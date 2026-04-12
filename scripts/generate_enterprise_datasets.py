import os
import numpy as np
import pandas as pd

os.makedirs('datasets', exist_ok=True)
np.random.seed(42)

def generate_enterprise_bias():
    N = 5000
    gender = np.random.choice(['Male', 'Female'], N, p=[0.55, 0.45])
    age = np.random.randint(22, 60, N)
    education_level = np.random.choice(['High School', 'Bachelors', 'Masters', 'PhD'], N, p=[0.1, 0.5, 0.3, 0.1])
    income = np.random.randint(30000, 200000, N)
    employment_status = np.random.choice(['Employed', 'Self-Employed', 'Unemployed'], N, p=[0.8, 0.15, 0.05])
    city = np.random.choice(['Metropolis', 'Gotham', 'Star City', 'Central City'], N, p=[0.4, 0.3, 0.2, 0.1])
    credit_score = np.random.randint(300, 850, N)
    experience_years = np.clip(np.random.normal(age - 22, 4), 0, 40).astype(int)
    loan_amount = np.random.randint(10000, 100000, N)

    # Bias Logic
    hiring_prob = np.where(gender == 'Male', 0.65, 0.45)
    hiring_prob += np.where(education_level == 'PhD', 0.2, 0)
    hiring_prob += np.where(education_level == 'Masters', 0.1, 0)
    hiring_prob -= np.where(age > 50, 0.15, 0)
    hired = np.random.binomial(1, np.clip(hiring_prob, 0.05, 0.95))

    loan_prob = (credit_score - 300) / 600 + (income / 200000) * 0.3
    loan_prob += np.where(city == 'Metropolis', 0.1, 0) # City bias
    loan_prob -= np.where(employment_status == 'Unemployed', 0.4, 0)
    loan_prob -= np.where((gender == 'Female') & (income < 60000), 0.15, 0) # intersectional bias
    loan_approved = np.random.binomial(1, np.clip(loan_prob, 0.01, 0.99))

    df = pd.DataFrame({
        'gender': gender,
        'age': age,
        'education_level': education_level,
        'income': income,
        'employment_status': employment_status,
        'city': city,
        'credit_score': credit_score,
        'experience_years': experience_years,
        'loan_amount': loan_amount,
        'hired': ['Yes' if h else 'No' for h in hired],
        'loan_approved': ['Yes' if l else 'No' for l in loan_approved]
    })
    
    # Missing values
    missing_indices = np.random.choice(N, size=int(N*0.05), replace=False)
    df.loc[missing_indices, 'income'] = np.nan
    missing_indices = np.random.choice(N, size=int(N*0.02), replace=False)
    df.loc[missing_indices, 'credit_score'] = np.nan
    
    df.to_csv('datasets/enterprise_bias_dataset.csv', index=False)

def generate_hiring_bias():
    N = 2500
    gender = np.random.choice(['Male', 'Female', 'Non-Binary'], N, p=[0.6, 0.35, 0.05])
    age = np.random.randint(20, 65, N)
    experience_years = np.clip(np.random.normal(age - 20, 3).astype(int), 0, None)
    
    # Bias towards younger males
    hiring_prob = 0.5
    hiring_prob += np.where(gender == 'Male', 0.15, 0)
    hiring_prob -= np.where(gender == 'Non-Binary', 0.1, 0)
    hiring_prob -= np.where(age > 45, 0.2, 0)
    hiring_prob += (experience_years / 40) * 0.2
    
    hired = np.random.binomial(1, np.clip(hiring_prob, 0.1, 0.9))
    
    df = pd.DataFrame({'gender': gender, 'age': age, 'experience_years': experience_years, 'hired': ['Yes' if h else 'No' for h in hired]})
    df.to_csv('datasets/hiring_bias_dataset.csv', index=False)

def generate_loan_bias():
    N = 2500
    gender = np.random.choice(['Male', 'Female'], N, p=[0.5, 0.5])
    income = np.random.randint(20000, 150000, N)
    credit_score = np.random.randint(300, 850, N)
    
    # Bias: Even with similar credit, women get slightly lower approvals at lower incomes
    loan_prob = (credit_score - 300) / 600
    loan_prob -= np.where((gender == 'Female') & (income < 50000), 0.2, 0)
    
    approved = np.random.binomial(1, np.clip(loan_prob, 0.05, 0.95))
    df = pd.DataFrame({'gender': gender, 'income': income, 'credit_score': credit_score, 'loan_approved': ['Yes' if a else 'No' for a in approved]})
    df.to_csv('datasets/loan_bias_dataset.csv', index=False)

generate_enterprise_bias()
generate_hiring_bias()
generate_loan_bias()
print("Generated Enterprise V3 datasets successfully in /datasets folder!")
