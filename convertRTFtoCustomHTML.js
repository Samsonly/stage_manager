const fs = require("fs");
const path = require("path");

function processRTFContent(content) {
  let modifiedContent = convertRTFEscapeSequencesToHTML(content);

  modifiedContent = modifiedContent
    .replace(/\\(\s|$)/gm, " <br>")
    .replace(/\\pard(?![a-zA-Z])/g, "</i></u></b>\\")
    .replace(/\\plain(?![a-zA-Z])/g, "</i></u></b>\\")
    .replace(/\\par/g, "\\ <br>\\")
    .replace(/\\i0/g, "\\ </i>\\")
    .replace(/\\ulnone/g, "\\ </u>\\")
    .replace(/\\b0/g, "\\ </b>\\")
    .replace(/\\i(?![a-zA-Z])/g, "\\ <i>\\")
    .replace(/\\ul(?![a-zA-Z])/g, "\\ <u>\\")
    .replace(/\\b(?![a-zA-Z])/g, "\\ <b>\\")
    .replace(/\\[a-zA-Z]+-?\d*\s?/g, "")
    .replace(/\{[^{}<]*\}/g, "")
    .replace(/\\/g, "")
    .replace(/\( /g, "(")
    .replace(/ \)/g, ")");

  if (modifiedContent.startsWith("{")) {
    modifiedContent = modifiedContent.substring(1);
  }
  if (modifiedContent.endsWith("}")) {
    modifiedContent = modifiedContent.slice(0, -1);
  }

  modifiedContent = removeUnmatchedTags(modifiedContent);
  modifiedContent = organizeHTMLTags(modifiedContent);

  const createNewLinesResult = createNewLines(modifiedContent);

  const italicExtractionResult = extractItalicSections(
    createNewLinesResult.modifiedContent
  );

  if (
    !italicExtractionResult ||
    !italicExtractionResult.modifiedContent ||
    !italicExtractionResult.temporaryDoc
  ) {
    return { modifiedContent: "", extractedSections: "" };
  }

  const italicConsolidationResult = consolidateItalicExtractions(
    italicExtractionResult
  );

  const actExtractionResult = extractActSections(
    italicConsolidationResult.modifiedContent
  );
  const sceneExtractionResult = extractSceneSections(
    actExtractionResult.modifiedContent
  );
  const characterExtractionResult = extractCharacterTags(
    sceneExtractionResult.modifiedContent
  );

  let finalModifiedContent = characterExtractionResult.modifiedContent;
  let extractedSections =
    italicConsolidationResult.temporaryDoc.join("\n") +
    "\n\n" +
    actExtractionResult.temporaryDoc.join("\n") +
    "\n\n" +
    sceneExtractionResult.temporaryDoc.join("\n") +
    "\n\n" +
    characterExtractionResult.temporaryDoc.join("\n") +
    "\n\n" +
    createNewLinesResult.extractedText.join("\n");
  let characterNames = characterExtractionResult.characterNames.join("\n");

  return {
    modifiedContent: finalModifiedContent,
    extractedSections,
    characterNames,
  };
}

function createHTMLFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`File saved to ${filePath}`);
  } catch (err) {
    console.error(err);
  }
}

function convertRTFtoHTML(filePath) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const { modifiedContent, extractedSections, characterNames } =
      processRTFContent(data);

    const dir = path.dirname(filePath);
    const baseName = path.basename(filePath, ".rtf");
    const outputDir = path.join(dir, "testing-outputs");

    createHTMLFile(
      path.join(outputDir, `${baseName}_modified.html`),
      modifiedContent
    );
    createHTMLFile(
      path.join(outputDir, `${baseName}_extracted.html`),
      extractedSections
    );
    createHTMLFile(
      path.join(outputDir, `${baseName}_names.html`),
      characterNames
    );
  });
}

function convertRTFEscapeSequencesToHTML(rtfContent) {
  const escapeSequenceMap = {
    92: "'", // Regular apostrophe
    93: "\u201C", // Left double quotation mark
    94: "\u201D", // Right double quotation mark
    96: "-", // Hyphen
    97: "\u2014", // Em dash
    85: "...", // Three periods for ellipsis
    91: "\u2018", // Left single quotation mark
    95: "\u2022", // Bullet
    a0: "\u00A0", // Non-breaking space
  };

  return rtfContent.replace(/\\'([0-9a-fA-F]{2})/g, (match, hexValue) => {
    const mappedChar = escapeSequenceMap[hexValue.toLowerCase()];
    if (mappedChar) {
      return mappedChar;
    }

    const char = String.fromCharCode(parseInt(hexValue, 16));
    return char;
  });
}

