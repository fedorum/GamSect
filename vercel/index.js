// COMMENT GENERATION

// import { request, response } from "express";

// generates comments related to the user input when the 'generate' button is pressed
function generateCustom() {
    let input = document.getElementById("userThemeInput");
    let theme = input.value;
    document.getElementById("theme").innerHTML = "Theme: " + capitalise(theme);
    input.value = "";

    console.log(theme);
    callGemini(theme);
}
document.getElementById("generateCustomButton").addEventListener("click", generateCustom);

// generates random comments when the 'generate' button is pressed
function generateRandom() {
    // find a way to randomise the theme
    // ?

    let theme = "?";
    document.getElementById("theme").innerHTML = "Theme: ?";
    
    console.log(theme);
    // callGemini(theme);
}
document.getElementById("generateRandomButton").addEventListener("click", generateRandom);

// sends a request to the backend to call the gemini api to generate comments
async function callGemini(theme) {
    // specifying the type of response to be received from gemini
    const requestBody = {
        // 
        contents: [{
            parts: [{
                text: "Generate a succinct comment, in the style of the ones provided in the GAMSAT section II exam, on the theme of " + theme
            }]
        }],
        // 
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    comment1: {
                        type: "string",
                        description: "The generated comment"
                    },
                    author1: {
                        type: "string",
                        description: "The author of the comment"
                    }
                // insert repeat objects?
                },
                required: ["comment", "author"]
            }
        }
    };

    // the response is received from the backend in the form of 4 comments 
    const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
    });
    
    const data = await response.json();
    console.log(data.candidates[0].content.parts[0].text);
    // displaycomments(comments);
}

// displays the generated comments on the screen
function displaycomments(comments) {
    
}

// capitalises the first letter of each word in the theme for aesthetics
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
        // if time is not 0 (i.e. invalid), start the timer and toggle the button to stop the timer
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

// 
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
        document.getElementById("startButton").innerHTML = "Start";
        document.getElementById("editor").disabled = true;
        document.getElementById("unlockButton").classList.add("show");
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

// unlocks the editor and hides the 'unlock' button
function unlock() {
    document.getElementById("editor").disabled = false;
    document.getElementById("unlockButton").classList.remove("show");
}

document.getElementById("unlockButton").addEventListener("click", unlock);

// TESTING

const theme = "freedom";

// const test = JSON.stringify("Generate 4 comments in the style of the GAMSAT essay on the theme of " + theme);
const test = JSON.stringify({
        contents: [{ parts: [{ text: "Generate 4 comments in the style of the GAMSAT section II exam on the theme of " + theme }] }],
    })

// console.log(test);
