import React from "react";
import "../../styles/CustomConfirm.css"; // Adjust path as necessary

function CustomConfirm({ message, onNo, onYes }) {
  return (
    <div className="modal-background-overlay">
      <div id="confirm-modal-window">
        <div id="confirm-table">
          <div id="confirm-title">{message} </div>
          <button id="confirm-no-button" onClick={onNo}>
            No
          </button>
          <button id="confirm-yes-button" onClick={onYes}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomConfirm;
