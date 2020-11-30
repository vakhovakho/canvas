const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Circle {
    constructor(id, ctx, x, y, r, color = "gold"){
        this.id = id;
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
        this.dx = 0;
        this.dy = 1;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    move() {
        this.ctx.clearRect(this.x - this.r - 1, this.y - this.r - 1, 2 * this.r + 2, 2 * this.r + 2);
        this.checkBorderTouch();
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }

    checkBorderTouch() {
        if(this.x + this.r >= this.ctx.canvas.width || this.x - this.r <= 0) {
            this.dx *= -1;
        }

        if(this.y + this.r >= this.ctx.canvas.height || this.y - this.r <= 0) {
            this.dy *= -1;
        }
    }
}

class Rectangle {
    constructor(id, ctx, x, y, w, h, color = "blue"){
        this.id = id;
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    remove() {
        this.ctx.clearRect(this.x, this.y, this.w, this.h);
    }
}

class Board extends Rectangle {
    move(x, y) {
        if(x + this.w > this.ctx.canvas.width || x < 0) {
            return;
        }
        this.remove();
        this.x = x;
        this.y = y;
        this.draw();
    }
}
 
class Game {
    constructor(canvas, width = window.innerWidth, height = window.innerHeight) {
        canvas.width = width;
        canvas.height = height;
        this.ctx = canvas.getContext("2d");
        this.interval = null;
        this.circle = null;
        this.rectangles = [];
        this.board = null;
        this.floor = null;
        this.speed =  4;
    }

    draw() {
        this.generateBoard();
        this.generateCircle();
        this.generateRectangles();
    }

    generateCircle() {
        this.circle = new Circle(1, this.ctx, 475, 500, 10);
        this.circle.draw();
    }

    generateBoard() {
        this.board = new Board("0", this.ctx, this.ctx.canvas.width / 2 - 100, this.ctx.canvas.height - 50, 320, 20, "gold");
        this.board.draw();
        this.floor = new Rectangle("-1", this.ctx, 0, this.ctx.canvas.height - 30, this.ctx.canvas.width, 30, "blue");
        this.floor.draw();
    }

    generateRectangles() {
        const maxCountInRow = Math.floor(this.ctx.canvas.width / 110);
        const padding = (this.ctx.canvas.width - maxCountInRow * 110) / 2;
        for(let i = 0; i < maxCountInRow; i++) {
            for(let j = 0; j < 6; j++) {
                const rectAngle = new Rectangle(i + "_" + j, this.ctx, padding + 110 * i, 10 + 50 * j, 100, 40);
                this.rectangles.push(rectAngle);
                rectAngle.draw();
            }
        }
    }

    removeRect(rectangle) {
        this.rectangles = this.rectangles.filter(rect => rect.id !== rectangle.id);
        rectangle.remove();
    }

    gameOver() {
        alert("game over");
        clearInterval(this.interval);
        this.interval = null;
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.draw();
    }

    checkForBoardTouch(){
        let dxs = [
            Math.cos(165 * Math.PI / 180), 
            Math.cos(150 * Math.PI / 180), 
            Math.cos(135 * Math.PI / 180), 
            Math.cos(120 * Math.PI / 180), 
            Math.cos(75 * Math.PI / 180), 
            Math.cos(60 * Math.PI / 180), 
            Math.cos(45 * Math.PI / 180), 
            Math.cos(30 * Math.PI / 180)
        ];

        let dys = [
            Math.sin(150 * Math.PI / 180), 
            Math.sin(135 * Math.PI / 180), 
            Math.sin(120 * Math.PI / 180), 
            Math.sin(105 * Math.PI / 180), 
            Math.sin(75 * Math.PI / 180), 
            Math.sin(60 * Math.PI / 180), 
            Math.sin(45 * Math.PI / 180), 
            Math.sin(30 * Math.PI / 180)
        ];

        if(this.board.y - (this.circle.y + this.circle.r) <= 2) {
            if(this.board.x <= this.circle.x + this.circle.r && 
                this.board.x + this.board.w >= this.circle.x - this.circle.r 
            ) {
                let segmentWidth = this.board.w / 8;
                this.circle.dx = this.speed * Math.floor(dxs[Math.floor((this.circle.x - this.board.x) / segmentWidth)] * 10) / 10;
                this.circle.dy = -1 * this.speed * Math.floor(dys[Math.floor((this.circle.x - this.board.x) / segmentWidth)] * 10) / 10;
            } else {
                if(this.board.x - (this.circle.x + this.circle.r) <= 10 && 
                    this.circle.x < this.board.x
                ) {
                    this.circle.dx = Math.cos(Math.PI * 165 / 180);
                    this.circle.dy *= -1 * Math.cos(Math.PI * 165 / 180);
                } else {
                    if((this.circle.x - this.circle.r) - (this.board.x + this.board.w) <= 10 && 
                        this.circle.x > this.board.x
                    ) {
                        this.circle.dx = this.speed * Math.floor(Math.cos(15 * Math.PI / 180) * 10) / 10;
                        this.circle.dy = -1 * this.speed * Math.floor(Math.sin(15 * Math.PI / 180) * 10) / 10;
                    }      
                }
            }
        } 
    }

    checkForLose(){
        if(this.ctx.canvas.height - (this.circle.y + this.circle.r) < 30) {
            this.gameOver();
        }
    }

    checkForRectangleTouch() {
        this.rectangles.forEach(rect => {
            let circleLeftBorder = this.circle.x - this.circle.r;
            let circleRightBorder = this.circle.x + this.circle.r;
            let circleTopBorder = this.circle.y - this.circle.r;
            let circleBottomBorder = this.circle.y + this.circle.r;

            let rectLeftBorder = rect.x;
            let rectRightBorder = rect.x + rect.w;
            let rectTopBorder = rect.y;
            let rectBottomBorder = rect.y + rect.h;

            if(rectLeftBorder <= circleRightBorder &&
                rectRightBorder >= circleLeftBorder &&
                rectTopBorder <= circleBottomBorder &&
                rectBottomBorder >= circleTopBorder
            ) {
                if(rectBottomBorder - circleTopBorder <= 5 || circleBottomBorder - rectTopBorder <= 5) {
                    this.circle.dy *= -1;
                } else {
                    if(circleRightBorder - rectLeftBorder <= 5 || rectRightBorder - circleLeftBorder <= 5) {
                        this.circle.dx *= -1;
                    }    
                }
                    
                this.removeRect(rect);
                return;
            }
        });
    }

    checkForWin() {
        if(this.rectangles.length === 0) {
            alert("You Won!");
            clearInterval(this.interval);
            this.interval = null;
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.draw();
        }
    }

    start() {
        if(this.interval) {
            return;
        }
        this.interval = setInterval(() => {
            this.checkForLose();
            this.checkForBoardTouch();
            this.checkForRectangleTouch();
            this.checkForWin();
            this.circle.move();
        }, 1)
    }
}

const game = new Game(canvas);
game.draw();


let interval = null;
window.addEventListener("keydown", e => {  
    game.start();  
    let x = game.board.x;
    let y = game.board.y;
    let changeX = 0;
    let changeY = 0;
    switch(e.key){
        case "ArrowLeft":
            changeX = -10;
            break;
        case "ArrowRight":
            changeX = 10;
            break;
        case "ArrowUp":
            // changeY = -10;
            break;
        case "ArrowDown":
            // changeY = 10;
            break;
        default:
            break;
    }
    if(!interval) {
        interval = setInterval(() => {
            x += changeX;
            y += changeY;
            game.board.move(x, y);
        }, 10)
    }

    
    
});

window.addEventListener("keyup", e => {
    if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        if(interval) {
            clearInterval(interval);
            interval = null;
        }
    } else {
        if(e.code === "Space") {
            game.start();
        }
    }
})




