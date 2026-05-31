import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
import warnings

warnings.filterwarnings('ignore')

def generate_user_clusters():
    print("1. Loading SaaS Data for Behavioral Mapping...")
    df = pd.read_csv("dataset.csv")


    features = ['tenure', 'MonthlyCharges']
    categorical = ['Contract', 'InternetService', 'PaymentMethod']

    #convert text to binary math
    ml_data = pd.get_dummies(df[features + categorical], drop_first=True)

    print("2. Normalizing Spatial Data...")

    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(ml_data)

    print("3. Running Unsupervised Clustering (Finding 4 Personas)...")

    kmeans = KMeans(n_clusters=4, random_state=42)
    cluster_labels = kmeans.fit_predict(scaled_data)

    print("4. Compressing Dimensions for 3D Visualization (PCA)...")

    pca = PCA(n_components=3)
    xyz_coords = pca.fit_transform(scaled_data)

   
    cluster_results = []
    for i in range(len(df)):
        cluster_results.append({
            "customer_id": df.iloc[i]['customerID'],
            "cluster_group": int(cluster_labels[i]),
            "x": float(round(xyz_coords[i, 0], 3)),
            "y": float(round(xyz_coords[i, 1], 3)),
            "z": float(round(xyz_coords[i, 2], 3))
        })

    print("\n--- CLUSTER MAPPING COMPLETE ---")
    
    df['Cluster'] = cluster_labels
    for i in range(4):
        size = len(df[df['Cluster'] == i])
        print(f"Persona {i}: {size} users identified")

    return cluster_results

if __name__ == "__main__":
    generate_user_clusters()