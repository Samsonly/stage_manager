import React from "react";

function ToggleLeftMenuButton({ leftIsExpanded, toggleLeftMenu }) {
  return (
    <div
      id="toggle-left-menu-button"
      style={{
        border: ".5px solid black",
        flex: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={toggleLeftMenu}
    >
      {leftIsExpanded ? "<<" : ">>"}
    </div>
  );
}

export default ToggleLeftMenuButton;
