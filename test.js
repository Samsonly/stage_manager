<body>
    <div class="top-container">
      <div class="nav-bar">
        <!-- TODO: Add Top Toolbar Items Here-->
        Navigation Bar
      </div>
      <div class="section4">
        <!-- TODO: Add space for Drop-down items/widgets here -->

        <h1>Empty Section 4</h1>
      </div>
    </div>
    <div class="middle-container">
      <div class="section1">
        <div class="left-vertical-bar">
          <div class="lvb-top">
            <button class="extend-right">>></button>
          </div>
          <div class="lvb-bottom">
            <div class="script-bar">
              <!-- TODO: Content for script-bar goes here -->
              <div class="script-icons">
                <img
                  id="upload-icon"
                  src="./icons/upload.png"
                  alt="Upload Icon"
                />
                <img
                  id="script-icon"
                  src="./icons/script.png"
                  alt="Script Icon"
                />
                <img
                  id="table-of-contents-icon"
                  src="./icons/table-of-contents.png"
                  alt="Table of Contents Icon"
                />
                <img
                  id="characters-icon"
                  src="./icons/characters.png"
                  alt="Character List Icon"
                />
                <img
                  id="style-settings-icon"
                  src="./icons/font.png"
                  alt="Style Settings Icon"
                />
              </div>
            </div>
            <div class="swap-button">
              <button class="swap-sides">&#8646;</button>
            </div>
          </div>
        </div>
        <div class="content" id="script-content">
          <h1>Script Content</h1>
          <p>This is where the Script is located</p>
        </div>
      </div>
      <div class="section2">
        <div class="content" id="design-content">
          <h1>Design Content</h1>
          <p>This is where content for Design related material</p>
        </div>
        <div class="right-vertical-bar">
          <div class="rvb-top">
            <button class="extend-left"><<</button>
          </div>
          <div class="rvb-bottom">
            <div class="design-bar">
              <div class="design-icons">
                <img
                  id="groundplan-icon"
                  src="./icons/groundplan.png"
                  alt="Groundplan Icon"
                />
              </div>
            </div>
            <div class="swap-button">
              <button class="swap-sides">&#8646;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-container">
      <div class="bottom-panel">
        <div class="tab-bar">
          <!-- This is the tab bar -->
          <div class="tab-container">
            <!-- No initial tab here -->
          </div>
        </div>
        <div class="section3">
          <h1>Empty Section 3</h1>
        </div>
      </div>
      <div class="taskbar">
        <div class="task">LINE NOTES</div>
        <div class="task">TO-DO ITEMS</div>
        <div class="task">REPORT NOTES</div>
        <div class="task">PLACEHOLDER 4</div>
        <div class="task">PLACEHOLDER 5</div>
        <div class="task">PLACEHOLDER 6</div>
        <div class="task">PLACEHOLDER 7</div>
        <div class="task">PLACEHOLDER 8</div>
      </div>
    </div>
  </body>

const horizontalSplit = Split([".section1", ".section2"], {
  sizes: [50, 50],
  minSize: 100,
  gutterSize: 2,
  cursor: "col-resize",
});

const verticalSplit = Split([".middle-container", ".bottom-container"], {
  direction: "vertical",
  sizes: [100, 0],
  minSize: [0, 20],
  gutterSize: 2,
  cursor: "row-resize",
});

swapSidesButton.forEach((button) => {
//this makes the swap-sides buttons on either side to swap the design and script content, and the design and script bars
});

scriptIcons.forEach((icon) => {
  //this turns the various script icons into buttons that will perform the appropriate action when clicked
});

designIcons.forEach((icon) => {
// this turns the various design icons into buttons that will perform the appropriate action when clicked
});

tasks.forEach((task) => {
  //thisexpands the hidden bottom panel and creates a new tab bar if it is the first task clicked
});

function toggleMinButtonVisibility(tab, visibility) {
//this outsources the logic for toggling the visibility of the minimize button, which should only be visible when the tab is active
}

function activateTab(tab, taskText) {
//this outsources the logic for activating a tab, which should only be active when it is clicked, and only one tab is active at a time
}

function createNewTab(taskText) {
  // this creates a new tab and adds it to the tab bar, it also gives the minimize button the appropriate functionality
}

function updateTabBar() {
//this outsources the logic for updating the tab bar, which should only be visible when there are tabs to display
}

function minimizeTab(tab) {
 // this outsources the logic for minimizing a tab, which should only be minimized when the minimize button is clicked, or if an active tab is reclicked from the task bar.
 // it calls on the updateTabBar function to update the tab bar after the tab is minimized, and the checkIfAllTasksAreMinimized function 
}

function checkIfAllTasksAreMinimized() {
//this outsources the logic for checking if all tasks are minimized, and if so, it hides the tab bar
}

function uploadScript() {
 // this function creates an input element of type file, and triggers a click event on it, which opens the file explorer for the user to select a file
  // it calls the function generatePlayContent, which is found in a different js, createCharacterList, and createTableOfContents
}

function createCharacterList() {
  // this function creates a list of characters from the script content, and adds it to the character List tab
 // it calls the function editCharacter, which is an alert dialog that allows the user to edit aspects of the character
}

function viewCharacterList() {
  // this function shows the character list inside of the script content window, and hides any other view
}

function createTableOfContents() {
 //this function creates a table of contents from the script, and adds it to the table of contents tab
 // it also makes each item a link to the appropriate section of the script, which would call upon viewScript() and scorll to the correct location
}

function viewTableOfContents() {
  // this function shows the table of contents inside of the script content window, and hides any other view

}

function viewScript(href) {
  // this function shows the actual script inside of the script content window, and hides any other view. 
  // if linked from the table of contents, it will scroll to the correct location

}

function editStyleSettings() {
  //TODO: Implement style settings menu
  // this function is a placeholder for a function that has not yet been created
}

function editCharacter(characterName) {
 // this function creates an alert dialog that allows the user to edit aspects of the character
 // it calls upon the functions renameCharacter, reassignCharacter, multipleAssignCharacter, removeCharacter, and restoreCharacter
 // only one of the latter 2 functions are displayed at a time depending on the state of the character's "isRemoved" status, which is also set within this function
 // none of the 5 functions are implemented yet, and are only placeholders
 // this function also includes building the save and close buttons which have their own functions below
}

function renameCharacter() {
  // Rename character logic here (Logic not implemented yet)
}

function reassignCharacter() {
  // Reassign character logic here (Logic not implemented yet)
}

function multipleAssignCharacter() {
  // Assign to multiple characters logic here (Logic not implemented yet)
}

function removeCharacter() {
  // Remove character logic here (Logic not implemented yet)
}

function restoreCharacter() {
  // Restore character logic here (Logic not implemented yet)
}

function saveChanges() {
  //this function saves the changes made to the character list, notes that changes have taken place
}

function closeDialog() {
//this function checks if changes have been made, and if so, calls on the confirmExit function, otherwise it closes the parent dialog
}

function confirmExit() {
 //this function creates a confirm dialog that asks the user if they want to save changes before exiting the character edit dialog
}