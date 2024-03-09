import React, { useState } from "react";
import Split from "react-split";
import TopContainer from "./components/TopContainer";
import MiddleContainer from "./components/MiddleContainer";
import BottomContainer from "./components/BottomContainer";
import GroundplanViewer from "./components/GroundplanViewer";
import "./App.css";

function App() {
  const [isTaskSectionVisible, setIsTaskSectionVisible] = useState(false);
  const [activeTaskTab, setActiveTaskTab] = useState(null);
  const [taskTabs, setTaskTabs] = useState([]);
  const [fileToView, setFileToView] = useState(null); // State to hold the selected .obj file
  const [snapshotUrl, setSnapshotUrl] = useState(""); // State to hold the snapshot URL
  const [showViewer, setShowViewer] = useState(false); // State to control the visibility of GroundplanViewer

  const handleFileSelect = (file) => {
    setFileToView(file);
    setShowViewer(true); // Open GroundplanViewer
  };

  const handleSnapshot = (url) => {
    setSnapshotUrl(url);
    setShowViewer(false); // Close GroundplanViewer after taking snapshot
  };

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
          <MiddleContainer
            onFileSelect={handleFileSelect}
            snapshotUrl={snapshotUrl}
          />
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
          <MiddleContainer
            onFileSelect={handleFileSelect}
            snapshotUrl={snapshotUrl}
          />
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
      {showViewer && (
        <GroundplanViewer
          file={fileToView}
          onClose={() => setShowViewer(false)}
          onSnapshot={handleSnapshot}
        />
      )}
    </div>
  );
}

export default App;
