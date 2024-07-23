import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const exportLineNotesUtil = () => {
  const centeredText = (text) => {
    return { text: text, alignment: "center" };
  };

  const centeredLabel = (text) => {
    return {
      text: text,
      alignment: "center",
      fontWeight: "bold",
      textDecoration: "underline",
    };
  };

  const docDefinition = {
    pageSize: "LETTER",
    pageMargins: [36, 36, 36, 36],
    content: [
      {
        // 1. Header
        text: "Header",
        bold: true,
        decoration: "underline",
        fontSize: 30,
        alignment: "center",
        margin: [0, 0, 0, 20], // Add some space after the header
      },
      {
        // 2. Key Table
        table: {
          widths: ["10%", "40%", "10%", "40%"], // 4 columns each taking 25%
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
                fontWeight: "bold",
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
        // layout: "noBorders", // No borders in this example, can be adjusted as needed
      },
      {
        // Spacer between tables
        text: "",
        margin: [0, 20, 0, 20], // Add vertical space between the tables
      },
      {
        // 3. Line Note Table
        table: {
          widths: [54, "*"],
          body: [
            [centeredLabel("Note"), centeredLabel("Line")],
            [centeredText("Note content here"), "Line content here"],
          ],
        },
      },
    ],
  };

  pdfMake.createPdf(docDefinition).download("example.pdf");
};

export default exportLineNotesUtil;
