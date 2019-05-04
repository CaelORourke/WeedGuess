var wordGuess = (function () {
    var wins = 0;
    var losses = 0;
    var guessesRemaining = 6;
    var currentWord = "";
    var lettersInWord = [];
    var lettersToDisplay = [];
    var lettersGuessed = [];
    var gameStarted = false;
    var score = 0;

    function chooseRandomWord() {
        currentWord = wordsToGuess[Math.floor(Math.random() * wordsToGuess.length)];
        console.log("currentWord='" + currentWord + "'");
    };

    function getLetterScore(letters) {
        var score = 0;
        for (var i = 0; i < letters.length; ++i) {
            score += letterScores[letters[i]] || 0;
        }
        return score;
    };

    function setLettersToDisplay() {
        lettersInWord = currentWord.split("");

        for (let index = 0; index < lettersInWord.length; index++) {
            if (lettersInWord[index] === " ") {
                lettersToDisplay[index] = " ";
            }
            else if (lettersInWord[index] === "-") {
                lettersToDisplay[index] = "-";
            }
            else {
                lettersToDisplay[index] = "_";
            }
        }
        // console.log(lettersToDisplay);
    };

    function updateLettersToDisplay(letter) {
        for (let index = 0; index < lettersInWord.length; index++) {
            if (letter === lettersInWord[index].toLowerCase()) {
                lettersToDisplay[index] = lettersInWord[index];
            }
        }
    };

    return {
        getCurrentWord: function () {
            return currentWord;
        },

        getGameStarted: function () {
            return gameStarted;
        },

        getGuessesRemaining: function () {
            return guessesRemaining;
        },

        getLettersGuessed: function () {
            return lettersGuessed;
        },

        getLettersInWord: function () {
            return lettersInWord;
        },

        getLettersToDisplay: function () {
            return lettersToDisplay;
        },

        getLosses: function () {
            return losses;
        },

        getScore: function () {
            return score;
        },

        getWins: function () {
            return wins;
        },

        hasGuessedLetter: function(letter) {
            if (lettersGuessed.indexOf(letter) > -1) {
                // don't let the user make the same guess
                return true;
            }
            else {
                lettersGuessed.push(letter);
                lettersGuessed.sort();
                return false;
            }
        },

        hasUserLost: function() {
            // check is user lost
            if (guessesRemaining < 1) {
                losses++;
                return true;
            }
            else {
                return false;
            }
        },

        hasUserWon: function(timeRemaining) {
            // check if user won
            if (lettersInWord.toString() === lettersToDisplay.toString()) {
                wins++;
                // score points for letters in the word
                score += getLetterScore(lettersInWord) * 100;

                if (timeRemaining > 0) {
                    // score points for time remaining
                    score += (timeRemaining * 10);
                }
                return true;
            }
            else {
                return false;
            }
        },

        isLetterInWord: function(letter) {
            if ((currentWord.indexOf(letter) > -1) || (currentWord.indexOf(letter.toUpperCase()) > -1)) {
                // console.log("correct guess");
                updateLettersToDisplay(letter);
                return true;
            }
            else {
                guessesRemaining--;
                return false;
            }
        },

        newRound: function () {
            guessesRemaining = 6;
            lettersInWord = [];
            lettersToDisplay = [];
            lettersGuessed = [];
            chooseRandomWord();
            setLettersToDisplay();
            gameStarted = true;
        },

        resetGame: function () {
            wins = 0;
            losses = 0;
            score = 0;
            gameStarted = false;
        }
    };
})();
