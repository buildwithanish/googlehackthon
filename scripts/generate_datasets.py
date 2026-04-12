import os
import numpy as np
import pandas as pd

os.makedirs('datasets', exist_ok=True)
np.random.seed(42)
N = 500

# 1. Hiring Dataset (age & gender bias: males and younger generally hired more)
gender = np.random.choice(['Male', 'Female'], N, p=[0.6, 0.4])
age = np.random.randint(22, 60, N)
education = np.random.choice(['Bachelors', 'Masters', 'PhD'], N)
experience_years = np.clip(np.random.normal(age - 22, 3).astype(int), 0, None)
salary_expected = np.random.randint(50000, 150000, N)

# Bias function
hired_probs = np.where(gender == 'Male', 0.6, 0.3)
hired_probs = np.where(age > 45, hired_probs * 0.5, hired_probs)
hired = np.random.binomial(1, hired_probs)

hiring_df = pd.DataFrame({
    'gender': gender,
    'age': age,
    'education': education,
    'experience_years': experience_years,
    'salary_expected': salary_expected,
    'hired': hired
})
hiring_df.to_csv('datasets/hiring_dataset.csv', index=False)


# 2. Loan Dataset (income and gender bias)
gender_loan = np.random.choice(['Male', 'Female', 'Non-binary'], N, p=[0.55, 0.4, 0.05])
income = np.random.randint(30000, 150000, N)
credit_score = np.random.randint(300, 850, N)
employment_status = np.random.choice(['Employed', 'Self-Employed', 'Unemployed'], N, p=[0.7, 0.2, 0.1])
loan_amount = np.random.randint(5000, 50000, N)

# Loan bias condition
loan_probs = (credit_score - 300) / 550 * 0.5 + (income / 150000) * 0.4
loan_probs = np.where(gender_loan == 'Female', loan_probs * 0.7, loan_probs)
loan_probs = np.where(employment_status == 'Unemployed', loan_probs * 0.2, loan_probs)
loan_approved = np.random.binomial(1, np.clip(loan_probs, 0.05, 0.95))

loan_df = pd.DataFrame({
    'gender': gender_loan,
    'income': income,
    'credit_score': credit_score,
    'employment_status': employment_status,
    'loan_amount': loan_amount,
    'loan_approved': loan_approved
})
loan_df.to_csv('datasets/loan_dataset.csv', index=False)


# 3. Healthcare Dataset (gender & age bias on treatment)
gender_health = np.random.choice(['Male', 'Female'], N)
age_health = np.random.randint(18, 90, N)
disease_risk = np.random.randint(1, 11, N) # Scale 1 to 10

# Healthcare biased recommendation: Older women might get less aggressive treatments despite risk
treat_probs = disease_risk / 10.0
treat_probs = np.where((gender_health == 'Female') & (age_health > 60), treat_probs * 0.6, treat_probs)
treatment_recommended = np.random.binomial(1, np.clip(treat_probs, 0.1, 0.9))

health_df = pd.DataFrame({
    'gender': gender_health,
    'age': age_health,
    'disease_risk': disease_risk,
    'treatment_recommended': treatment_recommended
})
health_df.to_csv('datasets/healthcare_dataset.csv', index=False)

print("Datasets generated successfully in /datasets folder!")
