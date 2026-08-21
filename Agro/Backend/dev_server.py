"""Dependency-free development server for Expo Go.

Use this when FastAPI/Uvicorn are not installed:
    python3 dev_server.py
"""

from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlencode, urlparse
from urllib.request import urlopen
from subprocess import run
import json
import os


def load_env():
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if not os.path.exists(env_path):
        return
    with open(env_path, encoding="utf-8") as env_file:
        for line in env_file:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                os.environ.setdefault(key.strip(), value.strip())


load_env()
LOCAL_PRICES = []
FALLBACK_MANDI_ITEMS = [
    ("Wheat", "Lokwan", "Indore", "Indore", "Madhya Pradesh", 2300, 2650, 2475),
    ("Rice", "Common", "Karnal", "Karnal", "Haryana", 2800, 3400, 3100),
    ("Paddy", "Basmati", "Amritsar", "Amritsar", "Punjab", 3200, 4100, 3650),
    ("Maize", "Yellow", "Davangere", "Davangere", "Karnataka", 1900, 2350, 2125),
    ("Bajra", "Hybrid", "Jaipur", "Jaipur", "Rajasthan", 2100, 2500, 2300),
    ("Jowar", "White", "Solapur", "Solapur", "Maharashtra", 2600, 3300, 2950),
    ("Ragi", "Local", "Mysuru", "Mysuru", "Karnataka", 3000, 3900, 3450),
    ("Barley", "Feed", "Bikaner", "Bikaner", "Rajasthan", 1800, 2200, 2000),
    ("Gram", "Desi", "Akola", "Akola", "Maharashtra", 5200, 6100, 5650),
    ("Tur", "Red", "Gulbarga", "Kalaburagi", "Karnataka", 7600, 9200, 8400),
    ("Moong", "Green", "Nagaur", "Nagaur", "Rajasthan", 6500, 8200, 7350),
    ("Urad", "Black", "Latur", "Latur", "Maharashtra", 6800, 8500, 7650),
    ("Masoor", "Red", "Kanpur", "Kanpur", "Uttar Pradesh", 5600, 6800, 6200),
    ("Groundnut", "Bold", "Rajkot", "Rajkot", "Gujarat", 5200, 6900, 6050),
    ("Soybean", "Yellow", "Ujjain", "Ujjain", "Madhya Pradesh", 4200, 5100, 4650),
    ("Mustard", "Black", "Alwar", "Alwar", "Rajasthan", 5000, 6100, 5550),
    ("Sesame", "White", "Unjha", "Mehsana", "Gujarat", 9800, 12500, 11150),
    ("Sunflower", "Hybrid", "Raichur", "Raichur", "Karnataka", 4300, 5400, 4850),
    ("Cotton", "Long Staple", "Adilabad", "Adilabad", "Telangana", 6200, 7600, 6900),
    ("Sugarcane", "Co 86032", "Kolhapur", "Kolhapur", "Maharashtra", 300, 380, 340),
    ("Onion", "Red", "Lasalgaon", "Nashik", "Maharashtra", 1200, 2400, 1800),
    ("Potato", "Jyoti", "Agra", "Agra", "Uttar Pradesh", 900, 1600, 1250),
    ("Tomato", "Hybrid", "Kolar", "Kolar", "Karnataka", 800, 1800, 1300),
    ("Brinjal", "Round", "Pune", "Pune", "Maharashtra", 1200, 2400, 1800),
    ("Cabbage", "Green", "Azadpur", "Delhi", "Delhi", 600, 1300, 950),
    ("Cauliflower", "White", "Patna", "Patna", "Bihar", 1000, 2100, 1550),
    ("Okra", "Green", "Surat", "Surat", "Gujarat", 1800, 3200, 2500),
    ("Green Chilli", "Local", "Guntur", "Guntur", "Andhra Pradesh", 3000, 6200, 4600),
    ("Garlic", "Desi", "Neemuch", "Neemuch", "Madhya Pradesh", 6500, 11000, 8750),
    ("Ginger", "Fresh", "Kochi", "Ernakulam", "Kerala", 5500, 9800, 7650),
    ("Banana", "Robusta", "Jalgaon", "Jalgaon", "Maharashtra", 900, 1500, 1200),
    ("Apple", "Royal Delicious", "Shimla", "Shimla", "Himachal Pradesh", 6500, 10500, 8500),
    ("Mango", "Alphonso", "Ratnagiri", "Ratnagiri", "Maharashtra", 8000, 15000, 11500),
    ("Orange", "Nagpur", "Nagpur", "Nagpur", "Maharashtra", 2200, 4200, 3200),
    ("Grapes", "Thompson", "Nashik", "Nashik", "Maharashtra", 3500, 7000, 5250),
    ("Pomegranate", "Bhagwa", "Sangli", "Sangli", "Maharashtra", 6000, 12000, 9000),
    ("Coconut", "Milling", "Kozhikode", "Kozhikode", "Kerala", 1800, 3200, 2500),
    ("Turmeric", "Finger", "Erode", "Erode", "Tamil Nadu", 7200, 9800, 8500),
    ("Coriander", "Green", "Kota", "Kota", "Rajasthan", 5200, 7600, 6400),
    ("Cumin", "Jeera", "Unjha", "Mehsana", "Gujarat", 22000, 31000, 26500),
    ("Cardamom", "Small", "Idukki", "Idukki", "Kerala", 90000, 140000, 115000),
    ("Black Pepper", "Malabar", "Wayanad", "Wayanad", "Kerala", 42000, 58000, 50000),
    ("Tea", "CTC", "Guwahati", "Kamrup", "Assam", 14000, 22000, 18000),
    ("Coffee", "Arabica", "Chikkamagaluru", "Chikkamagaluru", "Karnataka", 19000, 28000, 23500),
]
FALLBACK_MANDI_RECORDS = [
    {
        "commodity": commodity,
        "variety": variety,
        "market": market,
        "district": district,
        "state": state,
        "min_price": str(min_price),
        "max_price": str(max_price),
        "modal_price": str(modal_price),
        "arrival_date": "Recent sample",
    }
    for commodity, variety, market, district, state, min_price, max_price, modal_price in FALLBACK_MANDI_ITEMS
]


