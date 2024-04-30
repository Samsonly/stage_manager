# TODO Worklist

General: - SwapSides Logic

Fixes:

TopContainer:

MiddleContainer:

BottomContainer
TaskBar
TaskBarButtons: Single Line. Font Choice. Allow overflow to disappear off screen (nowrap)
TaskSection: Make sure hidden logic includes hiding the gutter
TaskTabBar
TaskTab
MinButton: Not that icon. Empty looking one is prefered. Get better Font, and take a look at padding and font sizes

Before Rollout:
rewrite: robots.txt
update: logo512.png
update: logo192.png

Consider API usage for retrieving specific information from theater production company database?

Potential Overlay Layout: 2. Let's create an overlapping division along the bottom right of the screen (let's say 200x200 pixels wide). In that division I'd like the following layouts that change based on type of camera that is active. For Perspective Camera:

- 2p top padding
- 40p tall header row: - 10p left padding - 30p x 30p button (snapShotButton) - 10p padding - 100p Header (displaying "Perspective") - 10p padding - 30p x 30p button (toggleCameraButton) - 10p right padding
- 60p tall rotation row: - 10p left left padding - 60p wide div - 5p top padding - 25p button row - 4p left padding - 25p x 25p button (panLeftButton) - 2p padding - 25p x 25p button (panRightButton) - 4p right padding - 5p padding - 20p input row - 4p left padding - 52p input field (xRotationInput) - 4p left padding - 5p bottom padding

Save to paste:
Okay, so now I have this current logic:

const extractCharacterNames = (data, names = []) => {
data.forEach((item) => {
if (item.characterContent && item.characterContent.characterName) {
names.push(
item.characterContent.characterName.trim().replace(/\.$/, "")
);
} else if (item.internalSceneStructure) {
extractCharacterNames(item.internalSceneStructure, names);
} else if (item.sceneStructure) {
item.sceneStructure.forEach((scene) =>
extractCharacterNames(scene.internalSceneStructure, names)
);
}
});
return names;
};

const characterNames = Array.from(
new Set(extractCharacterNames(scriptData.actStructure))
).filter((name) => name);

with this render:

return (

<div className="modal-backdrop">
<div className="character-list-modal">
<div id="character-list-title">Character List</div>
{characterNames.map((name, index) => (
<p key={index} onClick={() => editCharacter(name)}>
{name}
</p>
))}
<button className="menu-close-button" onClick={onClose}>
Close
</button>
</div>
</div>
);

I would prefer the following to occur:

1. We need to create TWO new GlobalContext states:
   1a. `isProjectActive` (which is set to False)
   1b. `isProjectSaved` (which is also set to False).

2a. CreateNewProject should first check `ifProjectActive` status. If false, then its current logic handles as normal (step 3)
2b. If true, then it should check 'isProjectSaved' status. If THAT is true, then it can continue its logic as normal (step 3).
2c. If that is FALSE, then it should create a prompt that says "Would you like to save `${projectSaveFile.projectName}`before creating a New Project?"
2d. Clicking "Yes" should trigger `SaveProject.js`
2e. Clicking "No" should trigger a confirmation of "Are you sure you do not want to save `${projectSaveFile.projectName}` ? All progress since your previous save will be lost."
2f. Clicking "No" on the confirmation should return the user to previous prompt (Step 2c)
2g. Clicking "Yes" on the confirmation should continue on to Step 3.

3a. CreateNewProject should rewrite the entire saveProjectFile to be `"projectName": ${projectName}` (similar to how it already does).
3b. isProjectActive should be set to "true"
3c. isProject

(Do NOT provide solutions for anything below, this is just our next steps/worklist)

4a. "Save Project" button inside of NavigationBar.js should be greyed out/disabled if "isProjectActive" = false
4b. In addition to downloading the saveProjectFile, `SaveProject.js` should ALSO set "isProjectSaved" to "true"
5a. upload-script-button inside of ScriptMenu.js should be greyed out/disabled if "isProjectActive" = false
5b. In addition to uploading a file, upload-script-button should also set "isProjectSaved" to "false"
