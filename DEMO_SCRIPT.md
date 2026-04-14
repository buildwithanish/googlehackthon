# FairAI - Hackathon Demo Video Script (3 Minutes)

**Total Time: ~3:00 Minutes**

## 1. Introduction & The Problem (0:00 - 0:40)

**(Visuals: Title Slide - "FairAI: Unbiased AI Decision Platform")**

**Speaker:**
"Hi everyone, I'm Anish from Team Synapse Squad Hub. Today we're thrilled to present FairAI. 
In our increasingly automated world, AI systems manage everything from medical diagnosing to hiring decisions. But here is the problem: these systems are often trained on historically biased data. This leads to unfair, sometimes devastating decisions that penalize marginalized groups. A biased algorithm deciding who gets a loan or a job is unacceptable. But how can developers detect and fix this bias when AI is such a 'black box'?"

**(Visuals: Screen showing headlines about AI bias in hiring/loans)**

## 2. Our Solution: FairAI (0:40 - 1:10)

**(Visuals: Transition to FairAI architecture diagram or landing page)**

**Speaker:**
"Enter FairAI. FairAI is a comprehensive, production-ready bias detection platform. It instantly audits machine learning datasets and models for unfairness using industry-standard metrics like Demographic Parity and Disparate Impact. More importantly, we integrate Google Gemini AI to not just identify the bias, but to explain it in plain language and offer concrete mitigation steps. Let me show you how it works."

## 3. The Demo (1:10 - 2:30)

**(Visuals: Screen recording of the FairAI Web App - Upload Page)**

**Speaker:**
"This is our web portal. Let's say we are a financial institution testing our loan approval dataset. If we don't have our real data ready, we can use our built-in 'Demo Mode' which contains pre-loaded datasets with intentional biases."

**(Visuals: Clicks on 'Financial Services Loan Dataset' Demo Button, routing to Dashboard)**

**Speaker:**
"Our platform seamlessly uploads the dataset to our FastAPI backend. Once we select our Target (Loan Approved) and Sensitive attribute (Gender or Income), the Bias Detection Engine gets to work."

**(Visuals: Dashboard populates with gauge charts and bar charts)**

**Speaker:**
"Instantly, we see our Fairness Score. We get a high bias alert because our data fails the 80% rule for Disparate Impact. Our interactive charts clearly show precisely how one group is favored over another over prediction distributions."

**(Visuals: Scroll down to AI Explanation and Report buttons)**

**Speaker:**
"Next, instead of making developers guess how to fix it, we query Google Gemini. Gemini analyzes the statistical variance and outputs a human-readable Fairness Explanation, and lists 5 actionable mitigation strategies—such as reweighting samples or applying fairness algorithms. Finally, compliance teams can export a professional PDF Bias Report with a single click."

## 4. Impact & Conclusion (2:30 - 3:00)

**(Visuals: Switch to Team/Impact Slide)**

**Speaker:**
"FairAI bridges the gap between complex AI ethics and practical development. By making it this simple to detect, explain, and mitigate biases, we empower companies to build responsible AI that works fairly for everyone, reducing legal risks and fostering trust.
Thank you for watching our demo. Together, we can ensure AI makes the world better, not more biased."
