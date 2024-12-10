document.addEventListener("DOMContentLoaded", () => {
  const inputs = Array.from(document.querySelectorAll(".box input"));
  const checkButton = document.getElementById("check");
  const hintsDisplay = document.getElementById("hints");
  const triesDisplay = document.getElementById("tries");
  let chosenCode = "";
  let hints = [];
  let tries = 3;

  fetch("codes.json")
    .then((response) => response.json())
    .then((data) => {
      const keys = Object.keys(data);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      chosenCode = data[randomKey].code;
      hints = data[randomKey].hints;

      triesDisplay.innerHTML = `Tries remaining: ${tries}`;
      // Display hints
      hintsDisplay.innerHTML = `<strong>Hints:</strong> <br><br>${hints
        .map((hint, index) => `${index + 1}: ${hint}`)
        .join("<br><br>")}`;
    })
    .catch((error) => console.error("Error loading JSON:", error));

  checkButton.addEventListener("click", () => {
    const enteredCode = inputs.map((input) => input.value).join("");
    if (enteredCode.length !== 5) {
      alert("Please fill in all the boxes!");
      return;
    }

    if (enteredCode === chosenCode) {
      alert("Congratulations! The safe has opened!");
    } else {
      tries--;
      triesDisplay.innerHTML = `Tries remaining: ${tries}`;

      if (tries == 0) {
        alert("Safe Unable to Unlock");
        location.reload();
      }

      for (let i = 0; i < 5; i++) {
        if (enteredCode[i] === chosenCode[i]) {
          inputs[i].style.backgroundColor = "green";
        } else {
          inputs[i].style.backgroundColor = "red";
        }
      }
    }
  });
});
