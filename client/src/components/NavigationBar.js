import React, { useState } from "react";
import { useSettings } from "./Contexts/SettingsContext.js";
import {
  useGlobal,
  UPDATE_PROJECT_ACTIVE_STATUS,
} from "./Contexts/GlobalContext.js";
import { useProject } from "./Contexts/ProjectContext.js";
import CharacterList from "./CharacterList.js";
import ContactDatabase from "./ContactDatabase.js";
import CustomConfirm from "./Modals/CustomConfirm.js";
import { saveProjectData } from "./Utils/saveProjectUtil";
import "../styles/NavigationBar.css";
import ProductionAssignments from "./ProductionAssignments.js";

function NavigationBar() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { showSettings } = useSettings();
  const { dispatch: dispatchGlobal } = useGlobal();
  const { state: projectState } = useProject();
  const { isProjectSaved, projectSaveFile } = projectState;

  const handleDropdown = (itemId) => {
    setActiveDropdown(itemId);
  };

  const handleNewProjectProcess = () => {
    dispatchGlobal({ type: UPDATE_PROJECT_ACTIVE_STATUS, payload: false });
    setTimeout(() => {
      dispatchGlobal({ type: UPDATE_PROJECT_ACTIVE_STATUS, payload: true });
    }, 100);
  };

  const handleNewProjectClick = () => {
    const confirmAndSave = (retry = false) => {
      const message = retry
        ? `Failed to save ${projectSaveFile.projectName}. Try again?`
        : `You have unsaved changes in ${projectSaveFile.projectName}. Do you want to save before creating a new project?`;

      showSettings(CustomConfirm, {
        message,
        onNo: () => {
          showSettings(null);
          if (!retry) {
            handleNewProjectProcess();
          }
        },
        onYes: () => {
          saveProjectData(projectState.projectSaveFile)
            .then(() => {
              showSettings(null);
              handleNewProjectProcess();
            })
            .catch((error) => {
              console.error("Error saving the project:", error);
              confirmAndSave(true);
            });
        },
      });
    };

    if (!isProjectSaved) {
      confirmAndSave();
    } else {
      handleNewProjectProcess();
    }
  };

  const handleItemClick = (e, item) => {
    e.stopPropagation();
    setActiveDropdown(null);
    switch (item) {
      case "CharacterList":
        showSettings(CharacterList);
        break;
      case "NewProject":
        handleNewProjectClick();
        break;
      case "SaveProject":
        saveProjectData(projectState.projectSaveFile);
        break;
      case "Contact List":
        showSettings(ContactDatabase);
        break;
      case "Production Assignments":
        showSettings(ProductionAssignments);

        break;
      default:
        break;
    }
  };

  return (
    <div id="nav-bar">
      <div
        className="nav-bar-item"
        id="nb-item-1"
        onClick={() => handleDropdown(1)}
        onMouseOver={() => activeDropdown && handleDropdown(1)}
      >
        Project
        {activeDropdown === 1 && (
          <div className="dropdown-content">
            <div
              className="dditem"
              id="dd1item1"
              onClick={(e) => handleItemClick(e, "NewProject")}
            >
              New Project
            </div>
            <div className="dditem" id="dd1item2">
              Open Project
            </div>
            <div
              className="dditem"
              id="dd1item3"
              onClick={(e) => handleItemClick(e, "SaveProject")}
            >
              Save Project
            </div>
            <div className="dditem" id="dd1item4">
              Save Project As
            </div>
            <div className="dditem" id="dd1item5">
              Placeholder 5
            </div>
            <div className="dditem" id="dd1item6">
              Placeholder 6
            </div>
            <div className="dditem" id="dd1item7">
              Placeholder 7
            </div>
            <div className="dditem" id="dd1item8">
              Placeholder 8
            </div>
            <div className="dditem" id="dd1item9">
              Placeholder 9
            </div>
            <div className="dditem" id="dd1item10">
              Placeholder 10
            </div>
          </div>
        )}
      </div>
      <div
        className="nav-bar-item"
        id="nb-item-2"
        onClick={() => handleDropdown(2)}
        onMouseOver={() => activeDropdown && handleDropdown(2)}
      >
        Content
        {activeDropdown === 2 && (
          <div className="dropdown-content">
            <div className="dditem" id="dd2item1">
              Edit Script
            </div>
            <div
              className="dditem"
              id="dd2item2"
              onClick={(e) => handleItemClick(e, "CharacterList")}
            >
              Character List
            </div>
            <div className="dditem" id="dd2item3">
              Placeholder 3
            </div>
            <div className="dditem" id="dd2item4">
              Placeholder 4
            </div>
            <div className="dditem" id="dd2item5">
              Placeholder 5
            </div>
            <div className="dditem" id="dd2item6">
              Placeholder 6
            </div>
            <div className="dditem" id="dd2item7">
              Placeholder 7
            </div>
            <div className="dditem" id="dd2item8">
              Placeholder 8
            </div>
            <div className="dditem" id="dd2item9">
              Placeholder 9
            </div>
            <div className="dditem" id="dd2item10">
              Placeholder 10
            </div>
          </div>
        )}
      </div>
      <div
        className="nav-bar-item"
        id="nb-item-3"
        onClick={() => handleDropdown(3)}
        onMouseOver={() => activeDropdown && handleDropdown(3)}
      >
        Team
        {activeDropdown === 3 && (
          <div className="dropdown-content">
            <div
              className="dditem"
              id="dd3item1"
              onClick={(e) => handleItemClick(e, "Contact List")}
            >
              Contact List
            </div>
            <div
              className="dditem"
              id="dd3item2"
              onClick={(e) => handleItemClick(e, "Production Assignments")}
            >
              Production Assignments
            </div>
            <div className="dditem" id="dd3item3">
              Placeholder 3
            </div>
            <div className="dditem" id="dd3item4">
              Placeholder 4
            </div>
            <div className="dditem" id="dd3item5">
              Placeholder 5
            </div>
            <div className="dditem" id="dd3item6">
              Placeholder 6
            </div>
            <div className="dditem" id="dd3item7">
              Placeholder 7
            </div>
            <div className="dditem" id="dd3item8">
              Placeholder 8
            </div>
            <div className="dditem" id="dd3item9">
              Placeholder 9
            </div>
            <div className="dditem" id="dd3item10">
              Settings
            </div>
          </div>
        )}
      </div>
      <div
        className="nav-bar-item"
        id="nb-item-4"
        onClick={() => handleDropdown(4)}
        onMouseOver={() => activeDropdown && handleDropdown(4)}
      >
        Rehearsal
        {activeDropdown === 4 && (
          <div className="dropdown-content">
            <div className="dditem" id="dd4item1">
              Placeholder 1
            </div>
            <div className="dditem" id="dd4item2">
              Placeholder 2
            </div>
            <div className="dditem" id="dd4item3">
              Placeholder 3
            </div>
            <div className="dditem" id="dd4item4">
              Placeholder 4
            </div>
            <div className="dditem" id="dd4item5">
              Placeholder 5
            </div>
            <div className="dditem" id="dd4item6">
              Placeholder 6
            </div>
            <div className="dditem" id="dd4item7">
              Placeholder 7
            </div>
            <div className="dditem" id="dd4item8">
              Placeholder 8
            </div>
            <div className="dditem" id="dd4item9">
              Placeholder 9
            </div>
            <div className="dditem" id="dd4item10">
              Placeholder 10
            </div>
          </div>
        )}
      </div>
      <div
        className="nav-bar-item"
        id="nb-item-5"
        onClick={() => handleDropdown(5)}
        onMouseOver={() => activeDropdown && handleDropdown(5)}
      >
        Schedule
        {activeDropdown === 5 && (
          <div className="dropdown-content">
            <div className="dditem" id="dd5item1">
              Placeholder 1
            </div>
            <div className="dditem" id="dd5item2">
              Placeholder 2
            </div>
            <div className="dditem" id="dd5item3">
              Placeholder 3
            </div>
            <div className="dditem" id="dd5item4">
              Placeholder 4
            </div>
            <div className="dditem" id="dd5item5">
              Placeholder 5
            </div>
            <div className="dditem" id="dd5item6">
              Placeholder 6
            </div>
            <div className="dditem" id="dd5item7">
              Placeholder 7
            </div>
            <div className="dditem" id="dd5item8">
              Placeholder 8
            </div>
            <div className="dditem" id="dd5item9">
              Placeholder 9
            </div>
            <div className="dditem" id="dd5item10">
              Placeholder 10
            </div>
          </div>
        )}
      </div>
      <div
        className="nav-bar-item"
        id="nb-item-6"
        onClick={() => handleDropdown(6)}
        onMouseOver={() => activeDropdown && handleDropdown(6)}
      >
        Help
        {activeDropdown === 6 && (
          <div className="dropdown-content">
            <div className="dditem" id="dd6item1">
              Placeholder 1
            </div>
            <div className="dditem" id="dd6item2">
              Placeholder 2
            </div>
            <div className="dditem" id="dd6item3">
              Placeholder 3
            </div>
            <div className="dditem" id="dd6item4">
              Placeholder 4
            </div>
            <div className="dditem" id="dd6item5">
              Placeholder 5
            </div>
            <div className="dditem" id="dd6item6">
              Placeholder 6
            </div>
            <div className="dditem" id="dd6item7">
              Placeholder 7
            </div>
            <div className="dditem" id="dd6item8">
              Placeholder 8
            </div>
            <div className="dditem" id="dd6item9">
              Placeholder 9
            </div>
            <div className="dditem" id="dd6item10">
              Placeholder 10
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavigationBar;
