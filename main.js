const MIN_NUMBER = 1;
const MAX_NUMBER = 500;

const minNumberSpan = document.querySelector("#minNumberSpan");
const maxNumberSpan = document.querySelector("#maxNumberSpan");
const startButton = document.querySelector("#startButton");
const restartButton = document.querySelector("#restartButton");
const limiteDiv = document.querySelector("#limiteDiv");
const propositionForm = document.querySelector("#propositionForm");
const errorDiv = document.querySelector("#errorDiv");
const playerPropositionInput = document.querySelector("#playerProposition");
const maxAndMinPlayedDiv = document.querySelector("#maxAndMinPlayed");
const attemptDiv = document.querySelector("#attemptDiv");

const minLimiteSpan = document.createElement("span");
const maxLimiteSpan = document.createElement("span");
const minPlayedSpan = document.createElement("span");
const maxPlayedSpan = document.createElement("span");
const questionDiv = document.createElement("span");
const indicatorDiv = document.createElement("div");

const minNumberNode = document.createTextNode(MIN_NUMBER.toString());
const maxNumberNode = document.createTextNode(MAX_NUMBER.toString());

let game = null;

minNumberSpan?.appendChild(minNumberNode);
maxNumberSpan?.appendChild(maxNumberNode);

minLimiteSpan.innerText = MIN_NUMBER.toString();
minLimiteSpan.classList.add("p-5");
maxLimiteSpan.innerText = MAX_NUMBER.toString();
maxLimiteSpan.classList.add("p-5");

limiteDiv?.appendChild(minLimiteSpan);
limiteDiv?.appendChild(indicatorDiv);
limiteDiv?.appendChild(maxLimiteSpan);

maxAndMinPlayedDiv?.appendChild(minPlayedSpan);
questionDiv.textContent = "?";
maxAndMinPlayedDiv?.appendChild(questionDiv)
maxAndMinPlayedDiv?.appendChild(maxPlayedSpan);

indicatorDiv.classList.add("indicator");

startButton?.addEventListener("click", () => {
  const startDiv = document.querySelector("#startDiv");
  const gameDiv = document.querySelector("#gameDiv");
  startDiv?.classList.add("hidden");
  gameDiv?.classList.remove("hidden");
  startNewGame();
})

playerPropositionInput?.addEventListener("click", () => {
  // @ts-ignore
  errorDiv.textContent = "";
})

propositionForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  // @ts-ignore
  const form = new FormData(event.currentTarget);
  const playerProposition = Number(form.get("playerProposition"))
  const result = game.testProposition(playerProposition)

  // @ts-ignore
  errorDiv.textContent = result;

})

restartButton?.addEventListener("click", () => {
  startNewGame();
})

/**
 * 
 * @param {number} max 
 * @param {number} min 
 * @returns 
 */
const random = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

const startNewGame = () => {
  game.start();
}

class Game {
  constructor() {
    this._attempt = 0;
    this._playerNumber = 0;
    this._numberToGuess = 0;
    this._minPlayedNumber = MIN_NUMBER - 1;
    this._maxPlayedNumber = MAX_NUMBER + 1;
    this._minPercent = 0;
    this._maxPercent = 100;
  }

  start() {
    this._attempt = 0;
    // @ts-ignore
    attemptDiv.textContent = this._attempt;
    this._numberToGuess = random(MIN_NUMBER, MAX_NUMBER);
    // @ts-ignore
    errorDiv.textContent = "";
    minPlayedSpan.textContent = `${MIN_NUMBER - 1} <`;
    maxPlayedSpan.textContent = `< ${MAX_NUMBER + 1}`;
    this._minPercent = 0;
    this._maxPercent = 100;
    indicatorDiv.style.background = `linear-gradient(to right, red ${this._minPercent}%, white ${this._minPercent}% ${this._maxPercent}%, red ${this._maxPercent}%)`;
  }

  /**
   * 
   * @param {number} playerProposition 
   * @returns 
   */
  isValidNumber(playerProposition) {
    if (!playerProposition || Number.isNaN(playerProposition) || playerProposition < 1 || playerProposition > 500) {
      return false;
    }
    this._playerNumber = playerProposition;
    return true;
  }

  /**
   * 
   * @param {number} playerProposition 
   * @returns 
   */
  testProposition(playerProposition) {
    if (!this.isValidNumber(playerProposition)) {
      return `Veuillez saisir un nombre entre ${MIN_NUMBER} et ${MAX_NUMBER}`;
    }
    this.attemptIncrease();
    if (this._playerNumber > this._numberToGuess) {
      this.updateMaxPlayedNumber();
      return "Le nombre à trouver est plus petit";
    }
    if (this._playerNumber < this._numberToGuess) {
      this.updateMinPlayedNumber();
      return "Le nombre à trouver est plus grand";
    }
    return `Vous avez gagné en ${this._attempt} coup(s)`;
  }

  updateMaxPlayedNumber() {
    if (this._playerNumber < this._maxPlayedNumber) {
      this._maxPlayedNumber = this._playerNumber;
      maxPlayedSpan.textContent = `< ${this._maxPlayedNumber}`;
      this.updateIndicator();
    }
  }

  updateMinPlayedNumber() {
    if (this._playerNumber > this._minPlayedNumber) {
      this._minPlayedNumber = this._playerNumber;
      minPlayedSpan.textContent = `${this._minPlayedNumber} <`;
      this.updateIndicator();
    }
  }

  updateIndicator() {
    this._minPercent = this._minPlayedNumber * 100 / MAX_NUMBER;
    this._maxPercent = this._maxPlayedNumber * 100 / MAX_NUMBER;
    indicatorDiv.style.background = `linear-gradient(to right, red ${this._minPercent}%, white ${this._minPercent}% ${this._maxPercent}%, red ${this._maxPercent}%)`;
  }

  attemptIncrease() {
    this._attempt++;
    // @ts-ignore
    attemptDiv.textContent = this._attempt;
  }

}

game = new Game();