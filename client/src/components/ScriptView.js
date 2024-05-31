import React from "react";
import PlayContent from "./PlayContent.js";
import UploadScript from "./UploadScript.js";
import uploadScriptImage from "../assets/upload-script.png";
import { useProject } from "../contexts/ProjectContext.js";
import "../styles/ScriptView.css";

function ScriptView() {
  const { state } = useProject();
  const { projectSaveFile } = state;
  const uploadScript = UploadScript();
  const isScriptLoaded = Object.keys(projectSaveFile.script).length > 0;

  return (
    <div id="script-view">
      {isScriptLoaded ? (
        <PlayContent scriptJson={projectSaveFile.script} />
      ) : (
        <div id="base-view">
          <div id="upload-script-button-container">
            <button id="upload-script-button" onClick={uploadScript}>
              <img
                id="upload-script-button-icon"
                src={uploadScriptImage}
                alt="Upload Script"
              />
              <div id="upload-script-button-text">Upload Script</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScriptView;
