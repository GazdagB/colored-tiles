let tileContainer = document.querySelector(".tile-container");
let allTiles = [];
const numberOfTilesDisplayed = 450;


let colorsArray = [ 
    "#FF3864", 
    "#2DE2E6", 
    "#F9C80E", 
    "#00FF41", 
    "#FF0090", 
    "#FF4D00", 
    "#0D00FF"  
];

let shuffledColors = shuffleArray([...colorsArray]);
let colorIndex = 0;

window.addEventListener("load", () => {
    for (let i = 0; i < numberOfTilesDisplayed; i++) {
        let tile = document.createElement('div');
        tile.classList.add("tile");
        tileContainer.appendChild(tile);
        console.log("run");
    }

    allTiles.push(...document.querySelectorAll('.tile'));
    allTiles.forEach(tile => {
        tile.addEventListener("mouseover", (event) => {
            tile.style.transition = "0s";
            event.target.style.backgroundColor = getNextColor();
        });

        tile.addEventListener("mouseout", (event) => {
            tile.style.backgroundColor = "#0e1118";
            tile.style.transition = "1s";
        });
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

