const topContainer = document.querySelector(".top-container");
const navBar = document.querySelector(".nav-bar");
const section4 = document.querySelector(".section4");
const middleContainer = document.querySelector(".middle-container");
const section1 = document.querySelector(".section1");
const leftVerticalBar = document.querySelector(".left-vertical-bar");
const lvbTop = document.querySelector(".lvb-top");
const scriptIcons = document.querySelectorAll(".script-icons");
const designIcons = document.querySelectorAll(".design-icons");
const extendRightButton = document.querySelector(".extend-right-button");
const lvbBottom = document.querySelector(".lvb-bottom");
const scriptBar = document.querySelector(".script-bar");
const swapSidesButton = document.querySelectorAll(".swap-sides");
const scriptContent = document.querySelector("#script-content");
const section2 = document.querySelector(".section2");
const designContent = document.querySelector("#design-content");
const rightVerticalBar = document.querySelector(".right-vertical-bar");
const rvbTop = document.querySelector(".rvb-top");
const extendLeftButton = document.querySelector(".extend-left-button");
const rvbBottom = document.querySelector(".rvb-bottom");
const designBar = document.querySelector(".design-bar");
const bottomContainer = document.querySelector(".bottom-container");
const bottomPanel = document.querySelector(".bottom-panel");
const tabBar = document.querySelector(".tab-bar");
const tabContainer = document.querySelector(".tab-container");
const section3 = document.querySelector(".section3");
const taskbar = document.querySelector(".taskbar");
const tasks = document.querySelectorAll(".task");

let activeTab = null;
let originalHTML;
let draftHTML;
let hasChanges = false;

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

// section4.style.display = "none";
bottomPanel.style.display = "none";
document.querySelector(".gutter.gutter-vertical").style.display = "none";

swapSidesButton.forEach((button) => {
  button.addEventListener("click", () => {
    if (scriptContent.parentNode === section1) {
      section2.insertBefore(scriptContent, rightVerticalBar);
      section1.appendChild(designContent);
      rightVerticalBar.appendChild(lvbBottom);
      leftVerticalBar.appendChild(rvbBottom);
    } else {
      section1.appendChild(scriptContent);
      section2.insertBefore(designContent, rightVerticalBar);
      leftVerticalBar.appendChild(lvbBottom);
      rightVerticalBar.appendChild(rvbBottom);
    }
  });
});

scriptIcons.forEach((icon) => {
  icon.addEventListener("click", (event) => {
    const altText = event.target.alt;
    switch (altText) {
      case "Upload Icon":
        uploadScript();
        break;
      case "Script Icon":
        viewScript();
        break;
      case "Table of Contents Icon":
        viewTableOfContents();
        break;
      case "Character List Icon":
        viewCharacterList();
        break;
      case "Style Settings Icon":
        editStyleSettings();
        break;
    }
  });
});

designIcons.forEach((icon) => {
  icon.addEventListener("click", (event) => {
    const altText = event.target.alt;
    switch (altText) {
      case "Groundplan Icon":
        viewGroundplan();
        break;
    }
  });
});

tasks.forEach((task) => {
  task.addEventListener("click", () => {
    bottomPanel.style.display = "block";
    document.querySelector(".gutter.gutter-vertical").style.display = "block";
    verticalSplit.setSizes([70, 30]);
    let tab = document.querySelector(`.tab[data-task='${task.textContent}']`);

    if (activeTab) {
      activeTab.classList.remove("active-tab");
      toggleMinButtonVisibility(activeTab, "hidden");
    }

    if (tab) {
      if (tab === activeTab) {
        minimizeTab(tab);
      } else {
        activateTab(tab, task.textContent);
      }
    } else {
      tab = createNewTab(task.textContent);
      activateTab(tab, task.textContent);
    }

    updateTabBar();
  });
});

function toggleMinButtonVisibility(tab, visibility) {
  const minButton = tab.querySelector(".min-btn");
  if (minButton) {
    minButton.style.visibility = visibility;
  }
}

function activateTab(tab, taskText) {
  activeTab = tab;
  activeTab.classList.add("active-tab");
  toggleMinButtonVisibility(activeTab, "visible");
  document.querySelector(".section3").innerHTML = `<h1>${taskText}</h1>`;
}

function createNewTab(taskText) {
  const newTab = document.createElement("div");
  newTab.className = "tab";
  newTab.setAttribute("data-task", taskText);

  const span = document.createElement("span");
  span.textContent = taskText;
  newTab.appendChild(span);

  const minButton = document.createElement("button");
  minButton.className = "min-btn";
  minButton.textContent = "⌄";
  minButton.style.visibility = "hidden";
  minButton.addEventListener("click", (event) => {
    event.stopPropagation();
    minimizeTab(newTab);
    updateTabBar();
  });
  newTab.appendChild(minButton);

  tabContainer.appendChild(newTab);

  return newTab;
}

