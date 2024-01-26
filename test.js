function reorganizeItalicSection(content) {
  let modifiedContent = content.modifiedContent;
  const indexedOpenItalics = cleanStageDirections(content.temporaryDoc);
  const groupedParenthesis = groupStageDirections(indexedOpenItalics);
  let lines = groupedParenthesis.lines;
  const splitArray = groupedParenthesis.splitArray;
  const condensedArray = groupedParenthesis.condensedArray;

  ({ modifiedContent, lines } = splitStageDirections(
    modifiedContent,
    lines,
    splitArray
  ));
  const finalizedStageDirections = condenseStageDirections(
    modifiedContent,
    lines,
    condensedArray
  );

  const renamedStageDirections = parseStageDirections(finalizedStageDirections);
  ({ modifiedContent, temporaryDoc } = parseCharacterDirections(
    renamedStageDirections
  ));

  return { modifiedContent, temporaryDoc };
}

function cleanStageDirections(content) {
  const lines = content;
  const openWithoutCloseRegex = /.*\[\((?!.*\))/;
  let openParenthesisLines = [];

  lines.forEach((line, index) => {
    if (openWithoutCloseRegex.test(line)) {
      openParenthesisLines.push(index);
    }
  });

  return { lines, openParenthesisLines };
}

function groupStageDirections(content) {
  const lines = content.lines;
  const openParenthesisLines = content.openParenthesisLines;
  const splitArray = [];
  const condensedArray = [];

  openParenthesisLines.forEach((startIndex) => {
    for (let i = startIndex + 1; i < lines.length; i++) {
      const line = lines[i];
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
            lines[i] = line.replace(")", `)]\n{i${tagNumber}.5} - [`);
            splitArray.push(i);
            condensedArray.push(lines.slice(startIndex, i + 1));
            //TODO There should be some additional logic here that confirms that the new '.5' line actually has a closing tag somewhere as well
            //TODO does this 'break' pull it entirely out of the loop? Will it ever go through the successful find below?
            //TODO test splitArray with a different script that has an example of this happening
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
  });

  return { lines, splitArray, condensedArray };
}

function splitStageDirections(content) {
  let modifiedContent = content.modifiedContent;
  const lines = content.lines;
  const splitArray = content.splitArray;

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

  return { modifiedContent, lines };
}

function condenseStageDirections(content) {
  let modifiedContent = content.modifiedContent;
  const lines = content.lines;
  const condensedArray = content.condensedArray;

  condensedArray.forEach((nestedArray) => {
    const listOfTags = [];
    const endingIndex = nestedArray.length;
    const startingIndex = lines.findIndex((line) =>
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

    lines.splice(startingIndex, endingIndex, mergedLines);

    let startingTag = listOfTags[0];
    let endingTag = listOfTags[endingIndex - 1];
    let regexPattern = new RegExp(startingTag + ".*?" + endingTag, "s");

    modifiedContent = modifiedContent.replace(regexPattern, mergedTags);
  });

  return { modifiedContent, temporaryDoc: lines };
}

function parseStageDirections(content) {
  let modifiedContent = content.modifiedContent;
  let temporaryDoc = content.lines;
  const stgdRegex = /{i(\d+(?:-\d+)*)}(?:\s|<[^>]+>|\n)*{c/g;

  modifiedContent = modifiedContent.replace(stgdRegex, (match, tagNumber) => {
    const originalTag = `{i${tagNumber}}`;
    const newTag = `{stgd${tagNumber}}`;

    const arrayIndex = temporaryDoc.findIndex((element) =>
      element.includes(originalTag)
    );
    if (arrayIndex !== -1) {
      temporaryDoc[arrayIndex] = temporaryDoc[arrayIndex].replace(
        originalTag,
        newTag
      );
    }

    return match.replace(originalTag, newTag);
  });

  return { modifiedContent, temporaryDoc };
}

function parseCharacterDirections(content) {
  let modifiedContent = content.modifiedContent;
  let temporaryDoc = content.temporaryDoc;
  const cdirRegex = /{i(\d+(?:-\d+)*)}\s-\s\[\(/g;

  temporaryDoc.forEach((element, index) => {
    let tagMatch;
    while ((tagMatch = cdirRegex.exec(element)) !== null) {
        const tagNumber = tagMatch[1];
        const originalTag = `{i${tagNumber}}`;
        const newTag = `{cdir${tagNumber}}`;

        temporaryDoc[index] = element.replace(originalTag, newTag);

        modifiedContent = modifiedContent.replace(new RegExp(originalTag, 'g'), newTag);


    }
  });

  return { modifiedContent, temporaryDoc };
}

//
//
// below is new chunk of items to import, but at least 'act description' logic should be before the above content in priority (or at least before renaming, but after merging)
//
//

function actDescriptionSearch(content){
    let modifiedContent = content.modifiedContent
    let extractedText = content.lines
    let temporaryDoc = [];
    const actRegex = /{a(\d+)}([\s\S]*?){([a-z]+)\d+(-\d+)*}/g;
    const htmlTagRegex = /<[^>]+>|\n/g;
    const actDescriptionRegex = /{i\d+(-\d+)*}/; 
    let actdCounter = 1;


    let match;
    while ((match = actRegex.exec(modifiedContent)) !== null) {
        const actNumber = match[1]; 
        const betweenPlaceholders = match[2].trim();
        const nextPlaceholderType = match[3]; 

        const textWithoutHtml = betweenPlaceholders.replace(htmlTagRegex, '');

        const hasNonHtmlAlpha = /[a-zA-Z]/.test(textWithoutHtml);

        if (hasNonHtmlAlpha) {
            const actdTag = `{actd${actNumber}}`;
            const newElement - `${actdTag} - [${textWithoutHtml}]`;
            temporaryDoc.push(newElement)
            
            modifiedContent = modifiedContent.replace(betweenPlaceholders, actdTag);

            if (iTagRegex.test(nextPlaceholderType)) {
                // Find the matching element in extractedText
                const iIndex = temporaryDoc.findIndex(element => iTagRegex.test(element));
                if (iIndex !== -1) {
                    // Extract the text from the matching element
                    const iTextMatch = temporaryDoc[iIndex].match(/{i\d+(-\d+)*}\s-\s\["(.*?)"\]/);
                    if (iTextMatch) {
                        const iText = iTextMatch[2];

                        // Add the text to the end of the new element in temporaryDoc
                        temporaryDoc[temporaryDoc.length - 1] = `${newElement.slice(0, -1)} ${iText}]`;

                        // Delete the element from temporaryDoc
                        temporaryDoc.splice(iIndex, 1);

                        // Delete the old '{i\d+(-\d+)*}' placeholder from modifiedContent
                        modifiedContent = modifiedContent.replace(iTagRegex, "");
                    }
                }
            }

            results.push({
                action: "ADD/MERGE ACT DESCRIPTION TAGS",
                actPlaceholder: `{a${actNumber}}`,
                actdTag: actdTag,
                textExtracted: textWithoutHtml.trim()
            });

            actdCounter++;          
        } else if (actDescriptionRegex.test(nextPlaceholderType)) {
            // CONVERT ACT DESCRIPTION TAGS logic here
            results.push({
                actPlaceholder,
                nextPlaceholderType,
                action: "CONVERT ACT DESCRIPTION TAGS",
                textBetween: betweenPlaceholders.trim()
            });
        }
        // Condition 3: Move on to the next match
        else {
            results.push({
                actPlaceholder,
                nextPlaceholderType,
                action: "NO ACTION",
                textBetween: betweenPlaceholders.trim()
            });
        }
    }

    return {modifiedContent, temporaryDoc, extractedText};
}

}