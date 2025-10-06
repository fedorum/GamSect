// COMMENT GENERATION

// generates comments related to the user input when the 'generate' button is pressed
function generateCustom() {
    const input = document.getElementById("userThemeInput");
    const theme = input.value;
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

    const theme = "?";
    document.getElementById("theme").innerHTML = "Theme: ?";
    
    console.log(theme);
    // callGemini(theme);
}
document.getElementById("generateRandomButton").addEventListener("click", generateRandom);

// sends a request to the backend to call the gemini api to generate comments
async function callGemini(theme) {
    // specifying the type of response to be received from gemini
    const requestBody = {
        // initialising the request for the api (i.e. generating comments based on theme)
        contents: [{
            parts: [{
                text: "You are a setter for section II of the GAMSAT exam. Generate 4 short, simple, and succinct comments in the style of the exam on the theme of " + theme
            }]
        }],
        // configuring the number of comments required in the response (i.e. 4)
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    comment1: {
                        type: "string",
                        description: "The first comment"
                    },
                    author1: {
                        type: "string",
                        description: "The author of the first comment"
                    },
                    comment2: {
                        type: "string",
                        description: "The second comment"
                    },
                    author2: {
                        type: "string",
                        description: "The author of the second comment"
                    },
                    comment3: {
                        type: "string",
                        description: "The second comment"
                    },
                    author3: {
                        type: "string",
                        description: "The author of the second comment"
                    },
                    comment4: {
                        type: "string",
                        description: "The second comment"
                    },
                    author4: {
                        type: "string",
                        description: "The author of the second comment"
                    }
                },
                required: ["comment1", "author1", "comment2", "author2", "comment3", "author3", "comment4", "author4"]
            }
        }
    };

    // the response is received from the backend in the form of 4 comments
    try {
        const response = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const comments = JSON.parse(data.candidates[0].content.parts[0].text);
        displayComments(comments);
    }

    // handling errors with the gemini api
    catch (error) {
        console.error("Error fetching structured output from Gemini API:", error);
        return null;
    }
}

// displays the generated comments on the screen
function displayComments(comments) {
    document.getElementById("comment1").innerHTML = comments.comment1;
    document.getElementById("comment2").innerHTML = comments.comment2;
    document.getElementById("comment3").innerHTML = comments.comment3;
    document.getElementById("comment4").innerHTML = comments.comment4;
    document.getElementById("author1").innerHTML = comments.author1;
    document.getElementById("author2").innerHTML = comments.author2;
    document.getElementById("author3").innerHTML = comments.author3;
    document.getElementById("author4").innerHTML = comments.author4;
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
    const userTime = document.getElementById("userTimeInput").value;
    const buttonValue = document.getElementById("startButton").innerHTML;

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
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const paddedMins = minutes.toString().padStart(2, "0");
    const paddedSecs = seconds.toString().padStart(2, "0");
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
