// function extractSceneSections(content) {
//     const temporaryDoc = [];
//     let placeholderCount = 1;
//     const prologueRegex = /prologue(\s*<[^>]*>|$)/gim;
//     const intermissionRegex = /intermission(\s*<[^>]*>|$)/gim;
//     const epilogueRegex = /epilogue(\s*<[^>]*>|$)/gim;
//     const sceneRegex = /^scene(:\s|\s*-|\s[1-9]*|\s[one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty]|$)/gim;
//     const sceneNumRegex = /^[1-9][0-9]*([:\s]*|[\s-]*|[\s[a-zA-Z]]*|$)/gim;

//     let lines = content.split('\n');
//     let modifiedContent = lines.map(line => {
//         if (line.match(prologueRegex)) {
//             const extractedText = line.replace(/<[^>]+>/g, '').trim();
//             const placeholder = `{s${placeholderCount}}`;
//             temporaryDoc.push(`${placeholder} - [${extractedText}]`);
//             line = line.replace(extractedText, placeholder);
//             placeholderCount++;
//         }
//         return line;
//     })

//     modifiedContent = modifiedContent.map(line => {
//         if (line.match(intermissionRegex)) {
//             const extractedText = line.replace(/<[^>]+>/g, '').trim();
//             const placeholder = `{s${placeholderCount}}`;
//             temporaryDoc.push(`${placeholder} - [${extractedText}]`);
//             line = line.replace(extractedText, placeholder);
//             placeholderCount++;
//         }
//         return line;
//     })

//     modifiedContent = modifiedContent.map(line => {
//         if (line.match(epilogueRegex)) {
//             const extractedText = line.replace(/<[^>]+>/g, '').trim();
//             const placeholder = `{s${placeholderCount}}`;
//             temporaryDoc.push(`${placeholder} - [${extractedText}]`);
//             line = line.replace(extractedText, placeholder);
//             placeholderCount++;
//         }
//         return line;
//     })

//     modifiedContent = modifiedContent.map(line => {
//         if (line.match(sceneRegex)) {
//             const extractedText = line.replace(/<[^>]+>/g, '').trim();
//             const placeholder = `{s${placeholderCount}}`;
//             temporaryDoc.push(`${placeholder} - [${extractedText}]`);
//             line = line.replace(extractedText, placeholder);
//             placeholderCount++;
//         }
//         return line;
//     })

//     modifiedContent = modifiedContent.map(line => {
//         if (line.match(sceneNumRegex)) {
//             const extractedText = line.replace(/<[^>]+>/g, '').trim();
//             const placeholder = `{s${placeholderCount}}`;
//             temporaryDoc.push(`${placeholder} - [${extractedText}]`);
//             line = line.replace(extractedText, placeholder);
//             placeholderCount++;
//         }
//         return line;
//     }).join('\n');

//     return { modifiedContent, temporaryDoc };
// }

// // below is createNewLines() prior to attempting to print HTML logs

// function createNewLines(content) {
//     let cleanedContent = content
//         .replace(/\n/g, '')
//         .replace(/\s+/g, ' ')
//         .replace(/<br>([\s]*|$)/gm, '<br>\n')
//         .replace(/\n((<[^>]+>\s*)+)/g, (match, p1) => {
//         return match.replace('\n', '');
//     });
//     console.log (cleanedContent)
//     cleanedContent = cleanedContent
// //                .replace(/\n[\s]+/g, '\n');
//         .replace(/{br}/g, '<br>');

//     return cleanedContent
// }

//

// function consolidateStageDirections(content) {
//     let lines = content;
//     const openWithoutCloseRegex = /^\{i\d+\}.*\((?!.*\))/;
//     const openItalicsRegex = /^\{i\d+\}.*\(/;
//     const closeParenthesisRegex = /\)/;
//     let openParenthesisLines = [];
//     let index = 1;

//     lines.forEach((line, index) => {
//         if (openItalicsRegex.test(line) && !closeParenthesisRegex.test(line)) {
//             openParenthesisLines.push(index);
//         }
//     });

//     openParenthesisLines.forEach(startIndex => {
//         let endIndex = startIndex;
//         let foundClosingParenthesis = false;

//         for (let i = startIndex + 1; i < lines.length; i++) {
//             if (closeParenthesisRegex.test(lines[i])) {
//                 endIndex = i;
//                 foundClosingParenthesis = true;
//                 return (fullIndex);
//             } else if (openItalicsRegex.test(lines[i])) {
//                 console.log(`Unmatched opening parenthesis in tag at line ${startIndex + 1}`);
//                 break;
//             }
//         }

//         if (foundClosingParenthesis) {

//             // Process the range for consolidation
//             // This would involve extracting the tag numbers, merging them,
//             // and then replacing the content in `modifiedContent`
//             // The exact implementation will depend on your data format and requirements
//         }
//     });

