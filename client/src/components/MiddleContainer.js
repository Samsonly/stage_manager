import React from "react";
import Split from "react-split";
import ScriptMenu from "./ScriptMenu";
import ScriptView from "./ScriptView";
import DesignView from "./DesignView";
import DesignMenu from "./DesignMenu";
import {
  useGlobal,
  SET_INVERTED_LAYOUT,
  SET_LEFT_IS_EXPANDED,
  SET_RIGHT_IS_EXPANDED,
  SET_SCRIPT_DATA,
  SET_CURRENT_VIEW,
} from "./GlobalContext";
import "./MiddleContainer.css";

function MiddleContainer({ onFileSelect }) {
  const { state, dispatch } = useGlobal();
  const {
    layoutIsInverted,
    leftIsExpanded,
    rightIsExpanded,
    currentView,
    scriptData,
  } = state;

  const handleScriptUpload = (data) => {
    dispatch({ type: SET_SCRIPT_DATA, payload: data });
    dispatch({ type: SET_CURRENT_VIEW, payload: "script" });
  };

  const horizontalGutter = (index, direction) => {
    const gutterElement = document.createElement("div");
    gutterElement.className = "gutter";
    gutterElement.style.background =
      "linear-gradient(to right, lightgrey, black, lightgrey)";
    gutterElement.style.width = "10px";
    gutterElement.style.position = "relative";

    const beforeElement = document.createElement("div");
    beforeElement.style.content = '""';
    beforeElement.style.position = "absolute";
    beforeElement.style.top = "-3px";
    beforeElement.style.bottom = "-3px";
    beforeElement.style.left = "-3px";
    beforeElement.style.right = "-3px";
    beforeElement.style.zIndex = "10";

    gutterElement.appendChild(beforeElement);

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
        sizes={[50, 50]}
        minSize={[100, 100]}
        direction="horizontal"
        gutterSize={5}
        gutter={horizontalGutter}
        cursor="col-resize"
      >
        <div id="left-display">
          {layoutIsInverted ? (
            <div id="design-display">
              {leftIsExpanded && <DesignMenu onFileSelect={onFileSelect} />}
              <DesignView />
            </div>
          ) : (
            <div id="script-display">
              {leftIsExpanded && (
                <ScriptMenu onScriptUpload={handleScriptUpload} />
              )}
              <ScriptView currentView={currentView} scriptData={scriptData} />
            </div>
          )}
        </div>
        <div id="right-display">
          {!layoutIsInverted ? (
            <div id="design-display">
              <DesignView />
              {rightIsExpanded && <DesignMenu onFileSelect={onFileSelect} />}
            </div>
          ) : (
            <div id="script-display">
              <ScriptView currentView={currentView} scriptData={scriptData} />
              {rightIsExpanded && (
                <ScriptMenu onScriptUpload={handleScriptUpload} />
              )}
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
