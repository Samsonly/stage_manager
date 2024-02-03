// // function reorganizeItalicSection(content) {
// //   const pairedParenthesis = returnLooseParenthesis(content); //finds any parenthesis just outside of italicTags, and inserts them into the tag
// //   const indexedOpenItalics = inventoryStageDirections(
// //     pairedParenthesis.temporaryDoc
// //   ); //notes which lines have unmatched parenthesis
// //   const groupedParenthesis = groupStageDirections(indexedOpenItalics); //indexes groups of multi-lined chunks within parenthesis, and lines that need to be split, into two new arrays
// //   let lines = groupedParenthesis.lines;
// //   const splitArray = groupedParenthesis.splitArray;
// //   const condensedArray = groupedParenthesis.condensedArray;

// //   ({ modifiedContent, lines } = splitStageDirections(
// //     modifiedContent,
// //     lines,
// //     splitArray
// //   )); //uses stored index of lines needing to be split, and then splits them
// //   const finalizedStageDirections = condenseStageDirections(
// //     modifiedContent,
// //     lines,
// //     condensedArray
// //   ); //uses stored index of lines needing to be grouped, and then groups them

// //   const renamedStageDirections = parseStageDirections(finalizedStageDirections);
// //   ({ modifiedContent, temporaryDoc } = parseCharacterDirections(
// //     renamedStageDirections
// //   )); //renames italics known to be Stage Directions

// //   return { modifiedContent, temporaryDoc, actdArray };
// // }

// // function returnLooseParenthesis(content) {
// //   const openParenRegex = /\(\s*(<[^>]+>\s*)*({i\d+})/g;
// //   const closeParenRegex = /({i\d+})\s*(<[^>]+>\s*)*\)/g;
// //   let modifiedContent = content.modifiedContent;
// //   let temporaryDoc = content.temporaryDoc;

// //   const processMatch = (tag, isOpenParen) => {
// //     const tempDocIndex = temporaryDoc.findIndex((element) =>
// //       element.includes(tag)
// //     );

// //     if (tempDocIndex !== -1) {
// //       let regexPattern;
// //       if (isOpenParen) {
// //         temporaryDoc[tempDocIndex] = temporaryDoc[tempDocIndex].replace(
// //           /\[/,
// //           "[$("
// //         );
// //         regexPattern = new RegExp("\\(" + tag);
// //       } else {
// //         temporaryDoc[tempDocIndex] = temporaryDoc[tempDocIndex].replace(
// //           /\](?![^\[]*\])/g,
// //           ")]"
// //         );
// //         regexPattern = new RegExp(tag + "\\)");
// //       }

// //       modifiedContent = modifiedContent.replace(regexPattern, tag);
// //     }
// //   };

// //   modifiedContent.replace(openParenRegex, (_, tag) => {
// //     processMatch(tag, true);
// //   });

// //   modifiedContent.replace(closeParenRegex, (_, tag) => {
// //     processMatch(tag, false);
// //   });

// //   return { modifiedContent, temporaryDoc };
// // }

// // function inventoryStageDirections(content) {
// //   const lines = content;
// //   const openWithoutCloseRegex = /.*\[\((?!.*\))/;
// //   let openParenthesisLines = [];

// //   lines.forEach((line, index) => {
// //     if (openWithoutCloseRegex.test(line)) {
// //       openParenthesisLines.push(index);
// //     }
// //   });

// //   return { lines, openParenthesisLines };
// // }

// // function groupStageDirections(content) {
// //   const lines = content.lines;
// //   const openParenthesisLines = content.openParenthesisLines;
// //   const splitArray = [];
// //   const condensedArray = [];

// //   openParenthesisLines.forEach((startIndex) => {
// //     for (let i = startIndex + 1; i < lines.length; i++) {
// //       const line = lines[i];
// //       const hasCloseParenthesis = line.includes(")");
// //       const hasOpenParenthesis = line.includes("(");
// //       const openIndex = line.indexOf("(");
// //       const closeIndex = line.indexOf(")");

