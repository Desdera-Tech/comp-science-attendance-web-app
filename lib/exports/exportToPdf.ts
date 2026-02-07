import path from "path";
import PDFDocument from "pdfkit";

export async function exportRecordEntriesToPDF(
  entries: any[],
  title: string,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // Paths for font variants
    const fontRegular = path.join(
      process.cwd(),
      "public/fonts/Roboto-Regular.ttf",
    );
    const fontBold = path.join(process.cwd(), "public/fonts/Roboto-Bold.ttf");
    const fontBoldItalic = path.join(
      process.cwd(),
      "public/fonts/Roboto-BoldItalic.ttf",
    );

    const doc = new PDFDocument({ margin: 40, size: "A4", font: fontRegular });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // --- Table Configuration ---
    // Matric No is roughly 15 chars; 100-110 units is usually sufficient for size 10 font.
    const colX = { sn: 50, name: 100, matric: 440 };
    const colWidths = { sn: 50, name: 340, matric: 105 };
    const tableWidth = colWidths.sn + colWidths.name + colWidths.matric;
    const padding = 8;
    const minRowHeight = 25;

    // Set a fainter border color (Light Grey)
    doc.strokeColor("#cccccc").lineWidth(0.5);

    // ---- TITLE ----
    doc.rect(colX.sn, 60, tableWidth, 30).stroke();
    doc.font(fontBold).fontSize(14).text(title.toUpperCase(), colX.sn, 71, {
      width: tableWidth,
      align: "center",
    });

    let currentY = 100;

    // ---- HEADER ROW ----
    doc.rect(colX.sn, currentY, tableWidth, minRowHeight).stroke();

    // Vertical dividers
    doc
      .moveTo(colX.name, currentY)
      .lineTo(colX.name, currentY + minRowHeight)
      .stroke();
    doc
      .moveTo(colX.matric, currentY)
      .lineTo(colX.matric, currentY + minRowHeight)
      .stroke();

    // Styled Header Text: Bold, Italic, and Centered
    doc.font(fontBoldItalic).fontSize(11);
    doc.text("S/N", colX.sn, currentY + padding, {
      width: colWidths.sn,
      align: "center",
    });
    doc.text("NAMES", colX.name, currentY + padding, {
      width: colWidths.name,
      align: "center",
    });
    doc.text("MATRIC NO.", colX.matric, currentY + padding, {
      width: colWidths.matric,
      align: "center",
    });

    currentY += minRowHeight;

    // ---- DATA ROWS ----
    doc.font(fontRegular).fontSize(10);

    entries.forEach((e) => {
      const nameHeight = doc.heightOfString(e.name, {
        width: colWidths.name - padding * 2,
      });
      const rowHeight = Math.max(nameHeight + padding * 2, minRowHeight);

      if (currentY + rowHeight > doc.page.height - 50) {
        doc.addPage();
        currentY = 50;
        doc.strokeColor("#cccccc"); // Reset color on new page
      }

      // Draw Row Outline and Dividers
      doc.rect(colX.sn, currentY, tableWidth, rowHeight).stroke();
      doc
        .moveTo(colX.name, currentY)
        .lineTo(colX.name, currentY + rowHeight)
        .stroke();
      doc
        .moveTo(colX.matric, currentY)
        .lineTo(colX.matric, currentY + rowHeight)
        .stroke();

      // Content
      doc.text(String(e.sn), colX.sn, currentY + padding, {
        width: colWidths.sn,
        align: "center",
      });

      doc.text(e.name.toUpperCase(), colX.name + padding, currentY + padding, {
        width: colWidths.name - padding * 2,
      });

      doc.text(e.matricNumber, colX.matric, currentY + padding, {
        width: colWidths.matric,
        align: "center",
      });

      currentY += rowHeight;
    });

    doc.end();
  });
}
