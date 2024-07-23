import { jsPDF } from "jspdf";
import "jspdf-autotable";

const exportLineNotesUtil = (lineNotes, character) => {
  // create a new jsPDF instance. p = portrait, pt = points, letter = letter size paper
  const doc = new jsPDF("p", "pt", "letter");

  // get the width of the page, which with the set values will 612 points (8.5 inches x 72 points per inch)
  const pageWidth = doc.internal.pageSize.getWidth();

  // set the margin to 36 points (0.5 inches)
  const margin = 36;

  // set the top margin to 72 points (1 inch)
  const topMargin = 72;

  // set the table width to 57% of the page width
  const tableWidth = (pageWidth - 2 * margin) * 0.57;

  // set the header text to the character name
  const headerText = character;

  // set the font size to 30 points and the font to Times New Roman bold
  const headerFontSize = 30;
  doc.setFontSize(headerFontSize);
  doc.setFont("times", "bold");

  // get the width of the header text
  const headerWidth = doc.getTextWidth(headerText);

  // draw the header text in the center of the page with an underline
  doc.text(
    headerText,
    (pageWidth - headerWidth) / 2,
    topMargin + headerFontSize,
    {
      underline: true,
    }
  );

  // define the header row and apply dataKeys to each column in the static table
  const staticTableColumns = [
    { header: "Code", dataKey: "col1" },
    { header: "Meaning", dataKey: "col2" },
    { header: "Code", dataKey: "col3" },
    { header: "Meaning", dataKey: "col4" },
  ];

  // define the rows for the static table
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

  // creates the static table
  doc.autoTable({
    // set the start Y position for the top of the table
    startY: topMargin + 20,

    // set the header row
    head: [staticTableColumns.map((col) => col.header)],

    // set the body rows
    body: staticTableRows.map((row) =>
      staticTableColumns.map((col) => row[col.dataKey])
    ),

    // set the column designs and widths
    columnStyles: {
      0: { cellWidth: tableWidth * 0.15, fontStyle: "bold" },
      1: { cellWidth: tableWidth * 0.35 },
      2: { cellWidth: tableWidth * 0.15, fontStyle: "bold" },
      3: { cellWidth: tableWidth * 0.35 },
    },

    // set the styles for the table
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

    // center the table on the page
    margin: { left: (pageWidth - tableWidth) / 2 },

    // set the styles for the header row
    headStyles: {
      fontStyle: "bold",
      fillColor: [255, 255, 255],
      fontSize: 10,
    },

    // adds styles to the cells in the table
    didDrawCell: (data) => {
      // extracts the data for each cell
      const { row, column, cell } = data;

      // checks if the cell is in the header row, and then creates a centered string of underlined text
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

      // makes the cell at row 4, column 0 bold and green
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

      // makes the cell at row 4, column 2 bold and red with a line through the text
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

  // checks each grouping of line notes for the matching character and returns it if found.
  const findCharacterNotes = (lineNotes, character) => {
    const characterObj = lineNotes.find((note) => note[character]);
    return characterObj ? characterObj[character] : [];
  };

  // defines the active line notes for the specified character
  const characterNotes = findCharacterNotes(lineNotes, character);

  // creates a string of error code abbreviations from the array of errors
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

  // converts the line notes into an array of objects with rich text formatting
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

  // iterates through each line note object, converts the errors to abbreviated codes and applies the 'id' key to them. Then converts the line text to rich text formatting and applies the 'note' key to them.
  const dynamicTableRows = characterNotes.map((characterNote) => ({
    id: errorCode(characterNote.error),
    note: richLine(characterNote.line),
  }));

  // creates a dynamic table with the 'id' and 'note' keys for each row.
  const dynamicTableColumns = [
    { header: "ID", dataKey: "id" },
    { header: "Note", dataKey: "note" },
  ];

  // creates the dynamic table
  doc.autoTable({
    // set the start Y position for the top of the table
    startY: doc.lastAutoTable.finalY + 20,

    // set the header row
    head: [dynamicTableColumns.map((col) => col.header)],

    // set the body rows
    body: dynamicTableRows.map((row) => [row.id, ""]),

    // set the column designs and widths
    columnStyles: {
      0: { cellWidth: (pageWidth - 2 * margin) * 0.1 },
      1: {
        cellWidth: (pageWidth - 2 * margin) * 0.9,
        halign: "left",
        fontStyle: "bold",
      },
    },

    // set the styles for the table
    styles: {
      overflow: "linebreak",
      halign: "center",
      valign: "middle",
      lineWidth: 0.5,
      lineColor: 0,
      font: "times",
      fontSize: 10,
      textColor: 0,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: [255, 255, 255],
      fontStyle: "bold",
    },
    didDrawCell: (data) => {
      const { row, column, cell } = data;

      if (row.section === "body" && column.index === 1) {
        const textArray = dynamicTableRows[row.index].note;

        if (textArray && cell) {
          let x = cell.x + cell.padding("left");
          let y = cell.y + cell.padding("top") + doc.getLineHeight();
          let maxHeight = 0;

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
              maxHeight = Math.max(maxHeight, y - cell.y);
              text = textArr.join(" ");
            }

            doc.text(text, x, y);
            maxHeight = Math.max(maxHeight, y - cell.y);
            x += doc.getTextWidth(part.text);

            if (
              x + doc.getTextWidth(part.text) >
              cell.x + cell.width - cell.padding("right")
            ) {
              x = cell.x + cell.padding("left");
              y += doc.getLineHeight();
              maxHeight = Math.max(maxHeight, y - cell.y);
            }
          });

          if (maxHeight > cell.height) {
            cell.height = maxHeight;
            data.row.height = maxHeight;
          }

          cell.text = "";
        } else {
          console.log("textArray or cell is undefined for row:", row.index);
        }
      }
    },
  });

  // initiate the download of the PDF with the character name
  doc.save(`${character}_line_notes.pdf`);
};

export default exportLineNotesUtil;
