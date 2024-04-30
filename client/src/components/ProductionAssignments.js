import React from "react";
import "../styles/ProductionAssignments.css";
import {
  useProject,
  UPDATE_PROJECT_SAVE_FILE,
  UPDATE_PROJECT_SAVE_STATUS,
} from "./Contexts/ProjectContext.js";
import { useSettings } from "./Contexts/SettingsContext.js";

const ProductionAssignments = () => {
  const { hideSettings } = useSettings();
  const { state, dispatch } = useProject();
  const { projectSaveFile } = state;

  const saveProductionAssignments = () => {
    const newAssignment = {
      //   department,
      //   role,
      //   assignee,
      //   email,
    };

    const updatedAssignments = [
      ...projectSaveFile.productionAssignments,
      newAssignment,
    ];

    dispatch({
      type: UPDATE_PROJECT_SAVE_FILE,
      payload: {
        productionAssignments: updatedAssignments,
        // characterList: updatedCharacterList,
        // for the above, when a new assignee is added to the Cast or Understudy department, the characterList should be updated to include the new assignee's name
      },
    });

    dispatch({
      type: UPDATE_PROJECT_SAVE_STATUS,
      payload: false,
    });
    hideSettings();
  };

  const enterAssignee = () => {
    //I want this to be an input that someone can begin entering a name and it will auto populate with names from the contact list
    // the contact list is the array in projectSaveFile.contactDirectory, and it should allow for firstName or lastName to be entered
    //and when selected, it should then display both firstName and lastName in the production-assignment-assignee div, as well as the email in the production-assignment-email div
    // there should be a check here for the boolean hasEmailAddress, and if it is false, then a warning should be displayed in the production-assignment-email div
  };

  const createNewAssignment = () => {
    //logic here should create a new blank "production-assignment-entry" div in the production-assignment-table
    // the department should be a dropdown with the options "cast", "understudy", "crew", "other" for now
    // the role should be an input field
    // the assignee should be an input field that allows for auto-population from the contact list (see enterAssignee)
  };
  return (
    <div className="modal-background-overlay">
      <div id="production-assignment-modal-window">
        <div id="production-assignment-title">Production Assignments</div>
        <div id="production-assignment-table">
          {projectSaveFile.characterList?.map((role, index) => (
            <div key={index} className="production-assignment-entry">
              <div className="production-assignment-department">Cast </div>
              <div className="production-assignment-role">"{role}"</div>
              <div
                className="production-assignment-assignee"
                onClick={enterAssignee}
              ></div>
              <div className="production-assignment-email"></div>
            </div>
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