function removeUnmatchedTags(content) {
  const tags = ["i", "u", "b"];

  tags.forEach((tag) => {
    const openingTagRegex = new RegExp(`<${tag}>`, "g");
    let match;

    while ((match = openingTagRegex.exec(content)) !== null) {
      const closingTagRegex = new RegExp(`</${tag}>`);

      if (!closingTagRegex.test(content.substring(match.index))) {
        content =
          content.substring(0, match.index) +
          content.substring(match.index + match[0].length);
        console.warn(
          `Unmatched opening tag <${tag}> removed at index ${match.index}`
        );
      }
    }

    const closingTagRegex = new RegExp(`</${tag}>`, "g");

    while ((match = closingTagRegex.exec(content)) !== null) {
      const openingTagRegex = new RegExp(`<${tag}>`);

      if (!openingTagRegex.test(content.substring(0, match.index))) {
        content =
          content.substring(0, match.index) +
          content.substring(match.index + match[0].length);
      }
    }
  });

  return content;
}

function organizeHTMLTags(content) {
  function moveTags(content, tag, outerTags) {
    const regex = new RegExp(`(<${tag}>)([\\s\\S]*?)(</${tag}>)`, "g");

    return content.replace(
      regex,
      (match, openingTag, innerContent, closingTag) => {
        let beforeTextContent = "";
        let afterTextContent = "";

        const parts = innerContent.split(/(<\/?[bu]>)/);
        let textEncountered = false;

        parts.forEach((part) => {
          if (part.match(/<\/?[bu]>/)) {
            if (!textEncountered) {
              beforeTextContent += part;
            } else {
              afterTextContent += part;
            }
          } else if (part.trim() !== "") {
            textEncountered = true;
          }
        });

        openingTag = beforeTextContent + openingTag;
        closingTag += afterTextContent;

        innerContent = innerContent.replace(
          new RegExp(beforeTextContent, "g"),
          ""
        );
        innerContent = innerContent.replace(
          new RegExp(afterTextContent, "g"),
          ""
        );

        return openingTag + innerContent + closingTag;
      }
    );
  }

  content = moveTags(content, "i", ["b", "u"]);
  content = moveTags(content, "u", ["b"]);

  return content;
}

function createNewLines(content) {
  let cleanedContent = content;

  cleanedContent = cleanedContent
    .replace(/\n/g, "")
    .replace(/>([ \t]+<)/g, "><")
    .replace(/\s+/g, " ")
    .replace(/^\s/gm, "")
    .replace(/<br>([\s]*|$)/gm, "<br>\n");

  cleanedContent = addEndTagToLines(cleanedContent);

  cleanedContent = cleanedContent.replace(/{end}\s*/g, "\n");

  const endingExtractionResult = extractEndingTags(cleanedContent);

  let cleanedExtraction = endingExtractionResult.modifiedContent;
  let extractedText = endingExtractionResult.temporaryDoc;

  cleanedContent = cleanedExtraction.replace(/^(<[^>]+>)+/gm, (match) => {
    return "{start}" + match;
  });

  cleanedContent = cleanedContent
    .replace(/\n*{start}/g, "")
    .replace(/{br}/g, "<br>");

  return { modifiedContent: cleanedContent, extractedText };
}

function addEndTagToLines(content) {
  let lines = content.split("\n");
  let processedLines = lines.map((line) => {
    if (/^<[^>]+>.*[^\s<][^>]*$/.test(line)) {
      return line.replace(/^(<[^>]+>)+/, (htmlTags) => htmlTags + "{end}");
    }
    return line;
  });
  return processedLines.join("\n");
}

function extractItalicSections(content) {
  const temporaryDoc = [];
  let placeholderCount = 1;
  let modifiedContent = "";
  let index = 0;

  while (index < content.length) {
    let startIndex = content.indexOf("<i>", index);
    let endIndex = content.indexOf("</i>", startIndex);

    if (startIndex === -1) {
      modifiedContent += content.slice(index);
      break;
    }

    if (endIndex === -1) {
      console.error("No closing </i> tag found for <i> at index " + startIndex);
      break;
    }

    modifiedContent += content.slice(index, startIndex);

    let italicText = content.slice(startIndex + 3, endIndex);
    italicText = processExtractedText(italicText);
    const placeholder = `{i${placeholderCount}}`;
    temporaryDoc.push(`${placeholder} - [${italicText}]`);
    placeholderCount++;

    modifiedContent += placeholder;
    index = endIndex + 4;
  }

  return { modifiedContent, temporaryDoc };
}

