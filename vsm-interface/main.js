var horizontalSplit = Split([".section1", ".section2"], {
  sizes: [50, 50],
  minSize: 100,
  gutterSize: 2,
  cursor: "col-resize",
});

var verticalSplit = Split([".middle-container", ".bottom-container"], {
  direction: "vertical",
  sizes: [70, 30],
  minSize: [0, 50],
  gutterSize: 2,
  cursor: "row-resize",
});

function updateGutterSize() {
  // This code should be run after the tabs have been created.
  var tabs = document.querySelectorAll(".tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var activeTab = document.querySelector(".active-tab");
      if (activeTab) {
        activeTab.classList.remove("active-tab");

        // Hide the minButton of the previously active tab
        var minButton = activeTab.querySelector(".min-btn");
        if (minButton) {
          minButton.style.visibility = "hidden";
        }
      }

      // Add the active-tab class to the clicked tab
      tab.classList.add("active-tab");

      // Show the minButton of the clicked tab
      var minButton = tab.querySelector(".min-btn");
      if (minButton) {
        minButton.style.visibility = "visible";
      }
    });
  });
  var sectionContainer = document.querySelector(".sections-container");
  var gutter = sectionContainer ? sectionContainer.nextElementSibling : null; // Ensure gutter is selected only if sectionContainer exists

  if (tabs.length === 0) {
    // If no tabs are active, hide the gutter
    gutter.style.display = "none";
  } else {
    // If there are active tabs, show the gutter
    gutter.style.display = "block";
  }
}

var tasks = document.querySelectorAll(".task");
var bottomContainer = document.querySelector(".bottom-container");
var tabContainer = document.querySelector(".tab-container");
var section3 = document.querySelector(".section3");
var activeTab = null;

bottomContainer.style.display = "none";

function minimizeTab(tab) {
  tab.remove();
  if (tab === activeTab) {
    var anotherTab = document.querySelector(".tab");
    if (anotherTab) {
      activeTab = anotherTab;
      activeTab.classList.add("active-tab");
      var minButton = activeTab.querySelector(".min-btn");
      minButton.style.visibility = "visible";
    } else {
      activeTab = null;
    }
    updateContent();
  }
  updateGutterSize();
}

tasks.forEach(function (task) {
  task.addEventListener("click", function () {
    bottomContainer.style.display = "block";
    var existingTab = document.querySelector(
      ".tab[data-task='" + task.textContent + "']"
    );
    if (activeTab) {
      activeTab.classList.remove("active-tab");
      var minButton = activeTab.querySelector(".min-btn");
      if (minButton) {
        minButton.style.visibility = "hidden";
      }
    }
    if (existingTab) {
      if (existingTab === activeTab) {
        existingTab.remove();
        var anotherTab = document.querySelector(".tab");
        if (anotherTab) {
          activeTab = anotherTab;
          activeTab.classList.add("active-tab");
          var minButton = activeTab.querySelector(".min-btn");
          minButton.style.visibility = "visible";
        } else {
          activeTab = null;
        }
        updateContent();
      } else {
        // If the clicked task is an existing but inactive tab
        activeTab = existingTab;
        activeTab.classList.add("active-tab");
        var minButton = activeTab.querySelector(".min-btn");
        minButton.style.visibility = "visible";
        updateContent();
      }
    } else {
      var newTab = document.createElement("div");
      newTab.className = "tab";
      newTab.setAttribute("data-task", task.textContent);

      // Create a new span element and set its text content to the task text
      var span = document.createElement("span");
      span.textContent = task.textContent;

      // Append the span to the new tab instead of setting the tab's text content
      newTab.appendChild(span);

      var minButton = document.createElement("button");
      minButton.className = "min-btn";
      minButton.textContent = "⌄";
      minButton.style.visibility = "hidden";
      minButton.addEventListener("click", function (event) {
        event.stopPropagation();
        minimizeTab(newTab);
        updateGutterSize();
      });
      newTab.appendChild(minButton);
      tabContainer.appendChild(newTab);
      section3.innerHTML =
        '<div class="task-content">Content for ' + task.textContent + "</div>";
      activeTab = newTab;
      activeTab.classList.add("active-tab");
      minButton.style.visibility = "visible";
    }
    updateGutterSize();
  });
});

// Select the "swap-sides" buttons
var swapSidesButtons = document.querySelectorAll(".swap-sides");

// Select the sections
var section1 = document.querySelector(".section1");
var section2 = document.querySelector(".section2");

// Select the content divisions
var scriptContent = document.querySelector("#script-content");
var designContent = document.querySelector("#design-content");

// Select the bars
var scriptBar = document.querySelector(".script-bar");
var designBar = document.querySelector(".design-bar");
var leftVerticalDiv = document.querySelector(".vertical-div.left");
var rightVerticalDiv = document.querySelector(".vertical-div.right");

// Select the "swap-sides" buttons and their containers for better targeting
var leftSwapButton = document.querySelector(".vertical-div.left .swap-sides");
var rightSwapButton = document.querySelector(".vertical-div.right .swap-sides");

// Add event listener to the "swap-sides" buttons
swapSidesButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // Select the 'bottom' divs inside each vertical div for targeting
    var leftBottomDiv = leftVerticalDiv.querySelector(".bottom");
    var rightBottomDiv = rightVerticalDiv.querySelector(".bottom");

    if (scriptContent.parentNode === section1) {
      // Move the content to the other section
      section2.appendChild(scriptContent);
      section1.appendChild(designContent);

      // Insert the 'script-bar' before the 'bottom' div in the right vertical div
      rightVerticalDiv.insertBefore(scriptBar, rightBottomDiv);

      // Insert the 'design-bar' before the 'bottom' div in the left vertical div
      leftVerticalDiv.insertBefore(designBar, leftBottomDiv);
    } else {
      // Move the content back to the original sections
      section1.appendChild(scriptContent);
      section2.appendChild(designContent);

      // Insert the 'script-bar' back before the 'bottom' div in the left vertical div
      leftVerticalDiv.insertBefore(scriptBar, leftBottomDiv);

      // Insert the 'design-bar' back before the 'bottom' div in the right vertical div
      rightVerticalDiv.insertBefore(designBar, rightBottomDiv);
    }
  });
});
