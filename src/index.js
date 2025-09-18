// PROMPT GENERATION

// capitalises the first letter of each word in a theme for aesthetics
function capitalise(string) {
    const words = string.split(" ");
    
    // iterates through the 'words' array and capitalises the first letter of each word
    const capitalisedString = words.map(word => {
        if (word.length == 0) {
            return "";
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    // joins the map of capitalised words together to form a single string
    return capitalisedString.join(" ");
}

import { generatePrompts } from "./gemini.js";

// generates prompts related to the user input when the 'generate' button is pressed
function generateCustom() {
    let input = document.getElementById("userThemeInput");
    let theme = input.value;
    let displayTheme = capitalise(theme);
    document.getElementById("theme").innerHTML = "Theme: " + displayTheme;
    input.value = "";
    generatePrompts(theme);
}

document.getElementById("generateCustomButton").addEventListener("click", generateCustom);

// generates random prompts when the 'generate' button is pressed
function generateRandom() {
    // find a way to randomise the theme
    let theme = "random";
    let displayTheme = capitalise(theme);
    document.getElementById("theme").innerHTML = "Theme: " + displayTheme;
    generatePrompts(theme);
}

document.getElementById("generateRandomButton").addEventListener("click", generateRandom);

// TIMER

var interval;
var time = 0;

// gets the user inputted time and starts the timer
function toggleTimer() {
    let userTime = document.getElementById("userTimeInput").value;
    let buttonValue = document.getElementById("startButton").innerHTML;

    if (buttonValue == "Start") {

        // if the user has inputted a time and if no previous timer has been inputted, process the new time
        if (userTime != "") {
            time = userTime * 60;
        }

        if (time != 0) {
            interval = setInterval(timerInterval, 1000); // makes the timer run every second
            document.getElementById("userTimeInput").value = "";
            document.getElementById("startButton").innerHTML = "Stop";
        }

        displayTime();
    }

    else if (buttonValue == "Stop") {
        clearInterval(interval);
        document.getElementById("startButton").innerHTML = "Start";
    }
}

document.getElementById("startButton").addEventListener("click", toggleTimer);

function resetTimer() {
    if (time != 0) {
        time = 0;
        clearInterval(interval);
        document.getElementById("countdown").innerHTML = "00:00";
        document.getElementById("startButton").innerHTML = "Start";
    }
}

document.getElementById("resetButton").addEventListener("click", resetTimer);

// runs every second and ticks down the timer
function timerInterval() {
    time -= 1;
    displayTime();
    if (time <= 0) {
        clearInterval(interval);
        time = 0;
        document.getElementById("countdown").innerHTML = "00:00";
        document.getElementById("editor").disabled = true;
    }
}

// displays the timer on screen
function displayTime() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    let paddedMins = minutes.toString().padStart(2, "0");
    let paddedSecs = seconds.toString().padStart(2, "0");
    document.getElementById("countdown").innerHTML = paddedMins + ":" + paddedSecs;
}

// TEXT EDITOR

// undo and redo button functionality
const editor = document.getElementById("editor");

function undo() {
    editor.focus();
    document.execCommand("undo", false, null);
}

document.getElementById("undoButton").addEventListener("click", undo);

function redo() {
    editor.focus();
    document.execCommand("redo", false, null);
}

document.getElementById("redoButton").addEventListener("click", redo);
