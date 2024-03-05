import React from "react";

function PlayContent({ scriptJson }) {
  return (
    <div className="playStructure">
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
