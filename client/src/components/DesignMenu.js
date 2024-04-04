import React from "react";
import uploadGroundplanImage from "../assets/upload-groundplan.png";

function DesignMenu({ onFileSelect }) {
  const uploadGroundplan = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".obj, .zip";
    fileInput.style.display = "none";
    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        onFileSelect(file);
      }
    };
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  const viewGroundplan = () => console.log("Viewing ground plan...");
  const exportBlocking = () => console.log("Exporting blocking...");

  return (
    <div id="design-menu">
      <button
        id="upload-groundplan-button"
        onClick={uploadGroundplan}
        style={{ padding: 0, border: "none", background: "transparent" }}
      >
        <img
          src={uploadGroundplanImage}
          style={{ width: "40px", height: "40px" }}
          alt="Upload Groundplan"
        />
      </button>
      <div
        id="view-groundplan-button"
        onClick={viewGroundplan}
        style={{
          width: "40px",
          height: "40px",
          backgroundImage: "url(view-groundplan.png)",
        }}
      ></div>
      <div
        id="export-blocking-button"
        onClick={exportBlocking}
        style={{
          width: "40px",
          height: "40px",
          backgroundImage: "url(export-blocking.png)",
        }}
      ></div>
    </div>
  );
}

export default DesignMenu;
