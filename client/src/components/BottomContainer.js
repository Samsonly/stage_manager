import React, { useEffect } from "react";

function BottomContainer({
  onToggleTaskSection,
  showTaskSection,
  setShowTaskSection,
  activeTaskTab,
  setActiveTaskTab,
  taskTabs,
  setTaskTabs,
}) {
  useEffect(() => {
    onToggleTaskSection(showTaskSection);
  }, [showTaskSection, onToggleTaskSection]);

  const handleTaskButtonClick = (taskName) => {
    if (taskName === activeTaskTab) {
      handleMinButtonClick(taskName);
    } else {
      setShowTaskSection(true);
      setActiveTaskTab(taskName);

      if (!taskTabs.includes(taskName)) {
        setTaskTabs([...taskTabs, taskName]);
      }
    }
  };

  const handleMinButtonClick = (taskName) => {
    const newTaskTabs = taskTabs.filter((tab) => tab !== taskName);
    setTaskTabs(newTaskTabs);

    if (taskName === activeTaskTab) {
      setActiveTaskTab(newTaskTabs[0] || null);
    }

    if (newTaskTabs.length === 0) {
      setShowTaskSection(false);
    }
  };

  const taskButtons = [
    "Line Notes",
    "To-Do Items",
    "Report Notes",
    "Calendar",
    "Placeholder 1",
    "Placeholder 2",
    "Placeholder 3",
    "Placeholder 4",
  ];

  return (
    <div
      className="bottom-container"
      style={{
        width: "100%",
        minHeight: "20px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgb(135, 74, 0)",
      }}
    >
      {showTaskSection && (
        <div
          className="task-section"
          style={{
            flex: 1,
            backgroundColor: "rgb(174, 84, 0)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            className="task-tab-bar"
            style={{
              height: "30px",
              backgroundColor: "rgb(116, 38, 19)",
              display: "flex",
              alignItems: "center",
              overflowX: "auto",
            }}
          >
            {taskTabs.map((tabName) => (
              <div
                key={tabName}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "nowrap",
                  padding: "4px",
                  marginRight: "10px",
                  height: "25px",
                  minWidth: "50px",
                  fontSize: "12px",
                  color: "white",
                  paddingLeft: "10px",
                }}
              >
                <div
                  style={{
                    textDecoration:
                      tabName === activeTaskTab ? "underline" : "none",
                    // textDecorationColor: "Color Goes Here",
                    textUnderlineOffset: "2px",
                  }}
                >
                  {tabName}
                  <button
                    onClick={() => handleMinButtonClick(tabName)}
                    style={{
                      marginLeft: "-3px",
                      marginTop: "-5px",
                      color: "white",
                      background: "none",
                      border: "none",
                      visibility:
                        tabName === activeTaskTab ? "visible" : "hidden",
                    }}
                  >
                    ⌄
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div
            className="task-view"
            style={{
              flex: 1,
              fontSize: "30px",
              backgroundColor: "Red",
              paddingLeft: "10px",
              paddingTop: "10px",
              overflow: "auto",
            }}
          >
            {activeTaskTab && `${activeTaskTab} Content`}
          </div>
        </div>
      )}
      <div
        className="task-bar"
        style={{
          height: "20px",
          backgroundColor: "Gold",
          display: "flex",
          alignItems: "center",
          boxSizing: "border-box",
          padding: "0px",
        }}
      >
        {taskButtons.map((buttonLabel) => (
          <div
            key={buttonLabel}
            onClick={() => handleTaskButtonClick(buttonLabel)}
            style={{
              flex: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
              whiteSpace: "nowrap",
              border: "1px solid black",
              backgroundColor: "Yellow",
              overflow: "hidden",
              color: "black",
              padding: "0 4px",
              fontSize: "12px",
            }}
          >
            {buttonLabel}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BottomContainer;