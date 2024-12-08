document.addEventListener("DOMContentLoaded", () => {
  const inputs = Array.from(document.querySelectorAll(".box input"));
  const checkButton = document.getElementById("check");
  const hintsDisplay = document.getElementById("hints");
  let chosenCode = "";
  let hints = [];

  // Load a random code and its hints
  fetch("codes.json")
    .then((response) => response.json())
    .then((data) => {
      const keys = Object.keys(data);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      chosenCode = data[randomKey].code;
      hints = data[randomKey].hints;

      // Display hints
      hintsDisplay.innerHTML = `<strong>Hints:</strong> <br><br>${hints
        .map((hint, index) => `${index + 1}: ${hint}`)
        .join("<br><br>")}`;
    })
    .catch((error) => console.error("Error loading JSON:", error));

  // Check the entered code
  checkButton.addEventListener("click", () => {
    const enteredCode = inputs.map((input) => input.value).join("");
    if (enteredCode.length !== 5) {
      alert("Please fill in all the boxes!");
      return;
    }

    // Compare entered code with the chosen code
    for (let i = 0; i < 5; i++) {
      if (enteredCode[i] === chosenCode[i]) {
        inputs[i].style.backgroundColor = "green"; // Correct digit
      } else {
        inputs[i].style.backgroundColor = "red"; // Incorrect digit
      }
    }

    if (enteredCode === chosenCode) {
      alert("Congratulations! The safe has opened!");
    }
  });
});
