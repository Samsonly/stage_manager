import React, { useState } from "react";
import {
  useProject,
  UPDATE_PROJECT_SAVE_FILE,
  UPDATE_PROJECT_SAVE_STATUS,
} from "./Contexts/ProjectContext.js";
import {
  useGlobal,
  UPDATE_PROJECT_ACTIVE_STATUS,
} from "./Contexts/GlobalContext.js";
import "../styles/CreateNewProject.css";

function CreateNewProject() {
  const [projectName, setProjectName] = useState("");
  const { dispatch: projectDispatch } = useProject();
  const { dispatch: globalDispatch } = useGlobal();

  const handleCreateProject = () => {
    if (!projectName) {
      alert("Please enter a project name.");
      return;
    }

    projectDispatch({
      type: UPDATE_PROJECT_SAVE_FILE,
      payload: { projectName },
    });
    projectDispatch({ type: UPDATE_PROJECT_SAVE_STATUS, payload: false });
  };

  const clearProject = () => {
    globalDispatch({ type: UPDATE_PROJECT_ACTIVE_STATUS, payload: false });
  };

  return (
    <div id="new-project-modal-background-overlay">
      <div id="new-project-modal-window">
        <div id="new-project-table">
          <div id="new-project-title">Create New Project </div>
          <div id="new-project-name-form">
            <label htmlFor="new-project-name">Project Name:</label>
            <input
              type="text"
              id="new-project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>
        </div>
        <button id="create-new-project-close-button" onClick={clearProject}>
          Close
        </button>
        <button id="create-new-project-button" onClick={handleCreateProject}>
          Create Project
        </button>
      </div>
    </div>
  );
}

export default CreateNewProject;
