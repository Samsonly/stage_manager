// ScriptContext.js
import React, { createContext, useContext, useReducer } from "react";

export const ScriptContext = createContext();

const initialState = {
  // Initial state related to scripts
};

const scriptReducer = (state, action) => {
  // Reducer logic for scripts
};

export const ScriptProvider = ({ children }) => {
  const [state, dispatch] = useReducer(scriptReducer, initialState);

  return (
    <ScriptContext.Provider value={{ state, dispatch }}>
      {children}
    </ScriptContext.Provider>
  );
};

export const useScript = () => useContext(ScriptContext);
