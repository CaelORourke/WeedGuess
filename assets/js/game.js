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
        $("#currentWord").html(wordGuess.getLettersToDisplay().join("&nbsp;"));
        $("#score").text(wordGuess.getScore());
        $("#guessesRemaining").text(wordGuess.getGuessesRemaining());
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

                if (wordGuess.isLetterInWord(keyPressed, stopwatch.time)) {
                    playSound(correctGuessSound);
                }
                else {
                    playSound(wrongGuessSound);
                }

                if (wordGuess.hasUserWon()) {
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
