import pandas as pd
import numpy as np
import os

def generate_fairai_dataset(n_rows=5000, bias_factor=0.3):
    """
    Generates a synthetic dataset for loan approvals with some intentional bias.
    bias_factor controls the disparity between Male and Female approval rates.
    """
    np.random.seed(42)
    
    # 1. Base Features
    genders = ['Male', 'Female']
    g = np.random.choice(genders, size=n_rows)
    
    ages = np.random.randint(18, 70, size=n_rows)
    incomes = np.random.normal(50000, 15000, size=n_rows).clip(15000, 200000)
    
    educations = ['High School', 'Bachelor', 'Master', 'PhD']
    ed = np.random.choice(educations, size=n_rows, p=[0.4, 0.4, 0.15, 0.05])
    
    credit_scores = np.random.randint(300, 850, size=n_rows)
    employment_years = np.random.randint(0, 40, size=n_rows)
    loan_amounts = np.random.randint(5000, 500000, size=n_rows)
    
    # 2. Base Approval Logic (Deterministic with noise)
    # Higher income, credit score, and education = higher approval chance
    base_score = (incomes / 200000) * 0.4 + (credit_scores / 850) * 0.5 + (employment_years / 40) * 0.1
    noise = np.random.normal(0, 0.1, size=n_rows)
    
    probs = (base_score + noise).clip(0, 1)
    
    # 3. Inject Intentional Bias
    # If Male, increase probability. If Female, decrease.
    for i in range(n_rows):
        if g[i] == 'Male':
            probs[i] = min(1.0, probs[i] * (1 + bias_factor/2))
        else:
            probs[i] = max(0.0, probs[i] * (1 - bias_factor/2))
            
    loan_approved = (probs > 0.5).astype(int)
    
    df = pd.DataFrame({
        'gender': g,
        'age': ages,
        'income': incomes.astype(int),
        'education': ed,
        'credit_score': credit_scores,
        'employment_years': employment_years,
        'loan_amount': loan_amounts,
        'loan_approved': loan_approved
    })
    
    return df

if __name__ == "__main__":
    if not os.path.exists("datasets"):
        os.makedirs("datasets")
        
    print("Generating demo_dataset.csv (5,000 rows)...")
    demo_df = generate_fairai_dataset(5000, 0.35)
    demo_df.to_csv("datasets/demo_dataset.csv", index=False)
    
    print("Generating medium_dataset.csv (100,000 rows)...")
    medium_df = generate_fairai_dataset(100000, 0.25)
    medium_df.to_csv("datasets/medium_dataset.csv", index=False)
    
    print("Datasets generated in 'datasets/' directory.")
