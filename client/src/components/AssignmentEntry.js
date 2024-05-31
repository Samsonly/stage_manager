import React, { useState } from "react";
import "../styles/AssignmentEntry.css";

const AssignmentEntry = ({
  assignment,
  updateAssignment,
  contactDirectory,
}) => {
  const [localAssignment, setLocalAssignment] = useState(assignment);
  const [suggestions, setSuggestions] = useState([]);

  const handleAssigneeChange = (e) => {
    const value = e.target.value;
    const newAssignee = {
      ...localAssignment,
      assignee: value,
    };
    setLocalAssignment(newAssignee);
    updateAssignment(newAssignee);

    if (value.length > 1) {
      setSuggestions(
        contactDirectory.filter((contact) =>
          `${contact.firstName} ${contact.lastName}`
            .toLowerCase()
            .includes(value.toLowerCase())
        )
      );
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (suggestion) => {
    const newAssignee = {
      ...localAssignment,
      assignee: `${suggestion.firstName} ${suggestion.lastName}`,
      email: suggestion.email,
    };
    setLocalAssignment(newAssignee);
    updateAssignment(newAssignee);
    setSuggestions([]);
  };

  return (
    <div className="production-assignment-entry">
      <select
        value={localAssignment.department}
        onChange={(e) =>
          updateAssignment({ ...localAssignment, department: e.target.value })
        }
      >
        <option value="cast">Cast</option>
        <option value="understudy">Understudy</option>
        <option value="crew">Crew</option>
        <option value="other">Other</option>
      </select>
      <input
        type="text"
        value={localAssignment.role}
        onChange={(e) =>
          updateAssignment({ ...localAssignment, role: e.target.value })
        }
        placeholder="Role"
      />
      <input
        type="text"
        value={localAssignment.assignee}
        onChange={handleAssigneeChange}
        placeholder="Assignee"
      />
      {suggestions.map((s) => (
        <div key={s.contactID} onClick={() => selectSuggestion(s)}>
          {`${s.firstName} ${s.lastName}`}
        </div>
      ))}
      <input type="text" value={localAssignment.email} readOnly />
    </div>
  );
};

export default AssignmentEntry;
