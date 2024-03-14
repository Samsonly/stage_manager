import React, { useContext } from "react";
import { GlobalContext } from "./GlobalContext";
import "./ScriptView.css";

const CharacterListView = () => {
  const { state } = useContext(GlobalContext);
  const { scriptData } = state;

  const extractCharacterNames = (data, names = []) => {
    data.forEach((item) => {
      if (item.characterContent && item.characterContent.characterName) {
        names.push(
          item.characterContent.characterName.trim().replace(/\.$/, "")
        );
      } else if (item.internalSceneStructure) {
        extractCharacterNames(item.internalSceneStructure, names);
      } else if (item.sceneStructure) {
        item.sceneStructure.forEach((scene) =>
          extractCharacterNames(scene.internalSceneStructure, names)
        );
      }
    });
    return names;
  };

  const characterNames = Array.from(
    new Set(extractCharacterNames(scriptData.actStructure))
  ).filter((name) => name);

  function editCharacter() {
    //logic here for editing Character List
  }

  return (
    <div id="character-list">
      {" "}
      <div id="character-list-title">List of Characters</div>
      {characterNames.map((name, index) => (
        <p key={index} onClick={() => editCharacter(name)}>
          {name}
        </p>
      ))}
    </div>
  );
};

export default CharacterListView;
