// generating quotes based on user-input
function getTheme() {
    var input = document.getElementById("userTheme");
    var theme = input.value;
    document.getElementById("theme").innerHTML = "Theme: " + theme;
    input.value = "";
}

document.getElementById("generateCustom").addEventListener("click", getTheme);

// AI generation

// timer functionality
var interval;
var timer = document.getElementById("userTime")
var seconds;

function setTimer() {
    interval = setInterval(startTimer, 1000);
    seconds = timer.value;
    document.getElementById("timer").innerHTML = "Time: " + seconds;
    document.getElementById("userTime").value = "";
    }

document.getElementById("startTimer").addEventListener("click", setTimer);

function startTimer() {
    seconds -= 1;
    document.getElementById("timer").innerHTML = "Time: " + seconds;
    if (seconds < 0) {
        clearInterval(interval)
        document.getElementById("timer").innerHTML = "Time: 00:00";
    }
}

// resetting timer function when new user input given