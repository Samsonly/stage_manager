import React from "react";

function TopContainer() {
  return (
    <div
      className="top-container"
      style={{
        width: "100%",
        height: "60px",
        backgroundColor: "rgb(37, 2, 71)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="nav-bar"
        style={{
          height: "20px",
          backgroundColor: "BlueViolet",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Navigation Bar
      </div>
      <div
        className="gadget-section"
        style={{
          height: "40px",
          backgroundColor: "violet",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Stage Manager Gadgets
      </div>
    </div>
  );
}

export default TopContainer;