// //       if (!hasCloseParenthesis && !hasOpenParenthesis) {
// //         continue;
// //       } else if (hasOpenParenthesis && hasCloseParenthesis) {
// //         if (closeIndex < openIndex) {
// //           const tagMatch = line.match(/\{i(\d+)\}/);

// //           if (tagMatch) {
// //             const tagNumber = tagMatch[1];
// //             lines[i] = line.replace(")", `)]\n{i${tagNumber}.5} - [`);
// //             splitArray.push(i);
// //             condensedArray.push(lines.slice(startIndex, i + 1));
// //             //TODO There should be some additional logic here that confirms that the new '.5' line actually has a closing tag somewhere as well
// //             //TODO does this 'break' pull it entirely out of the loop? Will it ever go through the successful find below?
// //             //TODO test splitArray with a different script that has an example of this happening
// //           }
// //           break;
// //         } else {
// //           const startLineTagMatch = lines[startIndex].match(/\{i(\d+)\}/);
// //           if (startLineTagMatch) {
// //             const startLineTag = startLineTagMatch[0];
// //             console.error(`Unclosed Parenthesis in Line ${startLineTag}`);
// //           } else {
// //             console.error(`Unclosed Parenthesis in Line ${startIndex}`);
// //           }
// //           break;
// //         }
// //       } else if (hasOpenParenthesis) {
// //         const startLineTagMatch = lines[startIndex].match(/\{i(\d+)\}/);
// //         if (startLineTagMatch) {
// //           const startLineTag = startLineTagMatch[0];
// //           console.error(`Unclosed Parenthesis in Line ${startLineTag}`);
// //         } else {
// //           console.error(`Unclosed Parenthesis in Line ${startIndex}`);
// //         }
// //         break;
// //       } else {
// //         condensedArray.push(lines.slice(startIndex, i + 1));
// //         break;
// //       }
// //     }
// //   });

// //   return { lines, splitArray, condensedArray };
// // }

// // function splitStageDirections(content) {
// //   let modifiedContent = content.modifiedContent;
// //   const lines = content.lines;
// //   const splitArray = content.splitArray;

// //   splitArray.forEach((element) => {
// //     const splitElements = element.split("\n");
// //     const firstLine = splitElements[0];
// //     const secondLine = splitElements[1];
// //     const firstLineMatch = firstLine.match(/\{i(\d+)\}/);
// //     const secondLineMatch = secondLine.match(/\{i(\d+)\}/);
// //     const updatedTags = firstLineMatch[0] + secondLineMatch[0];
// //     const indexToReplace = lines.findIndex((item) =>
// //       item.startsWith(firstLineMatch[0])
// //     );

// //     modifiedContent = modifiedContent.replace(
// //       new RegExp(firstLineMatch[0], "g"),
// //       updatedTags
// //     );
// //     lines.splice(indexToReplace, 1, ...splitElements);
// //   });

// //   return { modifiedContent, lines };
// // }

// // function condenseStageDirections(content) {
// //   let modifiedContent = content.modifiedContent;
// //   const lines = content.lines;
// //   const condensedArray = content.condensedArray;

// //   condensedArray.forEach((nestedArray) => {
// //     const listOfTags = [];
// //     const endingIndex = nestedArray.length;
// //     const startingIndex = lines.findIndex((line) =>
// //       line.includes(nestedArray[0])
// //     );

// //     nestedArray.forEach((element) => {
// //       const italicTag = element.match(/{i(\d+)\}/);
// //       if (italicTag) {
// //         listOfTags.push(italicTag[0]);
// //       }
// //     });

// //     let mergedTags = listOfTags.join("");
// //     mergedTags = mergedTags.replace(/\{i(\d+)\}.*/, "$1");
// //     const lastTagMatch = listOfTags[listOfTags.length - 1].match(/\{i(\d+)\}/);
// //     if (lastTagMatch) {
// //       mergedTags = `{i${mergedTags}-${lastTagMatch[1]}}`;
// //     }

// //     let mergedLines = nestedArray.join("");
// //     mergedLines = mergedLines.replace(/\]\s*\{i\d+\}\s*-\s*\[/g, " ");
// //     mergedLines = mergedLines.replace(/\[\|\\]/g, "");
// //     mergedLines = mergedLines.replace(/\{i\d+\}/g, mergedTags);

