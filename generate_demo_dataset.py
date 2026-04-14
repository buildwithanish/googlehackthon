"""
generate_demo_dataset.py
FairAI – Bias Detection Platform
Generates synthetic demo datasets for hackathon demos.

Usage:
    # Generate small demo dataset (5,000 rows) — default
    python generate_demo_dataset.py

    # Generate large dataset (10,000,000 rows = 1 crore)
    python generate_demo_dataset.py --large

    # Custom size
    python generate_demo_dataset.py --rows 100000

Author: Anish | Team Synapse Squad Hub
"""

import argparse
import os
import sys
import time

import numpy as np
import pandas as pd

# ── Reproducible seed ─────────────────────────────────────────────────────────
np.random.seed(42)
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "datasets")
os.makedirs(OUTPUT_DIR, exist_ok=True)


def generate_dataset(n_rows: int, filename: str) -> str:
    """
    Generates a synthetic loan approval dataset with intentional bias patterns.

    Bias patterns embedded:
    - Gender bias: Male applicants ~18% more likely to be approved
    - Income bias: Higher income groups strongly favoured
    - Credit score bias: Low credit scores nearly always rejected
    - Age bias: Applicants 25-45 slightly more favoured

    Returns the output file path.
    """
    print(f"\n[*] Generating {n_rows:,} rows of synthetic loan data...")
    start = time.time()

    CHUNK_SIZE = 500_000  # Stream in chunks for memory efficiency
    filepath = os.path.join(OUTPUT_DIR, filename)

    # Write in chunks to handle very large datasets without OOM
    first_chunk = True
    rows_written = 0

    while rows_written < n_rows:
        chunk = min(CHUNK_SIZE, n_rows - rows_written)

        # ── Demographic Features ──────────────────────────────────────────────
        gender = np.random.choice(
            ["Male", "Female", "Non-Binary"],
            size=chunk,
            p=[0.52, 0.44, 0.04]
        )

        age = np.clip(
            np.random.normal(38, 12, chunk).astype(int),
            18, 75
        )

        education = np.random.choice(
            ["No Degree", "High School", "Bachelors", "Masters", "PhD"],
            size=chunk,
            p=[0.08, 0.30, 0.38, 0.18, 0.06]
        )

        employment_years = np.clip(
            np.random.exponential(8, chunk).astype(int),
            0, 40
        )

        # ── Financial Features ────────────────────────────────────────────────
        # Income correlated with education level
        education_income_map = {
            "No Degree": 28000, "High School": 38000, "Bachelors": 62000,
            "Masters": 88000, "PhD": 110000,
        }
        base_income = np.array([education_income_map[e] for e in education])
        income = np.clip(
            (base_income + np.random.normal(0, 15000, chunk)).astype(int),
            15000, 300000
        )

        loan_amount = np.clip(
            (income * np.random.uniform(0.5, 4.0, chunk)).astype(int),
            5000, 1_000_000
        )

        credit_score = np.clip(
            np.random.normal(650, 95, chunk).astype(int),
            300, 850
        )

        # ── Approval Logic (with embedded bias) ───────────────────────────────
        # Base approval probability from financial factors
        p_approve = np.zeros(chunk)

        # Credit score component (0.0 – 0.6)
        p_approve += np.clip((credit_score - 500) / 350 * 0.6, 0, 0.6)

        # Income-to-loan ratio component (0.0 – 0.25)
        income_ratio = income / np.maximum(loan_amount, 1)
        p_approve += np.clip(income_ratio / 8 * 0.25, 0, 0.25)

        # Employment stability (0.0 – 0.10)
        p_approve += np.clip(employment_years / 40 * 0.10, 0, 0.10)

        # --- INTENTIONAL BIAS ---
        # Gender bias: Male +8%, Female -0%, Non-Binary -5%
        gender_bias = np.where(gender == "Male", 0.08,
                      np.where(gender == "Non-Binary", -0.05, 0.0))
        p_approve += gender_bias

        # Age bias: Prime age 25-45 gets +3%
        age_bias = np.where((age >= 25) & (age <= 45), 0.03, -0.02)
        p_approve += age_bias

        # Education bias: PhD/Masters subtle uplift
        edu_bias = np.where(education == "PhD", 0.04,
                   np.where(education == "Masters", 0.02, 0.0))
        p_approve += edu_bias

        # Clip final probability
        p_approve = np.clip(p_approve, 0.02, 0.98)

        # Bernoulli draw
        loan_approved = (np.random.random(chunk) < p_approve).astype(int)

        # ── Build DataFrame ───────────────────────────────────────────────────
        df_chunk = pd.DataFrame({
            "gender": gender,
            "age": age,
            "education": education,
            "employment_years": employment_years,
            "income": income,
            "credit_score": credit_score,
            "loan_amount": loan_amount,
            "loan_approved": loan_approved,
        })

        # Write (append after first chunk)
        df_chunk.to_csv(
            filepath,
            mode="w" if first_chunk else "a",
            header=first_chunk,
            index=False,
        )

        first_chunk = False
        rows_written += chunk

        elapsed = time.time() - start
        pct = rows_written / n_rows * 100
        speed = rows_written / elapsed if elapsed > 0 else 0
        remaining = (n_rows - rows_written) / speed if speed > 0 else 0
        print(
            f"  + {rows_written:>12,} rows written ({pct:.1f}%) "
            f"| {speed/1000:.0f}K rows/sec "
            f"| ETA: {remaining:.0f}s",
            end="\r",
        )

    elapsed = time.time() - start
    size_mb = os.path.getsize(filepath) / (1024 * 1024)
    print(f"\n[OK] Done! Saved: {filepath}")
    print(f"   Rows: {n_rows:,} | Size: {size_mb:.1f} MB | Time: {elapsed:.1f}s")
    return filepath


def print_stats(filepath: str, n_sample: int = 50000):
    """Print basic bias statistics from the generated dataset."""
    print(f"\n[STATS] Dataset Statistics (sample of {n_sample:,} rows):")
    df = pd.read_csv(filepath, nrows=n_sample)
    print(f"   Shape: {df.shape}")
    print(f"   Overall approval rate: {df['loan_approved'].mean()*100:.1f}%")
    print("\n   Approval rate by gender:")
    for gender, group in df.groupby("gender"):
        rate = group["loan_approved"].mean() * 100
        print(f"     {gender:12s}: {rate:.1f}%")
    print("\n   Approval rate by education:")
    for edu, group in df.groupby("education"):
        rate = group["loan_approved"].mean() * 100
        print(f"     {edu:15s}: {rate:.1f}%")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="FairAI demo dataset generator"
    )
    parser.add_argument(
        "--large", action="store_true",
        help="Generate large 10M-row dataset (takes ~3-5 minutes)"
    )
    parser.add_argument(
        "--rows", type=int, default=None,
        help="Custom row count (overrides --large)"
    )
    args = parser.parse_args()

    if args.rows:
        n = args.rows
        fname = f"custom_{n//1000}k_dataset.csv"
    elif args.large:
        n = 10_000_000
        fname = "large_demo_dataset.csv"
    else:
        n = 5_000
        fname = "demo_dataset.csv"

    path = generate_dataset(n, fname)
    print_stats(path)

    print("\n[OK] Next steps:")
    print("   1. Upload to FairAI dashboard at /upload")
    print("   2. Select 'loan_approved' as target column")
    print("   3. Select 'gender' as sensitive column")
    print("   4. Click 'Analyze Bias' to see results\n")
