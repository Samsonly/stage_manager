import {
  useProject,
  UPDATE_PROJECT_SAVE_FILE,
  UPDATE_PROJECT_SAVE_STATUS,
  SET_LEFT_BUTTONS_VISIBLE,
  SET_CURRENT_SCRIPT_VIEW,
} from "../contexts/ProjectContext.js";

const UploadScript = () => {
  const { dispatch } = useProject();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          const characters = createUniqueCharacterList(jsonData.actStructure);
          const initialProductionAssignments =
            createInitialProductionAssignments(characters);

          dispatch({
            type: UPDATE_PROJECT_SAVE_FILE,
            payload: {
              script: jsonData,
              characterList: characters,
              productionAssignments: initialProductionAssignments,
            },
          });
          dispatch({ type: UPDATE_PROJECT_SAVE_STATUS, payload: false });
          dispatch({ type: SET_LEFT_BUTTONS_VISIBLE, payload: true });
          dispatch({ type: SET_CURRENT_SCRIPT_VIEW, payload: "script" });
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const uploadScript = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.style.display = "none";
    fileInput.addEventListener("change", handleFileChange);
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  const createUniqueCharacterList = (data) => {
    const names = new Set();
    const extractCharacterNames = (data) => {
      data.forEach((item) => {
        if (item.characterContent && item.characterContent.characterName) {
          names.add(
            item.characterContent.characterName.trim().replace(/\.$/, "")
          );
        } else if (item.internalSceneStructure) {
          extractCharacterNames(item.internalSceneStructure);
        } else if (item.sceneStructure) {
          item.sceneStructure.forEach((scene) => {
            extractCharacterNames(scene.internalSceneStructure);
          });
        }
      });
    };

    extractCharacterNames(data);

    return Array.from(names).map((name) => ({
      characterName: name,
      mainActor: [{ actorID: "", actorName: "", actorEmail: "" }],
      understudy: [{ actorID: "", actorName: "", actorEmail: "" }],
    }));
  };

  const createInitialProductionAssignments = (characters) => {
    return characters.map((character) => ({
      department: "cast",
      role: character.characterName, //edit this to match desired result
      assignee: "",
      email: "",
    }));
  };

  return uploadScript;
};

export default UploadScript;
