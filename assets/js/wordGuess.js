var wordGuess = {
    wins:  0,
    losses:  0,
    guessesRemaining:  6,
    currentWord:  "",
    lettersInWord:  [],
    lettersToDisplay:  [],
    lettersGuessed:  [],
    gameStarted:  false,
    score:  0,

    chooseRandomWord: function() {
        this.currentWord = wordsToGuess[Math.floor(Math.random() * wordsToGuess.length)];
        console.log("currentWord='" + this.currentWord + "'");
    },

    getLettersToDisplay: function() {
        this.lettersInWord = this.currentWord.split("");

        for (let index = 0; index < this.lettersInWord.length; index++) {
            if (this.lettersInWord[index] === " ") {
                this.lettersToDisplay[index] = " ";
            }
            else if (this.lettersInWord[index] === "-") {
                this.lettersToDisplay[index] = "-";
            }
            else {
                this.lettersToDisplay[index] = "_";
            }
        }
        // console.log(this.lettersToDisplay);
    },

    getLetterScore: function(letters) {
        var score = 0;
        for (var i = 0; i < letters.length; ++i) {
            score += letterScores[letters[i]] || 0;
        }
        return score;
    },

    resetGame: function() {
        this.wins = 0;
        this.losses = 0;
        this.score = 0;
        this.gameStarted = false;
    },

    newRound: function() {
        this.guessesRemaining = 6;
        this.lettersInWord = [];
        this.lettersToDisplay = [];
        this.lettersGuessed = [];
        this.chooseRandomWord();
        this.getLettersToDisplay();
        this.gameStarted = true;
    },

    updateLettersToDisplay: function(letter) {
        for (let index = 0; index < this.lettersInWord.length; index++) {
            if (letter === this.lettersInWord[index].toLowerCase()) {
                this.lettersToDisplay[index] = this.lettersInWord[index];
            }
        }
    }
}