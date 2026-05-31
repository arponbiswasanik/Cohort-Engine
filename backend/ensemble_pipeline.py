import pandas as pd
from lifelines import CoxPHFitter
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import warnings


warnings.filterwarnings('ignore')

def build_and_train_pipeline():
    print("1. Loading SaaS dataset...")
    df = pd.read_csv("dataset.csv")

    df['churn_bool'] = df['Churn'].apply(lambda x: 1 if x == 'Yes' else 0)
    
    features = ['tenure', 'MonthlyCharges', 'Contract', 'InternetService', 'PaymentMethod']
    subset = df[features + ['churn_bool']].copy()
    
    #One-Hot Encode text columns into binary (1s and 0s) for the math models
    subset = pd.get_dummies(subset, drop_first=True)

    print("2. Running Cox Proportional Hazards (Extracting Risk Factors)...")
    #A small penalizer prevents the math from breaking on highly correlated columns
    cph = CoxPHFitter(penalizer=0.1) 
    cph.fit(subset, duration_col='tenure', event_col='churn_bool')
    
    #Extract the top hazard ratios
    summary = cph.summary[['exp(coef)']].sort_values(by='exp(coef)', ascending=False)
    print("\n--- TOP CHURN MULTIPLIERS ---")
    for feature, row in summary.head(3).iterrows():
        print(f"{feature}: {row['exp(coef)']:.2f}x higher risk of churning")

    print("\n3. Training Random Forest Classifier (Individual Predictions)...")
    X = subset.drop('churn_bool', axis=1)
    y = subset['churn_bool']


    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)


    predictions = rf.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    
    print(f"\n--- CLASSIFIER READY ---")
    print(f"Random Forest Accuracy: {accuracy * 100:.2f}%")
    print("Pipeline successfully validated!")

    return rf, cph, X.columns


if __name__ == "__main__":
    build_and_train_pipeline()