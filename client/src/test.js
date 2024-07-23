// // function createTableOfContents() {
// //   const tableOfContents = document.createElement("div");
// //   const playTitle = document.querySelector(".playTitle");
// //   const play = document.createElement("a");
// //   play.textContent = playTitle.textContent;
// //   play.className = "playTitle playToC";
// //   play.href = "#" + playTitle.id;
// //   play.addEventListener("click", function (event) {
// //     event.preventDefault(); // Prevent the default action
// //     viewScript(event.currentTarget.href);
// //   });
// //   tableOfContents.appendChild(play);
// //   const actTitles = document.querySelectorAll(".actTitle");
// //   actTitles.forEach((actTitle, index) => {
// //     const act = document.createElement("a");
// //     act.textContent = actTitle.textContent;
// //     act.className = "actTitle actToC";
// //     act.href = "#" + actTitle.id;
// //     act.addEventListener("click", function (event) {
// //       event.preventDefault(); // Prevent the default action
// //       viewScript(event.currentTarget.href);
// //     });
// //     tableOfContents.appendChild(act);
// //     const sceneTitles = actTitle.parentNode.querySelectorAll(".sceneTitle");
// //     sceneTitles.forEach((sceneTitle) => {
// //       const scene = document.createElement("a");
// //       scene.textContent = sceneTitle.textContent;
// //       scene.className = "sceneTitle sceneToC";
// //       scene.href = "#" + sceneTitle.id;
// //       scene.addEventListener("click", function (event) {
// //         event.preventDefault(); // Prevent the default action
// //         viewScript(event.currentTarget.href);
// //       });
// //       tableOfContents.appendChild(scene);
// //     });
// //   });
// //   tableOfContents.id = "table-of-contents";
// //   tableOfContents.style.display = "none";
// //   document.querySelector("#script-content").appendChild(tableOfContents);
// // }

// // function viewTableOfContents() {
// //   const tableOfContents = document.querySelector("#table-of-contents");
// //   const scriptContent = document.querySelector("#script-content");
// //   const children = scriptContent.children;
// //   for (let i = 0; i < children.length; i++) {
// //     children[i].style.display = "none";
// //   }
// //   tableOfContents.style.display = "block";
// // }

// // function viewScript(href) {
// //   const playStructure = document.querySelector(".playStructure");
// //   const scriptContent = document.querySelector("#script-content");
// //   const children = scriptContent.children;
// //   for (let i = 0; i < children.length; i++) {
// //     children[i].style.display = "none";
// //   }
// //   playStructure.style.display = "block";

// //   if (href) {
// //     const id = href.split("#")[1];
// //     const element = document.getElementById(id);
// //     if (element) {
// //       element.scrollIntoView();
// //     }
// //   }
// // }

// // function editStyleSettings() {
// //   //TODO: Implement style settings menu
// // }

// // function editCharacter(characterName) {
// //   const overlay = document.createElement("div");
// //   overlay.id = "overlay";
// //   document.body.appendChild(overlay);

// //   const editDialog = document.createElement("div");
// //   editDialog.id = "edit-dialog";
// //   overlay.appendChild(editDialog);

// //   const wrapper = document.createElement("div");
// //   wrapper.className = "wrapper";
// //   wrapper.style.overflow = "auto";
// //   editDialog.appendChild(wrapper);

// //   const title = document.createElement("h1");
// //   title.textContent = "Edit Character";
// //   wrapper.appendChild(title);

// //   const className = characterName
// //     .slice(0, -1)
// //     .toLowerCase()
// //     .split(" ")
// //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
// //     .join(" ");

// //   const name = document.createElement("p");
// //   name.textContent = `"${className}"`;
// //   name.id = "character-name";
// //   wrapper.appendChild(name);

// //   const characterElement = document.querySelector(`.${className}`);
// //   const isRemoved = characterElement
// //     ? characterElement.classList.contains("removedCharacter")
// //     : false;

// //   originalHTML = editDialog.innerHTML;
// //   draftHTML = originalHTML;

// //   const options = [
// //     "Rename",
// //     "Reassign",
// //     "Assign to Multiple Characters",
// //     isRemoved ? "Restore" : "Remove",
// //   ];
// //   const functions = [
// //     () => renameCharacter(draftHTML),
// //     () => reassignCharacter(draftHTML),
// //     () => multipleAssignCharacter(draftHTML),
// //     isRemoved
// //       ? () => restoreCharacter(draftHTML)
// //       : () => removeCharacter(draftHTML),
// //   ];

