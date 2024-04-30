import React from "react";
import "../styles/ContactDatabase.css";
import AddContact from "./AddContact.js";
import { useProject } from "./Contexts/ProjectContext.js";
import { useSettings } from "./Contexts/SettingsContext.js";

const ContactDatabase = () => {
  const { hideSettings, showSettings } = useSettings();
  const { state } = useProject();
  const { projectSaveFile } = state;

  const openAddContact = () => {
    showSettings(AddContact);
  };

  return (
    <div className="modal-background-overlay">
      <div id="contact-database-modal-window">
        <div id="contact-database-title">Contact Database </div>
        <div id="contact-database-table">
          {projectSaveFile.contactDirectory?.map((contact, index) => (
            <div key={index} className="contact-database-entry">
              <div className="contact-database-id">{contact.contactID}</div>
              <div className="contact-database-first-name">
                {contact.firstName}
              </div>
              <div className="contact-database-last-name">
                {contact.lastName}
              </div>
              <div className="contact-database-email">{contact.email}</div>
            </div>
          ))}
          <button id="add-contact-button" onClick={openAddContact}>
            add new contact...
          </button>
        </div>
        <div id="contact-database-button-row">
          <button className="menu-close-button" onClick={hideSettings}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactDatabase;