// //     lines.splice(startingIndex, endingIndex, mergedLines);

// //     let startingTag = listOfTags[0];
// //     let endingTag = listOfTags[endingIndex - 1];
// //     let regexPattern = new RegExp(startingTag + ".*?" + endingTag, "s");

// //     modifiedContent = modifiedContent.replace(regexPattern, mergedTags);
// //   });

// //   return { modifiedContent, temporaryDoc: lines };
// // }

// // function parseStageDirections(content) {
// //   let modifiedContent = content.modifiedContent;
// //   let temporaryDoc = content.lines;
// //   const stgdRegex = /{i(\d+(?:-\d+)*)}(?:\s|<[^>]+>|\n)*{c/g;

// //   modifiedContent = modifiedContent.replace(stgdRegex, (match, tagNumber) => {
// //     const originalTag = `{i${tagNumber}}`;
// //     const newTag = `{stgd${tagNumber}}`;

// //     const arrayIndex = temporaryDoc.findIndex((element) =>
// //       element.includes(originalTag)
// //     );
// //     if (arrayIndex !== -1) {
// //       temporaryDoc[arrayIndex] = temporaryDoc[arrayIndex].replace(
// //         originalTag,
// //         newTag
// //       );
// //     }

// //     return match.replace(originalTag, newTag);
// //   });

// //   return { modifiedContent, temporaryDoc };
// // }

// // function parseCharacterDirections(content) {
// //   let modifiedContent = content.modifiedContent;
// //   let temporaryDoc = content.temporaryDoc;
// //   const cdirRegex = /{i(\d+(?:-\d+)*)}\s-\s\[\(/g;

// //   temporaryDoc.forEach((element, index) => {
// //     let tagMatch;
// //     while ((tagMatch = cdirRegex.exec(element)) !== null) {
// //       const tagNumber = tagMatch[1];
// //       const originalTag = `{i${tagNumber}}`;
// //       const newTag = `{cdir${tagNumber}}`;

// //       temporaryDoc[index] = element.replace(originalTag, newTag);

// //       modifiedContent = modifiedContent.replace(
// //         new RegExp(originalTag, "g"),
// //         newTag
// //       );
// //     }
// //   });

// //   return { modifiedContent, temporaryDoc };
// // }

// // function actDescriptionSearch(content) {
// //   let modifiedContent = content.modifiedContent;
// //   let temporaryDoc = content.temporaryDoc;
// //   let actdArray = [];

// //   const actRegex = /{a(\d+)}([\s\S]*?)(?={([a-z]+)(\d+(-\d+)*)})/g;
// //   const htmlTagRegex = /<[^>]+>|\n/g;
// //   const iTagRegex = /{i(\d+(-\d+)*)}/;

// //   let match;
// //   while ((match = actRegex.exec(modifiedContent)) !== null) {
// //     const actNumber = match[1];
// //     let betweenPlaceholders = match[2];
// //     const nextPlaceholderType = match[3];
// //     const nextPlaceholderNumber = match[4];
// //     const textWithoutHtml = betweenPlaceholders
// //       .replace(htmlTagRegex, "")
// //       .trim();
// //     const hasNonHtmlAlpha = /[a-zA-Z]/.test(textWithoutHtml);
// //     const actdTag = `{actd${actNumber}}`;
// //     const nextTag = `{${nextPlaceholderType}${nextPlaceholderNumber}}`;

