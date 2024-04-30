import React, { createContext, useContext, useState } from "react";

const SettingsContext = createContext();

export function useSettings() {
  return useContext(SettingsContext);
}

export const SettingsProvider = ({ children }) => {
  const [modalStack, setModalStack] = useState([]);

  const showSettings = (Component, props = {}) => {
    const ModalComponent = <Component key={modalStack.length} {...props} />;
    setModalStack([...modalStack, ModalComponent]);
  };

  const hideSettings = () => {
    setModalStack((prevStack) => prevStack.slice(0, prevStack.length - 1));
  };

  return (
    <SettingsContext.Provider value={{ showSettings, hideSettings }}>
      {children}
      {modalStack.length > 0 && modalStack[modalStack.length - 1]}
    </SettingsContext.Provider>
  );
};
