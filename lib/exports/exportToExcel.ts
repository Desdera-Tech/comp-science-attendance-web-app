import ExcelJS from "exceljs";

export async function exportRecordEntriesToExcel(
  entries: any[],
  title: string,
) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Record Entries");

  // ---- TITLE ROW ----
  sheet.mergeCells("A1:C1");
  sheet.getCell("A1").value = title;
  sheet.getCell("A1").font = { size: 16, bold: true };
  sheet.getCell("A1").alignment = { horizontal: "center" };

  // ---- EMPTY ROW ----
  sheet.addRow([]);

  // ---- HEADER ROW (MANUAL, NOT sheet.columns) ----
  sheet.addRow(["S/N", "NAME", "MATRIC NO."]);
  sheet.getRow(3).font = { bold: true, italic: true };

  // ---- DATA ROWS ----
  entries.forEach((e) => {
    sheet.addRow([e.sn, e.name, e.matricNumber]);
  });

  // ---- COLUMN WIDTHS ----
  sheet.getColumn(1).width = 8;
  sheet.getColumn(2).width = 35;
  sheet.getColumn(3).width = 20;

  return workbook.xlsx.writeBuffer();
}
