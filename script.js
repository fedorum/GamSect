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
var time = document.getElementById("userTime") * 60;
var minutes;
var seconds;

function setTimer() {
    time = userTime.value * 60;
    interval = setInterval(startTimer, 1000);
    minutes = Math.floor(time / 60);
    seconds = time % 60;
    document.getElementById("timer").innerHTML = "Time: " + minutes + ":" + seconds;
    document.getElementById("userTime").value = "";
    }

document.getElementById("startTimer").addEventListener("click", setTimer);

function startTimer() {
    time -= 1;
    minutes = Math.floor(time / 60);
    seconds = time % 60;
    document.getElementById("timer").innerHTML = "Time: " + minutes + ":" + seconds;

    if (time < 0) {
        clearInterval(interval)
        document.getElementById("timer").innerHTML = "Time: 00:00";
    }
}

// function displayTime() {
//     minutes = Math.floor(time / 60);
//     seconds = time % 60;
//     if (minutes == 0 && minutes <= 9) {
//         minutes 
//     }

//     document.getElementById("timer").innerHTML = "Time: " + minutes + ":" + seconds;
// }

// resetting timer function when new user input given