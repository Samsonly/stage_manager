import React, { useState } from "react";
import uploadScriptImage from "../assets/upload-script.png";
import viewScriptImage from "../assets/view-script.png";
import tableOfContentsImage from "../assets/table-of-contents.png";
import characterListImage from "../assets/character-list.png";
import stylesImage from "../assets/styles.png";

function ScriptMenu({ onScriptUpload }) {
  const [buttonsVisible, setButtonsVisible] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          onScriptUpload(jsonData);
          setButtonsVisible(true);
        } catch (error) {}
      };
      reader.readAsText(file);
    }
  };

  const uploadScript = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.style.display = "none";
    fileInput.addEventListener("change", (event) => {
      handleFileChange(event);
    });
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  const viewScript = () => console.log("Viewing script...");

  const viewTableOfContents = () => console.log("Viewing table of contents...");

  const viewCharacterList = () => console.log("Viewing character list...");

  const editStyles = () => console.log("Editing styles...");

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {!buttonsVisible && (
        <button
          id="upload-script-button"
          onClick={uploadScript}
          style={{ padding: 0, border: "none", background: "transparent" }}
        >
          <img
            src={uploadScriptImage}
            style={{ width: "40px", height: "40px" }}
            alt="Upload Script"
          />
        </button>
      )}
      {buttonsVisible && (
        <>
          <button
            id="view-script-button"
            onClick={viewScript}
            style={{ padding: 0, border: "none", background: "transparent" }}
          >
            <img
              src={viewScriptImage}
              style={{ width: "40px", height: "40px" }}
              alt="View Script"
            />
          </button>
          <button
            id="table-of-contents-button"
            onClick={viewTableOfContents}
            style={{ padding: 0, border: "none", background: "transparent" }}
          >
            <img
              src={tableOfContentsImage}
              style={{ width: "40px", height: "40px" }}
              alt="Table of Contents"
            />
          </button>
          <button
            id="character-list-button"
            onClick={viewCharacterList}
            style={{ padding: 0, border: "none", background: "transparent" }}
          >
            <img
              src={characterListImage}
              style={{ width: "40px", height: "40px" }}
              alt="Character List"
            />
          </button>
          <button
            id="styles-button"
            onClick={editStyles}
            style={{ padding: 0, border: "none", background: "transparent" }}
          >
            <img
              src={stylesImage}
              style={{ width: "40px", height: "40px" }}
              alt="Styles"
            />
          </button>
        </>
      )}
    </div>
  );
}

export default ScriptMenu;
