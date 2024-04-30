import React, { useContext } from "react";
import { useSettings } from "./Contexts/SettingsContext.js";
import { ProjectContext } from "./Contexts/ProjectContext.js";

function SaveProject() {
  const { hideSettings } = useSettings();
  const { state } = useContext(ProjectContext);

  const handleSave = () => {
    const { projectSaveFile } = state;
    if (!projectSaveFile) {
      alert("No project data to save.");
      return;
    }

    const data = JSON.stringify(projectSaveFile, null, 2);
    const blob = new Blob([data], { type: "application/json" });

    const anchor = document.createElement("a");
    anchor.href = window.URL.createObjectURL(blob);
    anchor.download = "sm-project-file.thtr";

    document.body.appendChild(anchor);
    anchor.click();

    document.body.removeChild(anchor);

    hideSettings();
  };

  return (
    <div className="modal-background-overlay">
      <div className="modal-window">
        <div className="save-project-title">Save Project</div>
        <div className="save-project-button-container">
          <button className="save-project-button" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-project-button" onClick={hideSettings}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveProject;
