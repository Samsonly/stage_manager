import React, { useState } from "react";
import uploadGroundplanImage from "../assets/upload-groundplan.png";

function DesignMenu({ swapSides, onFileSelect }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUploadButton, setShowUploadButton] = useState(true);
  const [showViewAndExportButtons, setShowViewAndExportButtons] =
    useState(false);

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

  // Placeholder functions for other buttons
  const viewGroundplan = () => console.log("Viewing ground plan...");
  const exportBlocking = () => console.log("Exporting blocking...");

  return (
    <div id="design-menu" style={{ display: "flex", flexDirection: "column" }}>
      {showUploadButton && (
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
      )}
      {showViewAndExportButtons && (
        <>
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
        </>
      )}
    </div>
  );
}

export default DesignMenu;