// //   options.forEach((option, index) => {
// //     const p = document.createElement("p");
// //     const a = document.createElement("a");
// //     a.textContent = option;
// //     a.href = "#";
// //     a.onclick = functions[index];
// //     p.appendChild(a);

// //     const infoParent = document.createElement("span");
// //     infoParent.className = "info-parent";
// //     p.appendChild(infoParent);

// //     const info = document.createElement("img");
// //     info.src = "./icons/info.png";
// //     info.className = "info";
// //     info.id = `info-${option.toLowerCase().replace(" ", "-")}`;
// //     infoParent.appendChild(info);

// //     const infoWindow = document.createElement("div");
// //     infoWindow.textContent = `info about ${option}`;
// //     infoWindow.className = "info-window";
// //     editDialog.appendChild(infoWindow);

// //     info.addEventListener("mouseover", () => {
// //       const infoRect = info.getBoundingClientRect();
// //       const dialogRect = editDialog.getBoundingClientRect();
// //       const top = infoRect.top - dialogRect.top + infoRect.height - 10;
// //       const left = infoRect.left - dialogRect.left + infoRect.width + 15;
// //       infoWindow.style.top = `${top}px`;
// //       infoWindow.style.left = `${left}px`;
// //       infoWindow.style.display = "block";
// //     });
// //     info.addEventListener("mouseout", () => {
// //       infoWindow.style.display = "none";
// //     });

// //     wrapper.appendChild(p);
// //   });

// //   const actionContainer = document.createElement("div");
// //   actionContainer.className = "action-container";
// //   editDialog.appendChild(actionContainer);

// //   const saveImg = document.createElement("img");
// //   saveImg.src = "./icons/save.png";
// //   saveImg.className = "action";
// //   saveImg.onclick = saveChanges;
// //   actionContainer.appendChild(saveImg);

// //   const closeImg = document.createElement("img");
// //   closeImg.src = "./icons/close.png";
// //   closeImg.className = "action";
// //   closeImg.onclick = closeDialog;
// //   actionContainer.appendChild(closeImg);

// //   editDialog.style.display = "block";
// // }

// // function renameCharacter() {
// //   // Rename character logic here
// //   hasChanges = true;
// // }

// // function reassignCharacter() {
// //   // Reassign character logic here
// //   hasChanges = true;
// // }

// // function multipleAssignCharacter() {
// //   // Assign to multiple characters logic here
// //   hasChanges = true;
// // }

// // function removeCharacter() {
// //   // Remove character logic here
// //   hasChanges = true;
// // }

// // function restoreCharacter() {
// //   // Restore character logic here
// //   hasChanges = true;
// // }

// // function saveChanges() {
// //   document.querySelector("#edit-dialog").innerHTML = draftHTML;
// //   hasChanges = false;
// //   closeDialog();
// // }

// // function closeDialog() {
// //   const editDialog = document.querySelector("#edit-dialog");
// //   if (hasChanges) {
// //     confirmExit();
// //   } else {
// //     editDialog.style.display = "none";
// //     document.querySelector("#overlay").remove();
// //   }
// // }

// // function confirmExit() {
// //   const confirmation = confirm(
// //     "Exit without saving? All changes will be lost."
// //   );
// //   if (confirmation) {
// //     const editDialog = document.querySelector("#edit-dialog");
// //     editDialog.innerHTML = originalHTML;
// //     editDialog.style.display = "none";
// //     document.querySelector("#overlay").remove();
// //     hasChanges = false;
// //   }
// // }

// // import React, { useEffect, useRef } from "react";
// // import * as THREE from "three";
// // import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
// // import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
// // import { FlyControls } from "three/examples/jsm/controls/FlyControls";
// // import JSZip from "jszip";

// // const GroundplanViewer = ({ file, onClose }) => {
// //   const viewerRef = useRef();
// //   const orthoCameraRef = useRef(
// //     new THREE.OrthographicCamera(-10000, 10000, 10000, -10000, 0.1, 60000)
// //   );
// //   const perspectiveCameraRef = useRef(
// //     new THREE.PerspectiveCamera(75, 750 / 750, 0.1, 60000)
// //   );
// //   const currentCameraRef = useRef(perspectiveCameraRef.current); // Initially set to perspective camera
// //   const controlsRef = useRef();

