import React from "react";
import Split from "react-split";
import ScriptView from "./ScriptView.js";
import DesignView from "./DesignView.js";
import {
  useProject,
  SET_VERTICAL_PANE_SIZES,
  SET_INVERTED_LAYOUT,
} from "../contexts/ProjectContext.js";
import "../styles/MiddleContainer.css";

function MiddleContainer() {
  const { state, dispatch } = useProject();
  const { layoutIsInverted, verticalPaneSizes } = state;

  const handleDragEnd = (verticalPaneSizes) => {
    dispatch({ type: SET_VERTICAL_PANE_SIZES, payload: verticalPaneSizes });
  };

  const horizontalGutter = () => {
    const gutterElement = document.createElement("div");
    gutterElement.id = "middle-gutter";
    return gutterElement;
  };

  const handleSwapSides = () => {
    if (!layoutIsInverted) {
      dispatch({ type: SET_INVERTED_LAYOUT, payload: true });
    } else {
      dispatch({ type: SET_INVERTED_LAYOUT, payload: false });
    }
  };

  return (
    <div id="middle-container">
      <div id="left-bar">
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
              <DesignView />
            </div>
          ) : (
            <div id="script-display">
              <ScriptView />
            </div>
          )}
        </div>
        <div id="right-display">
          {!layoutIsInverted ? (
            <div id="design-display">
              <DesignView />
            </div>
          ) : (
            <div id="script-display">
              <ScriptView />
            </div>
          )}
        </div>
      </Split>
      <div id="right-bar">
        <div id="swap-sides-button" onClick={handleSwapSides}>
          ⇄
        </div>
      </div>
    </div>
  );
}

export default MiddleContainer;
