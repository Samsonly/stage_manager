import React from "react";
import {
  useProject,
  SET_TASK_TABS,
  SET_TASK_SECTION_VISIBILITY,
  SET_ACTIVE_TASK_TAB,
} from "../contexts/ProjectContext.js";
import "../styles/BottomContainer.css";

function BottomContainer() {
  const { state, dispatch } = useProject();
  const { isTaskSectionVisible, activeTaskTab, taskTabs } = state;

  const handleMinButtonClick = (taskName) => {
    const newTaskTabs = taskTabs.filter((tab) => tab !== taskName);
    dispatch({ type: SET_TASK_TABS, payload: newTaskTabs });
    if (taskName === activeTaskTab) {
      const newActiveTab = newTaskTabs.length > 0 ? newTaskTabs[0] : null;
      dispatch({ type: SET_ACTIVE_TASK_TAB, payload: newActiveTab });
    }
    if (newTaskTabs.length === 0) {
      dispatch({ type: SET_TASK_SECTION_VISIBILITY, payload: false });
    }
  };

  const handleTaskButtonClick = (taskName) => {
    if (!taskTabs.includes(taskName)) {
      const updatedTaskTabs = [...taskTabs, taskName];
      dispatch({ type: SET_TASK_TABS, payload: updatedTaskTabs });
    }

    dispatch({ type: SET_ACTIVE_TASK_TAB, payload: taskName });

    if (!isTaskSectionVisible) {
      dispatch({ type: SET_TASK_SECTION_VISIBILITY, payload: true });
    }

    if (taskName === activeTaskTab && isTaskSectionVisible) {
      handleMinButtonClick(taskName);
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
    <div id="bottom-container">
      {isTaskSectionVisible && (
        <div id="task-section">
          <div id="task-tab-bar">
            {taskTabs.map((tabName) => (
              <div
                key={tabName}
                className={`task-tab ${
                  tabName === activeTaskTab ? "active" : ""
                }`}
              >
                <div>
                  {tabName}
                  <button onClick={() => handleMinButtonClick(tabName)}>
                    ⌄
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div id="task-view">
            {activeTaskTab && `${activeTaskTab} Content`}
          </div>
        </div>
      )}
      <div id="task-bar">
        {taskButtons.map((buttonLabel) => (
          <div
            className="task-button"
            key={buttonLabel}
            onClick={() => handleTaskButtonClick(buttonLabel)}
          >
            {buttonLabel}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BottomContainer;
