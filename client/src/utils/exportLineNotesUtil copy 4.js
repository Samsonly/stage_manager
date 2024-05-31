import { jsPDF } from "jspdf";
import "jspdf-autotable";

const exportLineNotesUtil = (lineNotes, character) => {
  const doc = new jsPDF("p", "pt", "letter");

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 36;
  const topMargin = 72;
  const tableWidth = (pageWidth - 2 * margin) * 0.57;

  const headerText = character;
  doc.setFontSize(30);
  doc.setFont("times", "bold");
  const headerWidth = doc.getTextWidth(headerText);
  doc.text(headerText, (pageWidth - headerWidth) / 2, topMargin, {
    underline: true,
  });

  const staticTableColumns = [
    { header: "Code", dataKey: "col1" },
    { header: "Meaning", dataKey: "col2" },
    { header: "Code", dataKey: "col3" },
    { header: "Meaning", dataKey: "col4" },
  ];

  const staticTableRows = [
    {
      col1: "AW",
      col2: "Added Word(s)",
      col3: "JC",
      col4: "Jumped Cue",
    },
    {
      col1: "DW",
      col2: "Dropped Word(s)",
      col3: "MC",
      col4: "Missed Cue",
    },
    {
      col1: "WW",
      col2: "Wrong Word(s)",
      col3: "LC",
      col4: "Line Called",
    },
    {
      col1: "OOO",
      col2: "Out of Order",
      col3: "SK",
      col4: "Skipped Line",
    },
    {
      col1: "Bold",
      col2: "Word(s) Dropped",
      col3: "Strike",
      col4: "Word(s) Added",
    },
  ];

  doc.autoTable({
    startY: topMargin + 20,
    head: [staticTableColumns.map((col) => col.header)],
    body: staticTableRows.map((row) =>
      staticTableColumns.map((col) => row[col.dataKey])
    ),
    columnStyles: {
      0: { cellWidth: tableWidth * 0.15, fontStyle: "bold" },
      1: { cellWidth: tableWidth * 0.35 },
      2: { cellWidth: tableWidth * 0.15, fontStyle: "bold" },
      3: { cellWidth: tableWidth * 0.35 },
    },
    styles: {
      overflow: "linebreak",
      halign: "center",
      valign: "middle",
      cellPadding: 5,
      lineWidth: 0.5,
      lineColor: 0,
      font: "times",
      textColor: 0,
    },
    tableWidth: "auto",
    margin: { left: (pageWidth - tableWidth) / 2 },
    headStyles: {
      fontStyle: "bold",
      textColor: 0,
      fillColor: [255, 255, 255],
      lineColor: 0,
      lineWidth: 0.5,
      fontSize: 10,
      valign: "middle",
      halign: "center",
    },
    didDrawCell: (data) => {
      const { row, column, cell } = data;

      // Underline header row text
      if (row.section === "head") {
        const cellText = Array.isArray(cell.text)
          ? cell.text.join(" ")
          : cell.text;
        const textWidth = doc.getTextWidth(cellText);
        const underlineY = cell.y + cell.height - 6.5;
        const textX = cell.x + (cell.width - textWidth) / 2;
        doc.setLineWidth(0.5);
        doc.line(textX, underlineY, textX + textWidth, underlineY);
      }

      // Apply styles to specific cells in the final row
      if (row.index === 4 && column.dataKey === "col1") {
        doc.setFont("times", "bold");
        doc.setTextColor("green");
        const cellText = Array.isArray(cell.text)
          ? cell.text.join(" ")
          : cell.text;
        doc.text(cellText, cell.x + cell.width / 2, cell.y + cell.height / 2, {
          align: "center",
          baseline: "middle",
        });
      }
      if (row.index === 4 && column.dataKey === "col3") {
        doc.setFont("times", "bold");
        doc.setTextColor("red");
        const cellText = Array.isArray(cell.text)
          ? cell.text.join(" ")
          : cell.text;
        const strikeThroughText = cellText.split("").join("\u0336");
        doc.text(
          strikeThroughText,
          cell.x + cell.width / 2,
          cell.y + cell.height / 2,
          { align: "center", baseline: "middle" }
        );
      }
    },
  });

  const dynamicTableColumns = [
    { header: "ID", dataKey: "id" },
    { header: "Note", dataKey: "note" },
  ];

  const dynamicTableRows = [
    {
      id: "WW",
      note: "Not exactly. After seeing the list, I asked him what I could do to improve my chances in the future, and he said nothing. That I was a great candidate, but that I should try again next year and just be happy with my theatre role.",
    },
    {
      id: "WW, OOO, LC, JC",
      note: "some words",
    },
    ...lineNotes.map((note) => ({ id: note.id, note: note.note })),
  ];

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    head: [dynamicTableColumns.map((col) => col.header)],
    body: dynamicTableRows.map((row) =>
      dynamicTableColumns.map((col) => row[col.dataKey])
    ),
    columnStyles: {
      0: { cellWidth: (pageWidth - 2 * margin) * 0.1, halign: "center" },
      1: { cellWidth: (pageWidth - 2 * margin) * 0.9 },
    },
    styles: {
      overflow: "linebreak",
      valign: "middle",
      lineWidth: 0.5,
      lineColor: 0,
      font: "times",
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: 0,
      halign: "center",
    },
    bodyStyles: {
      textColor: 0,
      halign: "left",
    },
    didDrawCell: (data) => {
      const { row, column, cell } = data;
      if (row.index === 0) {
        cell.styles.halign = "center";
      }
    },
  });

  doc.save(`${character}_line_notes.pdf`);
};

export default exportLineNotesUtil;
