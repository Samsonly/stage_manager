import React, { useState } from "react";

function ScriptBar({ swapSides }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="script-bar"
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
      <div
        id="left-expand-collapse-button"
        style={{
          border: ".5px solid black",
          flex: "1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "<<" : ">>"} {/* Expand/Collapse Button */}
      </div>
      <div
        className="swap-sides-button"
        style={{
          border: ".5px solid black",
          flex: "1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => swapSides("scriptView")}
      >
        ⇄
      </div>{" "}
    </div>
  );
}

export default ScriptBar;
