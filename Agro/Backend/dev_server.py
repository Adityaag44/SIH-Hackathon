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
                params = {"api-key": api_key, "format": "json", "offset": 0, "limit": 30}
                for field, api_field in (("commodity", "Commodity"), ("market", "Market"), ("variety", "Variety")):
                    if query.get(field, [""])[0].strip():
                        params["filters[{}]".format(api_field)] = query[field][0].strip()
                response = fetch_json(api_url, params)
                return self.send_json(200, {"records": [mandi_record(item) for item in response.get("records", [])], "count": response.get("count", 0)})
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
