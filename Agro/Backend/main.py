from fastapi import FastAPI, UploadFile, File
from dotenv import load_dotenv
from kindwise import CropHealthApi
import os
import tempfile

load_dotenv(dotenv_path=".env")

KINDWISE_API_KEY = os.getenv("KINDWISE_API_KEY")

print("API KEY LOADED:", KINDWISE_API_KEY is not None)
print("API KEY LENGTH:", len(KINDWISE_API_KEY) if KINDWISE_API_KEY else 0)
crop_api = CropHealthApi(api_key=KINDWISE_API_KEY)

app = FastAPI()

@app.get("/")
def home():
    return {"message": "agro mini is running"}


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