import React, { useState } from "react";
import "../styles/EndRehearsal.css";
import { useProject } from "../contexts/ProjectContext.js";
import { useSettings } from "../contexts/SettingsContext.js";

const EndRehearsal = () => {
  const { hideSettings } = useSettings();
  const { state } = useProject();
  const { projectSaveFile } = state;
  const [lineNotesReport, setLineNotesReport] = useState([]);

  const sendEndOfRehearsalReports = () => {
    //consider adding logic here that maintains if a rehearsal is active or not
    hideSettings();
  };

  return (
    <div className="modal-background-overlay">
      <div id="end-rehearsal-modal-window">
        <div id="end-rehearsal-title">End of Rehearsal Reports</div>
        <div id="end-rehearsal-table"></div>
        <div id="end-rehearsal-line-notes-row">
          <div>
            <input
              type="checkbox"
              id="line-notes-report"
              name="line-notes-report"
              checked={lineNotesReport}
              onChange={() => setLineNotesReport(!lineNotesReport)}
              className="custom-checkbox"
            />
            <label htmlFor="line-notes-report">Line Notes</label>
          </div>
        </div>
        <div id="end-rehearsal-button-row">
          <button className="menu-close-button" onClick={hideSettings}>
            Close
          </button>
          <button
            className="menu-save-button"
            onClick={sendEndOfRehearsalReports}
          >
            Send Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndRehearsal;
