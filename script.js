// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount = 0;
let equationsArray = [];
let playersGuessArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0'


// Scroll
let valueY = 0;

// Refresh Splash Page Best Scores
function bestScoresToDOM() {
  // update best score spans
  // best score as an argument is the value of the array and index is corresponding index.
  bestScores.forEach((bestScore, index) => {
    const bestScoreEl = bestScore;
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}s`;

  })
  bestScoreArray.forEach((obj) => {
    let num = obj.questions
    // let num = getRadioValue()
    if (radioInputs.id === `value-${num}`) {
      bestScores.textContent = `Best Score: ${obj.bestScore}`
    }
  })
}

// check Local storage for best scores, set best scoreArray
function getSavedBestScore() {
  // localstorage= webserver
  if (localStorage.getItem('best scores')) {
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 25, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay },
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray))
  }
  bestScoresToDOM();
}

// Update best Score Array

function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    if (questionAmount == score.questions) {
       console.log(questionAmount, score.questions)
      // return best score as number with one decimal
      const savedBestScore = Number(bestScoreArray[index].bestScore)
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  })
  bestScoresToDOM();
  // save to local storage
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray))
}


// Reset Game
function playAgain() {
  gamePage.addEventListener('click', startTimer);
  showSplashPage();
  equationsArray = []
  playersGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}

// Format and Display Time in Dom
function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTime}s`
  penaltyTimeEl.textContent = `Penalty Time: +${penaltyTime}s`
  finalTimeEl.textContent = `Final Time: ${finalTimeDisplay}s`
  updateBestScore();
  // Scroll to the Top of item container
  itemContainer.scrollTo({ top: 0, behavior: 'instant' })

  showScorePage()
};



// Show Score page
function showScorePage() {
  // show play again button after 1 second
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
  scorePage.hidden = false;
  gamePage.hidden = true;
}

// Show Game Page
function showSplashPage() {
  scorePage.hidden = true;
  splashPage.hidden = false;

}

// Stop Timer, Process Results, go to score page
function checkTime() {
  console.log(timePlayed);
  if (playersGuessArray.length == questionAmount) {
    console.log('player guess array:', playersGuessArray)
    clearInterval(timer)
    console.log('equationsArray', equationsArray)
    equationsArray.forEach((value, index) => {
      if (value.evaluated === playersGuessArray[index]) {
        // answer is correct so no actions are taken here.
      } else {
        penaltyTimeCalculator()
      }
    })
    // Final Time
    finalTime = timePlayed + penaltyTime
    console.log('time', timePlayed, 'penaltyTime', penaltyTime, 'final:', finalTime)
    scoresToDOM();
  }
}


// evaluate each guess
function penaltyTimeCalculator() {
  penaltyTime += 0.5

}
//  final time + penalty time
// Add a 10th of second to timePlayed
function addTime() {
  timePlayed += 0.1;
  checkTime();
}

// start timer when game page is clicked
function startTimer() {
  // Reset Times
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  // this function goes off 10 times per second.
  timer = setInterval(addTime, 100)
  // remove event listener so that start-timer function is only ran once.
  gamePage.removeEventListener('click', startTimer)

}


// scroll and store user selection in playerGuessArray
// how do you check that guessedTrue indeed checks whether value is true?
function select(guessedTrue) {
  valueY += 80
  itemContainer.scroll(0, valueY)
  // add player guess to array
  return guessedTrue ? playersGuessArray.push('true') : playersGuessArray.push('false')
}

// Display Game Page()
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

// Get Random number upto max number
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount)
  console.log('correct eq', correctEquations)

  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations
  console.log('wrong eq', wrongEquations)

  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9)
    secondNumber = getRandomInt(9)
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3)
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
  // equationsToDOM() 
}




// Add equations to DOM

function equationsToDOM() {
  equationsArray.forEach((equation) => {
    // Create div and give it class of item
    const item = document.createElement('div')
    item.classList.add('item')
    // Create h1 and give it equation as value
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    // append h1 to the div, append total div to overall item container div.
    item.appendChild(equationText)
    itemContainer.appendChild(item)

  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  //   // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations()
  equationsToDOM()

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

// Displays 3 2 1 go!
function countdownStart() {
  countdown.textContent = '3'
  setTimeout(() => {
    countdown.textContent = '2';
  }, 1000);
  setTimeout(() => {
    countdown.textContent = '1';
  }, 2000);
  setTimeout(() => {
    countdown.textContent = 'GO!';
  }, 3000);
}

// navigate splash page to countdown page
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdownStart()
  // createEquations()
  populateGamePage()
  setTimeout(showGamePage, 400);
}

// Get value from selected radio button
function getRadioValue() {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

// Form that decides amount of questions
function selectQuestionAmount(event) {
  event.preventDefault();
  questionAmount = getRadioValue();
  console.log('question amount:', questionAmount);
  if (questionAmount) {
    showCountdown()
  }
  // countdownStart()
  // createEquations()

}
startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
    // Reset: remove selected label
    radioEl.classList.remove('selected-label');
    // Add it back if radio input is checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add('selected-label')
    }
  })
})

// Event Listeners
startForm.addEventListener('submit', selectQuestionAmount)
gamePage.addEventListener('click', startTimer)

// on Load
getSavedBestScore();