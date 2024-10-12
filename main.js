let tileContainer = document.querySelector(".tile-container");
let clickCountElem = document.querySelector(".click-count");
let gameContainerElem = document.querySelector(".game-container");
let desktopGameElem = document.querySelector(".desktop-game")
let timerElem = document.querySelector(".timer");
let responsivityModal = document.querySelector('.responsivity-modal')
let gameHelpOverlay = document.querySelector('.game-help-overlay')
let gameHelpContainer = document.querySelector('.game-help-container')
let btnHelp = document.querySelector(".btn-help")
let helpBtnClicked = false;
let btnClose = document.querySelector(".btn-close"); 
let winModal = document.querySelector(".win-modal");
let clicksElem = document.getElementById("clicks")
let timerWinElem = document.getElementById("timer-win")
let btnRestartGame = document.querySelector(".restart-game")

let allTiles = [];
const numberOfTilesDisplayed = 160;
let resetBtn = document.querySelector('.reset-btn'); 
let colorForm = document.getElementById('color-form'); 
let colorModal = document.querySelector(".color-modal");
let clickCount = 0; 

let choosenColor = "rgb(255, 77, 0)"; 
const baseColor = "#0e1118";

function checkIfWon() {
    let outcome = true;
    let index = 0;

    while (outcome && index < allTiles.length) {
        let currentColor = window.getComputedStyle(allTiles[index]).backgroundColor;

        if (currentColor === choosenColor) {
            index++;
        } else {
            outcome = false;
        }
    }

    return outcome;
}

function resetGame() {
    // Hiding the table
    hide(gameContainerElem);
    
    // Showing Settings Modal 
    show(colorModal, "flex");

    // Resetting all event listeners and base color for tiles 
    initGame();
}

function setChoosenColor(choosenColor) {
    document.querySelector(".choosen-tile").style.backgroundColor = choosenColor;
    resetBtn.style.backgroundColor = choosenColor; 
    resetBtn.addEventListener('mouseenter', () => {
        resetBtn.style.backgroundColor = getNextColor(); 
    });

    resetBtn.addEventListener('mouseout', () => {
        resetBtn.style.backgroundColor = choosenColor; 
    });
}

let colorsArray = [
    "rgb(255, 56, 100)",  // #FF3864
    "rgb(45, 226, 230)",  // #2DE2E6
    "rgb(249, 200, 14)",  // #F9C80E
    "rgb(0, 255, 65)",    // #00FF41
    "rgb(255, 77, 0)",    // #FF4D00
    "rgb(13, 0, 255)"     // #0D00FF
];

function createChoosableColors(colorsArray, colorsContainerElem) {
    let colorContainers = [];

    colorsArray.forEach(color => {
        let container = document.createElement("div");
        container.setAttribute("class", "color-container"); // Set class after creating element
        colorContainers.push(container); // Push the element itself
    });

    colorContainers.forEach((container, index) => {
        let color = colorsArray[index];
        let colorTile = document.createElement("div");
        let inputTile = document.createElement("input");

        colorTile.setAttribute("class", "choosable-tile");
        colorTile.style.backgroundColor = color;

        inputTile.type = "radio";
        inputTile.name = "color";
        inputTile.classList.add("color-input");
        inputTile.id = `color${index}`;
        inputTile.value = color;

        container.appendChild(colorTile);
        container.appendChild(inputTile);
    });

    colorContainers.forEach((container) => {
        colorsContainerElem.appendChild(container);
    });

    let renderedColors = document.querySelectorAll(".color-input");
    let randomIndex = Math.floor(Math.random() * renderedColors.length);
    renderedColors[randomIndex].checked = true;
}

createChoosableColors(colorsArray, document.getElementById("color-parent"));

let shuffledColors = shuffleArray([...colorsArray]);
let colorIndex = 0;

function handleMouseOver(event) {
    event.target.style.transition = "0s";
    event.target.style.backgroundColor = getNextColor();
}

function handleMouseOut(event) {
    event.target.style.backgroundColor = baseColor;
    event.target.style.transition = "0.5s";
}

window.addEventListener("load", () => {
    hide(gameContainerElem);

    if ("ontouchstart" in document.documentElement) {
        console.log("You are using a touchscreen device");
        hide(colorModal);
        hide(desktopGameElem); 
        show(responsivityModal,"flex")
    }

    setChoosenColor(choosenColor);

    for (let i = 0; i < numberOfTilesDisplayed; i++) {
        let tile = document.createElement('div');
        tile.classList.add("tile");
        tileContainer.appendChild(tile);
        console.log("run");
    }

    resetBtn.addEventListener('click', resetGame);

    allTiles.push(...document.querySelectorAll('.tile'));

    initGame();
});

