$(document).ready(function () {
    var correctGuessSound = $("#correctGuessSound")[0];
    var wrongGuessSound = $("#wrongGuessSound")[0];

    var isDataAvailable = false;

    //NOTE: the api returns JSON with a key for each strain.
    function convertStrainData(response) {
        //convert the data to an array of objects and only keep properties that we need.
        var strainsData = [];
        for (var index in response) {
            var strain = {
                id: response[index].id,
                name: index,
                race: response[index].race
            };
            strainsData.push(strain);
        }
        return strainsData;
    };

    function getStrains() {
        return new Promise(function (resolve, reject) {
            if (localStorage.getItem("strains") === null) {
                theStrainApi.getAllStrains().then(function (response) {
                    var myData = convertStrainData(response);
                    localStorage.setItem("strains", JSON.stringify(myData));
                    wordsToGuess = myData.map(s => s.name);
                    resolve(true);
                });
            }
            else {
                var myData = JSON.parse(localStorage.getItem("strains"));
                wordsToGuess = myData.map(s => s.name);
                resolve(true);
            }
        });
    };

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

    getStrains().then(() => {
        isDataAvailable = true;
        resetGame();
    });

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
            if (isDataAvailable) {
                $("#instructions").text("Press a letter key to guess.");
                displayLabels();
                newRound();
            }
        }
    });
});
