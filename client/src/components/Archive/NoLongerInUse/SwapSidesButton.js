import React from "react";

function SwapSidesButton({ handleSwapSides }) {
  return (
    <div
      className="swap-sides-button"
      style={{
        border: ".5px solid black",
        flex: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={handleSwapSides}
    >
      ⇄
    </div>
  );
}
export default SwapSidesButton;
