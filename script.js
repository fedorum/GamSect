// import { generatePrompts } from "./gemini.js";

// This function gets the user inputted theme
function getTheme() {
    let input = document.getElementById("userTheme");
    let theme = input.value;
    let displayTheme = theme.charAt(0).toUpperCase() + theme.slice(1);
    document.getElementById("theme").innerHTML = "Theme: " + displayTheme;
    input.value = "";
    // generatePrompts(theme);
    // console.log(theme);
}

document.getElementById("generateCustom").addEventListener("click", getTheme);

// AI generation

// Timer functionality
var interval;
var time = 0;

// This function gets the user inputted time and starts the timer
function toggleTimer() {
    let userTime = document.getElementById("userTime").value;
    let buttonValue = document.getElementById("timerButton").innerHTML;

    if (buttonValue == "Start") {
        
        // If the user has inputted a time and if no previous timer has been inputted, process the new time
        if (userTime != "") {
            time = userTime * 60;
        }

        interval = setInterval(timerInterval, 1000); // this makes the timer run every second
        document.getElementById("userTime").value = "";
        if (userTime != 0) {
            document.getElementById("timerButton").innerHTML = "Stop";
        }
        displayTime();
    }

    else if (buttonValue == "Stop") {
        clearInterval(interval);
        document.getElementById("timerButton").innerHTML = "Start";
    }
}

document.getElementById("timerButton").addEventListener("click", toggleTimer);

// This function runs every second and ticks down the timer
function timerInterval() {
    time -= 1;
    displayTime();
    if (time <= 0) {
        clearInterval(interval);
        time = 0;
        document.getElementById("countdown").innerHTML = "Time: 00:00";
        document.getElementById("editor").disabled = true;
    }
}

// This function displays the timer on screen
function displayTime() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    let paddedMins = minutes.toString().padStart(2, "0");
    let paddedSecs = seconds.toString().padStart(2, "0");
    document.getElementById("countdown").innerHTML = "Time: " + paddedMins + ":" + paddedSecs;
}

// Resetting timer function when new user input given