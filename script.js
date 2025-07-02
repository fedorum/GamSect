// this function gets the user inputted theme
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
var time = 0;

// this function gets the user inputted time and starts the timer
function toggleTimer() {
    let userTime = document.getElementById("userTime").value;
    let buttonValue = document.getElementById("timerButton").innerHTML;

    if (buttonValue == "Start") {
        
        // if the user has inputted a time and if no previous timer has been inputted, process the new time
        if ((userTime != null) && (time == 0)) {
            time = userTime * 60;
        }

        interval = setInterval(timerInterval, 1000); // this makes the timer run every second
        document.getElementById("userTime").value = "";
        document.getElementById("timerButton").innerHTML = "Stop";
        displayTime();
    }

    else if (buttonValue == "Stop") {
        clearInterval(interval);
        document.getElementById("timerButton").innerHTML = "Start";
    }
}

document.getElementById("timerButton").addEventListener("click", toggleTimer);

// this function runs every second and ticks down the timer
function timerInterval() {
    time -= 1;
    displayTime();
    if (time <= 0) {
        clearInterval(interval);
        time = 0;
        document.getElementById("countdown").innerHTML = "Time: 00:00";
    }
}

// this function displays the timer on screen
function displayTime() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    let paddedMins = minutes.toString().padStart(2, "0");
    let paddedSecs = seconds.toString().padStart(2, "0");
    document.getElementById("countdown").innerHTML = "Time: " + paddedMins + ":" + paddedSecs;
}

// resetting timer function when new user input given