function initGame() {

    // Reset Clicks 
    clickCount = 0; 
    clickCountElem.innerHTML = `Clicks: 0`;

    allTiles.forEach(tile => {
        tile.removeEventListener("click", handleTileClick);
        tile.removeEventListener("mouseover", handleMouseOver);
        tile.removeEventListener("mouseout", handleMouseOut);
    });
    
    allTiles.forEach(tile => {
        tile.style.backgroundColor = baseColor;
        tile.addEventListener("mouseover", handleMouseOver);
        tile.addEventListener("mouseout", handleMouseOut);
        tile.addEventListener('click', handleTileClick);
    });
}

function handleTileClick(event) {
    clickCount++; 
    clickCountElem.innerHTML = `Clicks: ${clickCount}`; 

    let clickedTile = event.target;
    let computedStyle = window.getComputedStyle(clickedTile);

    if (computedStyle.backgroundColor === choosenColor) {
        clickedTile.removeEventListener('mouseover', handleMouseOver);
        clickedTile.removeEventListener("mouseout", handleMouseOut);

        paintWin();
    }
}

function paintWin() {
    if (checkIfWon()) {

        timer.stop()

        clicksElem.innerHTML= clickCount
        timerWinElem.innerHTML = timer._timeString

        show(winModal, "flex")
        hide(btnHelp)
        hide(gameContainerElem)
    } else {
        console.log("You haven't won yet.");
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getNextColor() {
    if (colorIndex >= shuffledColors.length) {
        shuffledColors = shuffleArray([...colorsArray]);
        colorIndex = 0;
    }
    return shuffledColors[colorIndex++];
}

colorForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectedColor = document.querySelector('input[name="color"]:checked').value;
    console.log("Selected color:", selectedColor);

    setChoosenColor(selectedColor);
    choosenColor = selectedColor;
    
    hide(colorModal);
    show(gameContainerElem, "flex");
    timer.start();
});

function show(element, display = "block") {
    element.style.display = display;
}

function hide(element) {
    element.style.display = "none";
}

// TIMER 
class Timer {
    constructor(timerElem, refreshRate, stringFormat) {
        this._timerElem = timerElem;
        this._timeString = "00:00:00";
        this._startTime = null;
        this._timerInterval = null;
        this._refreshRate = refreshRate;
        this._stringFormat = stringFormat;
        this._finalTime = "Timer Not Stopped Yet";

        this.setStringFormat();
    }

    start() {
        this._startTime = Date.now();

        this._timerInterval = setInterval(() => {
            let elapsedTime = Date.now() - this._startTime;

            let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
            let minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
            let milliseconds = Math.floor((elapsedTime % 1000) / 10);

            switch (this._stringFormat) {
                case "msms":
                    this._timeString = `${this.padTime(milliseconds)}`;
                    break;
                case "ss:msms":
                    this._timeString = `${this.padTime(seconds)}:${this.padTime(milliseconds)}`;
                    break;
                case "mm:ss:msms":
                    this._timeString = `${this.padTime(minutes)}:${this.padTime(seconds)}:${this.padTime(milliseconds)}`;
                    break;
                case "hh:mm:ss:msms":
                    this._timeString = `${this.padTime(hours)}:${this.padTime(minutes)}:${this.padTime(seconds)}:${this.padTime(milliseconds)}`;
                    break;
                case "hh:mm:ss":
                    this._timeString = `${this.padTime(hours)}:${this.padTime(minutes)}:${this.padTime(seconds)}`;
                    break;
                case "hh:mm":
                    this._timeString = `${this.padTime(hours)}:${this.padTime(minutes)}`;
                    break;
                case "hh":
                    this._timeString = `${this.padTime(hours)}`;
                    break;
                default:
                    throw new RangeError("Invalid date provided: Please ensure the date format is correct.");
            }

            this._timerElem.textContent = this._timeString;

        }, this._refreshRate);
    }

    stop() {
        this._finalTime = Date.now() - this._startTime;
        clearInterval(this._timerInterval);
    }

    padTime(time) {
        return time.toString().padStart(2, '0');
    }

    reset() {
        this.stop();
        this._timerElem.textContent = '00:00:00:00';
    }

    setStringFormat() {
        this._timerElem.textContent = '00:00:00:00';
    }
}

const timer = new Timer(timerElem, 10, "mm:ss:msms");

gameHelpOverlay.addEventListener("click",()=>{
    hide(gameHelpContainer)
    show(btnHelp)
    helpBtnClicked = false;
})

btnHelp.addEventListener("click", ()=>{
    show(gameHelpContainer);
    hide(btnHelp)
    helpBtnClicked = true;
})

window.addEventListener("resize", ()=>{
    if(window.innerWidth < 1024){
        hide(gameHelpContainer)
        hide(btnHelp)
    } else if(window.innerWidth > 1024){
        show(btnHelp)
    }
})

btnClose.addEventListener('click',()=>{
    hide(gameHelpContainer)
    show(btnHelp)
})

btnRestartGame.addEventListener('click', ()=>{
    show(btnHelp)
    hide(winModal)
    timer.reset()
    resetGame()
})