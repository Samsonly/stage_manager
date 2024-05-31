import React from "react";
import {
  useGlobal,
  UPDATE_PROJECT_ACTIVE_STATUS,
  SET_LOADING_TYPE,
} from "../contexts/GlobalContext.js";
import "../styles/WelcomeScreen.css";

function WelcomeScreen() {
  const { dispatch } = useGlobal();

  const activateProject = (loadingType) => {
    dispatch({ type: SET_LOADING_TYPE, payload: `${loadingType}` });
    dispatch({ type: UPDATE_PROJECT_ACTIVE_STATUS, payload: true });
  };

  return (
    <div id="welcome-screen">
      <div id="welcome-banner"></div>
      <div id="welcome-header">Create or Choose a Project to Manage</div>
      <div id="welcome-button-row">
        <button
          id="welcome-create-button"
          onClick={() => activateProject("new")}
        >
          Create New Project
        </button>
        <button
          id="welcome-open-button"
          onClick={() => activateProject("open")}
        >
          Open Project
        </button>
      </div>
    </div>
  );
}

export default WelcomeScreen;
