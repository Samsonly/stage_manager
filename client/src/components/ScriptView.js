import React from "react";
import PlayContent from "./PlayContent";
import "./ScriptView.css";

function ScriptView({ currentView, scriptData }) {
  if (currentView === "baseView") {
    return (
      <div
        id="base-view"
        style={{
          width: "100%",
          backgroundColor: "DarkGrey",
          fontSize: "30px",
          textAlign: "center",
          paddingTop: "20px",
        }}
      >
        Script View
      </div>
    );
  }

  if (currentView === "script") {
    return (
      <div id="script-view">
        <PlayContent scriptJson={scriptData} />
      </div>
    );
  }
}

export default ScriptView;
