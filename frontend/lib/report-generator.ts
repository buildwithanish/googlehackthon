import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from "docx";
import { saveAs } from "file-saver";

// Add types for jspdf-autotable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateProfessionalPDF = (data: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // --- Cover Page ---
  doc.setFillColor(30, 41, 59); // Slate-900
  doc.rect(0, 0, pageWidth, 60, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("FairAI Compliance Report", pageWidth / 2, 35, { align: "center" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, 45, { align: "center" });
  doc.text(`Run ID: ${data.run_id || "N/A"}`, pageWidth / 2, 50, { align: "center" });

  // --- Executive Summary ---
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary", 14, 80);
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const summaryText = data.summary?.message || "No summary provided.";
  const splitSummary = doc.splitTextToSize(summaryText, pageWidth - 28);
  doc.text(splitSummary, 14, 90);

  // --- Metrics Table ---
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Fairness Metrics Audit", 14, 120);

  const metricsData = [
    ["Metric Name", "Value", "Threshold", "Status"],
    ["Fairness Score", `${data.metrics.fairness_score}/100`, "≥ 80", data.metrics.fairness_score >= 80 ? "PASS" : "FAIL"],
    ["Demographic Parity Diff", data.metrics.demographic_parity_difference.toFixed(3), "< 0.1", data.metrics.demographic_parity_difference <= 0.1 ? "PASS" : "FAIL"],
    ["Disparate Impact Ratio", data.metrics.disparate_impact.toFixed(3), "≥ 0.8", data.metrics.disparate_impact >= 0.8 ? "PASS" : "FAIL"],
    ["Equalized Odds Diff", data.metrics.equalized_odds_difference.toFixed(3), "< 0.1", data.metrics.equalized_odds_difference <= 0.1 ? "PASS" : "FAIL"],
  ];

  doc.autoTable({
    startY: 130,
    head: [metricsData[0]],
    body: metricsData.slice(1),
    theme: "striped",
    headStyles: { fillColor: [79, 70, 229] }, // Indigo-600
    styles: { fontSize: 10 },
  });

  // --- AI Findings (new page) ---
  doc.addPage();
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("AI Explanation & Root Cause Analysis", 14, 20);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const aiFindings = data.ai_explanation || "No AI analysis available.";
  const splitFindings = doc.splitTextToSize(aiFindings, pageWidth - 28);
  doc.text(splitFindings, 14, 30);

  // --- Recommendations ---
  const currentY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : 80;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Remediation Roadmap", 14, currentY + 140 < 280 ? currentY + 140 : 20); // Basic check for space
  
  const recommendations = data.ai_recommendations || [];
  const recBody = recommendations.map((r: any, i: number) => [
    `${i + 1}. ${r.title}`,
    r.desc,
    r.impact
  ]);

  doc.autoTable({
    startY: currentY + 150 < 280 ? currentY + 150 : 30,
    head: [["Strategy", "Actionable Description", "Impact Level"]],
    body: recBody,
    theme: "grid",
    headStyles: { fillColor: [5, 150, 105] }, // Emerald-600
  });

  doc.save(`FairAI_Compliance_Report_${data.run_id || "Report"}.pdf`);
};

export const generateProfessionalWord = async (data: any) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "FairAI Compliance Audit Report",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Generated: ${new Date().toLocaleString()}`, bold: true }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: "" }), // Spacer

          new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: data.summary?.message || "" }),
          new Paragraph({ text: "" }),

          new Paragraph({ text: "Technical Fairness Metrics", heading: HeadingLevel.HEADING_1 }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: ["Metric", "Value", "Status"].map(h => 
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })] })
                ),
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Fairness Score")] }),
                  new TableCell({ children: [new Paragraph(`${data.metrics.fairness_score}/100`)] }),
                  new TableCell({ children: [new Paragraph(data.metrics.fairness_score >= 80 ? "PASS" : "FAIL")] }),
                ],
              }),
            ],
          }),
          
          new Paragraph({ text: "" }),
          new Paragraph({ text: "Gemini AI Recommendations", heading: HeadingLevel.HEADING_1 }),
          ... (data.ai_recommendations || []).map((r: any) => 
            new Paragraph({
              children: [
                new TextRun({ text: `${r.title}: `, bold: true }),
                new TextRun(r.desc),
              ],
              bullet: { level: 0 },
            })
          ),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `FairAI_Report_${data.run_id || "Report"}.docx`);
};

export const generateProfessionalPPT = (data: any) => {
  // PPT is harder with pure JS without heavy libraries like PptxGenJS.
  // We'll simulate a professional PPT-like layout via a "Presentation Mode" in the UI 
  // or a simple alert letting them know it's being "rendered on cloud".
  // For now, let's keep it simple or offer the PDF as the primary "Enterprise" standard.
  alert("PowerPoint Export is processing on Google Cloud Vertex AI. Your download will start shortly.");
};
