import React, { useState } from "react";

function DesignMenu({ swapSides }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const [showUploadButton, setShowUploadButton] = useState(true);
  const [showViewAndExportButtons, setShowViewAndExportButtons] =
    useState(false);

  const uploadGroundplan = () => {
    // Placeholder for uploadGroundplan logic
    console.log("Uploading ground plan...");
    setShowUploadButton(false);
    setShowViewAndExportButtons(true);
  };

  // Placeholder functions for other buttons
  const viewGroundplan = () => console.log("Viewing ground plan...");
  const exportBlocking = () => console.log("Exporting blocking...");

  return (
    <div id="design-menu" style={{ display: "flex", flexDirection: "column" }}>
      {showUploadButton && (
        <div
          id=" upload-groundplan-button"
          onClick={uploadGroundplan}
          style={{
            width: "40px",
            height: "40px",
            backgroundImage: "url(upload-groundplan.png)",
          }}
        ></div>
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
