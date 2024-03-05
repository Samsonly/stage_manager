import React, { useState } from "react";

function DesignBar({ swapSides }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="design-bar"
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
      <div
        id="right-expand-collapse-button"
        style={{
          border: ".5px solid black",
          flex: "1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? ">>" : "<<"}
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
        onClick={() => swapSides("designView")}
      >
        ⇄
      </div>{" "}
    </div>
  );
}

export default DesignBar;
