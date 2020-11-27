const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 70;

const ctx = canvas.getContext("2d");
const startingCoordinates = [100, 500];
const maxX = window.innerWidth - (2 * startingCoordinates[0]);
let lastRect = [0, 0, 0, 0];

/**
* @param {CanvasRenderingContext2D} ctx The number to raise.
* @param {Array} columns
* @return {undefined}
*/
function generateSystem(ctx, columns) {
    drawLine(ctx, [0, 0], [maxX, 0]);
    columns.forEach((column, index) => {
        const coordinates = generateCoordinatesFor(columns, index);
        drawLine(ctx, ...coordinates);
        drawText(ctx, column, coordinates[0]);
    });
}

function generateCoordinatesFor(columns, index) {
    let distance = maxX / columns.length;
    const maxNumber = Math.max(...columns);
    const minHeight = 400 / maxNumber;
    return [
        [index * distance + distance / 2, 0], 
        [index * distance + distance / 2, columns[index] * minHeight]
    ];
}
/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 */
function clearCanvas(ctx) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function drawLine(ctx, start, end) {
    ctx.beginPath();
    ctx.lineWidth = "4";
    ctx.moveTo(start[0] + startingCoordinates[0], startingCoordinates[1] - start[1]);
    ctx.lineTo(end[0] + startingCoordinates[0], startingCoordinates[1] - end[1]);
    ctx.stroke();
}

function drawText(ctx, text, start){
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(text, start[0] + startingCoordinates[0] - 5, startingCoordinates[1] - start[1] + 30);
}

/**
* @param {CanvasRenderingContext2D} ctx The number to raise.
* @param {Array} from
* @param {Array} to
* @return {undefined}
*/
function drawRect(ctx, from, to, final = false) {
    const x = startingCoordinates[0] + from[1][0] + 2;
    const y = startingCoordinates[1] - Math.min(from[1][1], to[1][1]);
    const w = to[0][0] - from[0][0] - 4;
    const h = Math.min(from[1][1], to[1][1]);
    ctx.fillStyle = final ?  "rgba(0, 255, 0, 0.5)" : "rgba(255, 0, 0, 0.5)";
    lastRect = [x, y, w, h];
    ctx.fillRect(...lastRect);
}


function countArea(columns, left, right) {
    return Math.min(columns[left], columns[right]) * (right - left);
}

function* genMaxArea(columns){
    let left = 0;
    let right = columns.length - 1;
    let maxArea = [0, left, right];
    
    while(left < right){
        let newArea = [countArea(columns, left, right), left, right];
        yield newArea;
        if(maxArea[0] < newArea[0]) {
            maxArea = [newArea[0], left, right];
        }
        
        if(columns[left] > columns[right]) {
            right--;
        } else {
            left++;
        }
    }
        
    return maxArea;
}

function animate(columns){
    let count =  genMaxArea(columns);
    let interval = setInterval(() => {
        let prevArea = [0, 0, 0];
        let current = count.next();
        if(current.value) {
            clearCanvas(ctx);
            generateSystem(ctx, columns);
            animateRect(columns, current, prevArea);
        } else {
            clearInterval(interval);
        }
    }, 500);
}

function animateRect(columns, currentGen, prevArea) {
    let firstCoordinates = generateCoordinatesFor(columns, currentGen.value[1])
    let secondCoordinates = generateCoordinatesFor(columns, currentGen.value[2]);
    drawRect(ctx, firstCoordinates, secondCoordinates, currentGen.done); 
}

document.getElementById("submit").addEventListener("click", () => {
    clearCanvas(ctx);
    let input = document.getElementById("array");
    let columns = input.value.split(",")
        .map(val => +val)
        .filter(val => typeof val === "number" && val > 0);
    if(columns.length > 1) {
        generateSystem(ctx, columns);
        animate(columns);
    } else {
        drawText(ctx, "Invalid Data", [300, 300]);
    }
});

