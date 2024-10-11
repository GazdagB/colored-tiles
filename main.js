let tileContainer = document.querySelector(".tile-container");
let clickCountElem = document.querySelector(".click-count")
let gameContainerElem = document.querySelector(".game-container")

let timerElem = document.querySelector(".timer")

let allTiles = [];
const numberOfTilesDisplayed = 160;
let resetBtn = document.querySelector('.reset-btn'); 
let colorForm = document.getElementById('color-form'); 
let colorModal = document.querySelector(".color-modal");
let clickCount = 0; 

let choosenColor = "rgb(255, 77, 0)"; 
const baseColor = "#0e1118"

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


function resetGame(){


    //Hiding the Table 
    hideTable()
    
    //showingSettings Modal 
    showColorModal()


    //Reseting all event listeners and base color for tiles 
    initGame()
}


function setChoosenColor(choosenColor){
    document.querySelector(".choosen-tile").style.backgroundColor = choosenColor;
    resetBtn.style.backgroundColor = choosenColor; 
    resetBtn.addEventListener('mouseenter',()=>{
        resetBtn.style.backgroundColor = getNextColor(); 
    })

    resetBtn.addEventListener('mouseout',()=>{
        resetBtn.style.backgroundColor = choosenColor; 
    })
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

createChoosableColors(colorsArray,document.getElementById("color-parent"))


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
    hideTable();

    setChoosenColor(choosenColor);

    for (let i = 0; i < numberOfTilesDisplayed; i++) {
        let tile = document.createElement('div');
        tile.classList.add("tile");
        tileContainer.appendChild(tile);
        console.log("run");
    }

    resetBtn.addEventListener('click',resetGame)

    allTiles.push(...document.querySelectorAll('.tile'));

    initGame()

});

function initGame(){

    //reset Clicks 
    clickCount = 0; 
    clickCount.innerHTML= `Clicks: 0`

    allTiles.forEach(tile => {
        tile.removeEventListener("click",handleTileClick)
        tile.removeEventListener("mouseover",handleMouseOver)
        tile.removeEventListener("mouseout",handleMouseOut)
    })
    
    allTiles.forEach(tile => {
        tile.style.backgroundColor = baseColor
        tile.addEventListener("mouseover", handleMouseOver);
        tile.addEventListener("mouseout", handleMouseOut);
        
        tile.addEventListener('click',handleTileClick)
    });
}

function handleTileClick(event) {
    clickCount++; 
    clickCountElem.innerHTML = `Clicks: ${clickCount}`; 

    // Get the clicked tile's background color
    let clickedTile = event.target;
    let computedStyle = window.getComputedStyle(clickedTile);

    // Check if the clicked tile has the chosen color
    if (computedStyle.backgroundColor === choosenColor) {
        // Remove event listeners for this tile (disable further interaction)
        clickedTile.removeEventListener('mouseover', handleMouseOver);
        clickedTile.removeEventListener("mouseout", handleMouseOut);

        // Check if the player has won
        paintWin();
    }
}



function paintWin() {
    if (checkIfWon()) {
        console.log("Congrats you won!");
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
    e.preventDefault(); // Prevent the form from submitting in the traditional way

    // Get the selected color
    const selectedColor = document.querySelector('input[name="color"]:checked').value;
    console.log("Selected color:", selectedColor);

    // Set the chosen color based on the user's selection
    setChoosenColor(selectedColor);
    choosenColor = selectedColor;
    

    // Hide the modal
    colorModal.setAttribute("style", "display: none");
    showTable()
    timer.start()
    
});

function showTable(){
    gameContainerElem.style.display = "flex"
}

function hideTable(){
    gameContainerElem.style.display= "none"
}

function showColorModal(){
    colorModal.style.display = "flex"
}

function hideColorModal(){
    colorModal.style.display= "none"
}


//TIMER 
/**
 * This timer taks an HTML element as an argument and injects the time into it with the given interval 
 * Format types as arguments: 
 * HH:MM:SS
 * MM:SS
 * SS 
 */
class Timer{
    constructor(timerElem,refreshRate,stringFormat){
        this._timerElem = timerElem
        this._timeString = "00:00:00"
        this._startTime = null;
        this._timerInterval = null;
        this._refreshRate = refreshRate
        this._stringFormat = stringFormat

        this.setStringFormat()
    }

    start(){
        this._startTime = Date.now()

        this._timerInterval = setInterval(()=>{
            let elapsedTime = Date.now() - this._startTime;


            let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
            let minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
            let milliseconds = Math.floor((elapsedTime % 1000) / 10); // Show only two digits for milliseconds

            switch (this._stringFormat) {
                case "msms":
                    this._timeString = `${this.padTime(milliseconds)}`
                    break;
                case "ss:msms":
                    this._timeString = `${this.padTime(seconds)}:${this.padTime(milliseconds)}`
                    break;
                case "mm:ss:msms":
                    this._timeString = `${this.padTime(minutes)}:${this.padTime(seconds)}:${this.padTime(milliseconds)}`
                    break;
                case "hh:mm:ss:msms":
                    this._timeString = `${this.padTime(hours)}:${this.padTime(minutes)}:${this.padTime(seconds)}:${this.padTime(milliseconds)}`
                    break;
                case "hh:mm:ss":
                    this._timeString = `${this.padTime(hours)}:${this.padTime(minutes)}:${this.padTime(seconds)}`
                    break;
                case "hh:mm":
                    this._timeString = `${this.padTime(hours)}:${this.padTime(minutes)}`
                    break;
                case "hh":
                    this._timeString = `${this.padTime(hours)}`
                    break;
                default:
                    throw new RangeError("Invalid date provided: Please ensure the date format is correct.");
            }

            
            this._timerElem.textContent = this._timeString;

        },this._refreshRate)
    }

    stop() {
        clearInterval(this._timerInterval); // Stops the timer
    }

    padTime(time) {
        return time.toString().padStart(2, '0'); // Adds leading zero for hours, minutes, seconds
    }
    
    padMilliseconds(milliseconds) {
        return milliseconds.toString().padStart(2, '0'); // Pads milliseconds to 2 digits
    }

    reset() {
        this.stop(); // Stop the timer if it's running
        this._timerElem.textContent = '00:00:00:00'; // Reset display
        this._startTime = null; // Clear the start time
        this._timeString = '00:00:00:00'; // Reset the time string
    }

    setStringFormat(){
        this._stringFormat = this._stringFormat.toLowerCase()
    }
}

let timer = new Timer(timerElem,10,"hh:mm:ss:msms")


