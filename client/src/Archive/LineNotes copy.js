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
  const [lineCalled, setLineCalled] = useState(false);
  const [wrongWords, setWrongWords] = useState(false);
  const [addedWords, setAddedWords] = useState(false);
  const [droppedWords, setDroppedWords] = useState(false);
  const [outOfOrder, setOutOfOrder] = useState(false);
  const [missedCue, setMissedCue] = useState(false);
  const [jumpedCue, setJumpedCue] = useState(false);
  const [other, setOther] = useState(false);
  const [dialogueWords, setDialogueWords] = useState(() =>
    characterDialogue.split(/\s+/).flatMap((word, i, arr) =>
      i < arr.length - 1
        ? [
            { text: word, format: "static" },
            { text: " ", format: "space" },
          ]
        : [{ text: word, format: "static" }]
    )
  );
  const [activeInput, setActiveInput] = useState(null);
  const inputRef = useRef([]);
  const isHandlingWordClick = useRef(false);

  document.addEventListener("click", () => {
    if (!isHandlingWordClick.current) {
      setActiveInput(null);
    }
  });

  const handleWordClick = (index) => {
    //remove below
    console.log(`handleWordClick triggered at index: ${index}`);
    console.log(
      `addedWords: ${addedWords}, format: ${dialogueWords[index].format}`
    );
    //remove above
    isHandlingWordClick.current = true;
    setDialogueWords((prevWords) => {
      let newWords = [...prevWords];
      if (addedWords && newWords[index].format === "space") {
        console.log(`Inserting new input field at index: ${index + 1}`);

        const newInput = {
          text: "",
          format: "",
          inputWidth: "1ch",
        };
        newWords.splice(index + 1, 0, newInput);
        setActiveInput(index + 1);
        setTimeout(() => {
          if (inputRef.current[index + 1]) {
            inputRef.current[index + 1].focus();
          }
        }, 0);
      } else if (droppedWords && newWords[index].format === "static") {
        newWords[index].format = "dropped";
      } else if (droppedWords && newWords[index].format === "dropped") {
        newWords[index].format = "static";
      } else if (newWords[index].format === "added") {
        newWords[index].format = "";
        setActiveInput(index);
        setTimeout(() => {
          if (inputRef.current[index]) {
            inputRef.current[index].focus();
            inputRef.current[index].select();
          }
        }, 0);
      }
      return newWords;
    });
    setTimeout(() => {
      isHandlingWordClick.current = false;
    }, 0);
  };

  const handleInputChange = (index, event) => {
    const width = `${Math.max(event.target.value.length, 1)}ch`;
    setDialogueWords(
      dialogueWords.map((word, idx) => {
        if (idx === index) {
          return {
            ...word,
            text: event.target.value,
            inputWidth: width,
          };
        }
        return word;
      })
    );
  };

  const handleInputBlur = (index) => {
    setDialogueWords((prevWords) => {
      if (prevWords[index].text.trim() === "") {
        return prevWords.filter((word, idx) => idx !== index);
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
    // Ensure all input fields are blurred before saving
    inputRef.current.forEach((input) => {
      if (input) input.blur();
    });

    const formattedDialogue = dialogueWords.reduce((acc, word) => {
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

    const newLineNote = {
      line: formattedDialogue,
      error: errors,
    };

    let updatedLineNotes = projectSaveFile.lineNotes;

    const existingCharacterIndex = updatedLineNotes.findIndex((note) =>
      note.hasOwnProperty(characterName)
    );

    if (existingCharacterIndex >= 0) {
      updatedLineNotes[existingCharacterIndex][characterName].push(newLineNote);
    } else {
      const newCharacterEntry = {
        [characterName]: [newLineNote],
      };
      updatedLineNotes.push(newCharacterEntry);
    }

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
                      textDecoration: "line-through",
                      color: "red",
                    }}
                  />
                ) : (
                  <span
                    className={`${
                      word.format === "dropped" ? "line-notes-dropped-text" : ""
                    } ${
                      word.format === "added"
                        ? "line-notes-added-text"
                        : "line-notes-static-text"
                    }`}
                    onClick={() => handleWordClick(index)}
                  >
                    {word.text}
                  </span>
                )}
                {index < dialogueWords.length - 1 && (
                  <span
                    className="line-notes-space"
                    onClick={() => handleWordClick(index)}
                  >
                    {" "}
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