// //   useEffect(() => {
// //     if (!file) {
// //       return;
// //     }

// //     const scene = new THREE.Scene();
// //     scene.add(new THREE.AmbientLight(0x404040, 50));
// //     const pointLight = new THREE.PointLight(0xffffff, 1, 100);
// //     pointLight.position.set(50, 50, 50);
// //     scene.add(pointLight);
// //     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
// //     directionalLight.position.set(1, 1, 1);
// //     scene.add(directionalLight);

// //     const axesHelper = new THREE.AxesHelper(5);
// //     scene.add(axesHelper);

// //     const renderer = new THREE.WebGLRenderer({ alpha: true });
// //     renderer.setSize(750, 750);
// //     viewerRef.current.appendChild(renderer.domElement);

// //     const loadModel = (objUrl, mtlContent) => {
// //       const mtlLoader = new MTLLoader();
// //       const materials = mtlLoader.parse(mtlContent);
// //       materials.preload();

// //       const objLoader = new OBJLoader();
// //       objLoader.setMaterials(materials);
// //       objLoader.load(objUrl, addObjectToScene);
// //     };

// //     const addObjectToScene = (object) => {
// //       const box = new THREE.Box3().setFromObject(object);
// //       const center = box.getCenter(new THREE.Vector3());
// //       object.position.sub(center);
// //       scene.add(object);

// //       object.traverse((child) => {
// //         if (child.isMesh && child.material.map) {
// //         } else if (child.isMesh) {
// //         }
// //       });

// //       controlsRef.current = new FlyControls(
// //         currentCameraRef.current,
// //         renderer.domElement
// //       );
// //       const controls = controlsRef.current;
// //       controls.movementSpeed = 10;
// //       controls.rollSpeed = 0.005;
// //       controls.autoForward = false;
// //       controls.dragToLook = true;
// //       controlsRef.current = controls;

// //       const animate = () => {
// //         requestAnimationFrame(animate);
// //         controls.update(0.5);
// //         if (currentCameraRef.current === perspectiveCameraRef.current) {
// //           // Perspective camera is active, sync the orthographic camera to match
// //           orthoCameraRef.current.position.copy(
// //             perspectiveCameraRef.current.position
// //           );
// //           orthoCameraRef.current.rotation.copy(
// //             perspectiveCameraRef.current.rotation
// //           );
// //         } else {
// //           // Orthographic camera is active, sync the perspective camera to match
// //           perspectiveCameraRef.current.position.copy(
// //             orthoCameraRef.current.position
// //           );
// //           perspectiveCameraRef.current.rotation.copy(
// //             orthoCameraRef.current.rotation
// //           );
// //         }
// //         renderer.render(scene, currentCameraRef.current);
// //       };
// //       animate();
// //     };

// //     if (file.name.endsWith(".zip")) {
// //       JSZip.loadAsync(file).then((zip) => {
// //         let objFilePromise;
// //         let mtlFileContentPromise;
// //         let texturePromises = {};

// //         zip.forEach((relativePath, zipEntry) => {
// //           if (relativePath.endsWith(".obj")) {
// //             objFilePromise = zipEntry.async("blob").then(URL.createObjectURL);
// //           } else if (relativePath.endsWith(".mtl")) {
// //             mtlFileContentPromise = zipEntry.async("string");
// //           } else if (relativePath.match(/\.(jpg|jpeg|png)$/i)) {
// //             texturePromises[relativePath] = zipEntry
// //               .async("blob")
// //               .then(URL.createObjectURL);
// //           }
// //         });

// //         Promise.all([
// //           objFilePromise,
// //           mtlFileContentPromise,
// //           Promise.all(
// //             Object.entries(texturePromises).map(([path, promise]) =>
// //               promise.then((url) => ({ path, url }))
// //             )
// //           ),
// //         ]).then(([objUrl, mtlContent, textures]) => {
// //           textures.forEach(({ path, url }) => {
// //             const regex = new RegExp(
// //               path.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"),
// //               "g"
// //             );
// //             mtlContent = mtlContent.replace(regex, url);
// //           });

// //           loadModel(objUrl, mtlContent);
// //         });
// //       });
// //     } else {
// //       const objUrl = URL.createObjectURL(file);
// //       loadModel(objUrl);
// //     }

