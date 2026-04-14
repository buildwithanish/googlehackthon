import pandas as pd
import numpy as np
import io

def simulate_biased_dataset(gender_bias=0.2, income_bias=0.1, age_bias=0.05, size=1000):
    """
    Dynamically generates a synthetic dataset with adjustable bias parameters.
    Returns: pandas DataFrame
    """
    np.random.seed(np.random.randint(0, 10000))
    
    # Features
    genders = ['Male', 'Female']
    g = np.random.choice(genders, size=size)
    
    ages = np.random.randint(18, 70, size=size)
    incomes = np.random.normal(50000, 15000, size=size).clip(15000, 200000)
    credit_scores = np.random.randint(300, 850, size=size)
    
    # Base approval probability (fair part)
    # Normed 0 to 1
    base_probs = (credit_scores - 300) / 550 * 0.7 + (incomes / 200000) * 0.3
    
    # Apply Bias
    final_probs = base_probs.copy()
    
    for i in range(size):
        # Gender Bias (Favors Male)
        if g[i] == 'Male':
            final_probs[i] += gender_bias
        else:
            final_probs[i] -= gender_bias
            
        # Income Bias (Favors High Income)
        # Higher multiplier if already high
        if incomes[i] > 80000:
            final_probs[i] += income_bias
        elif incomes[i] < 30000:
            final_probs[i] -= income_bias
            
        # Age Bias (Favors Middle Age 30-50)
        if 30 <= ages[i] <= 50:
            final_probs[i] += age_bias
        else:
            final_probs[i] -= age_bias
            
    # Clip and threshold
    final_probs = final_probs.clip(0, 1)
    loan_approved = (final_probs > 0.5).astype(int)
    
    df = pd.DataFrame({
        'gender': g,
        'age': ages,
        'income': incomes.astype(int),
        'credit_score': credit_scores,
        'loan_approved': loan_approved,
        'prob_score': np.round(final_probs, 3) # Inclusion of score for transparency
    })
    
    return df

def get_csv_download(df):
    """Converts dataframe to downloadable CSV string."""
    towrite = io.BytesIO()
    df.to_csv(towrite, index=False, encoding='utf-8')
    towrite.seek(0)
    return towrite.read().decode('utf-8')
