document.addEventListener("DOMContentLoaded", () => {
  const inputs = Array.from(document.querySelectorAll(".box input"));
  const checkButton = document.getElementById("check");
  const hintsDisplay = document.getElementById("hints");
  const triesDisplay = document.getElementById("tries");
  const winsDisplay = document.getElementById("wins");
  let chosenCode = "";
  let lastChosenCode = "";
  let hints = [];
  let tries = 3;
  let consecutiveWins = 0;

  function resetGame() {
    tries = 3;
    triesDisplay.innerHTML = `Tries remaining: ${tries}`;
    winsDisplay.innerHTML = `Consecutive Wins: ${consecutiveWins}`;
    inputs.forEach((input) => {
      input.value = "";
      input.style.backgroundColor = "";
    });
  }

  fetch("codes.json")
    .then((response) => response.json())
    .then((data) => {
      const keys = Object.keys(data);
      let randomKey;
      do {
        randomKey = keys[Math.floor(Math.random() * keys.length)];
      } while (data[randomKey].code === lastChosenCode);

      chosenCode = data[randomKey].code;
      lastChosenCode = chosenCode;
      hints = data[randomKey].hints;

      hintsDisplay.innerHTML = `<strong>Hints:</strong> <br><br>${hints
        .map((hint, index) => `${index + 1}: ${hint}`)
        .join("<br><br>")}`;

      resetGame();
    })
    .catch((error) => console.error("Error loading JSON:", error));

  checkButton.addEventListener("click", () => {
    const enteredCode = inputs.map((input) => input.value).join("");
    if (enteredCode.length !== 5) {
      alert("Please fill in all the boxes!");
      return;
    }

    if (enteredCode === chosenCode) {
      for (let i = 0; i < 5; i++) {
        inputs[i].style.backgroundColor = "green";
      }

      const body = document.body;
      const diamondContainer = document.createElement("div");
      diamondContainer.style.position = "fixed";
      diamondContainer.style.top = "0";
      diamondContainer.style.left = "0";
      diamondContainer.style.width = "100%";
      diamondContainer.style.height = "100%";
      diamondContainer.style.pointerEvents = "none";
      diamondContainer.style.overflow = "hidden";
      body.appendChild(diamondContainer);

      for (let i = 0; i < 50; i++) {
        const diamond = document.createElement("div");
        diamond.style.position = "absolute";
        diamond.style.width = "20px";
        diamond.style.height = "20px";
        diamond.style.backgroundImage = "url('diamond.png')";
        diamond.style.backgroundSize = "cover";
        diamond.style.top = `${Math.random() * 100}%`;
        diamond.style.left = `${Math.random() * 100}%`;
        diamond.style.animation = `fly 1.5s ease-out forwards ${Math.random()}s`;

        diamondContainer.appendChild(diamond);
      }

      const style = document.createElement("style");
      style.textContent = `
      @keyframes fly {
        0% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        100% {
          transform: translateY(-200px) scale(0.5);
          opacity: 0;
        }
      }`;
      document.head.appendChild(style);

      setTimeout(() => {
        alert("Congratulations! The safe has opened! You found a Diamond");
        consecutiveWins++;
        winsDisplay.innerHTML = `Consecutive Wins: ${consecutiveWins}`;
        if (consecutiveWins >= 5) {
          window.location.href = "congratulations.html";
        } else {
          fetch("codes.json")
            .then((response) => response.json())
            .then((data) => {
              const keys = Object.keys(data);
              let randomKey;
              do {
                randomKey = keys[Math.floor(Math.random() * keys.length)];
              } while (data[randomKey].code === lastChosenCode);

              chosenCode = data[randomKey].code;
              lastChosenCode = chosenCode;
              hints = data[randomKey].hints;
              hintsDisplay.innerHTML = `<strong>Hints:</strong> <br><br>${hints
                .map((hint, index) => `${index + 1}: ${hint}`)
                .join("<br><br>")}`;
              resetGame();
            });
        }
      }, 1500);
    } else {
      tries--;
      triesDisplay.innerHTML = `Tries remaining: ${tries}`;
      if (tries === 0) {
        alert("Uh-Oh, you've been caught. Try Again");
        consecutiveWins = 0;
        winsDisplay.innerHTML = `Consecutive Wins: ${consecutiveWins}`;
        window.location.href = "index.html";
        return;
      }

      for (let i = 0; i < 5; i++) {
        inputs[i].style.backgroundColor =
          enteredCode[i] === chosenCode[i] ? "green" : "red";
      }
    }
  });
});
