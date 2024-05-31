import React from "react";
import "../styles/DesignMenu.css";
import uploadGroundplanImage from "../assets/upload-groundplan.png";

function DesignMenu({ onGroundplanUpload }) {
  // const uploadGroundplan = () => {
  //   const fileInput = document.createElement("input");
  //   fileInput.type = "file";
  //   fileInput.accept = ".obj, .zip";
  //   fileInput.style.display = "none";
  //   fileInput.onchange = (event) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //       onGroundplanUpload(file);
  //     }
  //   };
  //   document.body.appendChild(fileInput);
  //   fileInput.click();
  //   document.body.removeChild(fileInput);
  // };

  const viewGroundplan = () => console.log("Viewing ground plan..."); //Placeholder for future functionality
  // const exportBlocking = () => console.log("Exporting blocking..."); //Placeholder for future functionality

  return (
    <div id="design-menu">
      <button id="upload-groundplan-button" onClick={uploadGroundplan}>
        <img
          id="upload-groundplan-icon"
          src={uploadGroundplanImage}
          alt="Upload Groundplan"
        />
      </button>
      <button id="view-groundplan-button" onClick={viewGroundplan}>
        <img
          id="view-groundplan-icon"
          src={uploadGroundplanImage}
          alt="View Groundplan"
        />
      </button>
      {/* <button id="export-blocking-button" onClick={exportBlocking}>
        <img
          id="export-blocking-icon"
          src="export-blocking.png"
          alt="Export Blocking"
        />
      </button> */}
    </div>
  );
}

export default DesignMenu;