function updateTabBar() {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const activeTab = document.querySelector(".active-tab");
      if (activeTab) {
        activeTab.classList.remove("active-tab");
        const minButton = activeTab.querySelector(".min-btn");
        if (minButton) {
          minButton.style.visibility = "hidden";
        }
      }
      tab.classList.add("active-tab");
      const minButton = tab.querySelector(".min-btn");
      if (minButton) {
        minButton.style.visibility = "visible";
      }
    });
  });
}

function minimizeTab(tab) {
  tab.remove();
  if (tab === activeTab) {
    const anotherTab = document.querySelector(".tab");
    if (anotherTab) {
      activeTab = anotherTab;
      activeTab.classList.add("active-tab");
      const minButton = activeTab.querySelector(".min-btn");
      minButton.style.visibility = "visible";
    } else {
      activeTab = null;
    }
  }
  updateTabBar();
  checkIfAllTasksAreMinimized();
}

function checkIfAllTasksAreMinimized() {
  const allTasksAreMinimized = document.querySelectorAll(".tab").length === 0;
  if (allTasksAreMinimized) {
    document.querySelector(".bottom-panel").style.display = "none";
    verticalSplit.setSizes([100, 0]);
    document.querySelector(".gutter.gutter-vertical").style.display = "none";
  }
}

function uploadScript() {
  document.querySelector("#script-content").innerHTML = "";

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json";
  fileInput.style.display = "none";

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const jsonData = JSON.parse(event.target.result);
      generatePlayContent(jsonData);
      createCharacterList();
      createTableOfContents();
      const scriptIcons = document.querySelectorAll(".script-icons img");
      console.log(scriptIcons);
      for (let i = 0; i < scriptIcons.length; i++) {
        scriptIcons[i].style.display = "inline";
      }
      document.querySelector("#upload-icon").style.display = "none";
    };

    reader.readAsText(file);
  });

  document.body.appendChild(fileInput);
  fileInput.click();
  document.body.removeChild(fileInput);
}

function createCharacterList() {
  const characterList = document.createElement("div");
  const title = document.createElement("div");
  title.id = "character-list-title";
  title.textContent = "List of Characters";
  characterList.appendChild(title);

  const characterNames = Array.from(
    new Set(
      Array.from(document.querySelectorAll(".characterName")).map(
        (characterName) => characterName.textContent
      )
    )
  );
  characterNames.forEach((name) => {
    const p = document.createElement("p");
    p.textContent = name.slice(0, -1); // Remove the final period

    p.addEventListener("click", () => {
      editCharacter(name);
    });

    characterList.appendChild(p);
  });
  characterList.id = "character-list";
  characterList.style.display = "none";
  document.querySelector("#script-content").appendChild(characterList);
}

function viewCharacterList() {
  const characterList = document.querySelector("#character-list");
  const scriptContent = document.querySelector("#script-content");
  const children = scriptContent.children;
  for (let i = 0; i < children.length; i++) {
    children[i].style.display = "none";
  }
  characterList.style.display = "block";
}

function createTableOfContents() {
  const tableOfContents = document.createElement("div");
  const playTitle = document.querySelector(".playTitle");
  const play = document.createElement("a");
  play.textContent = playTitle.textContent;
  play.className = "playTitle playToC";
  play.href = "#" + playTitle.id;
  play.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default action
    viewScript(event.currentTarget.href);
  });
  tableOfContents.appendChild(play);
  const actTitles = document.querySelectorAll(".actTitle");
  actTitles.forEach((actTitle, index) => {
    const act = document.createElement("a");
    act.textContent = actTitle.textContent;
    act.className = "actTitle actToC";
    act.href = "#" + actTitle.id;
    act.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the default action
      viewScript(event.currentTarget.href);
    });
    tableOfContents.appendChild(act);
    const sceneTitles = actTitle.parentNode.querySelectorAll(".sceneTitle");
    sceneTitles.forEach((sceneTitle) => {
      const scene = document.createElement("a");
      scene.textContent = sceneTitle.textContent;
      scene.className = "sceneTitle sceneToC";
      scene.href = "#" + sceneTitle.id;
      scene.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the default action
        viewScript(event.currentTarget.href);
      });
      tableOfContents.appendChild(scene);
    });
  });
  tableOfContents.id = "table-of-contents";
  tableOfContents.style.display = "none";
  document.querySelector("#script-content").appendChild(tableOfContents);
}

function viewTableOfContents() {
  const tableOfContents = document.querySelector("#table-of-contents");
  const scriptContent = document.querySelector("#script-content");
  const children = scriptContent.children;
  for (let i = 0; i < children.length; i++) {
    children[i].style.display = "none";
  }
  tableOfContents.style.display = "block";
}

