import React, { useState } from "react";

function DesignView() {
  const [snapshotUrl, setSnapshotUrl] = useState("");

  const updateSnapshotUrl = (url) => {
    setSnapshotUrl(url);
  };

  return (
    <div
      id="design-view"
      style={{
        width: "100%",
        backgroundColor: "Maroon",
        fontSize: "30px",
        textAlign: "center",
        paddingTop: "20px",
        color: "white",
      }}
    >
      Design View
      {snapshotUrl && (
        <div>
          <img
            src={snapshotUrl}
            alt="Snapshot"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </div>
      )}
    </div>
  );
}

export default DesignView;
