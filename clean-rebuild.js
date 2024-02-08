import { readFile, writeFileSync } from "fs";
import { dirname, basename, join } from "path";

function categorizeTextByType(filepath) {
  readFile(filepath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const organizedTextStrings = processRTFContent(data);

    const dir = dirname(filepath);
    const filename = basename(filepath, ".rtf");
    const outputDir = join(dir, "testing-outputs");

    createHTMLFile(
      join(outputDir, `clean-${filename}-placeholder-list.html`),
      organizedTextStrings.finalPlaceholders
    );
    createHTMLFile(
      join(outputDir, `clean-${filename}-rtf-removed.html`),
      organizedTextStrings.cleanedofRTF
    );
  });
}

function processRTFContent(content) {
  let cleanedofRTF;

  //when converting various RTF markup to  HTML tags, encase them with unique symbols, maybe '%' or something?
  // Then delete all \s before and after so that the HTML tags are cleanly touching
  // although keep in mind that emphasized areas, especially those with quotes, will need to be handled differently

  return { finalPlaceholders, cleanedofRTF };
}
