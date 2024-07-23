import React, { useState, useRef } from "react";
import {
  useProject,
  UPDATE_PROJECT_SAVE_FILE,
  UPDATE_PROJECT_SAVE_STATUS,
} from "../contexts/ProjectContext.js";
import { useSettings } from "../contexts/SettingsContext.js";
import "../styles/LineNotes.css";

const LineNotes = ({ characterName, characterDialogue }) => {
  const { state, dispatch } = useProject();
  const { projectSaveFile } = state;
  const { hideSettings } = useSettings();
  const [lineNotes, setLineNotes] = useState([]);
  const [actorName, setActorName] = useState("");
  const [lineError, setLineError] = useState("");
  const [lineNote, setLineNote] = useState("");
  const [lineCalled, setLineCalled] = useState(false);
  const [wrongWords, setWrongWords] = useState(false);
  const [addedWords, setAddedWords] = useState(false);
  const [droppedWords, setDroppedWords] = useState(false);
  const [outOfOrder, setOutOfOrder] = useState(false);
  const [missedCue, setMissedCue] = useState(false);
  const [jumpedCue, setJumpedCue] = useState(false);
  const [other, setOther] = useState(false);
  const [dialogueWords, setDialogueWords] = useState(() =>
    characterDialogue.split(/(\s+)/).map((word) => ({
      text: word,
      isBold: false,
      isInput: false,
      isSpace: /^\s+$/.test(word),
      inputWidth: "1ch",
    }))
  );
  const [activeInput, setActiveInput] = useState(null);
  const [showOptions, setShowOptions] = useState(null);
  const inputRef = useRef([]);
  const isHandlingWordClick = useRef(false);
  document.addEventListener("click", () => {
    if (!isHandlingWordClick.current) {
      setShowOptions(null);
    }
  });

  const handleWordClick = (index) => {
    isHandlingWordClick.current = true;
    setDialogueWords((prevWords) => {
      let newWords = [...prevWords];
      if (newWords[index].isSpace && addedWords && !newWords[index].isInput) {
        const newInput = {
          text: "",
          isBold: false,
          isInput: true,
          isSpace: false,
          inputWidth: "1ch",
          wasAdded: true,
        };
        newWords.splice(index + 1, 0, newInput);
        setActiveInput(index + 1);
        setTimeout(() => {
          if (inputRef.current[index + 1]) {
            inputRef.current[index + 1].focus();
          }
        }, 0);
        setShowOptions(null);
        return newWords;
      } else if (
        !newWords[index].isSpace &&
        droppedWords &&
        !newWords[index].wasAdded
      ) {
        newWords[index] = {
          ...newWords[index],
          isBold: !newWords[index].isBold,
        };
        setShowOptions(null);
        return newWords;
      } else if (newWords[index].wasAdded) {
        setShowOptions(index);
      } else {
        setShowOptions(null);
      }
      return prevWords;
    });
    setTimeout(() => {
      isHandlingWordClick.current = false;
    }, 0);
  };

  const handleInputChange = (index, event) => {
    const width = `${Math.max(event.target.value.length)}ch`;
    setDialogueWords(
      dialogueWords.map((word, idx) => {
        if (idx === index) {
          return {
            ...word,
            text: event.target.value,
            inputWidth: width,
            wasAdded: true,
          };
        }
        return word;
      })
    );
  };

  const handleInputBlur = (index) => {
    setDialogueWords((prevWords) => {
      if (prevWords[index].text.trim() === "") {
        setShowOptions(null);
        return prevWords.filter((word, idx) => idx !== index);
      } else {
        return prevWords.map((word, idx) => {
          if (idx === index) {
            return { ...word, isInput: false };
          }
          return word;
        });
      }
    });
  };

  const handleEdit = (index) => {
    setDialogueWords(
      dialogueWords.map((word, idx) => {
        if (idx === index) {
          return { ...word, isInput: true };
        }
        return word;
      })
    );

    setTimeout(() => {
      if (inputRef.current[index]) {
        inputRef.current[index].focus();
        inputRef.current[index].select();
      }
    }, 0);
  };

  const handleDelete = (index) => {
    setDialogueWords(dialogueWords.filter((word, idx) => idx !== index));
  };

  const saveLineNote = () => {
    //added 5/7
    const formattedDialogue = formatDialogue(dialogueWords);
    const errors = getActiveErrors();

    const newLineNote = {
      line: formattedDialogue,
      error: errors,
    };

    let updatedLineNotes = projectSaveFile.lineNotes;

    const existingCharacterIndex = updatedLineNotes.findIndex((note) =>
      note.hasOwnProperty(characterName)
    );

    if (existingCharacterIndex >= 0) {
      // If the character already exists, push the new line note to the existing array
      updatedLineNotes[existingCharacterIndex][characterName].push(newLineNote);
    } else {
      // If the character does not exist, create a new object for this character and add it
      const newCharacterEntry = {
        [characterName]: [newLineNote],
      };
      updatedLineNotes.push(newCharacterEntry);
    }

    //above was added 5/7
    dispatch({
      type: UPDATE_PROJECT_SAVE_FILE,
      payload: { lineNotes: updatedLineNotes },
    });
    dispatch({
      type: UPDATE_PROJECT_SAVE_STATUS,
      payload: false,
    });
    hideSettings();
  };

  //added 5/7
  function formatDialogue(words) {
    return words
      .map((word) => {
        if (word.wasAdded) {
          return `_${word.text}_`; // Struck through (representing added words)
        } else if (word.isBold) {
          return `*${word.text}*`; // Bold (representing dropped words)
        }
        return word.text;
      })
      .join("");
  }

  //added 5/7 (this should probably be changed to determine what *was* checked, rather than what *is* checked)
  function getActiveErrors() {
    const errors = [];
    if (addedWords) errors.push("Added Word(s)");
    if (droppedWords) errors.push("Dropped Word(s)");
    if (wrongWords) errors.push("Wrong Word(s)");
    if (outOfOrder) errors.push("Out of Order");
    if (missedCue) errors.push("Missed Cue");
    if (jumpedCue) errors.push("Jumped Cue");
    if (lineCalled) errors.push("Line Called");
    if (other) errors.push("Other");
    return errors;
  }

  return (
    <div className="modal-background-overlay">
      <div id="line-notes-modal-window">
        <div id="line-notes-table">
          <div id="line-notes-title">Line Notes</div>
          <div id="line-notes-character-name">{characterName}</div>
          <div id="line-notes-error-options-box">
            <div className="line-notes-error-options-row">
              <div>
                <input
                  type="checkbox"
                  id="added-words"
                  name="added-words"
                  checked={addedWords}
                  onChange={() => setAddedWords(!addedWords)}
                />
                <label htmlFor="added-words">Added Word(s)</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="dropped-words"
                  name="dropped-words"
                  checked={droppedWords}
                  onChange={() => setDroppedWords(!droppedWords)}
                />
                <label htmlFor="dropped-words">Dropped Word(s)</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="wrong-words"
                  name="wrong-words"
                  checked={wrongWords}
                  onChange={() => setWrongWords(!wrongWords)}
                />
                <label htmlFor="wrong-words">Wrong Word(s)</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="out-of-order"
                  name="out-of-order"
                  checked={outOfOrder}
                  onChange={() => setOutOfOrder(!outOfOrder)}
                />
                <label htmlFor="out-of-order">Out of Order</label>
              </div>
            </div>
            <div className="line-notes-error-options-row">
              <div>
                <input
                  type="checkbox"
                  id="missed-cue"
                  name="missed-cue"
                  checked={missedCue}
                  onChange={() => setMissedCue(!missedCue)}
                />
                <label htmlFor="missed-cue">Missed Cue</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="jumped-cue"
                  name="jumped-cue"
                  checked={jumpedCue}
                  onChange={() => setJumpedCue(!jumpedCue)}
                />
                <label htmlFor="jumped-cue">Jumped Cue</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="called-line"
                  name="called-line"
                  checked={lineCalled}
                  onChange={() => setLineCalled(!lineCalled)}
                />
                <label htmlFor="called-line">Line Called</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="other"
                  name="other"
                  checked={other}
                  onChange={() => setOther(!other)}
                />
                <label htmlFor="other">Other</label>
              </div>
            </div>
          </div>
          <div id="line-notes-correct-dialogue">
            {dialogueWords.map((word, index) => (
              <React.Fragment key={index}>
                {word.isInput ? (
                  <input
                    id={`input-${index}`}
                    ref={(el) => (inputRef.current[index] = el)}
                    type="text"
                    value={word.text}
                    onChange={(event) => handleInputChange(index, event)}
                    onBlur={() => handleInputBlur(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleInputBlur(index);
                      }
                    }}
                    style={{
                      width: word.inputWidth,
                      textDecoration: word.wasAdded ? "line-through" : "none",
                    }}
                  />
                ) : (
                  <span
                    className={`${
                      word.isBold ? "line-notes-dropped-text" : ""
                    } ${
                      word.wasAdded
                        ? "line-notes-added-text"
                        : "line-notes-static-text"
                    }`}
                    onClick={() => handleWordClick(index)}
                  >
                    {word.text}
                    {showOptions === index && (
                      <div id="line-notes-added-words-edit-bar">
                        <button
                          id="line-notes-added-words-edit-button"
                          onClick={() => handleEdit(index)}
                        >
                          Edit
                        </button>
                        <button
                          id="line-notes-added-words-exit-button"
                          onClick={() => handleDelete(index)}
                        >
                          X
                        </button>
                      </div>
                    )}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
          <div id="line-notes-button-row">
            <button className="menu-close-button" onClick={hideSettings}>
              Close
            </button>
            <button className="menu-save-button" onClick={saveLineNote}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineNotes;
