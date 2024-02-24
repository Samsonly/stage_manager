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
    //TODO: ask about depreciated portion below
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
    }
  });
});

designIcons.forEach((icon) => {
  icon.addEventListener("click", (event) => {
    //TODO: ask about depreciated portion below
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
      const scriptIcons = document.querySelectorAll(".scriptIcons img");
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
  const characterNames = document.querySelectorAll(".characterName");
  const textContents = Array.from(characterNames).map(
    (characterName) => characterName.textContent
  );
  const uniqueTextContents = [...new Set(textContents)];
  uniqueTextContents.forEach((textContent) => {
    const p = document.createElement("p");
    p.textContent = textContent;
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
  const actTitles = document.querySelectorAll(".actTitle");
  actTitles.forEach((actTitle) => {
    const act = document.createElement("p");
    act.textContent = actTitle.textContent;
    tableOfContents.appendChild(act);
    const sceneTitles = actTitle.parentNode.querySelectorAll(".sceneTitle");
    sceneTitles.forEach((sceneTitle) => {
      const scene = document.createElement("p");
      scene.textContent = sceneTitle.textContent;
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

function viewScript() {
  const playContent = document.querySelector(".playStructure");
  const scriptContent = document.querySelector("#script-content");
  const children = scriptContent.children;
  for (let i = 0; i < children.length; i++) {
    children[i].style.display = "none";
  }
  document.querySelector(".playStructure").style.display = "block";
}

let uploadedPdf = null; // global variable to store the uploaded PDF

function viewGroundplan() {
  if (uploadedPdf === null) {
    // Prompt the user to upload a PDF
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "application/pdf";
    fileInput.style.display = "none";

    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        uploadedPdf = event.target.result; // Store the uploaded PDF
        displayPdf(uploadedPdf);
      };

      reader.readAsDataURL(file);
    });

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  } else {
    // Display the uploaded PDF
    displayPdf(uploadedPdf);
  }
}

function displayPdf(pdf) {
  const designContent = document.querySelector("#design-content");
  const children = designContent.children;
  for (let i = 0; i < children.length; i++) {
    children[i].style.display = "none";
  }

  let pdfContainer = document.querySelector(".groundplan");

  // If the container doesn't exist, create it
  if (pdfContainer === null) {
    pdfContainer = document.createElement("div");
    pdfContainer.className = "groundplan";
    designContent.appendChild(pdfContainer);
  }

  pdfContainer.style.display = "block";

  // Create an object element to display the PDF
  const object = document.createElement("object");
  object.data = pdf + "#toolbar=0"; // Try to hide the toolbar
  object.type = "application/pdf";
  object.width = "100%";
  object.style.height = "100%"; // Set height relative to the viewport
  object.style.objectFit = "contain"; // Scale the object to fit its container

  // Clear the previous PDF and append the new one
  pdfContainer.innerHTML = "";
  pdfContainer.appendChild(object);
}
