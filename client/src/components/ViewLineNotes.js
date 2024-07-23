import React, { useState } from "react";
import "../styles/ViewLineNotes.css";
import { useSettings } from "../contexts/SettingsContext.js";
import { useProject } from "../contexts/ProjectContext.js";
import exportLineNotesUtil from "../utils/exportLineNotesUtil.js";

function ViewLineNotes() {
  const { hideSettings } = useSettings();
  const { state } = useProject();
  const { projectSaveFile } = state;
  const storedLineNotes = projectSaveFile.lineNotes;

  const [activeCharacter, setActiveCharacter] = useState(null);

  const formatLineText = (line) => {
    return line.map((word, index) => {
      let formattedText;
      if (word.format === "dropped") {
        formattedText = (
          <span key={index} className="droppedWords">
            {word.text}
          </span>
        );
      } else if (word.format === "added") {
        formattedText = (
          <span key={index} className="addedWords">
            {word.text}
          </span>
        );
      } else {
        formattedText = <span key={index}>{word.text}</span>;
      }

      // Add a space after each word except the last one
      return (
        <React.Fragment key={index}>
          {formattedText}
          {index < line.length - 1 && " "}
        </React.Fragment>
      );
    });
  };
  const renderCharacterTabs = () => {
    if (!storedLineNotes || storedLineNotes.length === 0)
      return <div>No line notes available.</div>;
    return storedLineNotes.map((note, index) => {
      const character = Object.keys(note)[0];
      return (
        <button
          key={character}
          className={`character-tab ${
            activeCharacter === character ? "active-tab" : ""
          }`}
          onClick={() => setActiveCharacter(character)}
        >
          {character}
        </button>
      );
    });
  };

  const renderNotesForCharacter = () => {
    if (!activeCharacter) return <div>Select a character to view notes.</div>;
    const characterNotes = storedLineNotes.find((note) =>
      note.hasOwnProperty(activeCharacter)
    );
    if (!characterNotes) return <div>No notes found for this character.</div>;

    return characterNotes[activeCharacter].map((note, index) => (
      <div key={index} className="note-entry">
        <div className="note-errors">{note.error.join(", ")}</div>
        <div className="note-line">{formatLineText(note.line)}</div>
      </div>
    ));
  };

  const handleExport = () => {
    if (activeCharacter) {
      const doc = exportLineNotesUtil(storedLineNotes, activeCharacter);
      doc.save(`${activeCharacter}_line_notes.pdf`); // Save the PDF
    } else {
      alert("Please select a character to export notes for.");
    }
  };

  return (
    <div className="modal-background-overlay">
      <div className="modal-window">
        <div id="view-line-notes-table">
          <div id="view-line-notes-title">View Line Notes</div>
          <div id="view-line-notes-tabs">{renderCharacterTabs()}</div>
          <div id="view-line-notes-content">{renderNotesForCharacter()}</div>
          <div id="view-line-notes-button-row">
            <button className="menu-close-button" onClick={hideSettings}>
              Close
            </button>
            <button className="menu-export-button" onClick={handleExport}>
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewLineNotes;
