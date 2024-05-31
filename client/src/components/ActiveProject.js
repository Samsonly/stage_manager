import React from "react";
import { SettingsProvider } from "../contexts/SettingsContext";
import ProjectWindow from "./ProjectWindow";

function ActiveProject() {
  return (
    <SettingsProvider>
      <ProjectWindow />
    </SettingsProvider>
  );
}

export default ActiveProject;
