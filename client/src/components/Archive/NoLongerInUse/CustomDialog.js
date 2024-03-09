import React from "react";

const CustomDialog = ({ isOpen, close, children }) => {
  if (!isOpen) return null;

  console.log("CustomDialog rendering...");

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "400px",
          height: "400px",
          backgroundColor: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {children}
        <button onClick={close} style={{ alignSelf: "center" }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CustomDialog;
