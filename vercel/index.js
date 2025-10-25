// COMMENT GENERATION

// generates comments related to the user input when the 'generate' button is pressed
async function generateCustom() {
    const input = document.getElementById("userThemeInput");
    const theme = input.value;
    updateSpan("generatedTheme", theme);
    disableButton(this);
    input.disabled = true;

    // check if user theme is in database and retrieve the corresponding group of comments
    // if user theme does not exist, call gemini to generate and store in database after

    // await callGemini(theme);
    getThemesFromDatabase();
    
    setTimeout(() => {
        enableButton(this);
        input.disabled = false;
        input.value = "";
    }, 3000);
}
document.getElementById("generateCustomButton").addEventListener("click", generateCustom);

// generates random comments when the 'generate' button is pressed
async function generateRandom() {
    // find a way to randomise the theme
    // ?
    const theme = "?";
    updateSpan("generatedTheme", "?");
    disableButton(this);
    
    // check if user theme is in database and retrieve the corresponding group of comments
    // if user theme does not exist, call gemini to generate and store in database after

    // await callGemini(theme);

    setTimeout(() => {
        enableButton(this);
    }, 3000);
}
document.getElementById("generateRandomButton").addEventListener("click", generateRandom);

// reroll function
function reroll() {
    // check database for another group of comments
    // if no have, ask gemini to generate more and store accordingly
}

// re-styles the button and prevents it from being clicked
function disableButton(button) {
    button.disabled = true;
    button.classList.add("active");
    
    resizeButton(button, "Generating");
    
    const loaderSpan = button.children[1];
    loaderSpan.classList.add("active");
}

// re-styles the button and allows it to be clicked again
function enableButton(button) {
    const loaderSpan = button.children[1];
    loaderSpan.classList.remove("active");

    resizeButton(button, "Generate");

    button.classList.remove("active");
    button.disabled = false;
}

// re-styles the button and changes the text
function resizeButton(button, textChange) {
    const startWidth = button.offsetWidth;

    // add width change text here
    const generateSpan = button.children[0];
    generateSpan.innerHTML = textChange;

    const endWidth = button.offsetWidth;

    button.style.width = startWidth + "px";
    button.classList.add("resize");

    void button.offsetWidth;

    button.style.width = endWidth + "px";

    const onTransitionEnd = (e) => {
        if (e.propertyName === "width") {
            button.classList.remove("resize");
            button.style.width = "auto";
            button.removeEventListener("transitionend", onTransitionEnd);
        }
    };
    button.addEventListener("transitionend", onTransitionEnd);
}

// calling the database for themes (if any)
async function getThemesFromDatabase() {
    try {
        const response = await fetch("/api/server", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "database",
                action: "getThemes"
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // data is presented as a list, with the first index being the first entry
        const data = await response.json();
        console.log(data[0].id + ": " + data[0].theme);
        
    }

    // handling errors with the prisma database
    catch (error) {
        console.error("Error fetching themes from Prisma Database:", error);
        return null;
    }
}

// sends a request to the backend to call the gemini api to generate comments
async function callGemini(theme) {
    // specifying the type of response to be received from gemini
    const requestBody = {
        // initialising the request for the api (i.e. generating comments based on theme)
        contents: [{
            parts: [{
                text: `You are a setter for section II of the GAMSAT exam. \
                       Find or generate 4 short, simple, and succinct comments in the style of the exam on the theme of ${theme}. \
                       If possible, comments should come from notable authors. If not, do not include any author for the specific comment. \
                       Only include the full names of the authors, and not their professions or positions.`
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
        const response = await fetch("/api/server", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const comments = JSON.parse(data.candidates[0].content.parts[0].text);
        displayGeneration(comments);
    }

    // handling errors with the gemini api
    catch (error) {
        console.error("Error fetching structured output from Gemini API:", error);
        return null;
    }
}

// displays the generated comments on the screen
function displayGeneration(comments) {
    const displayBox = document.getElementById("userDisplayBox");
    const startHeight = displayBox.offsetHeight;

    updateSpan("comment1", comments.comment1);
    updateSpan("comment2", comments.comment2);
    updateSpan("comment3", comments.comment3);
    updateSpan("comment4", comments.comment4);

    updateSpan("author1", comments.author1);
    updateSpan("author2", comments.author2);
    updateSpan("author3", comments.author3);
    updateSpan("author4", comments.author4);

    const endHeight = displayBox.offsetHeight;

    if (endHeight == startHeight) {
        return;
    }

    displayBox.style.height = startHeight + "px";
    displayBox.classList.add("resize");

    void displayBox.offsetHeight;

    displayBox.style.height = endHeight + "px";

    const onTransitionEnd = (e) => {
        if (e.propertyName === "height") {
            displayBox.classList.remove("resize");
            displayBox.style.height = "auto";
            displayBox.removeEventListener("transitionend", onTransitionEnd);
        }
    };
    displayBox.addEventListener("transitionend", onTransitionEnd);
}

// 
function updateSpan(spanIdentifier, spanText) {
    const span = document.getElementById(spanIdentifier);
    span.style.opacity = 0;
    span.style.transition = "none";
    
    if (spanIdentifier == "generatedTheme") {
        span.textContent = capitalise(spanText);
    }
    else {
        span.textContent = spanText;
    }

    void span.offsetWidth;

    span.style.transition = "opacity 1s ease-in-out";
    span.style.opacity = 1;
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

// disabling the paste and cut functions

function disableFunctions() {
    const textarea = document.getElementById("editor");
    if (textarea) {
        textarea.addEventListener('paste', function(event) {
            event.preventDefault();
        });

        textarea.addEventListener('cut', function(event) {
            event.preventDefault();
        });
    }
}
document.addEventListener('DOMContentLoaded', disableFunctions);
