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

      if (row.section === "head") {
        const cellText = Array.isArray(cell.text)
          ? cell.text.join(" ")
          : cell.text;
        const textWidth = doc.getTextWidth(cellText);
        const underlineY = cell.y + cell.height - 6.5;
        const textX = cell.x + (cell.width - textWidth) / 2;
        doc.setLineWidth(1);
        doc.line(textX, underlineY, textX + textWidth, underlineY);
      }

      if (row.index === 4 && column.index === 0) {
        const padding = 2;
        const cellText = Array.isArray(cell.text)
          ? cell.text.join(" ")
          : cell.text;

        doc.setFillColor(255, 255, 255);
        doc.rect(
          cell.x + padding,
          cell.y + padding,
          cell.width - 2 * padding,
          cell.height - 2 * padding,
          "F"
        );

        doc.setFont("times", "bold");
        doc.setTextColor(0, 128, 0);
        doc.text(cellText, cell.x + cell.width / 2, cell.y + cell.height / 2, {
          align: "center",
          baseline: "middle",
        });
      }

      if (row.index === 4 && column.index === 2) {
        const padding = 2;
        const cellText = Array.isArray(cell.text)
          ? cell.text.join(" ")
          : cell.text;
        const textWidth = doc.getTextWidth(cellText);
        const textY = cell.y + cell.height / 2;

        doc.setFillColor(255, 255, 255);
        doc.rect(
          cell.x + padding,
          cell.y + padding,
          cell.width - 2 * padding,
          cell.height - 2 * padding,
          "F"
        );

        doc.setFont("times", "bold");
        doc.setTextColor(255, 0, 0);
        doc.text(cellText, cell.x + cell.width / 2, cell.y + cell.height / 2, {
          align: "center",
          baseline: "middle",
        });

        const linePadding = 4;
        doc.setLineWidth(1);
        doc.setDrawColor(255, 0, 0);
        const strikeThroughX = cell.x + (cell.width - textWidth) / 2;
        doc.line(
          strikeThroughX - linePadding,
          textY,
          strikeThroughX + textWidth + linePadding,
          textY
        );
      }
    },
  });

  const findCharacterNotes = (lineNotes, character) => {
    const characterObj = lineNotes.find((note) => note[character]);
    return characterObj ? characterObj[character] : [];
  };

  const characterNotes = findCharacterNotes(lineNotes, character);

  const errorCode = (errors) => {
    const errorMap = {
      "Added Word(s)": "AW",
      "Dropped Word(s)": "DW",
      "Wrong Word(s)": "WW",
      "Out of Order": "OOO",
      "Jumped Cue": "JC",
      "Missed Cue": "MC",
      "Line Called": "LC",
      "Skipped Line": "SK",
    };
    return errors.map((error) => errorMap[error] || error).join(", ");
  };

  const richLine = (text) => {
    const parts = [];
    const regex = /(\*([^*]+)\*)|(_([^_]+)_)|([^*_]+)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match[1]) {
        parts.push({
          text: match[2],
          droppedWords: true,
        });
      } else if (match[3]) {
        parts.push({
          text: match[4],
          addedWords: true,
        });
      } else if (match[5]) {
        parts.push({ text: match[5] });
      }
    }

    return parts;
  };

  // *** add below to noted version ***
  // replaces all instances of *word* and _word_ with word
  const stripFormatting = (text) => {
    return text.replace(/\*([^*]+)\*/g, "$1").replace(/_([^_]+)_/g, "$1");
  };

  //  creates filled background for cell with padding to avoid overlap of cell borders
  const fillBackground = (doc, cell, color = [255, 255, 255]) => {
    const padding = cell.styles.lineWidth;
    doc.setFillColor(...color);
    doc.rect(
      cell.x + padding,
      cell.y + padding,
      cell.width - 2 * padding,
      cell.height - 2 * padding,
      "F"
    );
  };

  const calculateTextHeight = (doc, textArray, cellWidth) => {
    let y = 0;
    textArray.forEach((part) => {
      let text = part.text;
      while (doc.getTextWidth(text) > cellWidth) {
        const textArr = text.split(" ");
        let line = "";

        while (
          textArr.length > 0 &&
          doc.getTextWidth(line + textArr[0]) <= cellWidth
        ) {
          line += textArr.shift() + " ";
        }

        y += doc.getLineHeight();
        text = textArr.join(" ");
      }
      y += doc.getLineHeight();
    });
    return y;
  };

  const dynamicTableRows = characterNotes.map((note) => {
    const textArray = richLine(note.line);
    const plainText = stripFormatting(note.line);
    const cellWidth = (pageWidth - 2 * margin) * 0.9; // Width of the second column
    const height = calculateTextHeight(doc, textArray, cellWidth);
    return {
      id: errorCode(note.error),
      note: textArray,
      plainText: plainText,
      height: height,
    };
  });

  const dynamicTableColumns = [
    { header: "ID", dataKey: "id" },
    { header: "Note", dataKey: "note" },
  ];

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    head: [dynamicTableColumns.map((col) => col.header)],
    body: dynamicTableRows.map((row) => [row.id, row.plainText]),
    columnStyles: {
      0: { cellWidth: (pageWidth - 2 * margin) * 0.1 },
      1: {
        cellWidth: (pageWidth - 2 * margin) * 0.9,
      },
    },
    styles: {
      overflow: "linebreak",
      valign: "middle",
      halign: "center",
      lineWidth: 0.5,
      lineColor: 0,
      font: "times",
      cellPadding: 5,
      fontSize: 10,
      textColor: 0,
    },
    headStyles: {
      fontStyle: "bold",
      fillColor: [255, 255, 255],
    },
    didDrawCell: (data) => {
      const { row, column, cell } = data;

      if (column.index === 1 && row.section === "body") {
        const textArray = dynamicTableRows[row.index].note;

        if (textArray && cell) {
          let x = cell.x + cell.padding("left");
          let y = cell.y + cell.padding("top") + doc.getLineHeight();

          fillBackground(doc, cell);

          textArray.forEach((part) => {
            if (part.droppedWords) {
              doc.setFont("times", "bold");
              doc.setTextColor(0, 128, 0);
            } else if (part.addedWords) {
              doc.setFont("times", "normal");
              doc.setTextColor(255, 0, 0);
              const textWidth = doc.getTextWidth(part.text);
              doc.text(part.text, x, y);
              doc.setDrawColor(255, 0, 0);
              doc.setLineWidth(1);
              doc.line(x, y - 3, x + textWidth, y - 3);
              x += textWidth;
              x += doc.getTextWidth(" ");
              return;
            } else {
              doc.setFont("times", "normal");
              doc.setTextColor(0);
            }

            const cellWidth =
              cell.width - cell.padding("left") - cell.padding("right");
            let text = part.text;

            while (doc.getTextWidth(text) > cellWidth) {
              const textArr = text.split(" ");
              let line = "";

              while (
                textArr.length > 0 &&
                doc.getTextWidth(line + textArr[0]) <= cellWidth
              ) {
                line += textArr.shift() + " ";
              }

              doc.text(line.trim(), x, y);
              y += doc.getLineHeight();
              text = textArr.join(" ");
            }

            doc.text(text, x, y);
            x += doc.getTextWidth(part.text);

            if (
              x + doc.getTextWidth(part.text) >
              cell.x + cell.width - cell.padding("right")
            ) {
              x = cell.x + cell.padding("left");
              y += doc.getLineHeight();
            }
          });

          cell.text = "";
        }
      }
    },
  });

  doc.save(`${character}_line_notes.pdf`);
};

export default exportLineNotesUtil;
