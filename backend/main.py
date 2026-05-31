from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from survival_model import get_survival_data
from clustering_model import generate_user_clusters
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import warnings
import os
from groq import Groq

warnings.filterwarnings('ignore')


import os
from dotenv import load_dotenv

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY") 


groq_client = Groq(api_key=GROQ_API_KEY)

app = FastAPI(title="Cohort Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Booting Machine Learning Engine...")

df = pd.read_csv("dataset.csv")
df['churn_bool'] = df['Churn'].apply(lambda x: 1 if x == 'Yes' else 0)

numerical_features = ['tenure', 'MonthlyCharges']
categorical_features = ['Contract', 'InternetService', 'PaymentMethod']

ml_data = df[['customerID'] + numerical_features + categorical_features + ['churn_bool']].copy()
ml_data_encoded = pd.get_dummies(ml_data, columns=categorical_features, drop_first=True)

X = ml_data_encoded.drop(['customerID', 'churn_bool'], axis=1)
y = ml_data_encoded['churn_bool']

rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X, y)
print("Engine Online! Ready for predictions.")


class SimulationRequest(BaseModel):
    customer_id: str
    MonthlyCharges: float
    Contract: str
    InternetService: str
    PaymentMethod: str

class AgentRequest(BaseModel):
    customer_id: str
    risk_percentage: float
    contract: str
    monthly_charges: float


@app.get("/api/survival")
def get_survival_curve():
    return {"status": "success", "data": get_survival_data()}

@app.get("/api/clusters")
def get_clusters():
    return {"status": "success", "data": generate_user_clusters()}

@app.get("/api/predict/{customer_id}")
def predict_user_risk(customer_id: str):
    user_row = ml_data_encoded[ml_data_encoded['customerID'] == customer_id]
    original_row = ml_data[ml_data['customerID'] == customer_id]
    
    if user_row.empty:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    user_features = user_row.drop(['customerID', 'churn_bool'], axis=1)
    risk_probability = rf_model.predict_proba(user_features)[0][1] 
    
    return {
        "customer_id": customer_id,
        "churn_risk_percentage": float(round(risk_probability * 100, 1)),
        "risk_status": "High Risk" if risk_probability > 0.5 else "Safe",
        "current_tenure_months": int(user_row['tenure'].iloc[0]),
        "features": {
            "MonthlyCharges": float(original_row['MonthlyCharges'].iloc[0]),
            "Contract": str(original_row['Contract'].iloc[0]),
            "InternetService": str(original_row['InternetService'].iloc[0]),
            "PaymentMethod": str(original_row['PaymentMethod'].iloc[0])
        }
    }


@app.post("/api/simulate")
def simulate_risk(req: SimulationRequest):
    user_row = ml_data[ml_data['customerID'] == req.customer_id]
    if user_row.empty:
        raise HTTPException(status_code=404, detail="Customer not found")

    #Create a copy of the user's original data and inject the hypothetical values
    simulated_data = user_row.copy()
    simulated_data['MonthlyCharges'] = req.MonthlyCharges
    simulated_data['Contract'] = req.Contract
    simulated_data['InternetService'] = req.InternetService
    simulated_data['PaymentMethod'] = req.PaymentMethod

    #One-Hot Encode this hypothetical scenario
    sim_encoded = pd.get_dummies(simulated_data, columns=categorical_features)
    
    #Align the new columns with the exact columns the Random Forest expects
    sim_encoded = sim_encoded.reindex(columns=X.columns, fill_value=0)
    
    #Run the new math
    new_risk = rf_model.predict_proba(sim_encoded)[0][1]
    
    return {
        "simulated_risk_percentage": float(round(new_risk * 100, 1))
    }


@app.post("/api/agent")
def generate_retention_strategy(req: AgentRequest):
    prompt = f"""
    You are a senior customer success manager at a SaaS company. 
    Customer {req.customer_id} is currently at a {req.risk_percentage}% risk of canceling their subscription. 
    They are currently on a {req.contract} contract paying ${req.monthly_charges}/month.
    
    Write a short, professional, and empathetic 3-sentence email to this customer. 
    Acknowledge their value to the company, and offer them a personalized incentive (like a discount, account review, or free upgrade) to prevent them from churning. 
    Do not include subject lines or placeholder brackets like [Your Name], just provide the exact email body.
    """
    
    try:

        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant", 
        )
        return {"strategy_email": chat_completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))