// generating quotes based on user-input
function getTheme() {
    var input = document.getElementById("theme");
    var theme = input.value;
    console.log(theme);
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
    document.getElementById("timer").innerHTML = timer.value;
    seconds = timer.value;
    document.getElementById("userTime").value = "";
    }

document.getElementById("startTimer").addEventListener("click", setTimer);

function startTimer() {
    seconds -= 1;
    document.getElementById("timer").innerHTML = seconds;
    if (seconds < 0) {
        clearInterval(interval)
        document.getElementById("timer").innerHTML = "0";
    }
}

// resetting timer function when new user input given