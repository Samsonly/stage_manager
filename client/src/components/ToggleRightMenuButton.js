import React from "react";

function ToggleRightMenuButton({ rightIsExpanded, toggleRightMenu }) {
  return (
    <div
      id="toggle-right-menu-button"
      style={{
        border: ".5px solid black",
        flex: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={toggleRightMenu}
    >
      {rightIsExpanded ? ">>" : "<<"}
    </div>
  );
}

export default ToggleRightMenuButton;
