var stopwatch = (function () {
    var intervalId = null;
    var timerRunning = false;
    var time = 0;
    var startTime = 60;
    var displayTime = null;
    var timesUp = null;

    function timerTick() {
        time--;

        if (typeof displayTime === "function") {
            displayTime(formatTime(time));
        }

        if (time <= 0) {
            timer.stopTimer();
            time = 0;
            if (typeof timesUp === "function") {
                timesUp();
            }
        }
    };

    function formatTime(time) {
        var minutes = Math.floor(time / 60);
        var seconds = time - (minutes * 60);

        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        return minutes + ":" + seconds;
    };

    var timer = {
        startTimer: function () {
            if (!timerRunning) {
                intervalId = setInterval(timerTick.bind(this), 1000);
                timerRunning = true;
            }
        },

        stopTimer: function () {
            if (timerRunning) {
                clearInterval(intervalId);
                timerRunning = false;
            }
        },
        resetTimer: function () {
            time = startTime;
            if (typeof displayTime === "function") {
                displayTime(formatTime(time));
            }
        },

        onDisplayTime: function (displayTimeCallback) {
            displayTime = displayTimeCallback;
        },

        onTimesUp: function (timesUpCallback) {
            timesUp = timesUpCallback;
        }
    };

    return timer;
})();
