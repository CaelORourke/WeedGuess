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
        $("#currentWord").html(wordGuess.getLettersToDisplay().join("&nbsp;"));

        // display the score
        $("#score").text(wordGuess.getScore());

        // display the guesses remaining
        $("#guessesRemaining").text(wordGuess.getGuessesRemaining());

        // display the letters guessed
        $("#lettersGuessed").text(wordGuess.getLettersGuessed().join(" "));
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

    $(document).keyup(function (event) {
        if (wordGuess.getGameStarted()) {
            // NOTE: we only care about letters
            if (event.keyCode >= 65 && event.keyCode <= 90) {

                var keyPressed = event.key.toLowerCase();

                // don't let the user make the same guess
                if (wordGuess.hasGuessedLetter(keyPressed)) {
                    return;
                }

                // check if key pressed is in the current word
                if (wordGuess.isLetterInWord(keyPressed)) {
                    playSound(correctGuessSound);
                }
                else {
                    playSound(wrongGuessSound);
                }

                if (wordGuess.hasUserWon(stopwatch.time)) {
                    showQuitOrContinue("Congratulations!", "You won!");
                }

                if (wordGuess.hasUserLost()) {
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
