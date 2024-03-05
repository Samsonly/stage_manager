import React, { useState } from "react";
import Split from "react-split";
import TopContainer from "./components/TopContainer";
import MiddleContainer from "./components/MiddleContainer";
import BottomContainer from "./components/BottomContainer";
import "./App.css";

function App() {
  const [isTaskSectionVisible, setIsTaskSectionVisible] = useState(false);
  const [activeTaskTab, setActiveTaskTab] = useState(null);
  const [taskTabs, setTaskTabs] = useState([]);

  const verticalGutter = (index, direction) => {
    const gutterElement = document.createElement("div");
    gutterElement.className = "gutter";
    gutterElement.style.background =
      "linear-gradient(to bottom, lightgrey, black, lightgrey)";
    gutterElement.style.position = "relative";

    const beforeElement = document.createElement("div");
    beforeElement.style.content = '""';
    beforeElement.style.position = "absolute";
    beforeElement.style.top = "-3px";
    beforeElement.style.bottom = "-3px";
    beforeElement.style.left = "-3px";
    beforeElement.style.right = "-3px";
    beforeElement.style.zIndex = "10";

    gutterElement.appendChild(beforeElement);

    return gutterElement;
  };

  const handleToggleTaskSection = (isVisible) => {
    setIsTaskSectionVisible(isVisible);
    // Additional logic for handling the gutter visibility can be added here
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <TopContainer />
      {isTaskSectionVisible ? (
        <Split
          style={{ display: "flex", flexDirection: "column", flex: 1 }}
          sizes={[70, 30]}
          minSize={[0, 20]}
          gutterSize={5}
          gutter={verticalGutter}
          direction="vertical"
          cursor="row-resize"
        >
          <MiddleContainer />
          <BottomContainer
            onToggleTaskSection={handleToggleTaskSection}
            showTaskSection={isTaskSectionVisible}
            setShowTaskSection={setIsTaskSectionVisible}
            activeTaskTab={activeTaskTab}
            setActiveTaskTab={setActiveTaskTab}
            taskTabs={taskTabs}
            setTaskTabs={setTaskTabs}
          />
        </Split>
      ) : (
        <>
          <MiddleContainer style={{ flex: 1 }} />
          <BottomContainer
            onToggleTaskSection={handleToggleTaskSection}
            showTaskSection={isTaskSectionVisible}
            setShowTaskSection={setIsTaskSectionVisible}
            activeTaskTab={activeTaskTab}
            setActiveTaskTab={setActiveTaskTab}
            taskTabs={taskTabs}
            setTaskTabs={setTaskTabs}
          />{" "}
        </>
      )}
    </div>
  );
}

export default App;
