import React, { useState } from "react";
import {
  useProject,
  UPDATE_PROJECT_SAVE_FILE,
  UPDATE_PROJECT_SAVE_STATUS,
} from "../contexts/ProjectContext.js";
import { useSettings } from "../contexts/SettingsContext.js";
import "../styles/AddContact.css";

const AddContact = () => {
  const { state, dispatch } = useProject();
  const { hideSettings } = useSettings();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [hasEmailAddress, setHasEmailAddress] = useState(false);
  const { projectSaveFile } = state;

  const generateContactId = () => {
    const lastContact = projectSaveFile.contactDirectory?.slice(-1)[0];
    const lastId = lastContact ? parseInt(lastContact.contactID.slice(1)) : 0;
    return `#${(lastId + 1).toString().padStart(5, "0")}`;
  };

  const saveContact = () => {
    const newContact = {
      contactID: generateContactId(),
      firstName,
      lastName,
      email,
      hasEmailAddress,
    };

    const updatedDirectory = [...projectSaveFile.contactDirectory, newContact];

    dispatch({
      type: UPDATE_PROJECT_SAVE_FILE,
      payload: { contactDirectory: updatedDirectory },
    });

    dispatch({
      type: UPDATE_PROJECT_SAVE_STATUS,
      payload: false,
    });
    hideSettings();
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setHasEmailAddress(e.target.value.trim() !== "");
  };

  return (
    <div className="modal-background-overlay">
      <div id="add-contact-modal-window">
        <div id="add-contact-table">
          <div id="add-contact-id-container">
            <label htmlFor="add-contact-id">Contact ID:</label>
            <input
              type="text"
              id="add-contact-id"
              value={generateContactId()}
              readOnly
            />
          </div>
          <div id="add-contact-title">Add New Contact</div>
          <div id="add-contact-form">
            <div id="add-contact-name-input-row">
              <div id="add-contact-first-name-container">
                <label htmlFor="add-contact-first-name">First Name:</label>
                <input
                  type="text"
                  id="add-contact-first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div id="add-contact-last-name-container">
                <label htmlFor="add-contact-last-name">Last Name:</label>
                <input
                  type="text"
                  id="add-contact-last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div id="add-contact-email-container">
              <label htmlFor="add-contact-email">Email Address:</label>
              <input
                type="email"
                id="add-contact-email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <input type="hidden" value={hasEmailAddress} />
          </div>
          <div id="contact-database-button-row">
            <button id="add-contact-close-button" onClick={hideSettings}>
              Close
            </button>
            <button id="add-contact-save-button" onClick={saveContact}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContact;
