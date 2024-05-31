import React, { createContext, useReducer, useContext } from "react";

export const ProjectContext = createContext();
export const UPDATE_PROJECT_SAVE_FILE = "UPDATE_PROJECT_SAVE_FILE";
export const UPDATE_PROJECT_SAVE_STATUS = "UPDATE_PROJECT_SAVE_STATUS";
export const SET_VERTICAL_PANE_SIZES = "SET_VERTICAL_PANE_SIZES";
export const SET_HORIZONTAL_PANE_SIZES = "SET_HORIZONTAL_PANE_SIZES";
export const SET_TASK_TABS = "SET_TASK_TABS";
export const SET_TASK_SECTION_VISIBILITY = "SET_TASK_SECTION_VISIBILITY";
export const SET_ACTIVE_TASK_TAB = "SET_ACTIVE_TASK_TAB";
export const SET_INVERTED_LAYOUT = "SET_INVERTED_LAYOUT";
export const SET_LEFT_IS_EXPANDED = "SET_LEFT_IS_EXPANDED";
export const SET_RIGHT_IS_EXPANDED = "SET_RIGHT_IS_EXPANDED";
export const SET_CURRENT_SCRIPT_VIEW = "SET_CURRENT_SCRIPT_VIEW";
export const SET_LEFT_BUTTONS_VISIBLE = "SET_LEFT_BUTTONS_VISIBLE";
export const SET_SCRIPT_SCROLL_POSITION = "SET_SCRIPT_SCROLL_POSITION";
export const SET_RENDER_FUNCTION = "SET_RENDER_FUNCTION";
export const STORE_GROUNDPLAN_FILE = "STORE_GROUNDPLAN_FILE";
export const SET_GROUNDPLAN_MODEL = "SET_GROUNDPLAN_MODEL";
export const SET_OBJECT_SIZE = "SET_OBJECT_SIZE";
export const SET_CURRENT_DESIGN_VIEW = "SET_CURRENT_DESIGN_VIEW";
export const SET_CAMERA_PARAMETERS = "SET_CAMERA_PARAMETERS";

const projectReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_PROJECT_SAVE_FILE:
      return {
        ...state,
        projectSaveFile: { ...state.projectSaveFile, ...action.payload },
      };
    case UPDATE_PROJECT_SAVE_STATUS:
      return { ...state, isProjectSaved: action.payload };
    case SET_VERTICAL_PANE_SIZES:
      return { ...state, verticalPaneSizes: action.payload };
    case SET_HORIZONTAL_PANE_SIZES:
      return { ...state, horizontalPaneSizes: action.payload };
    case SET_TASK_TABS:
      return { ...state, taskTabs: action.payload };
    case SET_TASK_SECTION_VISIBILITY:
      return { ...state, isTaskSectionVisible: action.payload };
    case SET_ACTIVE_TASK_TAB:
      return { ...state, activeTaskTab: action.payload };
    case SET_INVERTED_LAYOUT:
      return { ...state, layoutIsInverted: action.payload };
    case SET_LEFT_IS_EXPANDED:
      return { ...state, leftIsExpanded: action.payload };
    case SET_RIGHT_IS_EXPANDED:
      return { ...state, rightIsExpanded: action.payload };
    case SET_CURRENT_SCRIPT_VIEW:
      return { ...state, currentScriptView: action.payload };
    case SET_LEFT_BUTTONS_VISIBLE:
      return { ...state, leftButtonsVisible: action.payload };
    case SET_SCRIPT_SCROLL_POSITION:
      return { ...state, scriptScrollPosition: action.payload };
    case SET_RENDER_FUNCTION:
      return { ...state, renderFunction: action.payload };
    case STORE_GROUNDPLAN_FILE:
      return { ...state, groundplanFile: action.payload };
    case SET_GROUNDPLAN_MODEL:
      return { ...state, scene: action.payload };
    case SET_OBJECT_SIZE:
      return { ...state, objectSize: action.payload };
    case SET_CURRENT_DESIGN_VIEW:
      return { ...state, currentDesignView: action.payload };
    case SET_CAMERA_PARAMETERS:
      return {
        ...state,
        cameraParameters: {
          position: action.payload.position,
          rotation: action.payload.rotation,
          view: action.payload.view,
        },
      };
    default:
      return state;
  }
};

const initialState = {
  projectSaveFile: {
    projectName: "",
    script: {},
    characterList: [],
    contactDirectory: [],
    productionAssignments: [],
    lineNotes: [],
  },
  isProjectSaved: false,
  verticalPaneSizes: [50, 50],
  horizontalPaneSizes: [70, 30],
  isTaskSectionVisible: false,
  activeTaskTab: null,
  taskTabs: [],
  layoutIsInverted: false,
  leftIsExpanded: false,
  rightIsExpanded: false,
  currentScriptView: "baseView",
  leftButtonsVisible: false,
  scriptScrollPosition: 0,
  renderFunction: null,
  groundplanFile: null,
  scene: null,
  objectSize: { x: 0, y: 0, z: 0 },
  currentDesignView: "baseView",
  cameraParameters: {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    view: "",
  },
};

export const ProjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