// //     if (hasNonHtmlAlpha) {
// //       if (nextPlaceholderType === "i") {
// //         const iTagContentIndex = temporaryDoc.findIndex((element) =>
// //           element.includes(nextTag)
// //         );
// //         if (iTagContentIndex !== -1) {
// //           const iTagContent =
// //             temporaryDoc[iTagContentIndex].match(/-\s\[(.*?)\]/)[1];
// //           actdArray.push(`${actdTag} - [${textWithoutHtml} ${iTagContent}]`);
// //           temporaryDoc.splice(iTagContentIndex, 1);
// //         }
// //         modifiedContent = modifiedContent
// //           .replace(nextTag, actdTag)
// //           .replace(betweenPlaceholders, "");
// //       } else {
// //         actdArray.push(`${actdTag} - [${textWithoutHtml}]`);
// //         modifiedContent = modifiedContent.replace(betweenPlaceholders, "");
// //       }
// //       modifiedContent = modifiedContent.replace(betweenPlaceholders, actdTag);
// //     } else if (nextPlaceholderType === "i") {
// //       const iTagContentIndex = temporaryDoc.findIndex((element) =>
// //         element.includes(nextTag)
// //       );
// //       if (iTagContentIndex !== -1) {
// //         const iTagContent =
// //           temporaryDoc[iTagContentIndex].match(/-\s\[(.*?)\]/)[1];
// //         actdArray.push(`${actdTag} - [${iTagContent}]`);
// //         temporaryDoc.splice(iTagContentIndex, 1);
// //       }
// //       modifiedContent = modifiedContent
// //         .replace(nextTag, actdTag)
// //         .replace(betweenPlaceholders, "");
// //     }
// //   }
// //   return { modifiedContent, temporaryDoc, actdArray };
// // }

// // // delete after:
// // const fs = require("fs");
// // const path = require("path");

// // function processRTFContent(content) {
// //   let modifiedContent = convertRTFEscapeSequencesToHTML(content);

// //   modifiedContent = modifiedContent
// //     .replace(/\\(\s|$)/gm, " <br>")
// //     .replace(/\\pard(?![a-zA-Z])/g, "</i></u></b>\\")
// //     .replace(/\\plain(?![a-zA-Z])/g, "</i></u></b>\\")
// //     .replace(/\\par/g, "\\ <br>\\")
// //     .replace(/\\i0/g, "\\ </i>\\")
// //     .replace(/\\ulnone/g, "\\ </u>\\")
// //     .replace(/\\b0/g, "\\ </b>\\")
// //     .replace(/\\i(?![a-zA-Z])/g, "\\ <i>\\")
// //     .replace(/\\ul(?![a-zA-Z])/g, "\\ <u>\\")
// //     .replace(/\\b(?![a-zA-Z])/g, "\\ <b>\\")
// //     .replace(/\\[a-zA-Z]+-?\d*\s?/g, "")
// //     .replace(/\{[^{}<]*\}/g, "")
// //     .replace(/\\/g, "")
// //     .replace(/\( /g, "(")
// //     .replace(/ \)/g, ")");

// //   if (modifiedContent.startsWith("{")) {
// //     modifiedContent = modifiedContent.substring(1);
// //   }
// //   if (modifiedContent.endsWith("}")) {
// //     modifiedContent = modifiedContent.slice(0, -1);
// //   }

// //   modifiedContent = removeUnmatchedTags(modifiedContent);
// //   modifiedContent = organizeHTMLTags(modifiedContent);

// //   const createNewLinesResult = createNewLines(modifiedContent);

// //   const italicExtractionResult = extractItalicSections(
// //     createNewLinesResult.modifiedContent
// //   );

// //   //there is a lot more code in this function following this, but since I have confirmed that the swap happened before here, I'll save us some token/context
// // }

// // function convertRTFtoHTML(filePath) {
// //   fs.readFile(filePath, "utf8", (err, data) => {
// //     if (err) {
// //       console.error(err);
// //       return;
// //     }

// //     const { modifiedContent, extractedSections, characterNames } =
// //       processRTFContent(data);

// //     //more code following this, but it is after the issue
// //   });
// // }

// // function convertRTFEscapeSequencesToHTML(rtfContent) {
// //   const escapeSequenceMap = {
// //     92: "'", // Regular apostrophe
// //     93: "\u201C", // Left double quotation mark
// //     94: "\u201D", // Right double quotation mark
// //     96: "-", // Hyphen
// //     97: "\u2014", // Em dash
// //     85: "...", // Three periods for ellipsis
// //     91: "\u2018", // Left single quotation mark
// //     95: "\u2022", // Bullet
// //     a0: "\u00A0", // Non-breaking space
// //   };

