let tileContainer = document.querySelector(".tile-container");
let allTiles = [];
const numberOfTilesDisplayed = 450;
let resetBtn = document.querySelector('.reset-btn'); 

const choosenColor = "rgb(255, 77, 0)"; 

function resetGame(){
    console.log("game reseted");
    
    allTiles.forEach(tile => {

        tile.style.backgroundColor = "#0e1118"

        tile.addEventListener("mouseover", handleMouseOver);
        tile.addEventListener("mouseout", handleMouseOut);
        
        tile.addEventListener('click',(event)=>{
            let computedStyle = window.getComputedStyle(tile); 
            if(computedStyle.backgroundColor === choosenColor){
                tile.removeEventListener('mouseover',handleMouseOver);
                tile.removeEventListener("mouseout", handleMouseOut)
            }
        })
    });
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
    "rgb(255, 0, 144)",   // #FF0090
    "rgb(255, 77, 0)",    // #FF4D00
    "rgb(13, 0, 255)"     // #0D00FF
];

let shuffledColors = shuffleArray([...colorsArray]);
let colorIndex = 0;

function handleMouseOver(event) {
    event.target.style.transition = "0s";
    event.target.style.backgroundColor = getNextColor();
}


function handleMouseOut(event) {
    event.target.style.backgroundColor = "#0e1118";
    event.target.style.transition = "0.5s";
}


window.addEventListener("load", () => {

    setChoosenColor(choosenColor);

    for (let i = 0; i < numberOfTilesDisplayed; i++) {
        let tile = document.createElement('div');
        tile.classList.add("tile");
        tileContainer.appendChild(tile);
        console.log("run");
    }

    resetBtn.addEventListener('click',resetGame)

    allTiles.push(...document.querySelectorAll('.tile'));
    allTiles.forEach(tile => {

        tile.addEventListener("mouseover", handleMouseOver);
        tile.addEventListener("mouseout", handleMouseOut);
        
        tile.addEventListener('click',(event)=>{
            let computedStyle = window.getComputedStyle(tile); 
            if(computedStyle.backgroundColor === choosenColor){
                tile.removeEventListener('mouseover',handleMouseOver);
                tile.removeEventListener("mouseout", handleMouseOut)
            }
        })
    });
});

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

