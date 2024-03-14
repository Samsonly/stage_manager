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
