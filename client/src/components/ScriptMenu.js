import React from "react";
import uploadScriptImage from "../assets/upload-script.png";
import viewScriptImage from "../assets/view-script.png";
import tableOfContentsImage from "../assets/table-of-contents.png";
import characterListImage from "../assets/character-list.png";
import stylesImage from "../assets/styles.png";
import {
  useGlobal,
  SET_LEFT_BUTTONS_VISIBLE,
  SET_CURRENT_VIEW,
} from "./GlobalContext";

function ScriptMenu({ onScriptUpload }) {
  const { state, dispatch } = useGlobal();
  const { leftButtonsVisible } = state;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          onScriptUpload(jsonData);
          dispatch({ type: SET_LEFT_BUTTONS_VISIBLE, payload: true });
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

  const viewScript = () => {
    dispatch({ type: SET_CURRENT_VIEW, payload: "script" });
  };

  const viewTableOfContents = () => {
    dispatch({ type: SET_CURRENT_VIEW, payload: "tableOfContents" });
  };

  const viewCharacterList = () => {
    dispatch({ type: SET_CURRENT_VIEW, payload: "characterList" });
  };

  const editStyles = () => console.log("Editing styles...");

  return (
    <div id="script-menu">
      {!leftButtonsVisible && (
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
      {leftButtonsVisible && (
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
