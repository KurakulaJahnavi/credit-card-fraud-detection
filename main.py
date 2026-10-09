from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
import sys
from fastapi.middleware.cors import CORSMiddleware
from sklearn.base import BaseEstimator, TransformerMixin


# --------------------------------------------------
# Outlier Capper
# --------------------------------------------------

class OutlierCapper(BaseEstimator, TransformerMixin):

    def __init__(self, columns):
        self.columns = columns
        self.lower_bounds_ = {}
        self.upper_bounds_ = {}

    def fit(self, X, y=None):
        X = X.copy()

        for column in self.columns:
            Q1 = X[column].quantile(0.25)
            Q3 = X[column].quantile(0.75)

            IQR = Q3 - Q1

            lower = Q1 - 1.5 * IQR
            upper = Q3 + 1.5 * IQR

            self.lower_bounds_[column] = lower
            self.upper_bounds_[column] = upper

        return self

    def transform(self, X):
        X = X.copy()

        for column in self.columns:
            X[column] = X[column].clip(
                lower=self.lower_bounds_[column],
                upper=self.upper_bounds_[column]
            )

        return X


# --------------------------------------------------
# FastAPI Application
# --------------------------------------------------

app = FastAPI(
    title="Credit Card Fraud Detection API",
    description="API for detecting fraudulent credit card transactions",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Load Saved ML Pipeline
# --------------------------------------------------

MODEL_PATH = "../fraud_detection_pipeline.pkl"

sys.modules["__main__"].OutlierCapper = OutlierCapper

model = joblib.load(MODEL_PATH)


# --------------------------------------------------
# Transaction Input
# --------------------------------------------------

class Transaction(BaseModel):
    Time: float
    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float
    V21: float
    V22: float
    V23: float
    V24: float
    V25: float
    V26: float
    V27: float
    V28: float
    Amount: float


# --------------------------------------------------
# Prediction API
# --------------------------------------------------

@app.post("/predict")
def predict_transaction(transaction: Transaction):

    data = pd.DataFrame([transaction.model_dump()])

    prediction = model.predict(data)[0]

    probability = model.predict_proba(data)[0][1]

    result = "Fraud" if prediction == 1 else "Normal"

    return {
        "prediction": result,
        "fraud_probability": float(probability)
    }
