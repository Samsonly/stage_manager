import React, { useState } from "react";
import "../styles/ViewLineNotes.css";
import { useSettings } from "../contexts/SettingsContext.js";
import {
  useProject,
  UPDATE_PROJECT_SAVE_FILE,
} from "../contexts/ProjectContext.js";
import exportLineNotesUtil from "../utils/exportLineNotesUtil.js";
import EditLineNote from "./EditLineNote.js";
import CustomConfirm from "../containers/CustomConfirm.js";

function ViewLineNotes() {
  const { hideSettings, showSettings } = useSettings();
  const { state, dispatch } = useProject();
  const { projectSaveFile } = state;
  const storedLineNotes = projectSaveFile.lineNotes;
  const [includeArchived, setIncludeArchived] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState(null);
  const [activeNote, setActiveNote] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

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

    return characterNotes[activeCharacter]
      .filter((note) => includeArchived || note.status === "active")
      .map((note, noteIndex) => (
        <div
          key={noteIndex}
          className={`note-entry ${
            note.status === "archived" ? "archived-note" : ""
          }`}
          onMouseLeave={() => setActiveNote(null)}
        >
          <div className="note-errors">{note.error.join(", ")}</div>
          <div className="note-line">{formatLineText(note.line)}</div>
          <button
            className="menu-button"
            onClick={() => setActiveNote(noteIndex)}
          >
            ...
          </button>
          {activeNote === noteIndex && (
            <div className="dropdown-menu active">
              {note.status === "active" ? (
                <>
                  <button
                    onClick={() => {
                      showSettings(EditLineNote, {
                        activeCharacter,
                        noteIndex,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleToggleArchiveNote(activeCharacter, noteIndex)
                    }
                  >
                    Archive
                  </button>
                  <button
                    onClick={() => {
                      setNoteToDelete({
                        character: activeCharacter,
                        noteIndex,
                      });
                      setShowConfirmModal(true);
                    }}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() =>
                      handleToggleArchiveNote(activeCharacter, noteIndex)
                    }
                  >
                    Unarchive
                  </button>
                  <button
                    onClick={() => {
                      setNoteToDelete({
                        character: activeCharacter,
                        noteIndex,
                      });
                      setShowConfirmModal(true);
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ));
  };

  const handleExport = () => {
    if (activeCharacter) {
      const characterNotesObj = storedLineNotes.find((note) =>
        note.hasOwnProperty(activeCharacter)
      );

      if (!characterNotesObj) {
        alert("No notes found for the selected character.");
        return;
      }

      // Get the notes for the active character
      const characterNotes = characterNotesObj[activeCharacter];

      // Filter out only active notes
      const activeNotes = characterNotes.filter(
        (note) => note.status === "active"
      );

      if (activeNotes.length === 0) {
        alert("No active notes to export for the selected character.");
        return;
      }

      // Create a new object with only the active notes for the character
      const activeNotesObj = { [activeCharacter]: activeNotes };

      // Pass only active notes to the export utility
      const doc = exportLineNotesUtil([activeNotesObj], activeCharacter);
      doc.save(`${activeCharacter}_line_notes.pdf`); // Save the PDF
    } else {
      alert("Please select a character to export notes for.");
    }
  };

  const handleToggleArchiveNote = (character, noteIndex) => {
    const updatedLineNotes = storedLineNotes.map((note) => {
      if (note[character]) {
        const updatedCharacterNotes = note[character].map((lineNote, index) => {
          if (index === noteIndex) {
            return {
              ...lineNote,
              status: lineNote.status === "active" ? "archived" : "active",
            };
          }
          return lineNote;
        });
        return { [character]: updatedCharacterNotes };
      }
      return note;
    });

    dispatch({
      type: UPDATE_PROJECT_SAVE_FILE,
      payload: { lineNotes: updatedLineNotes },
    });

    setActiveNote(null);
  };

  const handleDeleteNote = (character, noteIndex) => {
    const updatedLineNotes = storedLineNotes.map((note) => {
      if (note[character]) {
        const updatedCharacterNotes = note[character].filter(
          (_, index) => index !== noteIndex
        );
        return { [character]: updatedCharacterNotes };
      }
      return note;
    });

    dispatch({
      type: UPDATE_PROJECT_SAVE_FILE,
      payload: { lineNotes: updatedLineNotes },
    });

    setActiveNote(null);
    setShowConfirmModal(false);
  };

  const handleConfirmDelete = () => {
    if (noteToDelete) {
      handleDeleteNote(noteToDelete.character, noteToDelete.noteIndex);
    }
  };

  return (
    <div className="modal-background-overlay">
      <div className="modal-window">
        <div id="view-line-notes-table">
          <div id="view-line-notes-title">
            View Line Notes
            <div className="include-archived-container">
              <input
                type="checkbox"
                id="include-archived"
                className="include-archived-checkbox"
                checked={includeArchived}
                onChange={() => setIncludeArchived(!includeArchived)}
              />
              <label
                htmlFor="include-archived"
                className="include-archived-label"
              >
                Include Archived
              </label>
            </div>{" "}
          </div>{" "}
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
      {showConfirmModal && (
        <CustomConfirm
          message="Are you sure you want to delete this line note?"
          onNo={() => setShowConfirmModal(false)}
          onYes={handleConfirmDelete}
        />
      )}
    </div>
  );
}

export default ViewLineNotes;
