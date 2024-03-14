// DesignContext.js
import React, { createContext, useContext, useReducer } from "react";

export const DesignContext = createContext();

const initialState = {
  // Initial state related to designs
};

const designReducer = (state, action) => {
  // Reducer logic for designs
};

export const DesignProvider = ({ children }) => {
  const [state, dispatch] = useReducer(designReducer, initialState);

  return (
    <DesignContext.Provider value={{ state, dispatch }}>
      {children}
    </DesignContext.Provider>
  );
};

export const useDesign = () => useContext(DesignContext);
