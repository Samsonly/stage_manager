import React from "react";
import NavigationBar from "./NavigationBar.js";
import "../styles/TopContainer.css";

function TopContainer() {
  return (
    <div className="top-container">
      <NavigationBar />
      <div className="gadget-section">Stage Manager Gadgets</div>
    </div>
  );
}

export default TopContainer;
