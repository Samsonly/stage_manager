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

//break

// function extractSceneDescription(
//   modifiedContent,
//   italicArray,
//   sceneArray,
//   slocArray
// ) {
//   const npRegex = /^{np\d+(-\d+)*}/;
//   const sceneRegex = /{s[a-z]?(\d+)}/;
//   const slocRegex = /{sloc(\d+)}/;
//   const sdesRegex = /{sdes(\d+(-\d+)*)-*(\d+)*}/;
//   let sdesArray = [];

//   italicArray = italicArray.map((npLine) => {
//     const npTagMatch = npLine.match(npRegex);

// if (npTagMatch) {
// const npTag = npTagMatch[0];
// let writeDelete = false;
let tagCount = 0.1;

// slocArray.forEach((slocLine) => {
//   const slocTagMatch = slocLine.match(slocRegex);

// if (slocTagMatch) {
//const slocTag = slocTagMatch[0];
// // const slocTagNumber = slocTagMatch[1];
const slocTagNumber = Number(slocTagMatch[1]);
let sdesNumber = slocTagNumber + tagCount;
// // const sdesTag = `{sdes${slocTagNumber}}`;
const sdesTag = `{sdes${sdesNumber}}`;
// const sdesLine = npLine.replace(npTag, sdesTag);
// const npTagPos = modifiedContent.indexOf(npTag);
// const slocTagPos = modifiedContent.indexOf(slocTag);

// if (slocTagPos !== -1 && npTagPos !== -1 && slocTagPos < npTagPos) {
//   const betweenTags = modifiedContent.substring(
//     slocTagPos + slocTag.length,
//     npTagPos
//   );
//       // if (!betweenTags.includes("{")) {
//       //   sdesArray.push(`${sdesLine}`);
//       //   modifiedContent = modifiedContent.replace(npTag, sdesTag);
//       //   writeDelete = true;
//       }
//     }
//   }
// });

//       sceneArray.forEach((sceneLine) => {
//         const sceneTagMatch = sceneLine.match(sceneRegex);
//         if (sceneTagMatch) {
//           const sceneTag = sceneTagMatch[0];
//           const sceneTagNumber = sceneTagMatch[1];
//           const sdesTag = `{sdes${sceneTagNumber}}`;
//           const sdesLine = npLine.replace(npTag, sdesTag);
//           const npTagPos = modifiedContent.indexOf(npTag);
//           const sceneTagPos = modifiedContent.indexOf(sceneTag);
//           if (sceneTagPos !== -1 && npTagPos !== -1 && sceneTagPos < npTagPos) {
//             const betweenTags = modifiedContent.substring(
//               sceneTagPos + sceneTag.length,
//               npTagPos
//             );
//             if (!betweenTags.includes("{")) {
//               sdesArray.push(`${sdesLine}`);
//               modifiedContent = modifiedContent.replace(npTag, sdesTag);
//               writeDelete = true;
//             }
//           }
//         }
//       });

//       sdesArray.forEach((newSdesLine) => {
//         const newSdesTagMatch = newSdesLine.match(sdesRegex);
//         if (newSdesTagMatch) {
//           const newSdesTag = newSdesTagMatch[0];
//           const sceneTagNumber = newSdesTagMatch[1];
//           const extraNewSdesNumber = newSdesTagMatch[3]
//             ? Number(newSdesTagMatch[3]) + 1
//             : 1;
//           let inc = 1 + extraNewSdesNumber;
//           const sdesTag = `{sdes${sceneTagNumber}-${inc}}`;
//           const sdesLine = npLine.replace(npTag, sdesTag);
//           const npTagPos = modifiedContent.indexOf(npTag);
//           const newSdesTagPos = modifiedContent.indexOf(newSdesTag);

//           if (
//             newSdesTagPos !== -1 &&
//             npTagPos !== -1 &&
//             newSdesTagPos < npTagPos
//           ) {
//             const betweenTags = modifiedContent.substring(
//               newSdesTagPos + newSdesTag.length,
//               npTagPos
//             );
//             if (!betweenTags.includes("{")) {
//               sdesArray.push(`${sdesLine}`);
//               modifiedContent = modifiedContent.replace(npTag, sdesTag);
//               writeDelete = true;
//             }
//           }
//         }
//       });

//       if (writeDelete) {
//         return "Delete";
//       }
//     }
//     return npLine;
//   });
//   return { modifiedContent, italicArray, sdesArray };
// }