// //   return rtfContent.replace(/\\'([0-9a-fA-F]{2})/g, (match, hexValue) => {
// //     const mappedChar = escapeSequenceMap[hexValue.toLowerCase()];
// //     if (mappedChar) {
// //       return mappedChar;
// //     }

// //     const char = String.fromCharCode(parseInt(hexValue, 16));
// //     return char;
// //   });
// // }

// // function removeUnmatchedTags(content) {
// //   const tags = ["i", "u", "b"];

// //   tags.forEach((tag) => {
// //     const openingTagRegex = new RegExp(`<${tag}>`, "g");
// //     let match;

// //     while ((match = openingTagRegex.exec(content)) !== null) {
// //       const closingTagRegex = new RegExp(`</${tag}>`);

// //       if (!closingTagRegex.test(content.substring(match.index))) {
// //         content =
// //           content.substring(0, match.index) +
// //           content.substring(match.index + match[0].length);
// //         console.warn(
// //           `Unmatched opening tag <${tag}> removed at index ${match.index}`
// //         );
// //       }
// //     }

// //     const closingTagRegex = new RegExp(`</${tag}>`, "g");

// //     while ((match = closingTagRegex.exec(content)) !== null) {
// //       const openingTagRegex = new RegExp(`<${tag}>`);

// //       if (!openingTagRegex.test(content.substring(0, match.index))) {
// //         content =
// //           content.substring(0, match.index) +
// //           content.substring(match.index + match[0].length);
// //       }
// //     }
// //   });

// //   return content;
// // }

// // function organizeHTMLTags(content) {
// //   function moveTags(content, tag, outerTags) {
// //     const regex = new RegExp(`(<${tag}>)([\\s\\S]*?)(</${tag}>)`, "g");

// //     return content.replace(
// //       regex,
// //       (match, openingTag, innerContent, closingTag) => {
// //         let beforeTextContent = "";
// //         let afterTextContent = "";

// //         const parts = innerContent.split(/(<\/?[bu]>)/);
// //         let textEncountered = false;

// //         parts.forEach((part) => {
// //           if (part.match(/<\/?[bu]>/)) {
// //             if (!textEncountered) {
// //               beforeTextContent += part;
// //             } else {
// //               afterTextContent += part;
// //             }
// //           } else if (part.trim() !== "") {
// //             textEncountered = true;
// //           }
// //         });

// //         openingTag = beforeTextContent + openingTag;
// //         closingTag += afterTextContent;

// //         innerContent = innerContent.replace(
// //           new RegExp(beforeTextContent, "g"),
// //           ""
// //         );
// //         innerContent = innerContent.replace(
// //           new RegExp(afterTextContent, "g"),
// //           ""
// //         );

// //         return openingTag + innerContent + closingTag;
// //       }
// //     );
// //   }

// //   content = moveTags(content, "i", ["b", "u"]);
// //   content = moveTags(content, "u", ["b"]);

// //   return content;
// // }

// // function createNewLines(content) {
// //   //THIS IS THE PARENT FUNCTION OF MY MISTAKE
// //   let cleanedContent = content;

// //   cleanedContent = cleanedContent
// //     .replace(/\n/g, "")
// //     .replace(/>([ \t]+<)/g, "><")
// //     .replace(/\s+/g, " ")
// //     .replace(/^\s/gm, "")
// //     .replace(/<br>([\s]*|$)/gm, "<br>\n");

// //   cleanedContent = addEndTagToLines(cleanedContent);

// //   cleanedContent = cleanedContent.replace(/{end}\s*/g, "\n");

// //   const endingExtractionResult = extractEndingTags(cleanedContent);

// //   let cleanedExtraction = endingExtractionResult.modifiedContent;
// //   let extractedText = endingExtractionResult.temporaryDoc;

// //   cleanedContent = cleanedExtraction.replace(/^(<[^>]+>)+/gm, (match) => {
// //     return "{start}" + match;
// //   });

