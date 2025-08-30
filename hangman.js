let questionData = [];
let currentQuestion = {};
let displayedAnswer = [];
let lives = 6;

// try fetching from API, fallback to local data if it fails
async function fetchQuestions() {
  try {
    const res = await fetch("http://codeapi.net.cws18.my-hosting-panel.com/hangman.php");
    if (!res.ok) throw new Error("Bad response");
    questionData = await res.json();
  } catch (e) {
    console.warn("API failed, using local questions instead.");
    questionData = [
      { Question: "Where is the head office of Code Quotient ?", Answer: "Mohali" },
      { Question: "What is the Capital of Himachal Pradesh ?", Answer: "Shimla" }
    ];
  }
  startGame();
}

function startGame() {
  // pick a random question out of the list
  currentQuestion = questionData[Math.floor(Math.random() * questionData.length)];

  // show the question text
  document.getElementById("question").innerText = currentQuestion.Question;

  // build the answer string with underscores (spaces remain)
  displayedAnswer = currentQuestion.Answer.split("").map(ch => ch === " " ? " " : "_");
  document.getElementById("answer").innerText = displayedAnswer.join(" ");

  // reset lives each round
  lives = 6;
  document.getElementById("lives").innerText = `Lives: ${lives}`;

  // clear any old win/lose messages
  document.getElementById("message").innerText = "";

  // draw all the A–Z buttons
  renderLetters();
}

function renderLetters() {
  const lettersDiv = document.getElementById("letters");
  lettersDiv.innerHTML = "";

  // loop through ASCII A–Z (65 → 90)
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    const btn = document.createElement("button");
    btn.innerText = letter;
    btn.onclick = () => checkLetter(letter, btn);
    lettersDiv.appendChild(btn);
  }
}

function checkLetter(letter, btn) {
  // once clicked, lock the button
  btn.disabled = true;
  let correct = false;

  // check each character in answer
  currentQuestion.Answer.split("").forEach((ch, idx) => {
    if (ch.toLowerCase() === letter.toLowerCase()) {
      displayedAnswer[idx] = ch; // reveal matching letter
      correct = true;
    }
  });

  document.getElementById("answer").innerText = displayedAnswer.join(" ");

  // wrong guess → lose a life
  if (!correct) {
    lives--;
    document.getElementById("lives").innerText = `Lives: ${lives}`;
  }

  // if no underscores left → all letters guessed
  if (!displayedAnswer.includes("_")) {
    document.getElementById("message").innerText = "🎉 You Won!";
    disableAll();
  }

  // if no lives → game over
  if (lives === 0) {
    document.getElementById("message").innerText = "💀 Game Over!";
    disableAll();
  }
}

// quick way to lock all buttons
function disableAll() {
  document.querySelectorAll("#letters button").forEach(btn => btn.disabled = true);
}

// kick off game
fetchQuestions();
