function generatePlayContent(scriptJson) {
  const playContainer = document.createElement("div");
  playContainer.className = "playStructure";

  const playTitle = document.createElement("div");
  playTitle.className = "playTitle";
  playTitle.textContent = scriptJson.playTitle;
  playTitle.id = "playTitle";
  //fix above
  playContainer.appendChild(playTitle);

  const playDescription = document.createElement("div");
  playDescription.className = "playDescription";
  playDescription.textContent = scriptJson.playDescription;
  playContainer.appendChild(playDescription);

  const actStructure = document.createElement("div");
  actStructure.className = "actStructure";
  playContainer.appendChild(actStructure);

  scriptJson.actStructure.forEach((act, actIndex) => {
    const actDiv = document.createElement("div");
    actDiv.className = "act";

    const actTitle = document.createElement("div");
    actTitle.className = "actTitle";
    actTitle.textContent = act.actTitle;
    actTitle.id = "actTitle" + actIndex;
    actDiv.appendChild(actTitle);

    const actDescription = document.createElement("div");
    actDescription.className = "actDescription";
    actDescription.textContent = act.actDescription;
    actDiv.appendChild(actDescription);

    const sceneStructure = document.createElement("div");
    sceneStructure.className = "sceneStructure";
    actDiv.appendChild(sceneStructure);

    act.sceneStructure.forEach((scene, sceneIndex) => {
      const sceneDiv = document.createElement("div");
      sceneDiv.className = "scene";

      const sceneTitle = document.createElement("div");
      sceneTitle.className = "sceneTitle";
      sceneTitle.textContent = scene.sceneTitle;
      sceneTitle.id = "sceneTitle" + actIndex + sceneIndex;
      sceneDiv.appendChild(sceneTitle);

      const sceneLocation = document.createElement("div");
      sceneLocation.className = "sceneLocation";
      sceneLocation.textContent = scene.sceneLocation;
      sceneDiv.appendChild(sceneLocation);

      const sceneDescription = document.createElement("div");
      sceneDescription.className = "sceneDescription";
      sceneDescription.textContent = scene.sceneDescription;
      sceneDiv.appendChild(sceneDescription);

      const internalSceneStructure = document.createElement("div");
      internalSceneStructure.className = "internalSceneStructure";
      sceneDiv.appendChild(internalSceneStructure);

      scene.internalSceneStructure.forEach((content) => {
        const contentDiv = document.createElement("div");

        if (content.stgdContent) {
          contentDiv.className = "stgdContent";
          content.stgdContent.forEach((item) => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "stageDirections";
            itemDiv.textContent = item.tagContent;
            contentDiv.appendChild(itemDiv);
          });
        } else if (content.characterContent) {
          contentDiv.className = "characterContent";

          const nameDiv = document.createElement("div");
          const characterName = content.characterContent.characterName;
          nameDiv.className =
            "characterName " + characterName.toLowerCase().slice(0, -1);
          nameDiv.textContent = characterName;
          contentDiv.appendChild(nameDiv);

          content.characterContent.characterAction.forEach((action) => {
            const actionDiv = document.createElement("div");
            if (action.tagType === "d") {
              actionDiv.className = "characterDialogue";
              actionDiv.textContent = action.tagContent;
            } else if (action.tagType === "cdir") {
              actionDiv.className = "characterDirection";
              actionDiv.textContent = action.tagContent;
            }
            contentDiv.appendChild(actionDiv);
          });
        }
        internalSceneStructure.appendChild(contentDiv);
      });

      const sceneEnding = document.createElement("div");
      sceneEnding.className = "sceneEnding";
      sceneEnding.textContent = scene.sceneEnding;
      sceneDiv.appendChild(sceneEnding);

      sceneStructure.appendChild(sceneDiv);
    });

    const actEnding = document.createElement("div");
    actEnding.className = "actEnding";
    actEnding.textContent = act.actEnding;
    actDiv.appendChild(actEnding);

    actStructure.appendChild(actDiv);
  });

  const playEnding = document.createElement("div");
  playEnding.className = "playEnding";
  playEnding.textContent = scriptJson.playEnding;
  playContainer.appendChild(playEnding);

  scriptContent.appendChild(playContainer);
}