// //     return () => {
// //       viewerRef.current.removeChild(renderer.domElement);
// //     };
// //   }, [file]);

// //   const toggleCamera = () => {
// //     if (currentCameraRef.current === perspectiveCameraRef.current) {
// //       currentCameraRef.current = orthoCameraRef.current;
// //     } else {
// //       currentCameraRef.current = perspectiveCameraRef.current;
// //     }
// //     controlsRef.current.object = currentCameraRef.current;
// //   };

// //   const captureCameraPosition = () => {
// //     if (currentCameraRef.current && controlsRef.current) {
// //       console.log("Camera Position:", currentCameraRef.current.position);
// //       console.log("Camera Rotation:", currentCameraRef.current.rotation);
// //     }
// //   };

// //   return (
// //     <div
// //       ref={viewerRef}
// //       style={{
// //         position: "fixed",
// //         top: "50%",
// //         left: "50%",
// //         transform: "translate(-50%, -50%)",
// //         width: "750px",
// //         height: "750px",
// //         backgroundColor: "rgba(0, 0, 0, 0.5)",
// //         zIndex: 1000,
// //         overflow: "hidden",
// //         borderRadius: "10px",
// //         display: "flex",
// //         flexDirection: "column",
// //         alignItems: "center",
// //         justifyContent: "start",
// //         padding: "20px",
// //       }}
// //     >
// //       <button onClick={captureCameraPosition}>Capture Camera Position</button>
// //       <button onClick={toggleCamera}>Toggle Camera</button>
// //       <div
// //         onClick={onClose}
// //         style={
// //           {
// //             /* Close button styles... */
// //           }
// //         }
// //       >
// //         Close
// //       </div>
// //     </div>
// //   );
// // };

// // export default GroundplanViewer;

// import React, { useEffect, useRef } from "react";
// import * as THREE from "three";
// import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
// import { FlyControls } from "three/examples/jsm/controls/FlyControls";
// import JSZip from "jszip";

// const GroundplanViewer = ({ file, onClose }) => {
//   const currentCameraRef = useRef(
//     new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       60000
//     )
//   );
//   const controlsRef = useRef();
//   const viewerRef = useRef();
//   const isOrthoRef = useRef(false);
//   const rendererRef = useRef(null);
//   const sceneRef = useRef(null);

//   useEffect(() => {
//     if (!file) {
//       return;
//     }

//     const scene = new THREE.Scene();
//     sceneRef.current = scene;
//     scene.add(new THREE.AmbientLight(0x404040, 50));
//     const pointLight = new THREE.PointLight(0xffffff, 1, 100);
//     pointLight.position.set(50, 50, 50);
//     scene.add(pointLight);
//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//     directionalLight.position.set(1, 1, 1);
//     scene.add(directionalLight);
//     const axesHelper = new THREE.AxesHelper(5);
//     scene.add(axesHelper);

//     const renderer = new THREE.WebGLRenderer({ alpha: true });
//     renderer.setSize(750, 750);
//     viewerRef.current.appendChild(renderer.domElement);
//     rendererRef.current = renderer;

//     const loadModel = (objUrl, mtlContent) => {
//       const mtlLoader = new MTLLoader();
//       const materials = mtlLoader.parse(mtlContent);
//       materials.preload();

//       const objLoader = new OBJLoader();
//       objLoader.setMaterials(materials);
//       objLoader.load(objUrl, addObjectToScene);
//     };

//     const addObjectToScene = (object) => {
//       const box = new THREE.Box3().setFromObject(object);
//       const center = box.getCenter(new THREE.Vector3());
//       object.position.sub(center);
//       scene.add(object);

//       object.traverse((child) => {
//         if (child.isMesh && child.material.map) {
//         } else if (child.isMesh) {
//         }
//       });

//       controlsRef.current = new FlyControls(
//         currentCameraRef.current,
//         renderer.domElement
//       );
//       const controls = controlsRef.current;
//       controls.movementSpeed = 5000;
//       controls.rollSpeed = 0.0005;
//       controls.autoForward = false;
//       controls.dragToLook = true;
//       controlsRef.current = controls;

//       const animate = () => {
//         requestAnimationFrame(animate);
//         controlsRef.current.update(0.5);
//         renderer.render(scene, currentCameraRef.current);
//       };

//       animate();
//     };

