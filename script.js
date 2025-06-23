// generating quotes based on user-input
function getTheme() {
    var input = document.getElementById("theme");
    var theme = input.value;
    console.log(theme);
    input.value = "";
}

document.getElementById("generateCustom").addEventListener("click", getTheme);

    // AI generation

// implement timer functionality
function getTimer() {
    var input = document.getElementById("timer");
    var timer = input.value;
    console.log(timer);
    input.value = "";
}

document.getElementById("startTimer").addEventListener("click", getTimer);

function displayTime() {
    
}

// // all purpose function for getting user input in field after clicking button (FIX)
// function getInput(field) {
//     var input = document.getElementById(field);
//     var value = input.value;
//     console.log(value);
//     input.value = "";
// }