// //   cleanedContent = cleanedContent
// //     .replace(/\n*{start}/g, "")
// //     .replace(/{br}/g, "<br>");

// //   return { modifiedContent: cleanedContent, extractedText };
// // }

// // function addEndTagToLines(content) {
// //   //THIS IS THE FUNCTION I MADE THE MISTAKE
// //   let lines = content.split("\n");
// //   let processedLines = lines.map((line) => {
// //     if (/^<[^>]+>.*[^\s<][^>]*$/.test(line)) {
// //       return line.replace(/^(<[^>]+>)+/, (htmlTags) => htmlTags + "{end}");
// //     }
// //     return line;
// //   });
// //   return processedLines.join("\n");
// // }

// // function extractItalicSections(content) {
// //   //THIS IS THE NEXT FUNCTION CALLED, WHICH SOMEHOW IS WORKING FROM MAGIC
// //   const temporaryDoc = [];
// //   let placeholderCount = 1;
// //   let modifiedContent = "";
// //   let index = 0;

// //   while (index < content.length) {
// //     let startIndex = content.indexOf("<i>", index);
// //     let endIndex = content.indexOf("</i>", startIndex);

// //     if (startIndex === -1) {
// //       modifiedContent += content.slice(index);
// //       break;
// //     }

// //     if (endIndex === -1) {
// //       console.error("No closing </i> tag found for <i> at index " + startIndex);
// //       break;
// //     }

// //     modifiedContent += content.slice(index, startIndex);

// //     let italicText = content.slice(startIndex + 3, endIndex);
// //     italicText = processExtractedText(italicText);
// //     const placeholder = `{i${placeholderCount}}`;
// //     temporaryDoc.push(`${placeholder} - [${italicText}]`);
// //     placeholderCount++;

// //     modifiedContent += placeholder;
// //     index = endIndex + 4;
// //   }

// //   return { modifiedContent, temporaryDoc };
// // }

// // function extractEndingTags(content) {
// //   let lines = content.split("\n");
// //   let modifiedContent = [];
// //   let temporaryDoc = [];
// //   let placeholderCount = 1;

// //   const foundWords = findEndingTags(content);

// //   lines.forEach((line, index) => {
// //     let matched = false;

// //     for (const [word, indices] of Object.entries(foundWords)) {
// //       if (indices.includes(index + 1)) {
// //         const extractedText = line.replace(/<[^>]+>/g, "").trim();
// //         line = `{et${placeholderCount}}`;
// //         temporaryDoc.push(`{et${placeholderCount}} - [${extractedText}]`);
// //         placeholderCount++;
// //         matched = true;
// //         break;
// //       }
// //     }

// //     if (!matched) {
// //       modifiedContent.push(line);
// //     } else {
// //       modifiedContent.push(line);
// //     }
// //   });

// //   return { modifiedContent: modifiedContent.join("\n"), temporaryDoc };
// // }

// // function findEndingTags(content) {
// //   const wordsToCheck = [
// //     "Blackout",
// //     "Lights Out",
// //     "End of Play",
// //     "End of Act",
// //     "End of Scene",
// //     "Fade to Black",
// //   ];

// //   let lines = content.split("\n");
// //   let foundWords = {};

// //   wordsToCheck.forEach((word) => {
// //     const regex = new RegExp(
// //       `^\\s*(<[^>]*>)*\\s*([\\[\\({\\})\\]]*${word}[\\[\\({\\})\\]]*)\\s*(<[^>]*>)*\\s*$`,
// //       "i"
// //     );
// //     lines.forEach((line, index) => {
// //       if (regex.test(line)) {
// //         if (!foundWords[word]) {
// //           foundWords[word] = [];
// //         }
// //         foundWords[word].push(index + 1);
// //       }
// //     });
// //   });

// //   return foundWords;
// // }

// // if (process.argv.length < 3) {
// //   console.log("Usage: node script.js <path_to_rtf_file>");
// // } else {
// //   convertRTFtoHTML(process.argv[2]);
// // }

// // function sceneLocationSearch(content) {
// //   let modifiedContent = content.modifiedContent;
// //   let slocArray = [];

