import React from "react";
import { useProject } from "../contexts/ProjectContext.js";
import { useSettings } from "../contexts/SettingsContext.js";
import "../styles/CharacterList.css";

const CharacterList = () => {
  const { state } = useProject();
  const { projectSaveFile } = state;
  const { hideSettings } = useSettings();

  const characters = projectSaveFile.characterList;

  function editCharacter(name) {
    console.log(`Editing character: ${name}`);
    // Placeholder for logic to edit character details
  }

  return (
    <div className="modal-background-overlay">
      <div className="modal-window">
        <div id="character-list-table">
          <div id="character-list-title">Character List</div>
          {characters.map((character, index) => (
            <div key={index} onClick={() => editCharacter(character)}>
              <p>{character.characterName}</p>
              {/* Display more details if needed */}
            </div>
          ))}
          <button className="menu-close-button" onClick={hideSettings}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterList;
