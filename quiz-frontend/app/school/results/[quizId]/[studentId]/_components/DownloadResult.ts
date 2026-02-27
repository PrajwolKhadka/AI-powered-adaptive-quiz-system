"use client";

interface ResultDetail {
  student: {
    fullName: string;
    email: string;
    className: number;
  };
  quiz: {
    subject: string;
    classLevel: number;
  };
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  timeTaken: number;
  aiFeedback: string;
  completedAt: string;
}

interface DownloadResultPDFProps {
  result: ResultDetail;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
};

export async function downloadResultPDF(result: ResultDetail) {
  const { default: jsPDF } = await import("jspdf");

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = 20;

  try {
    const logoRes = await fetch("/images/logo.png");
    const blob = await logoRes.blob();
    const base64: string = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
    const logoW = 40;
    const logoH = 20;
    doc.addImage(base64, "PNG", (pageW - logoW) / 2, y, logoW, logoH);
    y += logoH + 6;
  } catch {}

  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "normal");
  doc.text("Student Quiz Result Report", pageW / 2, y, { align: "center" });
  y += 8;

  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  doc.setFontSize(16);
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.text(result.student.fullName, margin, y);
  y += 7;

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.text(result.student.email, margin, y);
  y += 5;
  doc.text(`Class ${result.student.className}`, margin, y);
  y += 5;
  doc.text(
    `Completed: ${new Date(result.completedAt).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`,
    margin,
    y,
  );
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.text(
    `${result.quiz.subject} — Class ${result.quiz.classLevel}`,
    margin,
    y,
  );
  y += 10;

  const cardW = contentW / 4 - 3;
  const cardH = 18;
  const cards = [
    {
      label: "Score",
      value: `${result.correctAnswers}/${result.totalQuestions}`,
    },
    { label: "Accuracy", value: `${result.accuracy}%` },
    { label: "Time Taken", value: formatTime(result.timeTaken) },
    { label: "Wrong", value: `${result.wrongAnswers}` },
  ];

  cards.forEach((card, i) => {
    const x = margin + i * (cardW + 4);
    doc.setFillColor(248, 248, 248);
    doc.setDrawColor(220, 220, 220);
    doc.roundedRect(x, y, cardW, cardH, 3, 3, "FD");

    doc.setFontSize(7);
    doc.setTextColor(140, 140, 140);
    doc.setFont("helvetica", "normal");
    doc.text(card.label.toUpperCase(), x + cardW / 2, y + 5.5, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    doc.setFont("helvetica", "bold");
    doc.text(card.value, x + cardW / 2, y + 13, { align: "center" });
  });
  y += cardH + 10;

  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.text("AI Feedback", margin, y);
  y += 6;

  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.setFont("helvetica", "normal");
  const feedbackLines = doc.splitTextToSize(result.aiFeedback, contentW);
  doc.text(feedbackLines, margin, y);
  y += feedbackLines.length * 5 + 10;

  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.text("Performance Overview", margin, y);
  y += 7;

  const barH = 6;
  const correctPct = result.correctAnswers / result.totalQuestions;
  const wrongPct = result.wrongAnswers / result.totalQuestions;

  doc.setFillColor(134, 239, 172);
  doc.roundedRect(margin, y, contentW * correctPct, barH, 1, 1, "F");

  doc.setFillColor(252, 165, 165);
  doc.roundedRect(
    margin + contentW * correctPct,
    y,
    contentW * wrongPct,
    barH,
    1,
    1,
    "F",
  );
  y += barH + 5;

  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${result.correctAnswers} correct  ·  ${result.wrongAnswers} wrong  ·  ${result.accuracy}% accuracy`,
    margin,
    y,
  );
  y += 10;
  y += 20;

  const lineWidth = 70;
  const gapBetween = 20;
  const parentX = margin;
  const lineY = y;

  doc.setDrawColor(120, 120, 120);
  doc.line(parentX, lineY, parentX + lineWidth, lineY);

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.text("Parent/Guardian's Signature", parentX, lineY + 6);

  const teacherX = parentX + lineWidth + gapBetween;

  doc.line(teacherX, lineY, teacherX + lineWidth, lineY);
  doc.text("Teacher's Signature", teacherX, lineY + 6);

  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generated on ${new Date().toLocaleDateString()} · Page ${p} of ${pageCount}`,
      pageW / 2,
      290,
      { align: "center" },
    );
  }

  const filename = `${result.student.fullName.replace(/\s+/g, "_")}_${result.quiz.subject}_result.pdf`;
  doc.save(filename);
}
