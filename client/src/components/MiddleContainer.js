import React from "react";
import Split from "react-split";
import ScriptMenu from "./ScriptMenu.js";
import ScriptView from "./ScriptView.js";
import DesignView from "./DesignView.js";
import DesignMenu from "./DesignMenu.js";
import {
  useProject,
  SET_VERTICAL_PANE_SIZES,
  SET_INVERTED_LAYOUT,
  SET_LEFT_IS_EXPANDED,
  SET_RIGHT_IS_EXPANDED,
  SET_CURRENT_DESIGN_VIEW,
  STORE_GROUNDPLAN_FILE,
} from "./Contexts/ProjectContext.js";
import "../styles/MiddleContainer.css";

function MiddleContainer() {
  const { state, dispatch } = useProject();
  const {
    layoutIsInverted,
    leftIsExpanded,
    rightIsExpanded,
    verticalPaneSizes,
  } = state;

  const handleGroundplanUpload = (file) => {
    dispatch({ type: STORE_GROUNDPLAN_FILE, payload: file });
    dispatch({ type: SET_CURRENT_DESIGN_VIEW, payload: "groundplanEditor" });
  };

  const handleDragEnd = (verticalPaneSizes) => {
    dispatch({ type: SET_VERTICAL_PANE_SIZES, payload: verticalPaneSizes });
  };

  const horizontalGutter = () => {
    const gutterElement = document.createElement("div");
    gutterElement.id = "middle-gutter";
    return gutterElement;
  };

  const toggleLeftMenu = () => {
    if (!leftIsExpanded) {
      dispatch({ type: SET_LEFT_IS_EXPANDED, payload: true });
    } else {
      dispatch({ type: SET_LEFT_IS_EXPANDED, payload: false });
    }
  };

  const toggleRightMenu = () => {
    if (!rightIsExpanded) {
      dispatch({ type: SET_RIGHT_IS_EXPANDED, payload: true });
    } else {
      dispatch({ type: SET_RIGHT_IS_EXPANDED, payload: false });
    }
  };

  const handleSwapSides = () => {
    if (!layoutIsInverted) {
      dispatch({ type: SET_INVERTED_LAYOUT, payload: true });
      dispatch({ type: SET_RIGHT_IS_EXPANDED, payload: false });
      dispatch({ type: SET_LEFT_IS_EXPANDED, payload: false });
    } else {
      dispatch({ type: SET_INVERTED_LAYOUT, payload: false });
      dispatch({ type: SET_RIGHT_IS_EXPANDED, payload: false });
      dispatch({ type: SET_LEFT_IS_EXPANDED, payload: false });
    }
  };

  return (
    <div id="middle-container">
      <div id="left-bar">
        <div id="toggle-left-menu-button" onClick={toggleLeftMenu}>
          {leftIsExpanded ? "<<" : ">>"}
        </div>
        <div id="swap-sides-button" onClick={handleSwapSides}>
          ⇄
        </div>
      </div>
      <Split
        style={{ display: "flex", flexGrow: 1 }}
        sizes={verticalPaneSizes}
        minSize={[100, 100]}
        direction="horizontal"
        gutterSize={3}
        gutter={horizontalGutter}
        cursor="col-resize"
        onDragEnd={handleDragEnd}
      >
        <div id="left-display">
          {layoutIsInverted ? (
            <div id="design-display">
              {leftIsExpanded && (
                <DesignMenu onFileSelect={handleGroundplanUpload} />
              )}
              <DesignView />
            </div>
          ) : (
            <div id="script-display">
              {leftIsExpanded && <ScriptMenu />}
              <ScriptView />
            </div>
          )}
        </div>
        <div id="right-display">
          {!layoutIsInverted ? (
            <div id="design-display">
              <DesignView />
              {rightIsExpanded && (
                <DesignMenu onGroundplanUpload={handleGroundplanUpload} />
              )}
            </div>
          ) : (
            <div id="script-display">
              <ScriptView />
              {rightIsExpanded && <ScriptMenu />}
            </div>
          )}
        </div>
      </Split>
      <div id="right-bar">
        <div id="toggle-right-menu-button" onClick={toggleRightMenu}>
          {rightIsExpanded ? ">>" : "<<"}
        </div>
        <div id="swap-sides-button" onClick={handleSwapSides}>
          ⇄
        </div>
      </div>
    </div>
  );
}

export default MiddleContainer;
