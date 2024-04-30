import React from "react";
import UploadScript from "./UploadScript.js";
import PlayContent from "./PlayContent.js";
import TableOfContents from "./TableOfContents.js";
import {
  useProject,
  SET_CURRENT_SCRIPT_VIEW,
  SET_SCRIPT_SCROLL_POSITION,
} from "./Contexts/ProjectContext.js";
import "../styles/ScriptView.css";

function ScriptView() {
  const { state, dispatch } = useProject();
  const { currentScriptView, projectSaveFile } = state;

  const onViewSection = (view, elementId) => {
    dispatch({ type: SET_CURRENT_SCRIPT_VIEW, payload: view });
    if (view === "script") {
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          const scrollPosition = element.offsetTop;
          dispatch({
            type: SET_SCRIPT_SCROLL_POSITION,
            payload: scrollPosition,
          });
        }
      }, 0);
    }
  };

  switch (currentScriptView) {
    case "baseView":
      return (
        <div id="base-view">
          <UploadScript />
        </div>
      );
    case "script":
      return (
        <div id="script-view">
          <PlayContent scriptJson={projectSaveFile.script} />
        </div>
      );
    case "tableOfContents":
      return (
        <div id="script-view">
          <TableOfContents onViewSection={onViewSection} />
        </div>
      );
    default:
      return null;
  }
}

export default ScriptView;
