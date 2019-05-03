$(document).ready(function () {
    var correctGuessSound = $("#correctGuessSound")[0];
    var wrongGuessSound = $("#wrongGuessSound")[0];

    function clearDisplay() {
        $("#currentWord, #guessesRemaining, #lettersGuessed, #currentWordLabel, #lossesLabel, #guessesRemainingLabel, #lettersGuessedLabel").empty();
    }

    function displayLabels() {
        $("#currentWordLabel").text("Word to Guess:");
        $("#guessesRemainingLabel").text("Guesses Remaining:");
        $("#lettersGuessedLabel").text("Letters Guessed:");
    }

    function displayStats() {
        // display the current word
        $("#currentWord").html(wordGuess.lettersToDisplay.join("&nbsp;"));

        // display the score
        $("#score").text(wordGuess.score);

        // display the guesses remaining
        $("#guessesRemaining").text(wordGuess.guessesRemaining);

        // display the letters guessed
        $("#lettersGuessed").text(wordGuess.lettersGuessed.join(" "));
    }

    function newRound() {
        wordGuess.newRound();
        displayStats();
        stopwatch.resetTimer();
        stopwatch.startTimer();
    }

    function playSound(sound) {
        if (sound.paused) {
            sound.play();
        }
        else {
            sound.pause();
            sound.currentTime = 0;
            sound.play();
        }
    }

    function resetGame() {
        wordGuess.resetGame();
        stopwatch.startTime = 60;//seconds
        stopwatch.resetTimer();
        clearDisplay();
        $("#instructions").text("Press any key to get started!");
    }

    function showGameOver(message) {
        $('#gameOverMessage').html(message);
        $('#gameOverDialog').modal('show');
    }

    function showQuitOrContinue(title, message) {
        stopwatch.stopTimer();
        $('#winOrLossLabel').html(title);
        $('#winOrLossMessage').html(message);
        $('#quitOrContinueDialog').modal('show');
    }

    stopwatch.displayTime = function (time) {
        $("#timerDisplay .card-text").text(time)
    };

    stopwatch.timesUp = function () {
        showGameOver("Time's up!");
    };

    $("#continueGameButton").on("click", function () {
        $('#quitOrContinueDialog').modal('hide');
        newRound();
    });

    $("#quitGameButton, #closeButton").on("click", function () {
        $('#quitOrContinueDialog').modal('hide');
        resetGame();
    });

    $("#okButton").on("click", function () {
        $('#gameOverDialog').modal('hide');
        resetGame();
    });

    resetGame();

    // listen for keys that players type
    $(document).keyup(function (event) {
        if (wordGuess.gameStarted) {
            // NOTE: we only care about letters
            if (event.keyCode >= 65 && event.keyCode <= 90) {

                // console.log(event.key.toLowerCase());
                var keyPressed = event.key.toLowerCase();

                if (wordGuess.lettersGuessed.indexOf(keyPressed) > -1) {
                    // don't let the user make the same guess
                    return;
                }
                else {
                    wordGuess.lettersGuessed.push(keyPressed);
                    wordGuess.lettersGuessed.sort();
                }

                // check if key pressed is in the current word
                if ((wordGuess.currentWord.indexOf(keyPressed) > -1) || (wordGuess.currentWord.indexOf(keyPressed.toUpperCase()) > -1)) {
                    // console.log("correct guess");
                    wordGuess.updateLettersToDisplay(keyPressed);
                    playSound(correctGuessSound);
                }
                else {
                    // console.log("wrong guess");
                    wordGuess.guessesRemaining--;
                    playSound(wrongGuessSound);
                }

                // check if user won
                if (wordGuess.lettersInWord.toString() === wordGuess.lettersToDisplay.toString()) {
                    wordGuess.wins++;
                    // score points for letters in the word
                    wordGuess.score += wordGuess.getLetterScore(wordGuess.lettersInWord) * 100;

                    if (stopwatch.time > 0) {
                        // score points for time remaining
                        wordGuess.score += (stopwatch.time * 10);
                    }

                    showQuitOrContinue("Congratulations!", "You won!");
                }

                // check is user lost
                if (wordGuess.guessesRemaining < 1) {
                    wordGuess.losses++;
                    stopwatch.stopTimer();
                    showGameOver("You lost!");
                }

                displayStats()
            }
        }
        else {
            $("#instructions").text("Press a letter key to guess.");
            displayLabels();
            newRound();
        }
    });
});