function viewScript(href) {
  const playStructure = document.querySelector(".playStructure");
  const scriptContent = document.querySelector("#script-content");
  const children = scriptContent.children;
  for (let i = 0; i < children.length; i++) {
    children[i].style.display = "none";
  }
  playStructure.style.display = "block";

  if (href) {
    const id = href.split("#")[1];
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView();
    }
  }
}

function editStyleSettings() {
  //TODO: Implement style settings menu
}

function editCharacter(characterName) {
  const overlay = document.createElement("div");
  overlay.id = "overlay";
  document.body.appendChild(overlay);

  const editDialog = document.createElement("div");
  editDialog.id = "edit-dialog";
  overlay.appendChild(editDialog);

  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";
  wrapper.style.overflow = "auto";
  editDialog.appendChild(wrapper);

  const title = document.createElement("h1");
  title.textContent = "Edit Character";
  wrapper.appendChild(title);

  const className = characterName
    .slice(0, -1)
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const name = document.createElement("p");
  name.textContent = `"${className}"`;
  name.id = "character-name";
  wrapper.appendChild(name);

  const characterElement = document.querySelector(`.${className}`);
  const isRemoved = characterElement
    ? characterElement.classList.contains("removedCharacter")
    : false;

  originalHTML = editDialog.innerHTML;
  draftHTML = originalHTML;

  const options = [
    "Rename",
    "Reassign",
    "Assign to Multiple Characters",
    isRemoved ? "Restore" : "Remove",
  ];
  const functions = [
    () => renameCharacter(draftHTML),
    () => reassignCharacter(draftHTML),
    () => multipleAssignCharacter(draftHTML),
    isRemoved
      ? () => restoreCharacter(draftHTML)
      : () => removeCharacter(draftHTML),
  ];

  options.forEach((option, index) => {
    const p = document.createElement("p");
    const a = document.createElement("a");
    a.textContent = option;
    a.href = "#";
    a.onclick = functions[index];
    p.appendChild(a);

    const infoParent = document.createElement("span");
    infoParent.className = "info-parent";
    p.appendChild(infoParent);

    const info = document.createElement("img");
    info.src = "./icons/info.png";
    info.className = "info";
    info.id = `info-${option.toLowerCase().replace(" ", "-")}`;
    infoParent.appendChild(info);

    const infoWindow = document.createElement("div");
    infoWindow.textContent = `info about ${option}`;
    infoWindow.className = "info-window";
    editDialog.appendChild(infoWindow);

    info.addEventListener("mouseover", () => {
      const infoRect = info.getBoundingClientRect();
      const dialogRect = editDialog.getBoundingClientRect();
      const top = infoRect.top - dialogRect.top + infoRect.height - 10;
      const left = infoRect.left - dialogRect.left + infoRect.width + 15;
      infoWindow.style.top = `${top}px`;
      infoWindow.style.left = `${left}px`;
      infoWindow.style.display = "block";
    });
    info.addEventListener("mouseout", () => {
      infoWindow.style.display = "none";
    });

    wrapper.appendChild(p);
  });

  const actionContainer = document.createElement("div");
  actionContainer.className = "action-container";
  editDialog.appendChild(actionContainer);

  const saveImg = document.createElement("img");
  saveImg.src = "./icons/save.png";
  saveImg.className = "action";
  saveImg.onclick = saveChanges;
  actionContainer.appendChild(saveImg);

  const closeImg = document.createElement("img");
  closeImg.src = "./icons/close.png";
  closeImg.className = "action";
  closeImg.onclick = closeDialog;
  actionContainer.appendChild(closeImg);

  editDialog.style.display = "block";
}

function renameCharacter() {
  // Rename character logic here
  hasChanges = true;
}

function reassignCharacter() {
  // Reassign character logic here
  hasChanges = true;
}

function multipleAssignCharacter() {
  // Assign to multiple characters logic here
  hasChanges = true;
}

function removeCharacter() {
  // Remove character logic here
  hasChanges = true;
}

function restoreCharacter() {
  // Restore character logic here
  hasChanges = true;
}

function saveChanges() {
  document.querySelector("#edit-dialog").innerHTML = draftHTML;
  hasChanges = false;
  closeDialog();
}

function closeDialog() {
  const editDialog = document.querySelector("#edit-dialog");
  if (hasChanges) {
    confirmExit();
  } else {
    editDialog.style.display = "none";
    document.querySelector("#overlay").remove();
  }
}

function confirmExit() {
  const confirmation = confirm(
    "Exit without saving? All changes will be lost."
  );
  if (confirmation) {
    const editDialog = document.querySelector("#edit-dialog");
    editDialog.innerHTML = originalHTML;
    editDialog.style.display = "none";
    document.querySelector("#overlay").remove();
    hasChanges = false;
  }
}
