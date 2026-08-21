from fastapi import FastAPI, File, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from kindwise import CropHealthApi
from pydantic import BaseModel, Field
from urllib.parse import urlencode
from urllib.request import urlopen
from typing import Optional
import json
import os
import tempfile

load_dotenv(dotenv_path=".env")

KINDWISE_API_KEY = os.getenv("KINDWISE_API_KEY")
OPEN_METEO_FORECAST_URL = os.getenv("OPEN_METEO_FORECAST_URL")
OPEN_METEO_GEOCODING_URL = os.getenv("OPEN_METEO_GEOCODING_URL")
AGMARKNET_API_URL = os.getenv("AGMARKNET_API_URL")
AGMARKNET_API_KEY = os.getenv("AGMARKNET_API_KEY")

crop_api = CropHealthApi(api_key=KINDWISE_API_KEY)

app = FastAPI()
local_prices = []
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "agro mini is running"}


def get_json(url, params):
    """Load JSON from a configured provider without exposing its URL to the app."""
    with urlopen(f"{url}?{urlencode(params)}", timeout=12) as response:
        return json.loads(response.read().decode("utf-8"))


def record_value(record, *names):
    normalized = {"".join(char for char in key.lower() if char.isalnum()): value for key, value in record.items()}
    for name in names:
        value = normalized.get("".join(char for char in name.lower() if char.isalnum()))
        if value not in (None, ""):
            return value
    return "—"


def normalize_mandi_record(record):
    return {
        "commodity": record_value(record, "commodity"),
        "variety": record_value(record, "variety"),
        "market": record_value(record, "market"),
        "district": record_value(record, "district"),
        "state": record_value(record, "state"),
        "min_price": record_value(record, "min_price", "min price"),
        "max_price": record_value(record, "max_price", "max price"),
        "modal_price": record_value(record, "modal_price", "modal price"),
        "arrival_date": record_value(record, "arrival_date", "arrival date"),
    }


@app.get("/mandi-prices")
def mandi_prices(
    commodity: Optional[str] = Query(None, max_length=80),
    market: Optional[str] = Query(None, max_length=80),
    variety: Optional[str] = Query(None, max_length=80),
    limit: int = Query(20, ge=1, le=100),
):
    if not AGMARKNET_API_URL or not AGMARKNET_API_KEY:
        raise HTTPException(status_code=500, detail="AGMARKNET API is not configured on the server.")
    params = {"api-key": AGMARKNET_API_KEY, "format": "json", "offset": 0, "limit": limit}
    if commodity:
        params["filters[Commodity]"] = commodity.strip()
    if market:
        params["filters[Market]"] = market.strip()
    if variety:
        params["filters[Variety]"] = variety.strip()
    try:
        response = get_json(AGMARKNET_API_URL, params)
        return {"records": [normalize_mandi_record(record) for record in response.get("records", [])], "count": response.get("count", 0)}
    except Exception as error:
        print("AGMARKNET API error:", error)
        raise HTTPException(status_code=502, detail="Unable to load current mandi prices.")


class LocalPrice(BaseModel):
    commodity: str = Field(min_length=2, max_length=80)
    variety: Optional[str] = Field(default="", max_length=80)
    market: str = Field(min_length=2, max_length=80)
    price: float = Field(gt=0, le=1000000)
    unit: str = Field(default="per quintal", max_length=40)


@app.get("/local-prices")
def get_local_prices():
    return {"records": list(reversed(local_prices))}


@app.post("/local-prices", status_code=201)
def add_local_price(price: LocalPrice):
    entry = {**price.dict(), "source": "Local entry"}
    local_prices.append(entry)
    return entry


@app.get("/weather")
def weather(location: str = Query(..., min_length=2, max_length=120)):
    if not OPEN_METEO_FORECAST_URL or not OPEN_METEO_GEOCODING_URL:
        raise HTTPException(status_code=500, detail="Weather API is not configured on the server.")
    try:
        places = get_json(OPEN_METEO_GEOCODING_URL, {"name": location.strip(), "count": 1, "language": "en", "format": "json"})
        place = (places.get("results") or [None])[0]
        if not place:
            raise HTTPException(status_code=404, detail="Location not found. Try a nearby city or district.")
        forecast = get_json(OPEN_METEO_FORECAST_URL, {
            "latitude": place["latitude"], "longitude": place["longitude"],
            "current": "temperature_2m,relative_humidity_2m,precipitation,weather_code,soil_temperature_0cm,soil_moisture_0_to_1cm",
            "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,et0_fao_evapotranspiration",
            "forecast_days": 3, "timezone": "auto",
        })
        return {"place_name": ", ".join(filter(None, [place.get("name"), place.get("admin1"), place.get("country")])), "forecast": forecast}
    except HTTPException:
        raise
    except Exception as error:
        print("Weather API error:", error)
        raise HTTPException(status_code=502, detail="Weather service is temporarily unavailable.")


@app.post("/diagnose")
async def diagnose(file: UploadFile = File(...)):
    temp_path = None

    try:
        # Save uploaded image temporarily
        suffix = os.path.splitext(file.filename or ".jpg")[1]
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
        temp_path = temp_file.name

        content = await file.read()
        temp_file.write(content)
        temp_file.close()

        # Crop Health API
        identification = crop_api.identify(
            temp_path,
            details=[
                "common_name",
                "scientific_name",
                "description",
                "treatment",
                "symptoms",
                "severity",
                "spreading",
                "type",
            ],
            language="en",
        )

        result = identification.result

        # Crop information
        crop_suggestions = result.crop.suggestions
        disease_suggestions = result.disease.suggestions

        crop = crop_suggestions[0] if crop_suggestions else None
        disease = disease_suggestions[0] if disease_suggestions else None

        return {
            "crop": {
                "name": crop.name if crop else "Unknown",
                "confidence": crop.probability if crop else 0,
            },
            "disease": {
                "name": disease.name if disease else "Healthy / Unknown",
                "confidence": disease.probability if disease else 0,
                "details": disease.details if disease else {},
            },
        }

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
