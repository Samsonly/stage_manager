import React from "react";

function ScriptSection() {
  const isExpanded = false;

  return (
    <div style={{ display: "flex", height: "100%", width: "100%" }}>
      {isExpanded && (
        <div
          id="expanded-script-bar"
          style={{ width: "40px", backgroundColor: "Gray" }}
        >
          {" "}
        </div>
      )}
      <div
        id="script-view"
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
    </div>
  );
}

export default ScriptSection;
