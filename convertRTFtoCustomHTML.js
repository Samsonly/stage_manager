import { readFile, writeFileSync } from "fs";
import { dirname, basename, join } from "path";

function convertRTFtoHTML(filePath) {
  readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const { modifiedContent, extractedSections, characterNames } =
      processRTFContent(data);

    const dir = dirname(filePath);
    const baseName = basename(filePath, ".rtf");
    const outputDir = join(dir, "testing-outputs");

    createHTMLFile(
      join(outputDir, `${baseName}_modified.html`),
      modifiedContent
    );
    createHTMLFile(
      join(outputDir, `${baseName}_extracted.html`),
      extractedSections
    );
    createHTMLFile(join(outputDir, `${baseName}_names.html`), characterNames);
  });
}

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

  const createNewLinesResult = createNewLines(modifiedContent);

  const italicExtractionResult = extractItalicSections(
    createNewLinesResult.modifiedContent
  );

  const italicConsolidationResult = reorganizeItalicSection(
    italicExtractionResult
  );

  //TODO parse and extract Dialoge
  //TODO condense dialogue tags with new emphasis text inserted

  let finalModifiedContent = italicConsolidationResult.modifiedContent;

  let extractedSections =
    italicConsolidationResult.italicArray.join("\n") +
    "\n\n" +
    italicConsolidationResult.actArray.join("\n") +
    "\n\n" +
    italicConsolidationResult.actdArray.join("\n") +
    "\n\n" +
    italicConsolidationResult.sceneArray.join("\n") +
    "\n\n" +
    italicConsolidationResult.slocArray.join("\n") +
    "\n\n" +
    italicConsolidationResult.characterArray.join("\n") +
    "\n\n" +
    italicConsolidationResult.dialogueArray.join("\n") +
    "\n\n" +
    createNewLinesResult.endArray.join("\n");

  let characterNames = italicConsolidationResult.characterNames.join("\n");

  return {
    modifiedContent: finalModifiedContent,
    extractedSections,
    characterNames,
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
  let endArray = endingExtractionResult.endArray;

  cleanedContent = cleanedExtraction.replace(/^(<[^>]+>)+/gm, (match) => {
    return "{start}" + match;
  });

  cleanedContent = cleanedContent.replace(/\n*{start}/g, "");

  return { modifiedContent: cleanedContent, endArray };
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

function extractEndingTags(content) {
  let lines = content.split("\n");
  let modifiedContent = [];
  let endArray = [];
  let placeholderCount = 1;

  const foundWords = findEndingTags(content);

  lines.forEach((line, index) => {
    let matched = false;

    for (const [word, indices] of Object.entries(foundWords)) {
      if (indices.includes(index + 1)) {
        const extractedText = line.replace(/<[^>]+>/g, "").trim();
        line = `{endt${placeholderCount}}`;
        endArray.push(`{endt${placeholderCount}} - [${extractedText}]`);
        placeholderCount++;
        matched = true;
        break;
      }
    }
    modifiedContent.push(line);
  });

  return { modifiedContent: modifiedContent.join("\n"), endArray };
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

function extractItalicSections(content) {
  //TODO figure out how this works and make adjustments

  const italicArray = [];
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

  const extractedActTags = extractActSections(
    finalizedStageDirections.modifiedContent
  ); //finds Acts and extracts them into their own array
  let actArray = extractedActTags.actArray;
  modifiedContent = extractedActTags.modifiedContent;

  const extractedActDescTags = actDescriptionSearch(
    modifiedContent,
    italicArray
  ); //finds Act Descriptions and extracts them into their own array
  let actdArray = extractedActDescTags.actdArray;
  modifiedContent = extractedActDescTags.modifiedContent;
  italicArray = extractedActDescTags.italicArray;

  const extractedSceneSections = extractSceneSections(modifiedContent); //finds Scenes and extracts them into their own array
  modifiedContent = extractedSceneSections.modifiedContent;
  let sceneArray = extractedSceneSections.sceneArray;

  const extractedCharacterTags = extractCharacterTags(modifiedContent); //finds Characters and extracts them into their own array
  let characterArray = extractedCharacterTags.characterArray;
  let characterNames = extractedCharacterTags.characterNames;
  modifiedContent = extractedCharacterTags.modifiedContent;

  const extractedSceneLocations = sceneLocationSearch(modifiedContent); //finds Scene Locations and extracts them into their own array
  modifiedContent = extractedSceneLocations.modifiedContent;
  let slocArray = extractedSceneLocations.slocArray;

  const sortedItalicSection = sortItalicSection(modifiedContent, italicArray); //sorts through the remaining italics and renames them based on their content
  modifiedContent = sortedItalicSection.modifiedContent;
  italicArray = sortedItalicSection.italicArray;

  const renamedStageDirections = parseStageDirections(
    modifiedContent,
    italicArray
  ); //renames italics known to be Stage Directions

  const parsedCharacterDirections = parseCharacterDirections(
    renamedStageDirections
  ); //renames italics known to be Stage Character Directions
  modifiedContent = parsedCharacterDirections.modifiedContent;
  italicArray = parsedCharacterDirections.italicArray;
  modifiedContent = modifiedContent.replace(/<[^>]+>/g, "").trim();

  const replacedEmphasizedText = parseEmphasizedText(
    modifiedContent,
    italicArray
  ); //renames italics known to be Stage Character Directions
  modifiedContent = replacedEmphasizedText.modifiedContent;
  italicArray = replacedEmphasizedText.italicArray;

  modifiedContent = modifiedContent.replace(/\n/g, "");

  const extractedDialogue = extractDialogue(modifiedContent); //finds Dialogue and extracts them into their own array
  modifiedContent = extractedDialogue.modifiedContent;
  let dialogueArray = extractedDialogue.dialogueArray;

  modifiedContent = modifiedContent.replace(/ /g, "");

  return {
    modifiedContent,
    italicArray,
    actArray,
    actdArray,
    characterArray,
    characterNames,
    sceneArray,
    slocArray,
    dialogueArray,
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
            //TODO does this 'break' pull it entirely out of the loop? Will it ever go through the successful find below?
            //TODO test splitArray with a different script that has an example of this happening
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

function extractActSections(content) {
  const actArray = [];
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

  [...modifiedContent.matchAll(regex)].forEach(([match, sectionAct]) => {
    let section = sectionAct.split(" ")[1];
    if (sections.includes(section.toLowerCase())) {
      const placeholder = `{a${placeholderCount}}`;
      actArray.push(`${placeholder} - [${sectionAct}]`);
      modifiedContent = modifiedContent.replace(sectionAct, placeholder);
      placeholderCount++;
    }
  });

  return { modifiedContent, actArray };
}

function actDescriptionSearch(modifiedContent, italicArray) {
  let actdArray = [];

  const actRegex = /{a(\d+)}([\s\S]*?)(?={([a-z]+)(\d+(-\d+)*)})/g;
  const htmlTagRegex = /<[^>]+>|\n/g;

  let match;
  while ((match = actRegex.exec(modifiedContent)) !== null) {
    const actNumber = match[1];
    let betweenPlaceholders = match[2];
    const nextPlaceholderType = match[3];
    const nextPlaceholderNumber = match[4];
    const textWithoutHtml = betweenPlaceholders
      .replace(htmlTagRegex, "")
      .trim();
    const hasNonHtmlAlpha = /[a-zA-Z]/.test(textWithoutHtml);
    const actdTag = `{actd${actNumber}}`;
    const nextTag = `{${nextPlaceholderType}${nextPlaceholderNumber}}`;

    if (hasNonHtmlAlpha) {
      if (nextPlaceholderType === "i") {
        const iTagContentIndex = italicArray.findIndex((element) =>
          element.includes(nextTag)
        );
        if (iTagContentIndex !== -1) {
          const iTagContent =
            italicArray[iTagContentIndex].match(/-\s\[(.*?)\]/)[1];
          actdArray.push(`${actdTag} - [${textWithoutHtml} ${iTagContent}]`);
          italicArray.splice(iTagContentIndex, 1);
        }
        modifiedContent = modifiedContent
          .replace(nextTag, actdTag)
          .replace(betweenPlaceholders, "");
      } else {
        actdArray.push(`${actdTag} - [${textWithoutHtml}]`);
        modifiedContent = modifiedContent.replace(betweenPlaceholders, "");
      }
      modifiedContent = modifiedContent.replace(betweenPlaceholders, actdTag);
    } else if (nextPlaceholderType === "i") {
      const iTagContentIndex = italicArray.findIndex((element) =>
        element.includes(nextTag)
      );
      if (iTagContentIndex !== -1) {
        const iTagContent =
          italicArray[iTagContentIndex].match(/-\s\[(.*?)\]/)[1];
        actdArray.push(`${actdTag} - [${iTagContent}]`);
        italicArray.splice(iTagContentIndex, 1);
      }
      modifiedContent = modifiedContent
        .replace(nextTag, actdTag)
        .replace(betweenPlaceholders, "");
    }
  }
  return { modifiedContent, italicArray, actdArray };
}

function extractCharacterTags(content) {
  const characterArray = [];
  let placeholderCount = 1;
  const characterNames = new Set();
  const nameRegex = /^[A-Z0-9][A-Z0-9\s&/]*\./;
  //TODO FIX FOR NAMES THAT HAVE PERIODS IN THEM

  let modifiedContent = content.split("\n");
  modifiedContent = modifiedContent.map((line) => {
    let match = line.match(nameRegex);
    if (match) {
      // lines
      let extractedText = match[0];
      let placeholder = `{c${placeholderCount}}`;
      line = line.replace(nameRegex, placeholder);
      characterArray.push(`${placeholder} - [${extractedText}]`);
      characterNames.add(extractedText.slice(0, -1));
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

function extractSceneSections(content) {
  const sceneArray = [];
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
        sceneArray.push(`{s${placeholderCount}} - [${extractedText}]`);
        placeholderCount++;
        matched = true;
      }
    });

    return line;
  });

  return { modifiedContent: modifiedContent.join("\n"), sceneArray };
}

function sceneLocationSearch(modifiedContent) {
  let slocArray = [];
  const sceneRegex = /{s(\d+)}([\s\S]*?)(?={[a-z]+)/g;
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
  const nonParenRegex = /{i\d+(-\d+)*}\s-\s\[[a-zA-Z]/g;

  const updatedItalicArray = italicArray.map((line) => {
    if (line.match(nonParenRegex)) {
      const tagMatch = line.match(/{i(\d+(-\d+)*)}/);
      const tagNumber = tagMatch[1];
      const originalTag = `{i${tagNumber}}`;
      const newTag = `{sdes${tagNumber}}`;

      const updatedLine = line.replace(originalTag, newTag);

      modifiedContent = modifiedContent.replace(
        new RegExp(originalTag, "g"),
        newTag
      );

      return updatedLine;
    } else {
      return line;
    }
  });

  return { modifiedContent, italicArray: updatedItalicArray };
}

function parseStageDirections(modifiedContent, italicArray) {
  const stgdRegex = /{i(\d+(?:-\d+)*)}(?:\s|<[^>]+>|\n)*{c/g;

  modifiedContent = modifiedContent.replace(stgdRegex, (match, tagNumber) => {
    const originalTag = `{i${tagNumber}}`;
    const newTag = `{stgd${tagNumber}}`;

    const italicArrayIndex = italicArray.findIndex((element) =>
      element.includes(originalTag)
    );
    if (italicArrayIndex !== -1) {
      italicArray[italicArrayIndex] = italicArray[italicArrayIndex].replace(
        originalTag,
        newTag
      );
    }

    return match.replace(originalTag, newTag);
  });

  return { modifiedContent, italicArray };
}

function parseCharacterDirections(content) {
  let modifiedContent = content.modifiedContent;
  const italicArray = content.italicArray;
  const cdirRegex = /{i(\d+(?:-\d+)*)}\s-\s\[\(/g;

  italicArray.forEach((element, index) => {
    let tagMatch;
    while ((tagMatch = cdirRegex.exec(element)) !== null) {
      const tagNumber = tagMatch[1];
      const originalTag = `{i${tagNumber}}`;
      const newTag = `{cdir${tagNumber}}`;

      italicArray[index] = element.replace(originalTag, newTag);

      modifiedContent = modifiedContent.replace(
        new RegExp(originalTag, "g"),
        newTag
      );
    }
  });

  return { modifiedContent, italicArray };
}

function parseEmphasizedText(modifiedContent, italicArray) {
  modifiedContent = modifiedContent.split("{c");
  const sdesRegex = /{sdes(\d+(-\d+)*)}/g;
  const slocOrSTagBeforeRegex =
    /({sloc\d+}|{s\d+})(?:(?!{c).)*{sdes(\d+(-\d+)*)}/;
  const cdirOrTextBeforeRegex =
    /((\d+c\{)|(\d+-\d+ridc\{)|[^>}]*(?!\{[^}]*\}))/;

  let toRemove = [];
  italicArray.forEach((line, index) => {
    let match;
    while ((match = sdesRegex.exec(line)) !== null) {
      const sdesTag = match[0];
      const sdesTextMatch = line.match(/-\s\[(.*?)\]/);
      const sdesText = sdesTextMatch ? sdesTextMatch[1] : "";

      modifiedContent = modifiedContent.map((contentLine) => {
        const prevLineContext = contentLine.substring(
          0,
          contentLine.indexOf(sdesTag) + sdesTag.length
        );

        const prevLineContextEm = contentLine.substring(
          0,
          contentLine.indexOf(sdesTag)
        );

        if (
          slocOrSTagBeforeRegex.test(prevLineContext) //&&
        ) {
          return contentLine;
        } else if (cdirOrTextBeforeRegex.test(prevLineContextEm)) {
          const sdesTagRegex = new RegExp(sdesTag, "g");
          const newContentLine = contentLine.replace(
            sdesTagRegex,
            `<em>${sdesText}</em>`
          );
          if (newContentLine !== contentLine) {
            toRemove.push(index);
            return newContentLine;
          }

          return contentLine.replace(sdesTagRegex, `<em>${sdesText}</em>`);
        } else {
          const newTag = `{OTHER${match[1]}}`;
          return contentLine.replace(new RegExp(sdesTag, "g"), newTag);
        }
      });
    }
  });

  for (let i = toRemove.length - 1; i >= 0; i--) {
    italicArray.splice(toRemove[i], 1);
  }

  modifiedContent = modifiedContent.join("{c");

  return { modifiedContent, italicArray };
}

function extractDialogue(content) {
  let dialogueArray = [];
  let placeholderCount = 1;

  const dialogueRegex = /(\{c\d+\}|\{cdir\d+(-\d+)*\})([\s\S]*?)(?=\{)/g;
  let modifiedContent = content.replace(
    dialogueRegex,
    (match, tag, _, dialogueText) => {
      dialogueText = dialogueText.trim();

      if (dialogueText.length > 0) {
        const placeholder = `{d${placeholderCount}}`;
        dialogueArray.push(`${placeholder} - [${dialogueText}]`);
        placeholderCount++;

        return match.replace(dialogueText, placeholder);
      }

      return match;
    }
  );

  return { modifiedContent, dialogueArray };
}

function createHTMLFile(filePath, content) {
  try {
    writeFileSync(filePath, content, "utf8");
    console.log(`File saved to ${filePath}`);
  } catch (err) {
    console.error(err);
  }
}

if (process.argv.length < 3) {
  console.log("Usage: node script.js <path_to_rtf_file>");
} else {
  convertRTFtoHTML(process.argv[2]);
}
