import React, { createContext, useReducer, useContext } from "react";

export const GlobalContext = createContext();
export const UPDATE_PROJECT_ACTIVE_STATUS = "UPDATE_PROJECT_ACTIVE_STATUS";
export const SET_LOADING_TYPE = "SET_LOADING_TYPE";

const globalReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_PROJECT_ACTIVE_STATUS:
      return { ...state, isProjectActive: action.payload };
    case SET_LOADING_TYPE:
      return { ...state, loadingType: action.payload };
    default:
      return state;
  }
};

const initialState = {
  isProjectActive: false,
  loadingType: "",
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