//     if (file.name.endsWith(".zip")) {
//       JSZip.loadAsync(file).then((zip) => {
//         let objFilePromise;
//         let mtlFileContentPromise;
//         let texturePromises = {};

//         zip.forEach((relativePath, zipEntry) => {
//           if (relativePath.endsWith(".obj")) {
//             objFilePromise = zipEntry.async("blob").then(URL.createObjectURL);
//           } else if (relativePath.endsWith(".mtl")) {
//             mtlFileContentPromise = zipEntry.async("string");
//           } else if (relativePath.match(/\.(jpg|jpeg|png)$/i)) {
//             texturePromises[relativePath] = zipEntry
//               .async("blob")
//               .then(URL.createObjectURL);
//           }
//         });

//         Promise.all([
//           objFilePromise,
//           mtlFileContentPromise,
//           Promise.all(
//             Object.entries(texturePromises).map(([path, promise]) =>
//               promise.then((url) => ({ path, url }))
//             )
//           ),
//         ]).then(([objUrl, mtlContent, textures]) => {
//           textures.forEach(({ path, url }) => {
//             const regex = new RegExp(
//               path.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"),
//               "g"
//             );
//             mtlContent = mtlContent.replace(regex, url);
//           });

//           loadModel(objUrl, mtlContent);
//         });
//       });
//     } else {
//       const objUrl = URL.createObjectURL(file);
//       loadModel(objUrl);
//     }

//     return () => {
//       viewerRef.current.removeChild(renderer.domElement);
//     };
//   }, [file]);

//   const toggleCamera = () => {
//     const oldCamera = currentCameraRef.current;
//     const newCamera = isOrthoRef.current
//       ? new THREE.PerspectiveCamera(
//           75,
//           window.innerWidth / window.innerHeight,
//           0.1,
//           60000
//         )
//       : new THREE.OrthographicCamera(-10000, 10000, 10000, -10000, 0.1, 60000);

//     // Copy position and rotation from the old camera to the new one
//     newCamera.position.copy(oldCamera.position);
//     newCamera.rotation.copy(oldCamera.rotation);

//     currentCameraRef.current = newCamera; // Update the ref to point to the new camera
//     controlsRef.current = new FlyControls(
//       newCamera,
//       rendererRef.current.domElement
//     ); // Reinitialize controls with the new camera

//     isOrthoRef.current = !isOrthoRef.current; // Toggle the camera type flag
//     rendererRef.current.render(sceneRef.current, currentCameraRef.current);
//   };

//   const captureCameraPosition = () => {
//     if (currentCameraRef.current && controlsRef.current) {
//       console.log("Camera Position:", currentCameraRef.current.position);
//       console.log("Camera Rotation:", currentCameraRef.current.rotation);
//     }
//   };

//   return (
//     <div
//       ref={viewerRef}
//       style={{
//         position: "fixed",
//         top: "50%",
//         left: "50%",
//         transform: "translate(-50%, -50%)",
//         width: "750px",
//         height: "750px",
//         backgroundColor: "rgba(0, 0, 0, 0.5)",
//         zIndex: 1000,
//         overflow: "hidden",
//         borderRadius: "10px",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "start",
//         padding: "20px",
//       }}
//     >
//       <button onClick={captureCameraPosition}>Capture Camera Position</button>
//       <button onClick={toggleCamera}>Toggle Camera</button>
//       <div
//         onClick={onClose}
//         style={
//           {
//             /* Close button styles... */
//           }
//         }
//       >
//         Close
//       </div>
//     </div>
//   );
// };

// export default GroundplanViewer;

// const maxXBoundary = -(Math.max(size.x + size.z, size.y + size.x) / 2);
// const maxYBoundary = -(Math.max(size.x + size.y, size.y + size.z) / 2);
// const maxZBoundary = -(Math.max(size.x + size.z, size.y + size.z) / 2);
// currentCameraRef.current.position.set(0, 0, maxZBoundary);

{
  /* <div id="character-list-table">
  <div className="character-list-row">
    <div className="character-name-cell"></div>
    <div className="character-id-cell"></div>
    <div className="character-assignee-cell"></div>
  </div>
</div>; */
}