// }

// // --------

// function consolidateItalicExtractions(content){

// // let's make this function consolidate the '()' statements
// // it should do so by finding '(' on one line and ')' on another, and then:
// // extracing the range of lines and joining them into a single string that ends with {x} and then loading that string into an array, AND
// // merging the content into one line on the temporaryDoc array, AND
// // condensing the {i} tag into a range e.g. {i2-5}
//     let consolidatedDirections = consolidateStageDirections(content.temporaryDoc);
//     let indexedDirections = consolidateStageDirections(content.directionPlaceholders)

//     //
//     indexedDirections.forEach(() => {});

//     let consolidatedDescriptions = consolidatedSceneDescription(consolidatedDirections);

//     return { modifiedContent, temporaryDoc: consolidatedDescriptions };
// }

// function consolidateStageDirections(content) {
//     const lines = content.temporaryDoc;
//     let modifiedContent = content.modifiedContent
//     const openWithoutCloseRegex = /.*\[\((?!.*\))/;
//     let openParenthesisLines = [];

//     lines.forEach((line, index) => {
//         if (openWithoutCloseRegex.test(line)) {
//             openParenthesisLines.push(index);
//         }
//     });

//     lines.openParenthesisLines.forEach
//     return {  };
// }

//     console.log(`Line ${index + 1} has unmatched parenthesis: ${line}`);
//     // Additional logic to handle these lines

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

      if (!hasCloseParenthesis && !hasOpenParenthesis) {
        continue;
      } else if (hasOpenParenthesis && hasCloseParenthesis) {
        if (closeIndex < openIndex) {
          const tagMatch = line.match(/\{i(\d+)\}/);

          if (tagMatch) {
            const tagNumber = tagMatch[1];
            lines[i] = line.replace(")", `)]\n{i${tagNumber}.5} - [`);
            //this should leave the line that was originally tagMatched with only a ')' on it. We will want to handle Step 2 Logic Here
          }
          break;
        } else {
          console.error(`Unclosed Parenthesis in Line ${startIndex + 1}`);
          break;
        }
      } else if (hasOpenParenthesis) {
        console.error(`Unclosed Parenthesis in Line ${startIndex + 1}`);
        break;
      } else {
        let consolidationArray = [];
        let endIndex = i;

        for (let j = startIndex; j <= endIndex; j++) {
          consolidationArray.push(lines[j].replace(/[\[\] ]/g, ""));
        }

        const consolidatedText = consolidationArray.join(" ");
        const newTag = `{i${startIndex}-${endIndex}}`;
        lines.splice(
          startIndex,
          endIndex - startIndex + 1,
          `${newTag} - [${consolidatedText}]`
        );
      }

      const oldTags = consolidationArray
        .map((_, idx) => `{i${startIndex + idx}}`)
        .join("");
      modifiedContent = modifiedContent.replace(
        new RegExp(oldTags, "g"),
        newTag
      );

      break;
    }
  });

  return { modifiedContent: modifiedContent, temporaryDoc: lines };
}

// NOTE
//A: I had to change this since I realized some scenarios were missing, but I believe the rest of the logic holds up.
//QUESTION
// 1: Does this stop the whole process, or just this instance? I would want it just log the error and

// below is attempt on Sat night:

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

      if (!hasCloseParenthesis && !hasOpenParenthesis) {
        continue;
      } else if (hasCloseParenthesis && hasOpenParenthesis) {
        if (closeIndex < openIndex) {
          //logic to split line
          const tagMatch = line.match(/\{i(\d+)\}/);
        } else {
          break;
        }
      } else if (hasOpenParenthesis) {
      } else {
      }
    }
  });
}
// delete below after copying:
function consolidateStageDirections(content) {
  const lines = content.temporaryDoc;
  let modifiedContent = content.modifiedContent;
  const openWithoutCloseRegex = /.*\[\((?!.*\))/;
  let openParenthesisLines = [];

  lines.forEach((line, index) => {
    //logic exists here
  });

  openParenthesisLines.forEach((startIndex) => {
    for (let i = startIndex + 1; i < lines.length; i++) {
      //logic exists here
    }

    splitArray.forEach((element) => {
      const splitElements = element.split("\n");
      const firstLine = splitElements[0];
      const digitMatch = firstLine.match(/\{i(\d+)\}/);

      if (digitMatch) {
        const indexToReplace = lines.findIndex((item) =>
          item.startsWith(digitMatch[0])
        );
        if (indexToReplace !== -1) {
          lines.splice(indexToReplace, 1, ...splitElements);
        }
      }
    });
  });
  return { modifiedContent: modifiedContent, temporaryDoc: lines };
}