def fetch_json(url, params):
    request_url = "{}?{}".format(url, urlencode(params))
    # Python's SSL client times out against data.gov.in on this machine, while
    # the system curl client connects successfully. Keep the provider URL and
    # key server-side; Expo never receives either value.
    result = run(["curl", "--fail", "--silent", "--show-error", "--max-time", "25", request_url], capture_output=True, text=True, check=False)
    if result.returncode:
        raise RuntimeError(result.stderr.strip() or "Upstream request failed")
    return json.loads(result.stdout)


def value(record, *names):
    fields = {"".join(char for char in key.lower() if char.isalnum()): item for key, item in record.items()}
    for name in names:
        found = fields.get("".join(char for char in name.lower() if char.isalnum()))
        if found not in (None, ""):
            return found
    return "—"


def mandi_record(record):
    return {
        "commodity": value(record, "commodity"), "variety": value(record, "variety"),
        "market": value(record, "market"), "district": value(record, "district"),
        "state": value(record, "state"), "min_price": value(record, "min_price", "min price"),
        "max_price": value(record, "max_price", "max price"),
        "modal_price": value(record, "modal_price", "modal price"),
        "arrival_date": value(record, "arrival_date", "arrival date"),
    }


class ApiHandler(BaseHTTPRequestHandler):
    def send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_json(204, {})

    def do_GET(self):
        parsed = urlparse(self.path)
        query = parse_qs(parsed.query)
        try:
            if parsed.path == "/":
                return self.send_json(200, {"message": "agro backend is running"})
            if parsed.path == "/local-prices":
                return self.send_json(200, {"records": list(reversed(LOCAL_PRICES))})
            if parsed.path == "/mandi-prices":
                api_url, api_key = os.getenv("AGMARKNET_API_URL"), os.getenv("AGMARKNET_API_KEY")
                if not api_url or not api_key:
                    return self.send_json(500, {"detail": "AGMARKNET API is not configured on the server."})
                limit = max(1, min(100, int(query.get("limit", ["30"])[0] or 30)))
                params = {"api-key": api_key, "format": "json", "offset": 0, "limit": limit}
                for field, api_field in (("commodity", "Commodity"), ("market", "Market"), ("variety", "Variety")):
                    if query.get(field, [""])[0].strip():
                        params["filters[{}]".format(api_field)] = query[field][0].strip()
                try:
                    response = fetch_json(api_url, params)
                    records = [mandi_record(item) for item in response.get("records", [])]
                    return self.send_json(200, {"records": records, "count": response.get("count", 0)})
                except Exception as error:
                    print("AGMARKNET API error:", error)
                    return self.send_json(200, {"records": FALLBACK_MANDI_RECORDS[:limit], "count": len(FALLBACK_MANDI_RECORDS), "source": "fallback"})
            if parsed.path == "/weather":
                place_query = query.get("location", [""])[0].strip()
                if not place_query:
                    return self.send_json(400, {"detail": "Location is required."})
                places = fetch_json(os.environ["OPEN_METEO_GEOCODING_URL"], {"name": place_query, "count": 1, "language": "en", "format": "json"})
                place = (places.get("results") or [None])[0]
                if not place:
                    return self.send_json(404, {"detail": "Location not found."})
                forecast = fetch_json(os.environ["OPEN_METEO_FORECAST_URL"], {
                    "latitude": place["latitude"], "longitude": place["longitude"],
                    "current": "temperature_2m,relative_humidity_2m,precipitation,weather_code,soil_temperature_0cm,soil_moisture_0_to_1cm",
                    "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,et0_fao_evapotranspiration",
                    "forecast_days": 3, "timezone": "auto",
                })
                name = ", ".join(filter(None, [place.get("name"), place.get("admin1"), place.get("country")]))
                return self.send_json(200, {"place_name": name, "forecast": forecast})
            return self.send_json(404, {"detail": "Route not found."})
        except Exception as error:
            print("Request error:", error)
            return self.send_json(502, {"detail": "Upstream service is unavailable. Please try again."})

    def do_POST(self):
        if urlparse(self.path).path != "/local-prices":
            return self.send_json(404, {"detail": "Route not found."})
        try:
            length = int(self.headers.get("Content-Length", 0))
            price = json.loads(self.rfile.read(length).decode("utf-8"))
            if not str(price.get("commodity", "")).strip() or not str(price.get("market", "")).strip() or float(price.get("price", 0)) <= 0:
                return self.send_json(422, {"detail": "Commodity, market, and a valid price are required."})
            entry = {"commodity": str(price["commodity"]).strip(), "variety": str(price.get("variety", "")).strip(), "market": str(price["market"]).strip(), "price": float(price["price"]), "unit": str(price.get("unit", "per quintal")), "source": "Local entry"}
            LOCAL_PRICES.append(entry)
            return self.send_json(201, entry)
        except (ValueError, json.JSONDecodeError):
            return self.send_json(400, {"detail": "Invalid local price data."})

    def log_message(self, format, *args):
        print("%s - %s" % (self.address_string(), format % args))


if __name__ == "__main__":
    print("AGRO development server running on http://0.0.0.0:8000")
    ThreadingHTTPServer(("0.0.0.0", 8000), ApiHandler).serve_forever()
