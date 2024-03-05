import React, { useState } from "react";

function ExpandedDesignBar() {
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
    <div style={{ display: "flex", flexDirection: "column" }}>
      {showUploadButton && (
        <div
          onClick={uploadGroundplan}
          style={{
            width: "40px",
            height: "40px",
            backgroundImage: "url(upload-groundplan.png)",
          }}
        ></div> // Upload Groundplan Button
      )}
      {showViewAndExportButtons && (
        <>
          <div
            onClick={viewGroundplan}
            style={{
              width: "40px",
              height: "40px",
              backgroundImage: "url(view-groundplan.png)",
            }}
          ></div>{" "}
          // View Groundplan Button
          <div
            onClick={exportBlocking}
            style={{
              width: "40px",
              height: "40px",
              backgroundImage: "url(export-blocking.png)",
            }}
          ></div>{" "}
          // Export Blocking Button
        </>
      )}
    </div>
  );
}
