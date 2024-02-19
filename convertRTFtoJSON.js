import { create } from "domain";
import { readFile, write, writeFileSync } from "fs";
import { dirname, basename, join } from "path";

function convertRTFtoJSON(filePath) {
  readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    // Assuming processRTFContent now returns structured data for JSON
    const {
      modifiedContent,
      extractedSections,
      characterNames,
      problematicArray,
      structuredPlayContent,
    } = processRTFContent(data);

    const dir = dirname(filePath);
    const baseName = basename(filePath, ".rtf");
    const outputDir = join(dir, "json-outputs");

    createJSONFile(
      join(outputDir, `${baseName}_placeholders.json`),
      modifiedContent
    );
    createJSONFile(join(outputDir, `${baseName}_tags.json`), extractedSections);
    createJSONFile(
      join(outputDir, `${baseName}_characterList.json`),
      characterNames
    );
    createJSONFile(
      join(outputDir, `${baseName}_unsortedText.json`),
      problematicArray
    );
    createJSONFile(
      join(outputDir, `${baseName}_playStructure.json`),
      structuredPlayContent
    );
  });
}

function processRTFContent(content) {
  let modifiedContent = convertRTFEscapeSequencesToHTML(content);
  //TODO Look through the replaces below and check if they are necessary
  modifiedContent = modifiedContent
    .replace(/\\u8232/g, "\\")
    .replace(/\\(\s|$)/gm, " <br>")
    .replace(/\\plain(?![a-zA-Z])/g, "</i></u></b>\\")
    .replace(/\\i0/g, "\\ </i>\\")
    .replace(/\\ulnone/g, "\\ </u>\\")
    .replace(/\\b0/g, "\\ </b>\\")
    .replace(/\\i(?![a-zA-Z])/g, "\\ <i>\\")
    .replace(/\\ul(?![a-zA-Z])/g, "\\ <u>\\")
    .replace(/\\b(?![a-zA-Z])/g, "\\ <b>\\")
    .replace(/\\[a-zA-Z]+-?\d*\s?/g, "")
    .replace(/\{[^{}<]*\}/g, "")
    .replace(/\\/g, " ")
    .replace(/  /g, " ")
    .replace(/<(\w)>[\s|<br>]*<\/\1>/g, "")
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
  modifiedContent = modifiedContent.replace(
    /\s(\(voice over\)|\(voiceover\)|\(v\.o\.\)|\(vo\)|\(offstage\)|\(off-stage\)|\(off stage\)|\(o\.s\.\)|\(os\))\./gi,
    ". $1"
  );

  const createNewLinesResult = createNewLines(modifiedContent);

  const italicExtractionResult = extractItalicSections(
    createNewLinesResult.modifiedContent
  );

  const italicConsolidationResult = reorganizeItalicSection(
    italicExtractionResult
  );
  modifiedContent = italicConsolidationResult.modifiedContent.replace(
    /\n/g,
    ""
  );
  let leftoverArray = modifiedContent.split(/{.*?}/g).filter(Boolean);

  if (leftoverArray.length === 0) {
    leftoverArray.unshift("none");
  }

  leftoverArray.unshift("Unextracted Content");

  let unsortedArray = italicConsolidationResult.italicArray.filter(
    (line) => !line.includes("Delete")
  );

  if (unsortedArray.length === 0) {
    unsortedArray.unshift("none");
  }

  unsortedArray.unshift("Unsorted Italic Extractions");

  let problematicArray = leftoverArray.concat(unsortedArray);

  let extractedSections =
    "Play Title" +
    "\n" +
    italicConsolidationResult.titleArray.join("\n") +
    "\n\n" +
    "Play Descriptions" +
    "\n" +
    italicConsolidationResult.pdesArray.join("\n") +
    "\n\n" +
    "Act Title" +
    "\n" +
    italicConsolidationResult.actArray.join("\n") +
    "\n\n" +
    "Act Descriptions" +
    "\n" +
    italicConsolidationResult.adesArray.join("\n") +
    "\n\n" +
    "Scene Titles" +
    "\n" +
    italicConsolidationResult.sceneArray.join("\n") +
    "\n\n" +
    "Scene Locations" +
    "\n" +
    italicConsolidationResult.slocArray.join("\n") +
    "\n\n" +
    "Scene Descriptions" +
    "\n" +
    italicConsolidationResult.sdesArray.join("\n") +
    "\n\n" +
    "Character" +
    "\n" +
    italicConsolidationResult.characterArray.join("\n") +
    "\n\n" +
    "Character Directions" +
    "\n" +
    italicConsolidationResult.cdirArray.join("\n") +
    "\n\n" +
    "Dialogue" +
    "\n" +
    italicConsolidationResult.dialogueArray.join("\n") +
    "\n\n" +
    "Stage Directions" +
    "\n" +
    italicConsolidationResult.stgdArray.join("\n") +
    "\n\n" +
    "Endings" +
    "\n" +
    createNewLinesResult.endArray.join("\n");

  let characterNames = italicConsolidationResult.characterNames;
  let extractedPlayStructure = createPlayStructure(
    modifiedContent,
    extractedSections
  );
  let finalModifiedContent = extractedPlayStructure.modifiedContent;
  let finalExtractedSections = extractedPlayStructure.extractedSections;
  let finalPlayStructure = extractedPlayStructure.structuredPlayContent;

  return {
    modifiedContent: finalModifiedContent,
    extractedSections: finalExtractedSections,
    characterNames,
    problematicArray,
    structuredPlayContent: finalPlayStructure,
  };
}

function convertRTFEscapeSequencesToHTML(content) {
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

  return content.replace(/\\'([0-9a-fA-F]{2})/g, (match, hexValue) => {
    const mappedChar = escapeSequenceMap[hexValue.toLowerCase()];
    if (mappedChar) {
      return mappedChar;
    }

    const char = String.fromCharCode(parseInt(hexValue, 16));
    return char;
  });
}

function removeUnmatchedTags(content) {
  //TODO figure out how this works and make adjustments
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
  //TODO figure out how this works and make adjustments

  function moveTags(content, tag) {
    const regex = new RegExp(`(<${tag}>)([\\s\\S]*?)(</${tag}>)`, "g");

    return content.replace(regex, (_, openingTag, innerContent, closingTag) => {
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
    });
  }

  content = moveTags(content, "i", ["b", "u"]);
  content = moveTags(content, "u", ["b"]);

  return content;
}

function createNewLines(content) {
  //TODO figure out how this works and make adjustments
  // Also check through the replace below and see if it is necessary

  let cleanedContent = content;

  cleanedContent = cleanedContent
    .replace(/\n/g, "")
    .replace(/>([ \t]+<)/g, "><")
    .replace(/\s+/g, " ")
    .replace(/^\s/gm, "")
    .replace(/<br>([\s]*|$)/gm, "<br>\n");

  const endingExtractionResult = extractEndingTags(cleanedContent);

  let cleanedExtraction = endingExtractionResult.modifiedContent;
  let endArray = endingExtractionResult.endArray;

  return { modifiedContent: cleanedExtraction, endArray };
}

function addEndTagToLines(content) {
  //TODO figure out how this works and make adjustments

  let lines = content.split("\n");
  let processedLines = lines.map((line) => {
    if (/^<[^>]+>.*[^\s<][^>]*$/.test(line)) {
      return line.replace(/^(<[^>]+>)+/, (htmlTags) => htmlTags + "{end}");
    }
    return line;
  });
  return processedLines.join("\n");
}

