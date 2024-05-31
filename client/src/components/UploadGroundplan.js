import React from "react";
import uploadGroundplanImage from "../assets/upload-groundplan.png";
import {
  useProject,
  STORE_GROUNDPLAN_FILE,
  SET_CURRENT_DESIGN_VIEW,
} from "../contexts/ProjectContext.js";

function UploadGroundplan() {
  const { dispatch } = useProject();

  const onGroundplanUpload = (file) => {
    console.log("Uploading ground plan...", file);
    dispatch({ type: STORE_GROUNDPLAN_FILE, payload: file });
    dispatch({ type: SET_CURRENT_DESIGN_VIEW, payload: "groundplanEditor" });
  };

  const uploadGroundplan = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".obj, .zip";
    fileInput.style.display = "none";
    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        onGroundplanUpload(file);
      }
      document.body.removeChild(fileInput); // Remove the file input here
    };
    document.body.appendChild(fileInput);
    fileInput.click();
  };

  return (
    <div id="upload-groundplan-button-container">
      <button
        id="upload-groundplan-button"
        onClick={uploadGroundplan}
        style={{ padding: 0, border: "none", background: "transparent" }}
      >
        <img
          id="upload-groundplan-button-icon"
          src={uploadGroundplanImage}
          alt="Upload Groundplan"
        />
        <div id="upload-groundplan-button-text">Upload Groundplan</div>
      </button>
    </div>
  );
}

export default UploadGroundplan;
