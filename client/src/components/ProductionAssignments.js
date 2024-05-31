// ProductionAssignments.js
import React, { useState, useEffect } from "react";
import "../styles/ProductionAssignments.css";
import {
  useProject,
  UPDATE_PROJECT_SAVE_FILE,
  UPDATE_PROJECT_SAVE_STATUS,
} from "../contexts/ProjectContext.js";
import { useSettings } from "../contexts/SettingsContext.js";
import AssignmentEntry from "./AssignmentEntry";

const ProductionAssignments = () => {
  const { hideSettings } = useSettings();
  const { state, dispatch } = useProject();
  const { projectSaveFile } = state;

  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    setAssignments([...(projectSaveFile.productionAssignments || [])]);
  }, [projectSaveFile.productionAssignments]);

  const updateAssignment = (index, updatedAssignment) => {
    const newAssignments = [...assignments];
    newAssignments[index] = updatedAssignment;
    setAssignments(newAssignments);
  };

  const saveProductionAssignments = () => {
    dispatch({
      type: UPDATE_PROJECT_SAVE_FILE,
      payload: { productionAssignments: assignments },
    });
    dispatch({
      type: UPDATE_PROJECT_SAVE_STATUS,
      payload: false,
    });
    hideSettings();
  };

  const createNewAssignment = () => {
    setAssignments([
      ...assignments,
      { department: "", role: "", assignee: "", email: "" },
    ]);
  };

  return (
    <div className="modal-background-overlay">
      <div id="production-assignment-modal-window">
        <div id="production-assignment-title">Production Assignments</div>
        <div id="production-assignment-table">
          {assignments.map((assignment, index) => (
            <AssignmentEntry
              key={index}
              assignment={assignment}
              updateAssignment={(updated) => updateAssignment(index, updated)}
              contactDirectory={projectSaveFile.contactDirectory}
            />
          ))}
          <button id="add-assignment-button" onClick={createNewAssignment}>
            add new assignment...
          </button>
        </div>
        <div id="production-assignment-button-row">
          <button className="menu-close-button" onClick={hideSettings}>
            Close
          </button>
          <button
            className="menu-save-button"
            onClick={saveProductionAssignments}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductionAssignments;