function extractEndingTags(content) {
  //TODO figure out how this works and make adjustments

  let lines = content.split("\n");
  let modifiedContent = [];
  let endArray = [];
  let placeholderCount = 1;

  const foundWords = findEndingTags(content);

  lines.forEach((line, index) => {
    for (const [word, indices] of Object.entries(foundWords)) {
      if (indices.includes(index + 1)) {
        const extractedText = line.replace(/<[^>]+>/g, "").trim();
        let placeholder;
        if (word === "End of Play" || word === "The End") {
          placeholder = `{endp${placeholderCount}}`;
        } else if (word === "End of Act") {
          placeholder = `{enda${placeholderCount}}`;
        } else {
          placeholder = `{endt${placeholderCount}}`;
        }
        line = placeholder;
        endArray.push(`${placeholder} - [${extractedText}]`);
        placeholderCount++;
        break;
      }
    }
    modifiedContent.push(line);
  });

  modifiedContent = modifiedContent.join("\n");
  modifiedContent = modifiedContent
    .replace(/{endp(\d+)\}/g, "</i>{endp$1}")
    .replace(/{enda(\d+)\}/g, "</i>{enda$1}")
    .replace(/{endt(\d+)\}/g, "</i>{endt$1}")
    .replace(/<i>\s*<\/i>/g, "");

  return { modifiedContent, endArray };
}

