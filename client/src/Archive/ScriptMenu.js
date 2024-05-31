import React from "react";
import UploadScript from "./UploadScript";
import viewScriptImage from "../assets/view-script.png";
import tableOfContentsImage from "../assets/table-of-contents.png";
import stylesImage from "../assets/styles.png";
import {
  useProject,
  SET_CURRENT_SCRIPT_VIEW,
} from "./Contexts/ProjectContext.js";

function ScriptMenu() {
  const { state, dispatch } = useProject();
  const { leftButtonsVisible } = state;

  const viewScript = () => {
    dispatch({ type: SET_CURRENT_SCRIPT_VIEW, payload: "script" });
  };

  const viewTableOfContents = () => {
    dispatch({ type: SET_CURRENT_SCRIPT_VIEW, payload: "tableOfContents" });
  };

  const editStyles = () => console.log("Editing styles...");

  return (
    <div id="script-menu">
      {!leftButtonsVisible && <UploadScript />}
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
