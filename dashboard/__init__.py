# dashboard package
from .visualizations import (
    plot_demographic_parity,
    plot_equal_opportunity,
    plot_disparate_impact,
    plot_fairness_gauge,
    plot_group_distribution,
)
from .reporting import generate_pdf_report, generate_markdown_report
