import React from "react";
import {
  useGlobal,
  UPDATE_PROJECT_ACTIVE_STATUS,
} from "./Contexts/GlobalContext.js";
import "../styles/WelcomeScreen.css";

function WelcomeScreen() {
  const { dispatch } = useGlobal();

  const createNewProject = () => {
    dispatch({ type: UPDATE_PROJECT_ACTIVE_STATUS, payload: true });
  };

  return (
    <div id="welcome-screen">
      <div id="welcome-banner"></div>
      <div id="welcome-header">Create or Choose a Project to Manage</div>
      <div id="welcome-button-row">
        <button id="welcome-create-button" onClick={createNewProject}>
          Create New Project
        </button>
        <button
          id="welcome-open-button"
          onClick={() => console.log("Open Project button clicked")}
        >
          Open Project
        </button>
      </div>
    </div>
  );
}

export default WelcomeScreen;
