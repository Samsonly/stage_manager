import React from "react";
import PlayContent from "./PlayContent";
import CharacterList from "./CharacterList";
import TableOfContents from "./TableOfContents";
import {
  useGlobal,
  SET_CURRENT_VIEW,
  SET_SCRIPT_SCROLL_POSITION,
} from "./GlobalContext";
import "./ScriptView.css";

function ScriptView() {
  const { state, dispatch } = useGlobal();
  const { currentView, scriptData } = state;

  const onViewSection = (view, elementId) => {
    dispatch({ type: SET_CURRENT_VIEW, payload: view });
    if (view === "script") {
      // Ensure the script view is rendered and then scroll to the element
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          const scrollPosition = element.offsetTop;
          dispatch({
            type: SET_SCRIPT_SCROLL_POSITION,
            payload: scrollPosition,
          });
        }
      }, 0);
    }
  };

  switch (currentView) {
    case "baseView":
      return <div id="base-view">Script View</div>;
    case "script":
      return (
        <div id="script-view">
          <PlayContent scriptJson={scriptData} />
        </div>
      );
    case "characterList":
      return (
        <div id="script-view">
          <CharacterList />
        </div>
      );
    case "tableOfContents":
      return (
        <div id="script-view">
          <TableOfContents onViewSection={onViewSection} />
        </div>
      );
    default:
      return null;
  }
}

export default ScriptView;
