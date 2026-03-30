from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import numpy as np
import pandas as pd
import joblib
import warnings
from sklearn.exceptions import InconsistentVersionWarning
from tensorflow.keras.models import load_model

warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

# =========================
# Flask Setup
# =========================

app = Flask(__name__)
CORS(app)

print("🚀 Flask Crop Prediction API Starting...")

# =========================
# Model Paths
# =========================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "..", "models")

# Models
ENSEMBLE_MODEL_PATH = os.path.join(MODEL_DIR, "crop_ensemble_model.pkl")
LGB_MODEL_PATH      = os.path.join(MODEL_DIR, "crop_lgb_model.pkl")
LSTM_MODEL_PATH     = os.path.join(MODEL_DIR, "lstm_model.h5")

# Encoders and Feature List
LE_CROP_PATH   = os.path.join(MODEL_DIR, "le_crop.pkl")
LE_SEASON_PATH = os.path.join(MODEL_DIR, "le_season.pkl")
LE_STATE_PATH  = os.path.join(MODEL_DIR, "le_state.pkl")
FEATURES_PATH  = os.path.join(MODEL_DIR, "features.pkl")


print("📦 Loading models and encoders...")

ensemble_model = joblib.load(ENSEMBLE_MODEL_PATH)
lgb_model      = joblib.load(LGB_MODEL_PATH)

le_crop   = joblib.load(LE_CROP_PATH)
le_season = joblib.load(LE_SEASON_PATH)
le_state  = joblib.load(LE_STATE_PATH)
features  = joblib.load(FEATURES_PATH)

try:
    lstm_model = load_model(LSTM_MODEL_PATH, compile=False)
    print("✅ LSTM model loaded successfully")
except Exception as e:
    print(f"⚠️ LSTM model skipped: {e}")
    lstm_model = None

print("✅ All models loaded")


def estimate_ndvi(season, annual_rainfall):
    base_ndvi = {
        'kharif': 0.65,
        'rabi': 0.55,
        'whole year': 0.70,
        'summer': 0.45,
        'autumn': 0.60,
    }
    season_key = str(season).lower().strip()
    ndvi = base_ndvi.get(season_key, 0.55)
    rainfall_factor = min(annual_rainfall / 3000, 0.2)
    return round(min(ndvi + rainfall_factor, 1.0), 3)


def predict_with_uncertainty(model, X_input, n_iterations=10):
    preds = []
    for _ in range(n_iterations):
        noise = np.random.normal(0, 0.05, X_input.shape)
        noisy_input = X_input + noise
        pred = model.predict(noisy_input)[0]
        preds.append(np.expm1(pred))
    return {
        "predicted_yield": round(np.mean(preds), 2),
        "lower_bound": round(np.percentile(preds, 5), 2),
        "upper_bound": round(np.percentile(preds, 95), 2),
        "confidence": "90%"
    }


@app.route("/")
def home():
    return jsonify({"message": "Crop Prediction API Running"})


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data received"}), 400

        print("📥 Input Data:", data)

        crop          = data["Crop"]
        year          = float(data["Crop_Year"])
        season        = data["Season"]
        state         = data["State"]
        area          = float(data["Area"])
        rainfall      = float(data["Annual_Rainfall"])
        fertilizer    = float(data["Fertilizer"])
        pesticide     = float(data["Pesticide"])
        N             = float(data["N"])
        P             = float(data["P"])
        K             = float(data["K"])
        ph            = float(data["ph"])
        humidity      = float(data["humidity"])
        rainfall_nasa = float(data["rainfall_nasa"])
        temperature   = float(data["temperature"])

        crop_enc   = le_crop.transform([crop])[0]
        season_enc = le_season.transform([season])[0]
        state_enc  = le_state.transform([state])[0]

        ndvi = estimate_ndvi(season, rainfall)

        input_df = pd.DataFrame([[ 
            crop_enc, year, season_enc, state_enc, area,
            rainfall, fertilizer, pesticide,
            N, P, K, ph,
            humidity, rainfall_nasa, temperature,
            ndvi
        ]], columns=features)

        print("✅ Input vector ready for prediction")

        # Predict using ensemble model
        log_prediction = ensemble_model.predict(input_df)[0]
        prediction = np.expm1(log_prediction)

        uncertainty = predict_with_uncertainty(lgb_model, input_df.values)

        response = {
            "success": True,
            "predicted_yield": round(prediction, 2),
            "uncertainty": uncertainty
        }

        return jsonify(response)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
