import React from "react";
import { useGlobal } from "./contexts/GlobalContext"; // Adjust path as necessary
import { ProjectProvider } from "./contexts/ProjectContext"; // Adjust path as necessary
import WelcomeScreen from "./components/WelcomeScreen";
import ActiveProject from "./components/ActiveProject";

function App() {
  const { state } = useGlobal();
  const { isProjectActive } = state;

  return (
    <div id="App">
      {!isProjectActive ? (
        <WelcomeScreen />
      ) : (
        <ProjectProvider>
          <ActiveProject />
        </ProjectProvider>
      )}
    </div>
  );
}

export default App;
