import React, { useState } from "react";
import { useSettings } from "../contexts/SettingsContext.js";
import {
  useGlobal,
  UPDATE_PROJECT_ACTIVE_STATUS,
} from "../contexts/GlobalContext.js";
import { useProject } from "../contexts/ProjectContext.js";
import CharacterList from "./CharacterList.js";
import ContactDatabase from "./ContactDatabase.js";
import CustomConfirm from "../containers/CustomConfirm.js";
import EndRehearsal from "./EndRehearsal.js";
import OpenProject from "./OpenProject";
import ProductionAssignments from "./ProductionAssignments.js";
import UploadScript from "./UploadScript.js";
import ViewLineNotes from "./ViewLineNotes.js";
import { saveProjectData } from "../utils/saveProjectUtil.js";
import "../styles/NavigationBar.css";

function NavigationBar() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { showSettings, hideSettings } = useSettings();
  const { dispatch: dispatchGlobal } = useGlobal();
  const { state: projectState } = useProject();
  const { isProjectSaved, projectSaveFile } = projectState;
  const uploadScript = UploadScript();
  const openProject = OpenProject();

  const handleDropdown = (itemId) => {
    setActiveDropdown(itemId);
  };

  const handleNewProjectProcess = () => {
    dispatchGlobal({ type: UPDATE_PROJECT_ACTIVE_STATUS, payload: false });
    setTimeout(() => {
      dispatchGlobal({ type: UPDATE_PROJECT_ACTIVE_STATUS, payload: true });
    }, 100);
  };

  const handleNewProjectClick = (callback) => {
    const confirmAndSave = (retry = false) => {
      const message = retry
        ? `Failed to save ${projectSaveFile.projectName}. Try again?`
        : `You have unsaved changes in ${projectSaveFile.projectName}. Do you want to save before creating a new project?`;

      showSettings(CustomConfirm, {
        message,
        onNo: () => {
          hideSettings();
          if (!retry) {
            callback();
          }
        },
        onYes: () => {
          saveProjectData(projectState.projectSaveFile)
            .then(() => {
              hideSettings();
              callback();
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
      callback();
    }
  };

  const handleItemClick = (e, item) => {
    e.stopPropagation();
    setActiveDropdown(null);
    switch (item) {
      case "Character List":
        showSettings(CharacterList);
        break;
      case "Contact List":
        showSettings(ContactDatabase);
        break;
      case "End Rehearsal":
        showSettings(EndRehearsal);
        break;
      case "New Project":
        handleNewProjectClick(handleNewProjectProcess);
        break;
      case "Open Project":
        handleNewProjectClick(openProject);
        break;
      case "Production Assignments":
        showSettings(ProductionAssignments);
        break;
      case "Save Project":
        saveProjectData(projectState.projectSaveFile);
        break;
      case "Upload Script":
        uploadScript();
        break;
      case "View Line Notes":
        showSettings(ViewLineNotes);
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
              onClick={(e) => handleItemClick(e, "New Project")}
            >
              New Project
            </div>
            <div
              className="dditem"
              id="dd1item2"
              onClick={(e) => handleItemClick(e, "Open Project")}
            >
              Open Project
            </div>
            <div
              className="dditem"
              id="dd1item3"
              onClick={(e) => handleItemClick(e, "Save Project")}
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
            <div
              className="dditem"
              id="dd2item1"
              onClick={(e) => handleItemClick(e, "Upload Script")}
            >
              Upload Script
            </div>
            <div className="dditem" id="dd2item2">
              Edit Script
            </div>
            <div className="dditem" id="dd2item3">
              Placeholder 3
            </div>
            <div className="dditem" id="dd2item4">
              Placeholder 4
            </div>
            <div
              className="dditem"
              id="dd2item5"
              onClick={(e) => handleItemClick(e, "Character List")}
            >
              Character List
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
            <div
              className="dditem"
              id="dd4item10"
              onClick={(e) => handleItemClick(e, "End Rehearsal")}
            >
              End Rehearsal
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
        Reports
        {activeDropdown === 6 && (
          <div className="dropdown-content">
            <div
              className="dditem"
              id="dd6item1"
              onClick={(e) => handleItemClick(e, "View Line Notes")}
            >
              Line Notes
            </div>
            <div className="dditem" id="dd6item2">
              Rehearsal Reports
            </div>
            <div className="dditem" id="dd6item3">
              Performance Reports
            </div>
            <div className="dditem" id="dd6item4">
              Production Meeting Notes
            </div>
            <div className="dditem" id="dd6item5">
              Tech Week Notes
            </div>
            <div className="dditem" id="dd6item6">
              Daily Call
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
              [Equity]
            </div>
          </div>
        )}
      </div>
      <div
        className="nav-bar-item"
        id="nb-item-7"
        onClick={() => handleDropdown(7)}
        onMouseOver={() => activeDropdown && handleDropdown(7)}
      >
        Help
        {activeDropdown === 7 && (
          <div className="dropdown-content">
            <div className="dditem" id="dd7item1">
              Placeholder 1
            </div>
            <div className="dditem" id="dd7item2">
              Placeholder 2
            </div>
            <div className="dditem" id="dd7item3">
              Placeholder 3
            </div>
            <div className="dditem" id="dd7item4">
              Placeholder 4
            </div>
            <div className="dditem" id="dd7item5">
              Placeholder 5
            </div>
            <div className="dditem" id="dd7item6">
              Placeholder 6
            </div>
            <div className="dditem" id="dd7item7">
              Placeholder 7
            </div>
            <div className="dditem" id="dd7item8">
              Placeholder 8
            </div>
            <div className="dditem" id="dd7item9">
              Placeholder 9
            </div>
            <div className="dditem" id="dd7item10">
              Placeholder 10
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavigationBar;
