import React, { useState, useRef } from "react";
import {
  useProject,
  UPDATE_PROJECT_SAVE_FILE,
  UPDATE_PROJECT_SAVE_STATUS,
} from "../contexts/ProjectContext.js";
import { useSettings } from "../contexts/SettingsContext.js";
import "../styles/LineNotes.css";

const EditLineNote = ({ activeCharacter, noteIndex }) => {
  const { state, dispatch } = useProject();
  const { projectSaveFile } = state;
  const { hideSettings } = useSettings();
  const characterName = activeCharacter;

  // Find the correct note based on characterName and noteIndex
  const note = projectSaveFile.lineNotes.find(
    (charNotes) => Object.keys(charNotes)[0] === characterName
  )[characterName][noteIndex];

  console.log(note);

  const [dialogueWords, setDialogueWords] = useState(() => {
    const words = note.line.flatMap((word) => [
      { ...word },
      { text: " ", format: "space" },
    ]);
    words.push({ text: " ", format: "space" });
    return words;
  });
  const [lineCalled, setLineCalled] = useState(
    note.error.includes("Line Called")
  );
  const [wrongWords, setWrongWords] = useState(
    note.error.includes("Wrong Word(s)")
  );
  const [addedWords, setAddedWords] = useState(
    note.error.includes("Added Word(s)")
  );
  const [droppedWords, setDroppedWords] = useState(
    note.error.includes("Dropped Word(s)")
  );
  const [outOfOrder, setOutOfOrder] = useState(
    note.error.includes("Out of Order")
  );
  const [missedCue, setMissedCue] = useState(note.error.includes("Missed Cue"));
  const [jumpedCue, setJumpedCue] = useState(note.error.includes("Jumped Cue"));
  const [other, setOther] = useState(note.error.includes("Other"));
  const [activeInput, setActiveInput] = useState(null);
  const inputRef = useRef([]);
  const isHandlingWordClick = useRef(false);

  const handleWordClick = (index) => {
    isHandlingWordClick.current = true;

    setDialogueWords((prevWords) => {
      const newWords = prevWords.map((word, idx) => ({ ...word }));

      if (addedWords && newWords[index].format === "space") {
        const newInput = {
          text: "",
          format: "",
          inputWidth: "1ch",
        };
        newWords.splice(index + 1, 0, newInput);
        newWords.splice(index + 2, 0, { text: " ", format: "space" });
        setActiveInput(index + 1);
      } else if (droppedWords && newWords[index].format === "static") {
        newWords[index].format = "dropped";
      } else if (droppedWords && newWords[index].format === "dropped") {
        newWords[index].format = "static";
      } else if (newWords[index].format === "added") {
        newWords[index].format = "";
        setActiveInput(index);
      }

      return newWords;
    });

    setTimeout(() => {
      if (inputRef.current[index + 1] && addedWords) {
        inputRef.current[index + 1].focus();
      } else if (inputRef.current[index]) {
        inputRef.current[index].focus();
        inputRef.current[index].select();
      }
      isHandlingWordClick.current = false;
    }, 0);
  };

  const handleInputChange = (index, event) => {
    const hiddenMeasurer = document.getElementById("hiddenMeasurer");
    hiddenMeasurer.textContent = event.target.value || " ";
    const width = hiddenMeasurer.offsetWidth;
    setDialogueWords(
      dialogueWords.map((word, idx) => {
        if (idx === index) {
          return {
            ...word,
            text: event.target.value,
            inputWidth: `${width + 1}px`,
          };
        }
        return word;
      })
    );
  };

  const handleInputBlur = (index, event) => {
    setDialogueWords((prevWords) => {
      if (prevWords[index].text.trim() === "") {
        return prevWords.filter(
          (word, idx) => idx !== index && idx !== index + 1
        );
      } else {
        return prevWords.map((word, idx) => {
          if (idx === index) {
            return { ...word, format: "added" };
          }
          return word;
        });
      }
    });
    setActiveInput(null);
  };

  const saveLineNote = () => {
    inputRef.current.forEach((input) => {
      if (input) input.blur();
    });

    const filteredDialogueWords = dialogueWords.filter(
      (word) => word.format !== "space"
    );

    const formattedDialogue = filteredDialogueWords.reduce((acc, word) => {
      if (word.format === "added") {
        return acc.concat(
          word.text.split(/\s+/).map((w) => ({
            text: w,
            format: "added",
          }))
        );
      } else {
        return acc.concat({
          text: word.text,
          format: word.format,
        });
      }
    }, []);

    const errors = getActiveErrors();

    // Directly update the note at the specified index
    let updatedLineNotes = projectSaveFile.lineNotes.map((charNotes) => {
      const character = Object.keys(charNotes)[0];
      if (character === characterName) {
        return {
          [character]: charNotes[character].map((existingNote, noteIdx) =>
            noteIdx === noteIndex
              ? { line: formattedDialogue, error: errors }
              : existingNote
          ),
        };
      }
      return charNotes;
    });

    // Dispatch the updated line notes to the project context
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

  const handleStartOfLine = (event) => {
    const clickY = event.clientY;

    const spans = document.querySelectorAll(
      "#line-notes-correct-dialogue span"
    );

    let targetIndex = -1;
    for (let i = 0; i < spans.length; i++) {
      const spanRect = spans[i].getBoundingClientRect();
      if (spanRect.top <= clickY && spanRect.bottom >= clickY) {
        targetIndex = i;
        break;
      }
    }

    if (targetIndex !== -1) {
      setDialogueWords((prevWords) => {
        const newWords = prevWords.map((word, idx) => ({ ...word }));
        const newInput = {
          text: "",
          format: "",
          inputWidth: "1ch",
        };
        newWords.splice(targetIndex, 0, newInput);
        newWords.splice(targetIndex + 1, 0, { text: " ", format: "space" });
        setActiveInput(targetIndex);
        return newWords;
      });
    }
  };

  return (
    <div className="modal-background-overlay">
      <div id="line-notes-modal-window">
        <div id="line-notes-table">
          <div id="line-notes-title">Edit Line Notes</div>
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
            <div
              style={{
                width: "1ch",
                height: "100%",
                display: "inline-block",
                cursor: "pointer",
              }}
              onClick={handleStartOfLine}
            />
            {dialogueWords.map((word, index) => (
              <React.Fragment key={index}>
                {word.format === "" && activeInput === index ? (
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
                      fontFamily: "Heuristica",
                      fontSize: "20px",
                      height: "18px",
                    }}
                  />
                ) : (
                  <span
                    className={`${
                      word.format === "dropped" ? "line-notes-dropped-text" : ""
                    } ${
                      word.format === "added"
                        ? "line-notes-added-text"
                        : word.format === "space"
                        ? "line-notes-space"
                        : "line-notes-static-text"
                    }`}
                    onClick={() => handleWordClick(index)}
                  >
                    {word.text}
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
          <span
            id="hiddenMeasurer"
            className="hidden-measurer"
            style={{
              position: "absolute",
              visibility: "hidden",
              whiteSpace: "nowrap",
              fontSize: "20px",
              fontFamily: "Heuristica",
            }}
          ></span>
        </div>
      </div>
    </div>
  );
};

export default EditLineNote;
