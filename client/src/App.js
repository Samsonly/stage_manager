import React, { useState, useContext } from "react";
import Split from "react-split";
import TopContainer from "./components/TopContainer";
import { GlobalContext } from "./components/GlobalContext";
import { MiddleProvider } from "./components/MiddleContext";
import MiddleContainer from "./components/MiddleContainer";
import BottomContainer from "./components/BottomContainer";
import GroundplanViewer from "./components/GroundplanViewer";
import "./App.css";

function App() {
  const { state } = useContext(GlobalContext);
  const { isTaskSectionVisible } = state;
  const [fileToView, setFileToView] = useState(null);
  const [snapshotUrl, setSnapshotUrl] = useState("");
  const [showViewer, setShowViewer] = useState(false);

  const handleFileSelect = (file) => {
    setFileToView(file);
    setShowViewer(true);
  };

  const handleSnapshot = (url) => {
    setSnapshotUrl(url);
    setShowViewer(false);
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

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
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
          <MiddleProvider>
            <MiddleContainer
              onFileSelect={handleFileSelect}
              snapshotUrl={snapshotUrl}
            />
          </MiddleProvider>
          <BottomContainer />
        </Split>
      ) : (
        <>
          <MiddleProvider>
            <MiddleContainer
              onFileSelect={handleFileSelect}
              snapshotUrl={snapshotUrl}
            />
          </MiddleProvider>
          <BottomContainer />
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