// //   const sceneRegex = /{s(\d+)}([\s\S]*?)(?={[a-z]+)/g;
// //   const htmlTagRegex = /<[^>]+>|\n/g;

// //   let match;
// //   while ((match = sceneRegex.exec(modifiedContent)) !== null) {
// //     const sceneNumber = match[1];
// //     let betweenPlaceholders = match[2];
// //     const textWithoutHtml = betweenPlaceholders
// //       .replace(htmlTagRegex, "")
// //       .trim();
// //     const hasNonHtmlAlpha = /[a-zA-Z]/.test(textWithoutHtml);
// //     const slocTag = `{sloc${sceneNumber}}`;

// //     if (hasNonHtmlAlpha) {
// //       slocArray.push(`${slocTag} - [${textWithoutHtml}]`);
// //       modifiedContent = modifiedContent.replace(betweenPlaceholders, slocTag);
// //     }
// //   }
// //   return { modifiedContent, slocArray };
// // }

// // function sortItalicSection(modifiedContent, italicArray) {
// //   const nonParenRegex = /{i\d+(-\d+)*}\s-\s\[[a-z]/g;

// // //   const updatedItalicArray = italicArray.map(line => {
// //     if (line.match(nonParenRegex)) {
// //       const tagMatch = line.match(/{i(\d+(-\d+)*)}/);
// //       const tagNumber = tagMatch[1];
// //       const originalTag = `{i${tagNumber}}`;
// //       const newTag = `{sdir${tagNumber}}`;

// //       // Replace in the current line
// //       const updatedLine = line.replace(originalTag, newTag);

// //       // Replace in modifiedContent
// //       modifiedContent = modifiedContent.replace(new RegExp(originalTag, "g"), newTag);

// //       return updatedLine; // Return the updated line to be included in the new array
// //     } else {
// //       return line; // Return the line unmodified if it doesn't match the regex
// //     }
// //   });

// //   return { modifiedContent, italicArray: updatedItalicArray };
// // }

// // function extractDialogue(content) {
// //   let modifiedContent = content.modifiedContent;
// //   let dialogueArray = [];

// //   const dialogueRegex = /({cdir\d+(-\d+)*}}|{c\d+}([\s\S]*?)(?={)/g;
// //   const htmlTagRegex = /<[^>]+>|\n/g;

// //   let match;
// //   while ((match = dialogueRegex.exec(modifiedContent)) !== null) {
// //     const characterNumber = match[1];
// //     let betweenPlaceholders = match[2];
// //     const textWithoutHtml = betweenPlaceholders
// //       .replace(htmlTagRegex, "")
// //       .trim();
// //     const hasNonHtmlAlpha = /[a-zA-Z]/.test(textWithoutHtml);
// //     const dialogueTag = `{cdir${characterNumber}}`;

// //     if (hasNonHtmlAlpha) {
// //       dialogueArray.push(`${dialogueTag} - [${textWithoutHtml}]`);
// //       modifiedContent = modifiedContent.replace(
// //         betweenPlaceholders,
// //         dialogueTag
// //       );
// //     }
//   }
//   return { modifiedContent, dialogueArray };
// // }
// let content =
//   "{c1} As he thus spoke, the good dwarfs felt pity for him and gave him the coffin. The prince had his servants carry it away on their shoulders. But- <br> \n {c2} Wait, wait, wait... They just {OTHER2} Snow Whites dead body to a random dude in the woods? <br> \n  {c3} Not a random dude. To the prince. But then it happened- <br> \n  {c4} No, not  {OTHER3}  prince,  {OTHER4}  prince. And the dwarfs didnt even know if he was the real deal. They just took his word and {OTHER5} him their friends body. <br>{stgd6} \n  {c5} What?! <br>;";

// function extractDialogue(content) {
//   const dialogueRegex = /\{c\d+\}((?:(?!\{).)*)/g;
//   let match;
//   while ((match = dialogueRegex.exec(content)) !== null) {
//     console.log(match[1]);
//   }
// }

// extractDialogue(content);

function checkForTitle(content) {
  const titleRegex = /^/;
}
