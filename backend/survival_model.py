import pandas as pd
from lifelines import KaplanMeierFitter

def get_survival_data():
    # 1. Load the real dataset
    df = pd.read_csv("dataset.csv")

    # 2. Clean the data: The math requires binary numbers (1 for Churn, 0 for Retained)
    df['churn_bool'] = df['Churn'].apply(lambda x: 1 if x == 'Yes' else 0)

    # 3. Initialize the Kaplan-Meier model
    kmf = KaplanMeierFitter()
    
    # Fit the model using 'tenure' (months) and our binary churn column
    kmf.fit(durations=df['tenure'], event_observed=df['churn_bool'])

    # 4. Extract the survival probabilities into a clean format for our web API
    survival_df = kmf.survival_function_
    
    timeline_data = []
    for month, row in survival_df.iterrows():
        timeline_data.append({
            "month": int(month),
            "survival_probability": round(row['KM_estimate'], 4)
        })
        
    return timeline_data

# Test block: This only runs if we execute this specific file
if __name__ == "__main__":
    data = get_survival_data()
    print("Model ran successfully! Here are the survival probabilities for the first 5 months:")
    print(data[:5])