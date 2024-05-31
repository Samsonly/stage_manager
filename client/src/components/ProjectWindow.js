import React from "react";
import Split from "react-split";
import TopContainer from "./TopContainer.js";
import MiddleContainer from "./MiddleContainer.js";
import BottomContainer from "./BottomContainer.js";
import CreateNewProject from "./CreateNewProject.js";
import OpenProject from "./OpenProject.js";
import {
  useProject,
  SET_HORIZONTAL_PANE_SIZES,
} from "../contexts/ProjectContext.js";
import { useGlobal } from "../contexts/GlobalContext.js";
import "../styles/ProjectWindow.css";

function ProjectWindow() {
  const { state: projectState, dispatch } = useProject();
  const { state: globalState } = useGlobal();
  const { horizontalPaneSizes, isTaskSectionVisible } = projectState;
  const { loadingType } = globalState;

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
      {loadingType === "new" && <CreateNewProject />}
      {loadingType === "open" && <OpenProject />}
    </div>
  );
}

export default ProjectWindow;