function consolidateItalicExtractions(content) {
  const stageDirectionResults = consolidateStageDirections(content);

  const sceneDescriptionResults = consolidateSceneDirections(
    stageDirectionResults
  );

  return {
    modifiedContent: sceneDescriptionResults.modifiedContent,
    temporaryDoc: sceneDescriptionResults.temporaryDoc,
  };
}

function consolidateStageDirections(content) {
  const lines = content.temporaryDoc;
  let modifiedContent = content.modifiedContent;
  const openWithoutCloseRegex = /.*\[\((?!.*\))/;
  let openParenthesisLines = [];

  lines.forEach((line, index) => {
    if (openWithoutCloseRegex.test(line)) {
      openParenthesisLines.push(index);
    }
  });

  openParenthesisLines.forEach((startIndex) => {
    for (let i = startIndex + 1; i < lines.length; i++) {
      const line = lines[i];
      const hasCloseParenthesis = line.includes(")");
      const hasOpenParenthesis = line.includes("(");
      const openIndex = line.indexOf("(");
      const closeIndex = line.indexOf(")");
      let splitArray = [];
      let condensedArray = [];

      if (!hasCloseParenthesis && !hasOpenParenthesis) {
        continue;
      } else if (hasOpenParenthesis && hasCloseParenthesis) {
        if (closeIndex < openIndex) {
          const tagMatch = line.match(/\{i(\d+)\}/);

          if (tagMatch) {
            const tagNumber = tagMatch[1];
            lines[i] = line.replace(")", `)]\n{i${tagNumber}.5} - [`);
            splitArray.push(i);
            console.log(splitArray);
            condensedArray.push(lines.slice(startIndex, i + 1));
            //TODO There should be some additional logic here that confirms that the new '.5' line actually has a closing tag somewhere as well
            //TODO does this 'break' pull it entirely out of the loop? Will it ever go through the successful find below?
          }
          break;
        } else {
          const startLineTagMatch = lines[startIndex].match(/\{i(\d+)\}/);
          if (startLineTagMatch) {
            const startLineTag = startLineTagMatch[0];
            console.error(`Unclosed Parenthesis in Line ${startLineTag}`);
          } else {
            console.error(`Unclosed Parenthesis in Line ${startIndex}`);
          }
          break;
        }
      } else if (hasOpenParenthesis) {
        const startLineTagMatch = lines[startIndex].match(/\{i(\d+)\}/);
        if (startLineTagMatch) {
          const startLineTag = startLineTagMatch[0];
          console.error(`Unclosed Parenthesis in Line ${startLineTag}`);
        } else {
          console.error(`Unclosed Parenthesis in Line ${startIndex}`);
        }
        break;
      } else {
        condensedArray.push(lines.slice(startIndex, i + 1));
        break;
      }
    }

    splitArray.forEach((element) => {
      const splitElements = element.split("\n");
      const firstLine = splitElements[0];
      const secondLine = splitElements[1];
      const firstLineMatch = firstLine.match(/\{i(\d+)\}/);
      const secondLineMatch = secondLine.match(/\{i(\d+)\}/);
      const updatedTags = firstLineMatch[0] + secondLineMatch[0];
      const indexToReplace = lines.findIndex((item) =>
        item.startsWith(firstLineMatch[0])
      );

      modifiedContent = modifiedContent.replace(
        new RegExp(firstLineMatch[0], "g"),
        updatedTags
      );
      lines.splice(indexToReplace, 1, ...splitElements);
    });

    condensedArray.forEach((element) => {
      let mergedLines = element.join();
      mergedLines = mergedLines.replace(/\]\s*\{i\d+\}\s*-\s*\[/g, " ");
      mergedLines = mergedLines.replace(/\[\|\\]/g, "");

      //snag each id tag at start and hold
      //replace the multiple elements in 'lines' with result
      //replace the multiple elements in 'modifiedContent' with result
    });

    //TODO adding logic so that it can replace the items in both extract list and modified doc
  });

  return { modifiedContent: modifiedContent, temporaryDoc: lines };
}

function consolidateSceneDirections(content) {
  const lines = content.temporaryDoc;
  let modifiedContent = content.modifiedContent;
  return { modifiedContent, temporaryDoc: lines };
}

function extractActSections(content) {
  const temporaryDoc = [];
  let placeholderCount = 1;
  let regex = /(Act \w+)/gi;
  const sections = [
    "i",
    "ii",
    "iii",
    "iv",
    "v",
    "vi",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
  ];

  let modifiedContent = content;

  [...content.matchAll(regex)].forEach(([match, sectionAct]) => {
    let section = sectionAct.split(" ")[1];
    if (sections.includes(section.toLowerCase())) {
      const placeholder = `{a${placeholderCount}}`;
      temporaryDoc.push(`${placeholder} - [${sectionAct}]`);
      modifiedContent = modifiedContent.replace(sectionAct, placeholder);
      placeholderCount++;
    }
  });

  return { modifiedContent, temporaryDoc };
}

function extractSceneSections(content) {
  const temporaryDoc = [];
  let placeholderCount = 1;
  const prologueRegex = /prologue(\s*<[^>]*>|$)/gim;
  const intermissionRegex = /intermission(\s*<[^>]*>|$)/gim;
  const epilogueRegex = /epilogue(\s*<[^>]*>|$)/gim;
  const sceneRegex =
    /^(\s*)scene(:\s|\s*-|\s[1-9]*|\s[one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty]|$)/gim;
  const sceneNumRegex = /^(\s*)[1-9][0-9]*([:\s]*|[\s-]*|[\s[a-zA-Z]]*|$)/gim;

  let lines = content.split("\n");
  let modifiedContent = lines.map((line) => {
    let matched = false;
    let extractedText = "";

    [
      prologueRegex,
      intermissionRegex,
      epilogueRegex,
      sceneRegex,
      sceneNumRegex,
    ].forEach((regex) => {
      if (!matched && line.match(regex)) {
        extractedText = line.replace(/<[^>]+>/g, "").trim();
        line = line.replace(extractedText, `{s${placeholderCount}}`);
        temporaryDoc.push(`{s${placeholderCount}} - [${extractedText}]`);
        placeholderCount++;
        matched = true;
      }
    });

    return line;
  });

  return { modifiedContent: modifiedContent.join("\n"), temporaryDoc };
}

function extractCharacterTags(content) {
  const temporaryDoc = [];
  let placeholderCount = 1;
  const characterNames = new Set();
  const nameRegex = /^([A-Z]\s*)+\./;

  let lines = content.split("\n");
  let modifiedContent = lines.map((line) => {
    let match = line.match(nameRegex);
    if (match) {
      let extractedText = match[0];
      let placeholder = `{c${placeholderCount}}`;
      line = line.replace(nameRegex, placeholder);
      temporaryDoc.push(`${placeholder} - [${extractedText}]`);
      characterNames.add(extractedText.slice(0, -1));
      placeholderCount++;
    }
    return line;
  });
  return {
    modifiedContent: modifiedContent.join("\n"),
    temporaryDoc,
    characterNames: Array.from(characterNames),
  };
}

function extractEndingTags(content) {
  let lines = content.split("\n");
  let modifiedContent = [];
  let temporaryDoc = [];
  let placeholderCount = 1;

  const foundWords = findEndingTags(content);

  lines.forEach((line, index) => {
    let matched = false;

    for (const [word, indices] of Object.entries(foundWords)) {
      if (indices.includes(index + 1)) {
        const extractedText = line.replace(/<[^>]+>/g, "").trim();
        line = `{et${placeholderCount}}`;
        temporaryDoc.push(`{et${placeholderCount}} - [${extractedText}]`);
        placeholderCount++;
        matched = true;
        break;
      }
    }

    if (!matched) {
      modifiedContent.push(line);
    } else {
      modifiedContent.push(line);
    }
  });

  return { modifiedContent: modifiedContent.join("\n"), temporaryDoc };
}

function processExtractedText(text) {
  text = text.replace(/\n/g, "");

  text = text.replace(/<br>/g, "");

  while (text.includes("  ")) {
    text = text.replace(/  /g, " ");
  }

  text = text.trim();

  return text;
}

function findEndingTags(content) {
  const wordsToCheck = [
    "Blackout",
    "Lights Out",
    "End of Play",
    "End of Act",
    "End of Scene",
    "Fade to Black",
  ];

  let lines = content.split("\n");
  let foundWords = {};

  wordsToCheck.forEach((word) => {
    const regex = new RegExp(
      `^\\s*(<[^>]*>)*\\s*([\\[\\({\\})\\]]*${word}[\\[\\({\\})\\]]*)\\s*(<[^>]*>)*\\s*$`,
      "i"
    );
    lines.forEach((line, index) => {
      if (regex.test(line)) {
        if (!foundWords[word]) {
          foundWords[word] = [];
        }
        foundWords[word].push(index + 1);
      }
    });
  });

  return foundWords;
}

if (process.argv.length < 3) {
  console.log("Usage: node script.js <path_to_rtf_file>");
} else {
  convertRTFtoHTML(process.argv[2]);
}
