import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const exportLineNotesUtil = (lineNotes, character) => {
  const centeredText = (text) => {
    return { text: text, alignment: "center" };
  };

  const centeredLabel = (text) => {
    return {
      text: text,
      alignment: "center",
      bold: true,
      textDecoration: "underline",
    };
  };

  const errorCode = (text) => {
    text = text
      .replace("Added Word(s)", "AW")
      .replace("Dropped Word(s)", "DW")
      .replace("Wrong Word(s)", "WW")
      .replace("Out of Order", "OOO")
      .replace("Jumped Cue", "JC")
      .replace("Missed Cue", "MC")
      .replace("Line Called", "LC")
      .replace("Skipped Line", "SK");
    return { text: text, alignment: "center" };
  };

  const richLine = (text) => {
    const parts = [];
    const regex = /(\*([^*]+)\*)|(_([^_]+)_)|([^*_]+)/g;
    let lastIndex = 0;

    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match[1]) {
        parts.push({
          text: match[2],
          bold: true,
          color: "green",
          noWrap: true,
        });
      } else if (match[3]) {
        parts.push({
          text: match[4],
          decoration: "lineThrough",
          color: "red",
          noWrap: true,
        });
      } else if (match[5]) {
        parts.push({ text: match[5], noWrap: true });
      }
    }

    return { text: parts, alignment: "left" };
  };

  const calculateVerticalMargin = (textHeight, cellHeight) => {
    return (cellHeight - textHeight) / 2; // Simple vertical centering calculation
  };

  const findCharacterNotes = (lineNotes, character) => {
    const characterName = character;
    const characterObj = lineNotes.find((note) => note[characterName]);
    const characterData = characterObj[character];

    return characterData;
  };

  const characterNotes = findCharacterNotes(lineNotes, character);

  const docDefinition = {
    pageSize: "LETTER",
    pageMargins: [36, 36, 36, 36],
    content: [
      {
        text: character,
        bold: true,
        decoration: "underline",
        fontSize: 30,
        alignment: "center",
        margin: [0, 0, 0, 20],
      },
      {
        table: {
          widths: ["10%", "40%", "10%", "40%"],
          body: [
            [
              centeredLabel("Codes"),
              centeredLabel("Meaning"),
              centeredLabel("Codes"),
              centeredLabel("Meaning"),
            ],
            [
              centeredText("AW"),
              centeredText("Added Word(s)"),
              centeredText("JC"),
              centeredText("Jumped Cue"),
            ],
            [
              centeredText("DW"),
              centeredText("Dropped Word(s)"),
              centeredText("MC"),
              centeredText("Missed Cue"),
            ],
            [
              centeredText("WW"),
              centeredText("Wrong Word(s)"),
              centeredText("LC"),
              centeredText("Line Called"),
            ],
            [
              centeredText("OOO"),
              centeredText("Out of Order"),
              centeredText("SK"),
              centeredText("Skipped Line"),
            ],
            [
              {
                text: "Bold",
                bold: true,
                color: "green",
                alignment: "center",
              },
              centeredText("Word(s) dropped/missed"),
              {
                text: "Strike",
                decoration: "lineThrough",
                color: "red",
                alignment: "center",
              },
              centeredText("Word(s) added"),
            ],
          ],
        },
      },
      {
        text: "",
        margin: [0, 20, 0, 20],
      },
      {
        table: {
          widths: [54, "*"],
          body: [
            [centeredLabel("Note"), centeredLabel("Line")],
            ...characterNotes.map((note) => [
              {
                ...errorCode(note.error.join(", ")),
                margin: [0, calculateVerticalMargin(10, 60), 0, 0], // Example values: textHeight = 10, cellHeight = 60
              },
              {
                ...richLine(note.line),
                margin: [0, calculateVerticalMargin(10, 60), 0, 0], // Adjust these numbers based on actual measurements
              },
            ]),
          ],
        },
      },
    ],
  };

  pdfMake.createPdf(docDefinition).download(`${character || "example"}.pdf`);
};

export default exportLineNotesUtil;
