import React, { createContext, useReducer, useContext } from "react";

export const GlobalContext = createContext();
export const SET_TASK_TABS = "SET_TASK_TABS";
export const SET_TASK_SECTION_VISIBILITY = "SET_TASK_SECTION_VISIBILITY";
export const SET_ACTIVE_TASK_TAB = "SET_ACTIVE_TASK_TAB";
export const SET_INVERTED_LAYOUT = "SET_INVERTED_LAYOUT";
export const SET_LEFT_IS_EXPANDED = "SET_LEFT_IS_EXPANDED";
export const SET_RIGHT_IS_EXPANDED = "SET_RIGHT_IS_EXPANDED";
export const SET_CURRENT_VIEW = "SET_CURRENT_VIEW";
export const SET_SCRIPT_DATA = "SET_SCRIPT_DATA";
export const SET_LEFT_BUTTONS_VISIBLE = "SET_LEFT_BUTTONS_VISIBLE";
export const SET_SCRIPT_SCROLL_POSITION = "SET_SCRIPT_SCROLL_POSITION";
export const STORE_GROUNDPLAN_MODEL = "STORE_GROUNDPLAN_MODEL";
export const SET_GROUNDPLAN_VISIBLE = "SET_GROUNDPLAN_VISIBLE";
export const SET_GROUNDPLAN_VIEW = "SET_GROUNDPLAN_VIEW";

const globalReducer = (state, action) => {
  switch (action.type) {
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
    case SET_CURRENT_VIEW:
      return { ...state, currentView: action.payload };
    case SET_SCRIPT_DATA:
      return { ...state, scriptData: action.payload };
    case SET_LEFT_BUTTONS_VISIBLE:
      return { ...state, leftButtonsVisible: action.payload };
    case SET_SCRIPT_SCROLL_POSITION:
      return { ...state, scriptScrollPosition: action.payload };
    case STORE_GROUNDPLAN_MODEL:
      return { ...state, groundplanModel: action.payload };
    case SET_GROUNDPLAN_VISIBLE:
      return { ...state, isGroundplanVisible: action.payload };
    case SET_GROUNDPLAN_VIEW:
      return { ...state, groundplanView: action.payload };
    default:
      return state;
  }
};

const initialState = {
  isTaskSectionVisible: false,
  activeTaskTab: null,
  taskTabs: [],
  layoutIsInverted: false,
  leftIsExpanded: false,
  rightIsExpanded: false,
  currentView: "baseView",
  scriptData: null,
  leftButtonsVisible: false,
  scriptScrollPosition: 0,
  groundplanModel: null,
  isGroundplanVisible: false,
  groundplanView: null,
};

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
