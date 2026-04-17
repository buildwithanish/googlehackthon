import pandas as pd
import numpy as np
import os
import random

def generate_random_bias_dataset(filename):
    size = 200
    genders = ['Male', 'Female', 'Non-Binary']
    races = ['White', 'Black', 'Asian', 'Hispanic', 'Other']
    
    data = {
        'Age': np.random.randint(18, 75, size),
        'Gender': np.random.choice(genders, size),
        'Race': np.random.choice(races, size),
        'AnnualIncome': np.random.randint(20000, 150000, size),
        'CreditScore': np.random.randint(300, 850, size),
        'LoanAmount': np.random.randint(5000, 100000, size)
    }
    
    df = pd.DataFrame(data)
    
    # Inject a RANDOM bias profile for every file
    bias_type = random.choice(['gender', 'race', 'age', 'income'])
    
    def approve_logic(row):
        score = 0
        score += (row['CreditScore'] - 300) / 550 * 50
        score += (row['AnnualIncome'] / 150000) * 30
        
        # Artificial Bias Injection
        if bias_type == 'gender' and row['Gender'] == 'Female':
            score -= random.randint(10, 30)
        elif bias_type == 'race' and row['Race'] in ['Black', 'Hispanic']:
            score -= random.randint(15, 35)
        elif bias_type == 'age' and row['Age'] < 25:
            score -= random.randint(20, 40)
            
        return 1 if score > 40 else 0

    df['LoanApproved'] = df.apply(approve_logic, axis=1)
    df.to_csv(filename, index=False)

output_dir = "frontend/public/demo_datasets"
os.makedirs(output_dir, exist_ok=True)

print(f"Generating 50 unique forensic datasets in {output_dir}...")
for i in range(1, 51):
    generate_random_bias_dataset(f"{output_dir}/demo_audit_{i}.csv")

print("Success! 50 unique scenarios created.")