const richLine = (text) => {
  const parts = [];
  const regex = /(\*([^*]+)\*)|(_([^_]+)_)|([^*_]+)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match[1]) {
      parts.push({
        text: match[2],
        droppedWords: true,
      });
    } else if (match[3]) {
      parts.push({
        text: match[4],
        addedWords: true,
      });
    } else if (match[5]) {
      parts.push({ text: match[5] });
    }
  }

  return parts;
};

const findCellHeight = (textArray) => {
  const cellWidth = (pageWidth - 2 * margin) * 0.9 - 10;
  const wordArray = [];
  let lineCount = 1;
  let currentLineWidth = 0;

  doc.setFont("times", "normal");
  doc.setFontSize(10);
  const spaceWidth = doc.getTextWidth(" ");

  textArray.forEach((part) => {
    if (part.format === "droppedWord") {
      doc.setFont("times", "bold");
    } else {
      doc.setFont("times", "normal");
    }

    const words = part.text.split(" ");
    words.forEach((word) => {
      const wordWidth = doc.getTextWidth(word);
      wordArray.push(wordWidth);
    });
  });

  wordArray.forEach((wordWidth) => {
    if (currentLineWidth + spaceWidth + wordWidth > cellWidth) {
      lineCount++;
      currentLineWidth = wordWidth; // Start new line with the current word
    } else {
      currentLineWidth += spaceWidth + wordWidth;
    }
  });

  const rowHeight = "\n".repeat(lineCount);

  return rowHeight;
};

const dynamicTableRows = characterNotes.map((note) => {
  const textArray = richLine(note.line);
  const rowHeight = findCellHeight(textArray);

  return {
    id: errorCode(note.error),
    note: textArray,
    height: rowHeight,
  };
});

const dynamicTableColumns = [
  { header: "ID", dataKey: "id" },
  { header: "Note", dataKey: "note" },
];

doc.autoTable({
  startY: doc.lastAutoTable.finalY + 20,
  head: [dynamicTableColumns.map((col) => col.header)],
  body: dynamicTableRows.map((row) => [row.id, row.height]),
  columnStyles: {
    0: { cellWidth: (pageWidth - 2 * margin) * 0.1 },
    1: {
      cellWidth: (pageWidth - 2 * margin) * 0.9,
    },
  },
  styles: {
    overflow: "linebreak",
    valign: "middle",
    halign: "center",
    lineWidth: 0.5,
    lineColor: 0,
    font: "times",
    cellPadding: 5,
    fontSize: 10,
    textColor: 0,
  },
  headStyles: {
    fontStyle: "bold",
    fillColor: [255, 255, 255],
  },
  didDrawCell: (data) => {
    const { row, column, cell } = data;

    if (column.index === 1 && row.section === "body") {
      const textArray = dynamicTableRows[row.index].note;

      if (textArray && cell) {
        let x = cell.x + cell.padding("left");
        let y = cell.y + cell.padding("top") + doc.getLineHeight();

        textArray.forEach((part) => {
          doc.setFont("times", part.fontStyle); // Apply the font style
          doc.setTextColor(...part.color);
          doc.text(part.text, x, y);

          if (part.isLineThrough) {
            doc.setDrawColor(...part.color);
            doc.setLineWidth(1);
            doc.line(x, y - 3, x + doc.getTextWidth(part.text), y - 3);
          }

          x += doc.getTextWidth(part.text);

          if (
            x + doc.getTextWidth(part.text) >
            cell.width - cell.padding("right")
          ) {
            x = cell.x + cell.padding("left");
            y += doc.getLineHeight();
          }
        });

        cell.text = "";
      }
    }
  },
});

//message that I might not need: After each part has had its text width measured, I want this logic to occur:
// const spaceWidth = //this should be the measurement of a single empty space in fontSize 10 times.
// let lineCount = 1;

// Let's pretend we had an array where the partWidth attribute values of each element were as follows:

// [15, 6, 21, 3, 4, 45, 12, 2]

// I want a system that takes the value of the first element: `part[0].partWidth`, and compares it to the `cellWidth`. If `part[0].partWidth` is less than `cellWidth`, then we should add `spaceWidth` and `part[1].partWidth`, and then compare THAT number to `cellWidth`. If `part[0].partWidth + spaceWidth + part[1].partWidth` is still less than `cellWidth`, then we should continue by adding `spaceWidth` and `part[2].partWidth` etc. etc.

// IF/When our equation reaches a point where the tally becomes "Greater Than" `cellWidth`, then we need to take the most recently added part, and break the string down
