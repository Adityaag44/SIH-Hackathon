# AGRO Smart Farming Assistant

AGRO is a React Native Expo application for farmers. It provides crop diagnosis, local weather and soil conditions, mandi price lookup, simple farm advisory, profile details, language support, and farmer service links.

The project also includes a Python backend that keeps API keys server-side and exposes simple endpoints for the mobile app.

## Features

- Farmer login, registration, and profile flow.
- Multilingual UI text for common farmer workflows.
- Crop diagnosis from a camera or gallery image using the Kindwise Crop Health API.
- Weather and soil screen using Open-Meteo geocoding and forecast data.
- Mandi prices using the data.gov.in Agmarknet API.
- Large fallback mandi price dataset when the live vendor API is unreachable.
- Local market price entry for manually saving farmer-reported prices.
- Basic farm advisory using soil NPK inputs.
- Farmer services screen for common government/service actions.

## Project Structure

```text
Agro/
  Backend/
    main.py              FastAPI backend
    dev_server.py        Dependency-light development backend
    requirements.txt     Python dependencies for FastAPI backend
    .env                 Backend API keys and provider URLs
  frontend/
    App.js               Expo app navigation and home screen
    Screens/             App screens
    config/api.js        Shared frontend API helper
    .env                 Expo public backend URL
    package.json         Frontend dependencies and scripts
```

## Frontend Setup

```powershell
cd "C:\Users\Aditya Agrawal\Downloads\SIH-Hackathon\Agro\frontend"
npm install
npx expo start -c
```

The frontend reads its backend URL from:

```text
Agro/frontend/.env
```

Example:

```env
EXPO_PUBLIC_API_URL=http://10.163.114.200:8000
```

Use your computer's current Wi-Fi IPv4 address when testing on a physical phone with Expo Go. The phone and computer must be on the same network.

## Backend Setup

```powershell
cd "C:\Users\Aditya Agrawal\Downloads\SIH-Hackathon\Agro\Backend"
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

If the full FastAPI backend is not available, the lightweight development server can be started with:

```powershell
cd "C:\Users\Aditya Agrawal\Downloads\SIH-Hackathon\Agro\Backend"
python dev_server.py
```

## Backend Environment Variables

Create or update:

```text
Agro/Backend/.env
```

Expected values:

```env
KINDWISE_API_KEY=your_kindwise_key
OPEN_METEO_FORECAST_URL=https://api.open-meteo.com/v1/forecast
OPEN_METEO_GEOCODING_URL=https://geocoding-api.open-meteo.com/v1/search
CORS_ORIGINS=*
AGMARKNET_API_URL=https://api.data.gov.in/resource/your_resource_id
AGMARKNET_API_KEY=your_data_gov_key
```

Do not expose backend API keys in the frontend `.env`. Only `EXPO_PUBLIC_API_URL` belongs in the frontend.

## API Endpoints

- `GET /` - Backend health check.
- `GET /weather?location=Pune` - Weather, rainfall, and soil condition data.
- `GET /mandi-prices?limit=60` - Mandi price records from Agmarknet or fallback data.
- `GET /local-prices` - Farmer-entered local prices.
- `POST /local-prices` - Add a local price record.
- `POST /diagnose` - Upload crop image for diagnosis.

## Mandi Price Fallback

The live mandi provider can sometimes be unreachable from the current network. When that happens, the backend returns a bundled fallback list instead of failing the app.

The fallback list includes many products across grains, pulses, oilseeds, vegetables, fruits, spices, plantation crops, and cash crops. These fallback values are sample development data and should be confirmed with the market before trading.

## Troubleshooting

If the app says `Network request failed`:

- Make sure the backend is running on port `8000`.
- Make sure `Agro/frontend/.env` points to your current computer IPv4 address.
- Restart Expo with `npx expo start -c` after changing `.env`.
- Make sure your phone and computer are on the same network.
- Confirm the backend responds at `http://YOUR_IP:8000/`.

If mandi prices say the vendor is unavailable:

- The data.gov.in API may be unreachable from your network.
- Restart the backend so the fallback code is active.
- Test `http://YOUR_IP:8000/mandi-prices?limit=5` in a browser.

If crop diagnosis fails:

- Confirm `KINDWISE_API_KEY` is set in `Agro/Backend/.env`.
- Install backend dependencies with `python -m pip install -r requirements.txt`.
- Check that the backend terminal does not show import or API-key errors.

## Notes

This repository is intended for hackathon development. The app should be treated as an advisory tool, not a replacement for local agricultural officers, lab soil testing, or official market confirmation.
