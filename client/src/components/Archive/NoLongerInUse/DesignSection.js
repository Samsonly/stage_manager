import React from "react";

function DesignSection() {
  const isExpanded = false;

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        flexDirection: "row-reverse",
      }}
    >
      {isExpanded && (
        <div
          id="expanded-design-bar"
          style={{ width: "40px", backgroundColor: "Coral" }}
        >
          {" "}
        </div>
      )}
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
      </div>
    </div>
  );
}

export default DesignSection;
