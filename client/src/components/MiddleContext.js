import React, { createContext, useReducer, useContext } from "react";

export const MiddleContext = createContext();
export const SET_INVERTED_LAYOUT = "SET_INVERTED_LAYOUT";
export const SET_LEFT_IS_EXPANDED = "SET_LEFT_IS_EXPANDED";
export const SET_RIGHT_IS_EXPANDED = "SET_RIGHT_IS_EXPANDED";
export const SET_CURRENT_VIEW = "SET_CURRENT_VIEW";
export const SET_SCRIPT_DATA = "SET_SCRIPT_DATA";

const middleReducer = (state, action) => {
  switch (action.type) {
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
    default:
      return state;
  }
};

const initialState = {
  layoutIsInverted: false,
  leftIsExpanded: false,
  rightIsExpanded: false,
  currentView: "baseView",
  scriptData: null,
};

export const MiddleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(middleReducer, initialState);

  return (
    <MiddleContext.Provider value={{ state, dispatch }}>
      {children}
    </MiddleContext.Provider>
  );
};

export const useMiddle = () => useContext(MiddleContext);
