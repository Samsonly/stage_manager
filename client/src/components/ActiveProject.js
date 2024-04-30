import React from "react";
import { SettingsProvider } from "./Contexts/SettingsContext";
import ProjectWindow from "./ProjectWindow";

function ActiveProject() {
  return (
    <SettingsProvider>
      <ProjectWindow />
    </SettingsProvider>
  );
}

export default ActiveProject;
