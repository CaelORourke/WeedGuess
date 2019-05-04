const wordGuess = (function () {
    let currentWord = "";
    let gameLost = false;
    let gameStarted = false;
    let gameWon = false;
    let guessesRemaining = 6;
    let lettersGuessed = [];
    let lettersInWord = [];
    let lettersToDisplay = [];
    let losses = 0;
    let score = 0;
    let wins = 0;

    function chooseRandomWord() {
        currentWord = wordsToGuess[Math.floor(Math.random() * wordsToGuess.length)];
        console.log(`currentWord='${currentWord}'`);
    };

    function getLetterScore(letters) {
        let score = 0;
        for (let i = 0; i < letters.length; ++i) {
            score += letterScores[letters[i]] || 0;
        }
        return score;
    };

    function setLettersToDisplay() {
        lettersInWord = currentWord.split("");

        for (let i = 0; i < lettersInWord.length; i++) {
            if (lettersInWord[i] === " ") {
                lettersToDisplay[i] = " ";
            }
            else if (lettersInWord[i] === "-") {
                lettersToDisplay[i] = "-";
            }
            else {
                lettersToDisplay[i] = "_";
            }
        }
        // console.log(lettersToDisplay);
    };

    function updateLettersToDisplay(letter) {
        for (let i = 0; i < lettersInWord.length; i++) {
            if (letter === lettersInWord[i].toLowerCase()) {
                lettersToDisplay[i] = lettersInWord[i];
            }
        }
    };

    return {
        getGameStarted() {
            return gameStarted;
        },

        getGuessesRemaining() {
            return guessesRemaining;
        },

        getLettersGuessed() {
            return lettersGuessed;
        },

        getLettersToDisplay() {
            return lettersToDisplay;
        },

        getLosses() {
            return losses;
        },

        getScore() {
            return score;
        },

        getWins() {
            return wins;
        },

        hasGuessedLetter(letter) {
            if (lettersGuessed.indexOf(letter) > -1) {
                return true;
            }
            else {
                lettersGuessed.push(letter);
                lettersGuessed.sort();
                return false;
            }
        },

        hasUserLost() {
            return gameWon;
        },

        hasUserWon() {
            return gameLost;
        },

        isLetterInWord(letter, timeRemaining) {
            if ((currentWord.indexOf(letter) > -1) || (currentWord.indexOf(letter.toUpperCase()) > -1)) {
                // console.log("correct guess");
                updateLettersToDisplay(letter);

                // check if user won
                if (lettersInWord.toString() === lettersToDisplay.toString()) {
                    wins++;
                    // score points for letters in the word
                    score += getLetterScore(lettersInWord) * 100;

                    if (timeRemaining > 0) {
                        // score points for time remaining
                        score += (timeRemaining * 10);
                    }
                    gameLost = true;
                }

                return true;
            }
            else {
                guessesRemaining--;

                // check if user lost
                if (guessesRemaining < 1) {
                    losses++;
                    gameWon = true;
                }

                return false;
            }
        },

        newRound() {
            guessesRemaining = 6;
            lettersInWord = [];
            lettersToDisplay = [];
            lettersGuessed = [];
            chooseRandomWord();
            setLettersToDisplay();
            gameWon = false;
            gameLost = false;
            gameStarted = true;
        },

        resetGame() {
            wins = 0;
            losses = 0;
            score = 0;
            gameStarted = false;
        }
    };
})();
