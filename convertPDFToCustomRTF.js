const fs = require("fs");
const path = require("path");
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
          isUnderline: false,
          isIndented: item.transform[4] > someIndentationThreshold,
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
    if (item.isUnderline) {
      rtfText += "\\ul ";
    }
    if (item.isIndented) {
      rtfText += "\\li360 ";
    }

    rtfText += item.text;

    if (item.isIndented) {
      rtfText += "\\li0 ";
    }
    if (item.isUnderline) {
      rtfText += "\\ulnone ";
    }
    if (item.isItalic) {
      rtfText += "\\i0 ";
    }
    if (item.isBold) {
      rtfText += "\\b0 ";
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

async function main() {
  const inputFileName = process.argv[2];
  if (!inputFileName) {
    console.error("Please provide a PDF file name.");
    return;
  }

  const pdfPath = path.join(__dirname, "sample-scripts", inputFileName);
  const rtfOutputPath = path.join(
    __dirname,
    "testing-outputs",
    path.basename(inputFileName, ".pdf") + ".rtf"
  );

  try {
    const extractedData = await parsePDF(pdfPath);
    if (!extractedData) {
      throw new Error("Failed to extract data from PDF");
    }

    const rtfContent = convertToRTF(extractedData);
    const isSuccessful = outputRTF(rtfContent, rtfOutputPath);

    if (!isSuccessful) {
      throw new Error("Failed to write RTF file");
    }
  } catch (error) {
    console.error("An error occurred in the conversion process:", error);
  }
}

main();
