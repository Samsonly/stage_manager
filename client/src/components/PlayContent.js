import React, { useEffect, useRef } from "react";
import LineNotes from "./LineNotes.js";
import {
  useProject,
  SET_SCRIPT_SCROLL_POSITION,
} from "../contexts/ProjectContext.js";
import { useSettings } from "../contexts/SettingsContext.js";

function PlayContent({ scriptJson }) {
  const { state, dispatch } = useProject();
  const { scriptScrollPosition } = state;
  const playContentRef = useRef(null);
  const { showSettings } = useSettings();

  useEffect(() => {
    const handleScroll = () => {
      if (playContentRef.current) {
        dispatch({
          type: SET_SCRIPT_SCROLL_POSITION,
          payload: playContentRef.current.scrollTop,
        });
      }
    };

    const playContentElement = playContentRef.current;
    playContentElement.addEventListener("scroll", handleScroll);

    return () => {
      playContentElement.removeEventListener("scroll", handleScroll);
    };
  }, [dispatch]);

  useEffect(() => {
    if (playContentRef.current) {
      playContentRef.current.scrollTop = scriptScrollPosition;
    }
  }, [scriptScrollPosition]);

  const handleShiftClick = (event, characterName, dialogue) => {
    if (event.shiftKey) {
      showSettings(LineNotes, {
        characterName: characterName.slice(0, -1),
        characterDialogue: dialogue.tagContent,
      });
    }
  };

  return (
    <div className="playStructure" ref={playContentRef}>
      <div className="playTitle" id="playTitle">
        {scriptJson.playTitle}
      </div>
      <div className="playDescription">{scriptJson.playDescription}</div>
      <div className="actStructure">
        {scriptJson.actStructure.map((act, actIndex) => (
          <div className="act" key={actIndex}>
            <div className="actTitle" id={`actTitle${actIndex}`}>
              {act.actTitle}
            </div>
            <div className="actDescription">{act.actDescription}</div>

            <div className="sceneStructure">
              {act.sceneStructure.map((scene, sceneIndex) => (
                <div className="scene" key={sceneIndex}>
                  <div
                    className="sceneTitle"
                    id={`sceneTitle${actIndex}${sceneIndex}`}
                  >
                    {scene.sceneTitle}
                  </div>
                  <div className="sceneLocation">{scene.sceneLocation}</div>
                  <div className="sceneDescription">
                    {scene.sceneDescription}
                  </div>

                  <div className="internalSceneStructure">
                    {scene.internalSceneStructure.map(
                      (content, contentIndex) => (
                        <div
                          key={contentIndex}
                          className={
                            content.stgdContent
                              ? "stgdContent"
                              : content.characterContent
                              ? "characterContent"
                              : ""
                          }
                          // onClick={(e) => handleShiftClick(e, content)}
                        >
                          {content.stgdContent &&
                            content.stgdContent.map((item, itemIndex) => (
                              <div key={itemIndex} className="stageDirections">
                                {item.tagContent}
                              </div>
                            ))}
                          {content.characterContent && (
                            <>
                              <div
                                className={`characterName ${content.characterContent.characterName
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")
                                  .slice(0, -1)}`}
                                key={contentIndex}
                              >
                                {content.characterContent.characterName}
                              </div>
                              {content.characterContent.characterAction.map(
                                (action, actionIndex) => (
                                  <div
                                    key={actionIndex}
                                    className={
                                      action.tagType === "d"
                                        ? "characterDialogue"
                                        : "characterDirection"
                                    }
                                    onClick={(e) =>
                                      handleShiftClick(
                                        e,
                                        content.characterContent.characterName,
                                        action
                                      )
                                    }
                                  >
                                    {action.tagContent}
                                  </div>
                                )
                              )}
                            </>
                          )}
                        </div>
                      )
                    )}
                  </div>

                  <div className="sceneEnding">{scene.sceneEnding}</div>
                </div>
              ))}
            </div>

            <div className="actEnding">{act.actEnding}</div>
          </div>
        ))}
      </div>

      <div className="playEnding">{scriptJson.playEnding}</div>
    </div>
  );
}

export default PlayContent;
