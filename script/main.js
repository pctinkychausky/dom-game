import { words } from "./fixtures.js";
import { getRandomIntInclusive } from "./lib.js";

//setting state
let guessesRemaining = 10;
let won = false;

//put the guess into array (group them into an object)
let guessedLetters = Object.seal({
  correct: [],
  incorrect: [],
  get guesses() {
    return [...this.correct, ...this.incorrect];
  },
});

//Jame's practice
const hiddenClass = "hidden";
const winClass = "won";
const loseClass = "lost";

//pickedWord will change everytime
let pickedWord = null;

//set the answer and save it in storage
const wordStorageKey = "word";
const savedWord = localStorage.getItem(wordStorageKey);

if (savedWord) {
  pickedWord = savedWord;
} else {
  pickedWord = words[getRandomIntInclusive(0, words.length - 1)];
  localStorage.setItem(wordStorageKey, pickedWord);
}

//capitalizeFirstLetter for image
function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
let imageName = capitalizeFirstLetter(savedWord);
const imageLink = document.getElementById("image");

imageLink.src = `/animals-images/${imageName}.png`;
console.log(
  "🚀 ~ file: main.js ~ line 122 ~ updateDOM ~ imageLink.src",
  imageLink.src
);

//setting numbers of blank
const stringDisplay = document.getElementById("blanking");
let blankingString = `_ `.repeat(pickedWord.length);

stringDisplay.textContent = blankingString;

const goodGuessDisplay = document.getElementById("good-guesses");
const badGuessDisplay = document.getElementById("bad-guesses");

const guessesRemainingDisplay = document.getElementById("guesses-remaining");
guessesRemainingDisplay.textContent = guessesRemaining;

const message = document.getElementById("message");

//set up guess form
const guessInput = document.getElementById("guess");
const guessForm = document.forms["guess-form"];
guessForm.addEventListener("submit", (e) => {
  e.preventDefault();
  takeTurn(guessInput.value.toLowerCase());
  guessForm.reset();
  guessInput.focus();
});

function takeTurn(guess) {
  console.log(guess);
  console.log(JSON.parse(JSON.stringify(guessedLetters.guesses)));

  //deal with duplicate
  if (guessedLetters.guesses.includes(guess)) {
    message.textContent = `You have already picked ${guess}`;
    return;
  }

  //deak with guesses
  if (pickedWord.includes(guess)) {
    console.log("correct");
    guessedLetters.correct.push(guess);
  } else {
    console.log("incorrect");
    guessedLetters.incorrect.push(guess);

    guessesRemaining = guessesRemaining - 1;
  }

  checkWin();
  updateDOM();
}

let lettersRequired = Array.from(new Set(pickedWord)); // g,r,a,s
let sortedRequiredLetters = lettersRequired.sort().join("");

function checkWin() {
  const sortedGuesses = guessedLetters.correct.slice().sort().join("");
  if (sortedGuesses === sortedRequiredLetters) {
    won = true;
    localStorage.removeItem(wordStorageKey);
  }
}

function updateDOM() {
  //clear messages
  message.textContent = "";

  if (won) {
    //deal with winning
    message.textContent = `YOU WON!!! 🥳 The word was '${pickedWord}'!`;
    document.body.classList.add(winClass);
  } else if (!guessesRemaining) {
    //no remaining =lose
    message.textContent = `YOU LOSE!!! 😭🤡 The word was '${pickedWord}!'`;
    document.body.classList.add(loseClass);
  }

  //update user on guesses remaining
  guessesRemainingDisplay.textContent = guessesRemaining;

  //sort out blanking string

  blankingString = pickedWord
    .split("")
    .map((letter) =>
      guessedLetters.correct.includes(letter) ? `${letter} ` : "_ "
    )
    .join("");
  stringDisplay.textContent = blankingString;

  goodGuessDisplay.textContent = guessedLetters.correct.join(" ,") + " ";

  // Show list separator if required
  if (guessedLetters.incorrect.length && guessedLetters.correct.length) {
    seperator.classList.remove(hiddenClass);
  }

  badGuessDisplay.textContent = guessedLetters.incorrect.join(" ,") + " ";
}
