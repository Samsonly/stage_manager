const placeholders = {
  "{play1}": "[Damsels]",
  "{pdes1}":
    "[Here is where there would be information about the play regardless of act or scenes]",
  "{act1}": "[Act I]",
  "{ades1}": "[This is exclusively for act descriptions]",
  // Add more placeholders as needed
};

const tags = [
  "{play1}",
  "{pdes1}",
  "{act1}",
  "{ades1}",
  // List all tags in the order they appear
];

document.addEventListener("DOMContentLoaded", () => {
  tags.forEach((tag) => {
    let content = placeholders[tag]; // Get content associated with the tag
    let element;

    // Determine where to place the content based on the tag
    if (tag.startsWith("{play")) {
      element = document.getElementById("playDescription");
    } else if (tag.startsWith("{act")) {
      element = document.getElementById("actsContainer");
      // You can create a new div for each act if needed
    }
    // Add more conditions as needed

    // Create a new element for the content and append it to the correct container
    if (element) {
      let newElement = document.createElement("div");
      newElement.innerHTML = content; // Set the content
      element.appendChild(newElement);
    }
  });
});
