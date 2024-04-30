import React from "react";
import uploadScriptImage from "../assets/upload-script.png";
import {
  useProject,
  UPDATE_PROJECT_SAVE_FILE,
  UPDATE_PROJECT_SAVE_STATUS,
  SET_LEFT_BUTTONS_VISIBLE,
  SET_CURRENT_SCRIPT_VIEW,
} from "./Contexts/ProjectContext.js";

function UploadScript() {
  const { dispatch } = useProject();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          const characters = createUniqueCharacterList(jsonData.actStructure);

          dispatch({
            type: UPDATE_PROJECT_SAVE_FILE,
            payload: { script: jsonData, characterList: characters },
          });
          dispatch({ type: UPDATE_PROJECT_SAVE_STATUS, payload: false });
          dispatch({ type: SET_LEFT_BUTTONS_VISIBLE, payload: true });
          dispatch({ type: SET_CURRENT_SCRIPT_VIEW, payload: "script" });
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const uploadScript = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.style.display = "none";
    fileInput.addEventListener("change", handleFileChange);
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  const createUniqueCharacterList = (data) => {
    const names = new Set();
    const extractCharacterNames = (data) => {
      data.forEach((item) => {
        if (item.characterContent && item.characterContent.characterName) {
          names.add(
            item.characterContent.characterName.trim().replace(/\.$/, "")
          );
        } else if (item.internalSceneStructure) {
          extractCharacterNames(item.internalSceneStructure);
        } else if (item.sceneStructure) {
          item.sceneStructure.forEach((scene) => {
            extractCharacterNames(scene.internalSceneStructure);
          });
        }
      });
    };

    extractCharacterNames(data);

    return Array.from(names).map((name) => ({
      characterName: name,
      mainActor: [{ actorID: "", actorName: "", actorEmail: "" }],
      understudy: [{ actorID: "", actorName: "", actorEmail: "" }],
    }));
  };

  return (
    <div id="upload-script-button-container">
      <button
        id="upload-script-button"
        onClick={uploadScript}
        style={{ padding: 0, border: "none", background: "transparent" }}
      >
        <img
          id="upload-script-button-icon"
          src={uploadScriptImage}
          alt="Upload Script"
        />
        <div id="upload-script-button-text">Upload Script</div>
      </button>
    </div>
  );
}

export default UploadScript;
