import React from "react";
import Split from "react-split";
import TopContainer from "./TopContainer.js";
import MiddleContainer from "./MiddleContainer.js";
import BottomContainer from "./BottomContainer.js";
import CreateNewProject from "./CreateNewProject.js";
import {
  useProject,
  SET_HORIZONTAL_PANE_SIZES,
} from "./Contexts/ProjectContext.js";
import "../styles/ProjectWindow.css";

function ProjectWindow() {
  const { state, dispatch } = useProject();
  const { horizontalPaneSizes, isTaskSectionVisible, projectSaveFile } = state;

  const handleDragEnd = (horizontalPaneSizes) => {
    dispatch({ type: SET_HORIZONTAL_PANE_SIZES, payload: horizontalPaneSizes });
  };

  const verticalGutter = () => {
    const gutterElement = document.createElement("div");
    gutterElement.id = "bottom-gutter";
    return gutterElement;
  };

  return (
    <div id="project-window">
      <TopContainer />
      {isTaskSectionVisible ? (
        <Split
          style={{ display: "flex", flexDirection: "column", flex: 1 }}
          sizes={horizontalPaneSizes}
          minSize={[0, 20]}
          gutterSize={3}
          gutter={verticalGutter}
          direction="vertical"
          cursor="row-resize"
          onDragEnd={handleDragEnd}
        >
          <MiddleContainer />
          <BottomContainer />
        </Split>
      ) : (
        <>
          <MiddleContainer />
          <BottomContainer />
        </>
      )}
      {!projectSaveFile.projectName && <CreateNewProject />}
    </div>
  );
}

export default ProjectWindow;
