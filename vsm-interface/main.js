const horizontalSplit = Split([".section1", ".section2"], {
  sizes: [50, 50],
  minSize: 100,
  gutterSize: 2,
  cursor: "col-resize",
});

const verticalSplit = Split([".middle-container", ".bottom-container"], {
  direction: "vertical",
  sizes: [70, 30],
  minSize: [0, 50],
  gutterSize: 2,
  cursor: "row-resize",
});

let activeTab = null;

function updateGutterSize() {
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
  // const sectionContainer = document.querySelector(".sections-container");
  // const gutter = sectionContainer ? sectionContainer.nextElementSibling : null;
  // gutter.style.display = tabs.length === 0 ? "none" : "block";
  // bottomContainer.style.display = tabs.length === 0 ? "none" : "block";
}

const tasks = document.querySelectorAll(".task");
const bottomContainer = document.querySelector(".bottom-container");
const tabContainer = document.querySelector(".tab-container");
const section3 = document.querySelector(".section3");

bottomContainer.style.display = "none";

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
  updateGutterSize();
}

tasks.forEach((task) => {
  task.addEventListener("click", () => {
    bottomContainer.style.display = "block";
    const existingTab = document.querySelector(
      `.tab[data-task='${task.textContent}']`
    );
    if (activeTab) {
      activeTab.classList.remove("active-tab");
      const minButton = activeTab.querySelector(".min-btn");
      if (minButton) {
        minButton.style.visibility = "hidden";
      }
    }
    if (existingTab) {
      if (existingTab === activeTab) {
        minimizeTab(existingTab);
      } else {
        activeTab = existingTab;
        activeTab.classList.add("active-tab");
        const minButton = activeTab.querySelector(".min-btn");
        minButton.style.visibility = "visible";
        document.querySelector(
          ".section3"
        ).innerHTML = `<h1>${task.textContent}</h1>`;
      }
    } else {
      const newTab = document.createElement("div");
      newTab.className = "tab";
      newTab.setAttribute("data-task", task.textContent);
      const span = document.createElement("span");
      span.textContent = task.textContent;
      newTab.appendChild(span);
      const minButton = document.createElement("button");
      minButton.className = "min-btn";
      minButton.textContent = "⌄";
      minButton.style.visibility = "hidden";
      minButton.addEventListener("click", (event) => {
        event.stopPropagation();
        minimizeTab(newTab);
        updateGutterSize();
      });
      newTab.appendChild(minButton);
      tabContainer.appendChild(newTab);
      activeTab = newTab;
      activeTab.classList.add("active-tab");
      minButton.style.visibility = "visible";
      document.querySelector(
        ".section3"
      ).innerHTML = `<h1>${task.textContent}</h1>`;
    }
    updateGutterSize();
  });
});

const swapSidesButtons = document.querySelectorAll(".swap-sides");
const section1 = document.querySelector(".section1");
const section2 = document.querySelector(".section2");
const scriptContent = document.querySelector("#script-content");
const designContent = document.querySelector("#design-content");
const scriptBar = document.querySelector(".script-bar");
const designBar = document.querySelector(".design-bar");
const leftVerticalDiv = document.querySelector(".vertical-div.left");
const rightVerticalDiv = document.querySelector(".vertical-div.right");
const leftSwapButton = document.querySelector(".vertical-div.left .swap-sides");
const rightSwapButton = document.querySelector(
  ".vertical-div.right .swap-sides"
);

swapSidesButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const leftBottomDiv = leftVerticalDiv.querySelector(".bottom");
    const rightBottomDiv = rightVerticalDiv.querySelector(".bottom");
    if (scriptContent.parentNode === section1) {
      section2.appendChild(scriptContent);
      section1.appendChild(designContent);
      // rightVerticalDiv.insertBefore(scriptBar, rightBottomDiv);
      // leftVerticalDiv.insertBefore(designBar, leftBottomDiv);
    } else {
      section1.appendChild(scriptContent);
      section2.appendChild(designContent);
      // leftVerticalDiv.insertBefore(scriptBar, leftBottomDiv);
      // rightVerticalDiv.insertBefore(designBar, rightBottomDiv);
    }
    if (scriptBar.parentNode === leftVerticalDiv) {
      rightVerticalDiv.insertBefore(scriptBar, rightBottomDiv);
      leftVerticalDiv.insertBefore(designBar, leftBottomDiv);
    } else {
      leftVerticalDiv.insertBefore(scriptBar, leftBottomDiv);
      rightVerticalDiv.insertBefore(designBar, rightBottomDiv);
    }
  });
});
