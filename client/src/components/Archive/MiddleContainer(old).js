import React, { useState } from "react";
import Split from "react-split";
import ToggleLeftMenuButton from "./ToggleLeftMenuButton";
import SwapSidesButton from "./SwapSidesButton";
import ScriptMenu from "./ScriptMenu";
import ScriptView from "./ScriptView";
import DesignView from "./DesignView";
import DesignMenu from "./DesignMenu";
import ToggleRightMenuButton from "./ToggleRightMenuButton";

function MiddleContainer({ onFileSelect, snapshotUrl }) {
  const [leftIsExpanded, setLeftIsExpanded] = useState(false);
  const [rightIsExpanded, setRightIsExpanded] = useState(false);
  const [traditionalState, setTraditionalState] = useState(true);
  const [currentView, setCurrentView] = useState("baseView");
  const [scriptData, setScriptData] = useState(null);
  const handleScriptUpload = (data) => {
    setScriptData(data);
    setCurrentView("script");
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
    setLeftIsExpanded(!leftIsExpanded);
  };

  const toggleRightMenu = () => {
    setRightIsExpanded(!rightIsExpanded);
  };

  const handleSwapSides = () => {
    setTraditionalState(!traditionalState);
  };

  return (
    <div
      id="middle-container"
      style={{
        overflow: "auto",
        display: "flex",
        flexGrow: "1",
        flexDirection: "row",
      }}
    >
      <div
        id="left-bar"
        style={{
          width: "20px",
          fontSize: "12px",
          textAlign: "center",
          backgroundColor: "LightGray",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <ToggleLeftMenuButton
          leftIsExpanded={leftIsExpanded}
          toggleLeftMenu={toggleLeftMenu}
        />
        <SwapSidesButton handleSwapSides={handleSwapSides} />
      </div>
      {leftIsExpanded && (
        <div
          id={traditionalState ? "left-menu" : "right-menu"}
          style={{
            width: "40px",
            backgroundColor: traditionalState ? "Gray" : "Coral",
          }}
        >
          {traditionalState ? (
            <ScriptMenu onScriptUpload={handleScriptUpload} />
          ) : (
            <DesignMenu onFileSelect={onFileSelect} />
          )}
        </div>
      )}

      <Split
        style={{ display: "flex", flexGrow: 1 }}
        sizes={[50, 50]}
        minSize={[100, 100]}
        direction="horizontal"
        gutterSize={5}
        gutter={horizontalGutter}
        cursor="col-resize"
      >
        <div id={traditionalState ? "left-view" : "right-view"}>
          {traditionalState ? (
            <ScriptView currentView={currentView} scriptData={scriptData} />
          ) : (
            <DesignView snapshotUrl={snapshotUrl} />
          )}
        </div>
        <div
          id={traditionalState ? "right-view" : "left-view"}
          style={{ display: "flex", flexGrow: 1 }}
        >
          {traditionalState ? (
            <DesignView snapshotUrl={snapshotUrl} />
          ) : (
            <ScriptView currentView={currentView} scriptData={scriptData} />
          )}
        </div>
      </Split>

      {rightIsExpanded && (
        <div
          id={traditionalState ? "right-menu" : "left-menu"}
          style={{
            width: "40px",
            backgroundColor: traditionalState ? "Coral" : "Gray",
          }}
        >
          {traditionalState ? (
            <DesignMenu onFileSelect={onFileSelect} />
          ) : (
            <ScriptMenu onScriptUpload={handleScriptUpload} />
          )}
        </div>
      )}
      <div
        id="right-bar"
        style={{
          width: "20px",
          fontSize: "12px",
          textAlign: "center",
          backgroundColor: "LightCoral",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <ToggleRightMenuButton
          rightIsExpanded={rightIsExpanded}
          toggleRightMenu={toggleRightMenu}
        />
        <SwapSidesButton handleSwapSides={handleSwapSides} />
      </div>
    </div>
  );
}

export default MiddleContainer;