function findEndingTags(content) {
  //TODO figure out how this works and make adjustments
  const wordsToCheck = [
    "Blackout",
    "Lights Out",
    "End of Play",
    "End of Act",
    "End of Scene",
    "Fade to Black",
    "Transition To",
    "The End",
  ];

  let lines = content.split("\n");
  let foundWords = {};

  wordsToCheck.forEach((word) => {
    const regex = new RegExp(
      `^\\s*(<[^>]*>)*\\s*([\\[\\({\\})\\]]*\\s*${word}\\.*\\s*[:\\[\\({\\})\\]]*)\\s*(<[^>]*>)*\\s*$`,
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

function extractItalicSections(content) {
  //TODO figure out how this works and make adjustments
  const italicArray = [];
  let placeholderCount = 1;
  let modifiedContent = "";
  let index = 0;

  content = content.split("\n");

  content = content.map((line) => {
    return line
      .replace(/^(((<[^>]*>)*|)\s*)(\(.*\))/g, "$1<i> $4 </i>")
      .replace(/(((<[^>]*>)*|)\s*)(\[.*\])/g, "$1<i> $4 </i>");
  });
  content = content.join("\n");

  content = content
    .replace(/<i>[\s\n]*<i>/gm, "<i>")
    .replace(/<\/i>[\s\n]*<\/i>/gm, "</i>");

  content = addEndTagToLines(content);
  content = content.replace(/{end}\s*/g, "\n");
  content = content.replace(/^(<[^>]+>)+/gm, (match) => {
    return "{start}" + match;
  });
  content = content
    .replace(/\n*{start}/g, "")
    .replace(/<i>(<br>|\s*)*<i>/g, "<i>");

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
    italicArray.push(`${placeholder} - [${italicText}]`);
    placeholderCount++;

    modifiedContent += placeholder;
    index = endIndex + 4;
  }

  return { modifiedContent, italicArray };
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

function reorganizeItalicSection(content) {
  const pairedParenthesis = returnLooseParenthesis(content); //finds any parenthesis just outside of italicTags, and inserts them into the tag
  let modifiedContent = pairedParenthesis.modifiedContent;

  modifiedContent = modifiedContent
    .replace(/<br>/g, "")
    .replace(/([a-z])\s*\n\s*([a-z])/g, `$1 $2`);
  const indexedOpenItalics = inventoryStageDirections(
    pairedParenthesis.italicArray
  ); //notes which lines have unmatched parenthesis

  const notedItalicAdjustments = groupStageDirections(indexedOpenItalics); //indexes groups of multi-lined chunks within parenthesis, and lines that need to be split, into two new arrays
  let italicArray = notedItalicAdjustments.italicArray;
  let splitArray = notedItalicAdjustments.splitArray;
  let condensedArray = notedItalicAdjustments.condensedArray;

  ({ modifiedContent, italicArray } = splitStageDirections(
    modifiedContent,
    italicArray,
    splitArray
  )); //uses stored index of lines needing to be split, and then splits them

  const finalizedStageDirections = condenseStageDirections(
    modifiedContent,
    italicArray,
    condensedArray
  ); //uses stored index of lines needing to be grouped, and then groups them
  modifiedContent = finalizedStageDirections.modifiedContent;
  italicArray = finalizedStageDirections.italicArray;

  const extractedTitle = extractTitleOfPlay(
    finalizedStageDirections.modifiedContent
  ); //finds Title of Play and extracts it into its own array
  let titleArray = extractedTitle.titleArray;
  modifiedContent = extractedTitle.modifiedContent;
  modifiedContent = modifiedContent.replace(/<[^>]+>/g, "");

  const extractedActTags = extractActSections(modifiedContent); //finds Acts and extracts them into their own array
  let actArray = extractedActTags.actArray;
  modifiedContent = extractedActTags.modifiedContent;

  const extractedSceneSections = extractSceneSections(modifiedContent); //finds Scenes and extracts them into their own array
  modifiedContent = extractedSceneSections.modifiedContent;
  let sceneArray = extractedSceneSections.sceneArray;

  const extractedCharacterTags = extractCharacterTags(
    modifiedContent,
    italicArray
  ); //finds Characters and extracts them into their own array
  let characterArray = extractedCharacterTags.characterArray;
  let characterNames = extractedCharacterTags.characterNames;
  modifiedContent = extractedCharacterTags.modifiedContent;

  const extractedSceneLocations = sceneLocationSearch(modifiedContent); //finds Scene Locations and extracts them into their own array
  modifiedContent = extractedSceneLocations.modifiedContent;
  let slocArray = extractedSceneLocations.slocArray;

  const sortedItalicSection = sortItalicSection(modifiedContent, italicArray); //sorts through the remaining italics and renames them based on their content
  modifiedContent = sortedItalicSection.modifiedContent;
  italicArray = sortedItalicSection.italicArray;

  const replacedItalicText = parseItalicArray(
    modifiedContent,
    italicArray,
    titleArray,
    actArray,
    sceneArray,
    slocArray,
    characterArray
  );
  modifiedContent = replacedItalicText.modifiedContent;
  italicArray = replacedItalicText.italicArray;
  let pdesArray = replacedItalicText.pdesArray;
  let adesArray = replacedItalicText.adesArray;
  let sdesArray = replacedItalicText.sdesArray;
  let cdirArray = replacedItalicText.cdirArray;
  let stgdArray = replacedItalicText.stgdArray;

  const extractedDialogue = extractDialogue(modifiedContent); //finds Dialogue and extracts them into their own array
  modifiedContent = extractedDialogue.modifiedContent;
  let dialogueArray = extractedDialogue.dialogueArray;

  modifiedContent = modifiedContent.replace(/ /g, "");

  return {
    modifiedContent,
    italicArray,
    actArray,
    adesArray,
    characterArray,
    characterNames,
    sceneArray,
    slocArray,
    dialogueArray,
    titleArray,
    pdesArray,
    stgdArray,
    cdirArray,
    sdesArray,
  };
}

function returnLooseParenthesis(content) {
  const openParenRegex = /\(\s*(<[^>]+>\s*)*({i\d+})/g;
  const closeParenRegex = /({i\d+})\s*(<[^>]+>\s*)*\)/g;
  let modifiedContent = content.modifiedContent;
  let italicArray = content.italicArray;

  const processMatch = (tag, isOpenParen) => {
    const italicArrayIndex = italicArray.findIndex((element) =>
      element.includes(tag)
    );

    if (italicArrayIndex !== -1) {
      let regexPattern;
      if (isOpenParen) {
        italicArray[italicArrayIndex] = italicArray[italicArrayIndex].replace(
          /\[/,
          "[$("
        );
        regexPattern = new RegExp("\\(" + tag);
      } else {
        italicArray[italicArrayIndex] = italicArray[italicArrayIndex].replace(
          /\](?![^\[]*\])/g,
          ")]"
        );
        regexPattern = new RegExp(tag + "\\)");
      }

      modifiedContent = modifiedContent.replace(regexPattern, tag);
    }
  };

  modifiedContent.replace(openParenRegex, (_, tag) => {
    processMatch(tag, true);
  });

  modifiedContent.replace(closeParenRegex, (_, tag) => {
    processMatch(tag, false);
  });

  return { modifiedContent, italicArray };
}

function inventoryStageDirections(content) {
  const italicArray = content;
  const openWithoutCloseRegex = /.*\[\((?!.*\))/;
  let openParenthesisLines = [];

  italicArray.forEach((line, index) => {
    if (openWithoutCloseRegex.test(line)) {
      openParenthesisLines.push(index);
    }
  });

  return { italicArray, openParenthesisLines };
}

function groupStageDirections(content) {
  const italicArray = content.italicArray;
  const openParenthesisLines = content.openParenthesisLines;
  const splitArray = [];
  const condensedArray = [];

  openParenthesisLines.forEach((startIndex) => {
    for (let i = startIndex + 1; i < italicArray.length; i++) {
      const line = italicArray[i];
      const hasCloseParenthesis = line.includes(")");
      const hasOpenParenthesis = line.includes("(");
      const openIndex = line.indexOf("(");
      const closeIndex = line.indexOf(")");

      if (!hasCloseParenthesis && !hasOpenParenthesis) {
        continue;
      } else if (hasOpenParenthesis && hasCloseParenthesis) {
        if (closeIndex < openIndex) {
          const tagMatch = line.match(/\{i(\d+)\}/);

          if (tagMatch) {
            const tagNumber = tagMatch[1];
            italicArray[i] = line.replace(")", `)]\n{i${tagNumber}.5} - [`);
            splitArray.push(i);
            condensedArray.push(italicArray.slice(startIndex, i + 1));
            //TODO There should be some additional logic here that confirms that the new '.5' line actually has a closing tag somewhere as well
            //test splitArray with a different script that has an example of this happening
          }
          break;
        } else {
          const startLineTagMatch = italicArray[startIndex].match(/\{i(\d+)\}/);
          if (startLineTagMatch) {
            const startLineTag = startLineTagMatch[0];
            console.error(`Unclosed Parenthesis in Line ${startLineTag}`);
          } else {
            console.error(`Unclosed Parenthesis in Line ${startIndex}`);
          }
          break;
        }
      } else if (hasOpenParenthesis) {
        const startLineTagMatch = italicArray[startIndex].match(/\{i(\d+)\}/);
        if (startLineTagMatch) {
          const startLineTag = startLineTagMatch[0];
          console.error(`Unclosed Parenthesis in Line ${startLineTag}`);
        } else {
          console.error(`Unclosed Parenthesis in Line ${startIndex}`);
        }
        break;
      } else {
        condensedArray.push(italicArray.slice(startIndex, i + 1));
        break;
      }
    }
  });

  return { italicArray, splitArray, condensedArray };
}

function splitStageDirections(modifiedContent, italicArray, splitArray) {
  splitArray.forEach((element) => {
    const splitElements = element.split("\n");
    const firstLine = splitElements[0];
    const secondLine = splitElements[1];
    const firstLineMatch = firstLine.match(/\{i(\d+)\}/);
    const secondLineMatch = secondLine.match(/\{i(\d+)\}/);
    const updatedTags = firstLineMatch[0] + secondLineMatch[0];
    const indexToReplace = italicArray.findIndex((item) =>
      item.startsWith(firstLineMatch[0])
    );

    modifiedContent = modifiedContent.replace(
      new RegExp(firstLineMatch[0], "g"),
      updatedTags
    );
    italicArray.splice(indexToReplace, 1, ...splitElements);
  });

  return { modifiedContent, italicArray };
}

function condenseStageDirections(modifiedContent, italicArray, condensedArray) {
  condensedArray.forEach((nestedArray) => {
    const listOfTags = [];
    const endingIndex = nestedArray.length;
    const startingIndex = italicArray.findIndex((line) =>
      line.includes(nestedArray[0])
    );

    nestedArray.forEach((element) => {
      const italicTag = element.match(/{i(\d+)\}/);
      if (italicTag) {
        listOfTags.push(italicTag[0]);
      }
    });

    let mergedTags = listOfTags.join("");
    mergedTags = mergedTags.replace(/\{i(\d+)\}.*/, "$1");
    const lastTagMatch = listOfTags[listOfTags.length - 1].match(/\{i(\d+)\}/);
    if (lastTagMatch) {
      mergedTags = `{i${mergedTags}-${lastTagMatch[1]}}`;
    }

    let mergedLines = nestedArray.join("");
    mergedLines = mergedLines.replace(/\]\s*\{i\d+\}\s*-\s*\[/g, " ");
    mergedLines = mergedLines.replace(/\[\|\\]/g, "");
    mergedLines = mergedLines.replace(/\{i\d+\}/g, mergedTags);

    italicArray.splice(startingIndex, endingIndex, mergedLines);

    let startingTag = listOfTags[0];
    let endingTag = listOfTags[endingIndex - 1];
    let regexPattern = new RegExp(startingTag + ".*?" + endingTag, "s");

    modifiedContent = modifiedContent.replace(regexPattern, mergedTags);
  });

  return { modifiedContent, italicArray };
}

function extractTitleOfPlay(content) {
  let modifiedContent = content;
  const regex = /<b>(?:[\s\S]*)<u>\s*([\s\S]*?)(?:(<br>|\s]*<\/u>\s)*<\/b>)/;
  const titleArray = [];

  const match = modifiedContent.match(regex);
  if (match) {
    let title = match[1];
    const htmlRegex = /(\s*<[^>]+>\s*)+/g;
    let newTitle = title.replace(htmlRegex, " ").replace(/\n/, "").trim();
    const titleTag = `{play${1}}`;

    modifiedContent = modifiedContent.replace(title, titleTag);
    titleArray.push(`${titleTag} - [${newTitle}]`);
  }
  return { modifiedContent, titleArray };
}

function extractActSections(content) {
  const actArray = [];
  let placeholderCount = 1;
  let regex = /^(Act\s*\w+)/gim;

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
  [...modifiedContent.matchAll(regex)].forEach(([match, sectionAct]) => {
    let section = sectionAct.split(" ")[1];
    if (section && sections.includes(section.toLowerCase())) {
      const placeholder = `{act${placeholderCount}}`;
      actArray.push(`${placeholder} - [${sectionAct}]`);
      modifiedContent = modifiedContent.replace(sectionAct, placeholder);
      placeholderCount++;
    }
  });

  return { modifiedContent, actArray };
}

function extractSceneSections(content) {
  const sceneArray = [];
  let placeholderCount = 1;
  const prologueRegex = /^prologue(\s*<[^>]*>|\s*{|$)/gim;
  const interludeRegex = /^interlude(\s*<[^>]*>|$)/gim;
  const epilogueRegex = /^epilogue(\s*<[^>]*>|$)/gim;
  const sceneRegex =
    /^(\s*)scene(:\s|\s*-|\s[1-9]*|\s[one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty]|$)/gim;
  const sceneNumRegex = /^(\s*)[1-9][0-9]*([:\s]*|[\s-]*|[\s[a-zA-Z]]*|$)/gim;
  let lines = content.split("\n");
  let modifiedContent = lines.map((line) => {
    let matched = false;
    let extractedText = "";

    [
      { regex: prologueRegex, placeholder: "sp" },
      { regex: interludeRegex, placeholder: "si" },
      { regex: epilogueRegex, placeholder: "se" },
      { regex: sceneRegex, placeholder: "s" },
      { regex: sceneNumRegex, placeholder: "s" },
    ].forEach(({ regex, placeholder }) => {
      if (!matched && line.match(regex)) {
        const match = line.match(/.*?(?={|$)/);

        if (match) {
          extractedText = match[0].replace(/<[^>]+>/g, "").trim();
          const placeholderWithCount = `{${placeholder}${placeholderCount}}`;
          line = line.replace(extractedText, placeholderWithCount);

          sceneArray.push(`${placeholderWithCount} - [${extractedText}]`);
          placeholderCount++;
          matched = true;
        }
      }
    });

    return line;
  });

  return { modifiedContent: modifiedContent.join("\n"), sceneArray };
}

function extractCharacterTags(content) {
  const characterArray = [];
  let placeholderCount = 1;
  const characterNames = new Set();
  //TODO: Need to incorporate an apostrophe in the character name
  const nameRegex = /^([A-Z]+(?:\.(?![A-Z]|\.)|\/|\(|\)|\s|[A-Z])*\.)\s/g;
  let modifiedContent = content.split("\n");
  modifiedContent = modifiedContent.map((line) => {
    let match = line.match(nameRegex);
    if (match) {
      let extractedText = match[0];
      let placeholder = `{c${placeholderCount}}`;
      line = line.replace(nameRegex, placeholder);
      characterArray.push(`${placeholder} - [${extractedText.slice(0, -1)}]`);
      characterNames.add(extractedText.slice(0, -2));
      placeholderCount++;
    }
    return line;
  });
  return {
    modifiedContent: modifiedContent.join("\n"),
    characterArray,
    characterNames: Array.from(characterNames),
  };
}

function sceneLocationSearch(modifiedContent) {
  let slocArray = [];
  const sceneRegex = /{s[a-z]?(\d+)}([\s\S]*?)(?={[a-z]+)/g;
  const htmlTagRegex = /<[^>]+>|\n/g;

  let match;
  while ((match = sceneRegex.exec(modifiedContent)) !== null) {
    const sceneNumber = match[1];

    let betweenPlaceholders = match[2];
    const textWithoutHtml = betweenPlaceholders
      .replace(htmlTagRegex, "")
      .trim();

    const hasNonHtmlAlpha = /[a-zA-Z]/.test(textWithoutHtml);
    const slocTag = `{sloc${sceneNumber}}`;

    if (hasNonHtmlAlpha) {
      slocArray.push(`${slocTag} - [${textWithoutHtml}]`);
      modifiedContent = modifiedContent.replace(betweenPlaceholders, slocTag);
    }
  }

  return { modifiedContent, slocArray };
}

function sortItalicSection(modifiedContent, italicArray) {
  const nonParenRegex = /{i\d+(-\d+)*}\s-\s\[[^(\[]*\]/g;
  const parenRegex = /{i\d+(-\d+)*}\s-\s\[\(/g;
  const bracketRegex = /{i\d+(-\d+)*}\s-\s\[\[/g;
  const updatedItalicArray = italicArray.map((line) => {
    if (line.match(nonParenRegex)) {
      const npTagMatch = line.match(/{i(\d+(-\d+)*)}/);
      const npTagNumber = npTagMatch[1];
      const originalNpTag = `{i${npTagNumber}}`;
      const newNpTag = `{np${npTagNumber}}`;

      const updatedNpLine = line.replace(originalNpTag, newNpTag);

      modifiedContent = modifiedContent.replace(
        new RegExp(originalNpTag, "g"),
        newNpTag
      );

      return updatedNpLine;
    } else if (line.match(parenRegex)) {
      const pTagMatch = line.match(/{i(\d+(-\d+)*)}/);
      const pTagNumber = pTagMatch[1];
      const originalPTag = `{i${pTagNumber}}`;
      const newPTag = `{p${pTagNumber}}`;

      const updatedPLine = line.replace(originalPTag, newPTag);

      modifiedContent = modifiedContent.replace(
        new RegExp(originalPTag, "g"),
        newPTag
      );
      return updatedPLine;
    } else if (line.match(bracketRegex)) {
      const bTagMatch = line.match(/{i(\d+(-\d+)*)}/);
      const bTagNumber = bTagMatch[1];
      const originalBTag = `{i${bTagNumber}}`;
      const newBTag = `{b${bTagNumber}}`;

      const updatedBLine = line.replace(originalBTag, newBTag);

      modifiedContent = modifiedContent.replace(
        new RegExp(originalBTag, "g"),
        newBTag
      );
      return updatedBLine;
    }
    return line;
  });
  return { modifiedContent, italicArray: updatedItalicArray };
}

function parseItalicArray(
  modifiedContent,
  italicArray,
  titleArray,
  actArray,
  sceneArray,
  slocArray,
  characterArray
) {
  const playDescriptionExtracted = extractPlayDescription(
    modifiedContent,
    italicArray,
    titleArray
  );
  let pdesArray = playDescriptionExtracted.pdesArray;
  modifiedContent = playDescriptionExtracted.modifiedContent;
  italicArray = playDescriptionExtracted.italicArray;

  const actDescriptionExtracted = extractActDescription(
    modifiedContent,
    italicArray,
    actArray
  );
  let adesArray = actDescriptionExtracted.adesArray;
  modifiedContent = actDescriptionExtracted.modifiedContent;
  italicArray = actDescriptionExtracted.italicArray;

  const sceneDescriptionExtracted = extractSceneDescription(
    modifiedContent,
    italicArray,
    sceneArray,
    slocArray
  );
  let sdesArray = sceneDescriptionExtracted.sdesArray;
  modifiedContent = sceneDescriptionExtracted.modifiedContent;
  italicArray = sceneDescriptionExtracted.italicArray;

  const emphasizedDialogueReplaced = replaceEmphasizedDialogue(
    modifiedContent,
    italicArray,
    characterArray
  );
  modifiedContent = emphasizedDialogueReplaced.modifiedContent;
  italicArray = emphasizedDialogueReplaced.italicArray;

  const stageDirectionsExtracted = extractStageDirections(
    modifiedContent,
    italicArray
  );
  let stgdArray = stageDirectionsExtracted.stgdArray;
  modifiedContent = stageDirectionsExtracted.modifiedContent;
  italicArray = stageDirectionsExtracted.italicArray;

  const characterDirectionsExtracted = extractCharacterDirections(
    modifiedContent,
    italicArray,
    characterArray
  );
  let cdirArray = characterDirectionsExtracted.cdirArray;
  modifiedContent = characterDirectionsExtracted.modifiedContent;
  italicArray = characterDirectionsExtracted.italicArray;

  return {
    modifiedContent,
    italicArray,
    pdesArray,
    adesArray,
    sdesArray,
    stgdArray,
    cdirArray,
  };
}

function extractPlayDescription(modifiedContent, italicArray, titleArray) {
  const npRegex = /^{np\d+(-\d+)*}/;
  const playRegex = /{play(\d+)}/;
  let pdesArray = [];

  italicArray = italicArray.map((npLine) => {
    const npTagMatch = npLine.match(npRegex);
    if (npTagMatch) {
      const npTag = npTagMatch[0];
      let writeDelete = false;

      titleArray.forEach((titleLine) => {
        const playTagMatch = titleLine.match(playRegex);
        if (playTagMatch) {
          const playTag = playTagMatch[0];
          const playTagNumber = playTagMatch[1];
          const pdesTag = `{pdes${playTagNumber}}`;
          const pdesLine = npLine.replace(npTag, pdesTag);
          const npTagPos = modifiedContent.indexOf(npTag);
          const playTagPos = modifiedContent.indexOf(playTag);

          if (playTagPos !== -1 && npTagPos !== -1 && playTagPos < npTagPos) {
            const betweenTags = modifiedContent.substring(
              playTagPos + playTag.length,
              npTagPos
            );
            if (!betweenTags.includes("{")) {
              pdesArray.push(`${pdesLine}`);
              modifiedContent = modifiedContent.replace(npTag, pdesTag);
              writeDelete = true;
            }
          }
        }
      });
      if (writeDelete) {
        return "Delete";
      }
    }
    return npLine;
  });

  return { modifiedContent, italicArray, pdesArray };
}

function extractActDescription(modifiedContent, italicArray, actArray) {
  const npRegex = /^{np\d+(-\d+)*}/;
  const actRegex = /{act(\d+)}/;
  let adesArray = [];

  italicArray = italicArray.map((npLine) => {
    const npTagMatch = npLine.match(npRegex);

    if (npTagMatch) {
      const npTag = npTagMatch[0];
      let writeDelete = false;

      actArray.forEach((actLine) => {
        const actTagMatch = actLine.match(actRegex);
        if (actTagMatch) {
          const actTag = actTagMatch[0];
          const actTagNumber = actTagMatch[1];
          const adesTag = `{ades${actTagNumber}}`;
          const adesLine = npLine.replace(npTag, adesTag);
          const npTagPos = modifiedContent.indexOf(npTag);
          const actTagPos = modifiedContent.indexOf(actTag);

          if (actTagPos !== -1 && npTagPos !== -1 && actTagPos < npTagPos) {
            const betweenTags = modifiedContent.substring(
              actTagPos + actTag.length,
              npTagPos
            );
            if (!betweenTags.includes("{")) {
              adesArray.push(`${adesLine}`);
              modifiedContent = modifiedContent.replace(npTag, adesTag);
              writeDelete = true;
            }
          }
        }
      });
      if (writeDelete) {
        return "Delete";
      }
    }
    return npLine;
  });
  return { modifiedContent, italicArray, adesArray };
}

function extractStageDirections(modifiedContent, italicArray) {
  const pRegex = /{p(\d+(-\d+)*)}/;
  const bRegex = /{b(\d+(-\d+)*)}/;
  let stgdArray = [];
  italicArray = italicArray
    .reverse()
    .map((pLine) => {
      const pTagMatch = pLine.match(pRegex);
      const bTagMatch = pLine.match(bRegex);
      if (pTagMatch) {
        const pTag = pTagMatch[0];
        const pTagNumber = pTagMatch[1];
        const behindCRegex = new RegExp(
          `${pTag}[\\s\\S]*?({c\\d+}|{s[a-z]?\\d+}|{end[a-z]\\d+}|{act\\d+}|{stgd\\d+(-\\d+)*})`
        );
        const cTagMatch = modifiedContent.match(behindCRegex);

        if (cTagMatch) {
          const cTag = cTagMatch[1];
          const stgdTag = `{stgd${pTagNumber}}`;
          const stgdLine = pLine.replace(pTag, stgdTag);
          const pTagPos = modifiedContent.indexOf(pTag);
          const cTagPos = modifiedContent.indexOf(cTag);

          if (pTagPos !== -1 && cTagPos !== -1 && pTagPos < cTagPos) {
            const betweenTags = modifiedContent.substring(
              pTagPos + pTag.length,
              cTagPos
            );

            if (
              !betweenTags.includes("{") &&
              !betweenTags.replace(/<[^>]*>/g, "").match(/\w+|\?|!/)
            ) {
              stgdArray.push(`${stgdLine}`);
              modifiedContent = modifiedContent.replace(pTag, stgdTag);
              return "Delete";
            }
          }
        }
      } else if (bTagMatch) {
        const bTag = bTagMatch[0];
        const bTagMatched = modifiedContent.match(bTag);
        const bTagNumber = bTagMatch[1];

        if (bTagMatched) {
          const stgdTag = `{stgd${bTagNumber}}`;
          const stgdLine = pLine.replace(bTag, stgdTag);
          stgdArray.push(`${stgdLine}`);
          modifiedContent = modifiedContent.replace(bTag, stgdTag);
          return "Delete";
        }
      }
      return pLine;
    })
    .reverse();
  stgdArray = stgdArray.reverse();
  return { modifiedContent, italicArray, stgdArray };
}

// TODO read through the item below to confirm it does what I want
function extractCharacterDirections(
  modifiedContent,
  italicArray,
  characterArray
) {
  const pRegex = /{p(\d+(-\d+)*)}/;
  const characterRegex = /{c*(\d+)}/;
  const cdirRegex = /{cdir(\d+(\.\d+)?)}/;
  let cdirArray = [];

  italicArray = italicArray.map((pLine) => {
    const pTagMatch = pLine.match(pRegex);
    if (pTagMatch) {
      const pTag = pTagMatch[0];
      let writeDelete = false;
      let tagCount = 0.1;

      characterArray.forEach((cLine) => {
        const cTagMatch = cLine.match(characterRegex);
        if (cTagMatch) {
          const cTag = cTagMatch[0];
          const cTagNumber = Number(cTagMatch[1]);
          let cdirNumber = cTagNumber + tagCount;
          const cdirTag = `{cdir${cdirNumber}}`;
          const cdirLine = pLine.replace(pTag, cdirTag);
          const pTagPos = modifiedContent.indexOf(pTag);
          const cTagPos = modifiedContent.indexOf(cTag);

          if (cTagPos !== -1 && pTagPos !== -1 && cTagPos < pTagPos) {
            const betweenTags = modifiedContent.substring(
              cTagPos + cTag.length,
              pTagPos
            );
            if (!betweenTags.includes("{")) {
              cdirArray.push(`${cdirLine}`);
              modifiedContent = modifiedContent.replace(pTag, cdirTag);
              writeDelete = true;
            }
          }
        }
      });

      cdirArray.forEach((newCdirLine) => {
        const newCdirTagMatch = newCdirLine.match(cdirRegex);
        if (newCdirTagMatch) {
          const newCdirTag = newCdirTagMatch[0];
          const newCdirTagNumber = Number(newCdirTagMatch[1]);
          let newCdirNumber =
            Math.round((newCdirTagNumber + tagCount) * 10) / 10;
          const cdirTag = `{cdir${newCdirNumber}}`;
          const cdirLine = pLine.replace(pTag, cdirTag);
          const pTagPos = modifiedContent.indexOf(pTag);
          const newCdirTagPos = modifiedContent.indexOf(newCdirTag);

          if (
            newCdirTagPos !== -1 &&
            pTagPos !== -1 &&
            newCdirTagPos < pTagPos
          ) {
            const betweenTags = modifiedContent.substring(
              newCdirTagPos + newCdirTag.length,
              pTagPos
            );
            if (!betweenTags.includes("{")) {
              cdirArray.push(`${cdirLine}`);
              modifiedContent = modifiedContent.replace(pTag, cdirTag);
              writeDelete = true;
            }
          }
        }
      });
      if (writeDelete) {
        return "Delete";
      }
    }
    return pLine;
  });
  return { modifiedContent, italicArray, cdirArray };
}

function extractSceneDescription(
  modifiedContent,
  italicArray,
  sceneArray,
  slocArray
) {
  const npRegex = /({np\d+(-\d+)*}) - \[(.*)\]/;
  const sceneRegex = /{s[a-z]?(\d+)}/;
  const slocRegex = /{sloc(\d+)}/;
  const sdesRegex = /({sdes\d+}) - \[(.*)\]/;
  let sdesArray = [];
  italicArray = italicArray.map((npLine) => {
    const npTagMatch = npLine.match(npRegex);

    if (npTagMatch) {
      const npTag = npTagMatch[1];
      const npContent = npTagMatch[3];
      let writeDelete = false;
      // let tagCount = 0.1;

      slocArray.forEach((slocLine) => {
        const slocTagMatch = slocLine.match(slocRegex);

        if (slocTagMatch) {
          const slocTag = slocTagMatch[0];
          const slocTagNumber = Number(slocTagMatch[1]);
          let sdesNumber = slocTagNumber; //+ tagCount;
          const sdesTag = `{sdes${sdesNumber}}`;
          const sdesLine = npLine.replace(npTag, sdesTag);
          const npTagPos = modifiedContent.indexOf(npTag);
          const slocTagPos = modifiedContent.indexOf(slocTag);

          if (slocTagPos !== -1 && npTagPos !== -1 && slocTagPos < npTagPos) {
            const betweenTags = modifiedContent.substring(
              slocTagPos + slocTag.length,
              npTagPos
            );
            if (!betweenTags.includes("{")) {
              sdesArray.push(`${sdesLine}`);
              modifiedContent = modifiedContent.replace(npTag, sdesTag);
              writeDelete = true;
            }
          }
        }
      });

      sceneArray.forEach((sceneLine) => {
        const sceneTagMatch = sceneLine.match(sceneRegex);
        if (sceneTagMatch) {
          const sceneTag = sceneTagMatch[0];
          const sceneTagNumber = Number(sceneTagMatch[1]);
          let sdesNumber = sceneTagNumber; //+ tagCount;
          const sdesTag = `{sdes${sdesNumber}}`;
          const sdesLine = npLine.replace(npTag, sdesTag);
          const npTagPos = modifiedContent.indexOf(npTag);
          const sceneTagPos = modifiedContent.indexOf(sceneTag);
          if (sceneTagPos !== -1 && npTagPos !== -1 && sceneTagPos < npTagPos) {
            const betweenTags = modifiedContent.substring(
              sceneTagPos + sceneTag.length,
              npTagPos
            );
            if (!betweenTags.includes("{")) {
              sdesArray.push(`${sdesLine}`);
              modifiedContent = modifiedContent.replace(npTag, sdesTag);
              writeDelete = true;
            }
          }
        }
      });

      sdesArray = sdesArray.map((sdesLine) => {
        const sdesTagMatch = sdesLine.match(sdesRegex);

        if (sdesTagMatch) {
          const sdesTag = sdesTagMatch[1];
          const sdesContent = sdesTagMatch[2];
          const npTagPos = modifiedContent.indexOf(npTag);
          const sdesTagPos = modifiedContent.indexOf(sdesTag);
          const newSdesContent = (sdesContent + "<br><br>" + npContent).trim();

          if (sdesTagPos !== -1 && npTagPos !== -1 && sdesTagPos < npTagPos) {
            const betweenTags = modifiedContent.substring(
              sdesTagPos + sdesTag.length,
              npTagPos
            );
            if (!betweenTags.includes("{")) {
              const newSdesLine = sdesLine.replace(sdesContent, newSdesContent);
              modifiedContent = modifiedContent.replace(npTag, "");
              writeDelete = true;
              return newSdesLine;
            }
          }
        }
        return sdesLine; // return original line if no replacement occurred
      });

      if (writeDelete) {
        return "Delete";
      }
    }

    return npLine;
  });
  return { modifiedContent, italicArray, sdesArray };
}

function replaceEmphasizedDialogue(
  modifiedContent,
  italicArray,
  characterArray
) {
  const npRegex = /^{np\d+(-\d+)*}/;
  const characterRegex = /{c[a-z]*\d+(\.\d+)?}/;
  const npTextRegex = /\[(.*)\]/;
  italicArray = italicArray.map((npLine) => {
    const npTagMatch = npLine.match(npRegex);
    if (npTagMatch) {
      const npTag = npTagMatch[0];
      let writeDelete = false;
      characterArray.forEach((characterLine) => {
        const characterTagMatch = characterLine.match(characterRegex);
        if (characterTagMatch) {
          const characterTag = characterTagMatch[0];
          const npTagPos = modifiedContent.indexOf(npTag);
          const characterTagPos = modifiedContent.indexOf(characterTag);
          const npText = npLine.match(npTextRegex)[1];
          const emText = ` <em>${npText}</em> `;

          if (
            characterTagPos !== -1 &&
            npTagPos !== -1 &&
            characterTagPos < npTagPos
          ) {
            const betweenTags = modifiedContent.substring(
              characterTagPos + characterTag.length,
              npTagPos
            );
            if (!betweenTags.includes("{c")) {
              modifiedContent = modifiedContent
                .replace(npTag, emText)
                .replace(/\s*<em>/, " <em>")
                .replace(/<\/em>\s*/, "</em> ");
              writeDelete = true;
            }
          }
        }
      });
      if (writeDelete) {
        return "Delete";
      }
    }
    return npLine;
  });
  return { modifiedContent, italicArray };
}

function extractDialogue(content) {
  let modifiedContent = content
    .replace(/}\s*/g, "}")
    .replace(/([a-zA-Z])\s*\n/gm, `$1 `)
    .replace(/\n([a-zA-Z])/gm, `{stgd0}$1`)
    .replace(/\n/g, "");

  const characterRegex = /{c(\d+)}([^\{]+)/;
  const characterNumberRegex = /{c(\d+)}/;
  const combinedRegex = /({cdir\d+\.\d+}|{stgd\d+(-\d+)*})([^\{]+)/;
  let dialogueArray = [];
  let lines = modifiedContent.split(/(?=\{c\d+\})/);

  lines = lines.map((line) => {
    let characterNumber = null;
    let tagCount = 0.1;
    const characterMatch = characterRegex.exec(line);
    const characterNumberMatch = characterNumberRegex.exec(line);
    if (characterNumberMatch) {
      characterNumber = Number(characterNumberMatch[1]);
    }
    if (characterMatch) {
      tagCount = 0.1;
      let dialogueContent = characterMatch[2].trim();
      if (dialogueContent) {
        let dialogueNumber = characterNumber + tagCount;
        const dialogueTag = `{d${dialogueNumber}}`;
        const arrayContent = `${dialogueTag} - [${dialogueContent}]`;
        dialogueArray.push(arrayContent);
        line = line.replace(characterMatch[2], dialogueTag);
        tagCount += 0.1;
      }
    }
    let combinedMatch = combinedRegex.exec(line);
    while (combinedMatch) {
      let dialogueContent = combinedMatch[3].trim();
      if (dialogueContent) {
        let dialogueNumber = characterNumber + tagCount;
        const dialogueTag = `{d${dialogueNumber}}`;
        const arrayContent = `${dialogueTag} - [${dialogueContent}]`;
        dialogueArray.push(arrayContent);
        line = line.replace(combinedMatch[3], dialogueTag);
        tagCount += 0.1;
      }
      combinedMatch = combinedRegex.exec(line);
    }

    return line;
  });
  modifiedContent = lines.join("");
  modifiedContent = modifiedContent
    .replace(/{stgd0}/g, "")
    .replace(/({s[a-z]?\d+})/g, "\n$1")
    .replace(/({c\d+})/g, "\n$1")
    .replace(/({stgd\d+(-\d+)*})/g, "\n$1")
    .replace(/({end[a-z]\d+})/g, "\n$1")
    .replace(/({act\d+})/g, "\n$1");

  return { modifiedContent, dialogueArray };
}

function createPlayStructure(modifiedContent, extractedSections) {
  const balancedPlayTags = matchPlayTags(modifiedContent, extractedSections);
  modifiedContent = balancedPlayTags.modifiedContent;
  extractedSections = balancedPlayTags.extractedSections;
  let structuredPlayContent = balancedPlayTags.structuredPlayContent;

  const balancedActTags = matchActTags(
    modifiedContent,
    extractedSections,
    structuredPlayContent
  );
  modifiedContent = balancedActTags.modifiedContent;
  extractedSections = balancedActTags.extractedSections;
  structuredPlayContent = balancedActTags.structuredPlayContent;

  const balancedSceneTags = matchSceneTags(
    modifiedContent,
    extractedSections,
    structuredPlayContent
  );
  modifiedContent = balancedSceneTags.modifiedContent;
  extractedSections = balancedSceneTags.extractedSections;
  structuredPlayContent = balancedSceneTags.structuredPlayContent;

  return { modifiedContent, extractedSections, structuredPlayContent };
}

function matchPlayTags(modifiedContent, extractedSections) {
  const playStartRegex = /{play\d+}/g;
  const playDescriptionRegex = /{pdes\d+}/g;
  const playEndRegex = /{endp\d+}/g;
  const findStartOfPlay = modifiedContent.match(playStartRegex);
  const startOfPlayTagCount = findStartOfPlay ? findStartOfPlay.length : 0;
  const findEndOfPlay = modifiedContent.match(playEndRegex);
  const endOfPlayTagCount = findEndOfPlay ? findEndOfPlay.length : 0;
  let structuredPlayContent = {};

  if (startOfPlayTagCount > 1) {
    console.log("There are multiple starts to Play"); //replace with pop-up window to fix issue
  }

  if (endOfPlayTagCount > 1) {
    console.log("There are multiple endings to Play"); //replace with pop-up window to fix issue
  }

  if (startOfPlayTagCount == 0 && endOfPlayTagCount == 0) {
    modifiedContent = `{play1}\n${modifiedContent}\n{endp1}`;
    extractedSections = extractedSections.replace(
      /(Play Title\n)/,
      "$1{play1} - [Title of Play]"
    ); //include pop-up window to add title
    extractedSections = `${extractedSections}\n{endp1} - [END OF PLAY]`;
  }

  if (startOfPlayTagCount == 0 && endOfPlayTagCount == 1) {
    modifiedContent = `{play1}\n${modifiedContent}`;
    extractedSections = extractedSections.replace(
      /(Play Title\n)/,
      "$1{play1} - [Title of Play]"
    ); //include pop-up window to add title
  }

  if (startOfPlayTagCount == 1 && endOfPlayTagCount == 0) {
    modifiedContent = `${modifiedContent}\n{endp1}`;
    extractedSections = `${extractedSections}\n{endp1} - [END OF PLAY]`;
  }
  const newStartOfPlay = playStartRegex.exec(modifiedContent);
  const contentBeforePlayStart = modifiedContent.substring(
    0,
    newStartOfPlay.index
  );

  if (contentBeforePlayStart.trim().length !== 0) {
    console.log("There is content before the Play Starts"); //replace with pop-up window to fix issue
  }

  const newEndOfPlay = playEndRegex.exec(modifiedContent);
  const contentAfterPlayEnd = modifiedContent.substring(
    newEndOfPlay.index + newEndOfPlay[0].length
  );

  if (contentAfterPlayEnd.trim().length !== 0) {
    console.log("There is content after the Play Ends"); //replace with pop-up window to fix issue
  }

  let playDescriptionMatch = modifiedContent.match(playDescriptionRegex);
  if (!playDescriptionMatch) {
    modifiedContent = modifiedContent.replace(/({play\d+})/, "$1{pdes1}");
    extractedSections = extractedSections.replace(
      /(Play Descriptions)/,
      "$1\n{pdes1} - [ ]"
    );
  }

  modifiedContent = modifiedContent.replace(/{endp\d+}/, "{endp1}");
  extractedSections = extractedSections.replace(/{endp\d+}/, "{endp1}");

  let playTitle = extractedSections.match(/{play\d+} - \[(.*)\]/);
  let playDescription = extractedSections.match(/{pdes\d+} - \[(.*)\]/);
  let playEnding = extractedSections.match(/{endp\d+} - \[(.*)\]/);

  structuredPlayContent.playTitle = playTitle[1];
  structuredPlayContent.playDescription = playDescription[1];
  structuredPlayContent.actStructure = [];
  structuredPlayContent.playEnding = playEnding[1];

  return { modifiedContent, extractedSections, structuredPlayContent };
}

function matchActTags(
  modifiedContent,
  extractedSections,
  structuredPlayContent
) {
  const actStartRegex = /{act\d+}/g;
  const actStartMatches = modifiedContent.match(actStartRegex);
  const actStartCount = actStartMatches ? actStartMatches.length : 0;
  if (actStartCount == 0) {
    const oneActStructure = createOneActStructure(
      modifiedContent,
      extractedSections
    );
    modifiedContent = oneActStructure.modifiedContent;
    extractedSections = oneActStructure.extractedSections;
  } else if (actStartCount == 1) {
    const singleActStructure = createSingleActStructure(
      modifiedContent,
      extractedSections
    );
    modifiedContent = singleActStructure.modifiedContent;
    extractedSections = singleActStructure.extractedSections;
  } else if (actStartCount > 1) {
    const multipleActStructure = createMultipleActStructure(
      modifiedContent,
      extractedSections
    );
    modifiedContent = multipleActStructure.modifiedContent;
    extractedSections = multipleActStructure.extractedSections;
  }

  let actTitle = extractedSections.match(/{act\d+} - \[(.*)\]/);
  let actDescription = extractedSections.match(/{ades\d+} - \[(.*)\]/);
  let actEnding = extractedSections.match(/{enda\d+} - \[(.*)\]/);
  //below only works for One Act Structure. Needs more refinement for multiple acts
  //this means that the scene structure will need to be worked into the act loop for building the overall structure
  structuredPlayContent.actStructure.push({});
  structuredPlayContent.actStructure[0].actTitle = actTitle[1];
  structuredPlayContent.actStructure[0].actDescription = actDescription[1];
  structuredPlayContent.actStructure[0].sceneStructure = [];
  structuredPlayContent.actStructure[0].actEnding = actEnding[1];

  return { modifiedContent, extractedSections, structuredPlayContent };
}

function createOneActStructure(modifiedContent, extractedSections) {
  modifiedContent = modifiedContent
    .replace(/({play1}{pdes1})/, "$1{act1}{actdes1}")
    .replace(/({endp1})/, "{enda1}{endp1}");

  extractedSections = extractedSections
    .replace(/(Act Title)/, "$1\n{act1} - [ ]")
    .replace(/(Act Descriptions)/, "$1\n{ades1} - [ ]")
    .replace(/({endp1})/, `{enda1} - [END OF ACT]\n$1`);
  return { modifiedContent, extractedSections };
}

function createSingleActStructure(modifiedContent, extractedSections) {
  const actStartRegex = /{act\d+}/g;
  const actEndRegex = /{enda\d+}/g;

  //TODO: Implement logic for single act
  return { modifiedContent, extractedSections };
}

function createMultipleActStructure(modifiedContent, extractedSections) {
  const actStartRegex = /{act\d+}/g;
  const actEndRegex = /{enda\d+}/g;

  //TODO: Implement logic for multiple acts
  return { modifiedContent, extractedSections };
}

function matchSceneTags(
  modifiedContent,
  extractedSections,
  structuredPlayContent
) {
  //this needs to be worked into the act loop so that each act's scenes start fresh
  let arrayOfActs = modifiedContent
    .replace(/{play1}{pdes1}/, "")
    .replace(/({enda\d+}){endp1}/, "$1")
    .split(/(?={act\d+})/);

  arrayOfActs.forEach((act) => {
    let counters = {};
    let tempString = act.replace(/{(s[a-z]?)(\d+)}/g, (match, p1, p2) => {
      counters[p1] = (counters[p1] || 0) + 1;
      return `{${match}${p1}${counters[p1]}}`;
    });
    let sceneCount = 0;
    let lines = tempString.split(/(?={{s[a-z]?\d+})/);
    lines.forEach((line) => {
      let replacementRegex = /{({s[a-z]?\d+})(s[a-z]?\d+)}/;
      let lineMatch = line.match(replacementRegex);
      if (lineMatch) {
        const tempTag = lineMatch[0];
        const oldTag = lineMatch[1];
        const newTagContents = lineMatch[2];
        const newTag = "{" + newTagContents + "}";
        act = act.replace(oldTag, newTag);
        modifiedContent = modifiedContent.replace(oldTag, newTag);
        extractedSections = extractedSections.replace(oldTag, newTag);
      }
    });
    act = act.split(/(?={s[a-z]?\d+})/).filter(Boolean);

    act.forEach((scene, index) => {
      const sceneRegex = /{(s[a-z]?)(\d+)}/;
      const sceneLocationRegex = /{(s[a-z]?)(\d+)}({sloc\d+})/;
      const sceneDescriptionRegex = /{(s[a-z]?)(\d+)}.*({s[a-z]?des\d+})/;
      const completeSceneRegex = /{(s[a-z]?\d+)}.*({endt\d+})/;
      const nextSceneRegex = /{(s[a-z]?\d+)|enda\d+}/;
      const sceneMatch = scene.match(sceneRegex);
      const sceneLocationMatch = scene.match(sceneLocationRegex);
      const sceneDescriptionMatch = scene.match(sceneDescriptionRegex);
      const completeSceneMatch = scene.match(completeSceneRegex);
      const incompleteSceneMatch = scene.match(sceneRegex);
      //Work in Below: Logic for Script without a Scene

      if (sceneMatch) {
        const sceneTag = sceneMatch[0];
        structuredPlayContent.actStructure[0].sceneStructure.push({});
        //prettier-ignore
        structuredPlayContent.actStructure[0].sceneStructure[sceneCount].internalSceneStructure = [];
        //prettier-ignore
        let sceneTitle = extractedSections.match(new RegExp(`${sceneTag} - \\[(.*)\\]`));
        //prettier-ignore
        structuredPlayContent.actStructure[0].sceneStructure[sceneCount].sceneTitle = sceneTitle[1];
        //Work in Above: Logic for Script without a Scene
        if (sceneLocationMatch) {
          const sceneTagType = sceneLocationMatch[1];
          const sceneTagNumber = sceneLocationMatch[2];
          const oldLocationTag = sceneLocationMatch[3];
          let newLocationTag = `{${sceneTagType}loc${sceneTagNumber}}`;
          modifiedContent = modifiedContent.replace(
            oldLocationTag,
            newLocationTag
          );
          extractedSections = extractedSections.replace(
            oldLocationTag,
            newLocationTag
          );
          //prettier-ignore
          let sceneLocation = extractedSections.match(new RegExp(`${newLocationTag} - \\[(.*)\\]`));
          //prettier-ignore
          structuredPlayContent.actStructure[0].sceneStructure[sceneCount].sceneLocation = sceneLocation[1];
        } else {
          const sceneTagType = sceneMatch[1];
          const sceneTagNumber = sceneMatch[2];
          let locationTag = `{${sceneTagType}loc${sceneTagNumber}}`;
          let currentScene = sceneMatch[0];
          modifiedContent = modifiedContent.replace(
            currentScene,
            currentScene + locationTag
          );
          extractedSections = extractedSections.replace(
            /(Scene Locations)/,
            `$1\n${locationTag} - [ ]`
          );

          //prettier-ignore
          let sceneLocation = extractedSections.match(new RegExp(`${locationTag} - \\[(.*)\\]`));
          //prettier-ignore
          structuredPlayContent.actStructure[0].sceneStructure[sceneCount].sceneLocation = sceneLocation[1];
        }

        if (sceneDescriptionMatch) {
          const sceneTagType = sceneDescriptionMatch[1];
          const sceneTagNumber = sceneDescriptionMatch[2];
          const oldDescriptionTag = sceneDescriptionMatch[3];
          let newDescriptionTag = `{${sceneTagType}des${sceneTagNumber}}`;
          modifiedContent = modifiedContent.replace(
            oldDescriptionTag,
            newDescriptionTag
          );
          extractedSections = extractedSections.replace(
            oldDescriptionTag,
            newDescriptionTag
          );

          //prettier-ignore
          let sceneDescription = extractedSections.match(new RegExp(`${newDescriptionTag} - \\[(.*)\\]`));
          //prettier-ignore
          structuredPlayContent.actStructure[0].sceneStructure[sceneCount].sceneDescription = sceneDescription[1];
        } else {
          const sceneTagType = sceneMatch[1];
          const sceneTagNumber = sceneMatch[2];
          let descriptionTag = `{${sceneTagType}des${sceneTagNumber}}`;
          let currentScene = sceneMatch[0];
          modifiedContent = modifiedContent.replace(
            currentScene,
            currentScene + descriptionTag
          );
          extractedSections = extractedSections.replace(
            /(Scene Descriptions)/,
            `$1\n${descriptionTag} - [ ]`
          );
          //prettier-ignore
          let sceneDescription = extractedSections.match(new RegExp(`${descriptionTag} - \\[(.*)\\]`));
          //prettier-ignore
          structuredPlayContent.actStructure[0].sceneStructure[sceneCount].sceneDescription = sceneDescription[1];
        }

        if (completeSceneMatch) {
          const sceneTagContents = completeSceneMatch[1];
          const oldEndingTag = completeSceneMatch[2];
          let newEndingTag = `{end${sceneTagContents}}`;
          modifiedContent = modifiedContent.replace(oldEndingTag, newEndingTag);
          extractedSections = extractedSections.replace(
            oldEndingTag,
            newEndingTag
          );
          //prettier-ignore
          let sceneEnding = extractedSections.match(new RegExp(`${newEndingTag} - \\[(.*)\\]`));
          //prettier-ignore
          structuredPlayContent.actStructure[0].sceneStructure[sceneCount].sceneEnding = sceneEnding[1];
        } else {
          const sceneTagContents = incompleteSceneMatch[1];
          let endingTag = `{end${sceneTagContents}}`;
          let i = index + 1;
          let nextScene = act[i];
          let nextSceneMatch = nextScene.match(nextSceneRegex);
          const insertTagReplacement = endingTag + nextSceneMatch[0];
          modifiedContent = modifiedContent.replace(
            nextSceneMatch[0],
            insertTagReplacement
          );
          //prettier-ignore
          let sceneEnding = extractedSections.match(new RegExp(`${endingTag} - \\[(.*)\\]`));
          //prettier-ignore
          structuredPlayContent.actStructure[0].sceneStructure[sceneCount].sceneEnding = sceneEnding[1];
        }

        const internalSceneStructure = createInternalSceneStructure(
          scene,
          sceneCount,
          extractedSections,
          structuredPlayContent
        );

        sceneCount++;
      }
      //TODO: Add internal trigger for Chraracter and Stage Directions functions
    });
  });
  // console.log(structuredPlayContent.actStructure[0].sceneStructure);
  return { modifiedContent, extractedSections, structuredPlayContent };
}

function createInternalSceneStructure(
  scene,
  sceneCount,
  extractedSections,
  structuredPlayContent
) {
  let internalScene = scene
    .replace(/{s[a-z]?\d+}/g, "")
    .replace(/{sloc\d+}/g, "")
    .replace(/{s[a-z]?des\d+}/g, "")
    .replace(/{endt\d+}/g, "")
    .replace(/({d\d+\.\d+})({stgd\d+(-\d+)*})/g, "$1\n$2")
    .replace(/}({c\d+})/g, "}\n$1");
  internalScene = internalScene.split("\n").filter(Boolean);
  // let internalCount = 0;

  internalScene.forEach((line) => {
    const characterRegex = /({c\d+})/;
    const stageDirectionRegex = /^{stgd\d+(-\d+)*}/;
    const characterMatch = line.match(characterRegex);
    const stageDirectionMatch = line.match(stageDirectionRegex);

    if (characterMatch) {
      let characterTag = characterMatch[0];
      let characterContent = processCharacterStructure(
        line,
        characterTag,
        extractedSections
      );
      //prettier-ignore
      structuredPlayContent.actStructure[0].sceneStructure[sceneCount].internalSceneStructure.push(characterContent);
    }

    if (stageDirectionMatch) {
      let stgdContent = processStageDirectionStructure(line, extractedSections);
      //prettier-ignore
      structuredPlayContent.actStructure[0].sceneStructure[sceneCount].internalSceneStructure.push(stgdContent);
    }
  });
  return { scene, extractedSections, structuredPlayContent };
}

function processCharacterStructure(line, characterTag, extractedSections) {
  let characterContent = {};
  let extractedLines = extractedSections.split("\n");

  let characterIndex = extractedLines.findIndex((extractedLine) =>
    extractedLine.startsWith(characterTag)
  );

  let extractedLine = extractedLines[characterIndex];
  let extractedContent = extractedLine.match(/\[(.*)\]/);
  let characterName = extractedContent[1];
  characterContent.characterName = characterName;
  characterContent.characterAction = [];

  line = line.replace(characterTag, "").replace(/}{/g, "}\n{").split("\n");

  line.forEach((tag) => {
    let tagIndex = extractedLines.findIndex((extractedLine) =>
      extractedLine.startsWith(tag)
    );
    let extractedTag = extractedLines[tagIndex];
    // console.log(extractedTag);

    let extractedTagContent = extractedTag.match(/\[(.*)\]/);
    let tagTypeMatch = tag.match(/[a-z]+/);
    let tagType = tagTypeMatch[0];
    let tagContent = extractedTagContent[1];
    characterContent.characterAction.push({ tagType, tagContent });
  });

  return { characterContent };
}

function processStageDirectionStructure(line, extractedSections) {
  let stgdContent = [];
  let extractedLines = extractedSections.split("\n");

  line = line.replace(/}{/g, "}\n{").split("\n");

  line.forEach((tag) => {
    let tagIndex = extractedLines.findIndex((extractedLine) =>
      extractedLine.startsWith(tag)
    );
    let extractedTag = extractedLines[tagIndex];

    let extractedTagContent = extractedTag.match(/\[(.*)\]/);
    let tagTypeMatch = tag.match(/[a-z]+/);
    let tagType = tagTypeMatch[0];
    let tagContent = extractedTagContent[1];
    stgdContent.push({ tagType, tagContent });
  });

  return { stgdContent };
}

function createJSONFile(filePath, data) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    writeFileSync(filePath, jsonData, "utf8");
    console.log(`JSON file saved to ${filePath}`);
  } catch (err) {
    console.error(err);
  }
}

if (process.argv.length < 3) {
  console.log("Usage: node script.js <path_to_rtf_file>");
} else {
  convertRTFtoJSON(process.argv[2]);
}
