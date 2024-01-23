const fs = require("fs");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

async function parsePDF(pdfPath) {
  try {
    const pdfDocument = await pdfjsLib.getDocument(pdfPath).promise;
    const numPages = pdfDocument.numPages;
    let extractedData = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();

      for (const item of textContent.items) {
        const textObject = {
          text: item.str,
          isItalic: item.fontName.includes("Italic"),
          isBold: item.fontName.includes("Bold"),
          // Other formatting attributes as needed
        };
        extractedData.push(textObject);
      }
    }

    // Return the extracted data for further processing
    return extractedData;
  } catch (error) {
    console.error("Error loading PDF:", error);
  }
}

function convertToRTF(extractedData) {
  let rtfText = "{\\rtf1\\ansi";

  for (const item of extractedData) {
    if (item.isBold) {
      rtfText += "\\b ";
    }
    if (item.isItalic) {
      rtfText += "\\i ";
    }
    rtfText += item.text;
    if (item.isItalic) {
      rtfText += " \\i0";
    }
    if (item.isBold) {
      rtfText += " \\b0";
    }
  }

  rtfText += "}";
  return rtfText;
}

function outputRTF(rtfContent, outputPath) {
  try {
    fs.writeFileSync(outputPath, rtfContent);
    console.log(`RTF file successfully written to ${outputPath}`);
    return true;
  } catch (error) {
    console.error("Error writing RTF file:", error);
    return false;
  }
}

process.on("uncaughtException", (error) => {
  console.error("Unhandled Exception:", error);
});
