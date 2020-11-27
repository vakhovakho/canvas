const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const circles = [];

let posX = null;
let posY = null;

function Circle(changeX, changeY) {
    this.x =  Math.floor(Math.random() * (window.innerWidth - 110) + 55);
    this.y =  Math.floor(Math.random() * (window.innerHeight - 110) + 55);
    this.color =  "#" + Math.floor(Math.random()*16777215).toString(16) + "75";
    this.oldX = this.x;
    this.oldY = this.y;
    this.changeX = changeX;
    this.changeY = changeY;
    this.oldChangeX = changeX;
    this.oldChangeY = changeY;
    this.updateX = function(){
        if(posX) {
            this.changeX = this.x > posX ? -1 * Math.abs(changeX) : Math.abs(changeX);    
        } else {
            if(this.x > window.innerWidth - 50 || this.x < 50) {
                this.changeX = -1 * this.changeX;
            } 
        }
        this.x += this.changeX;
    }
    this.updateY = function() {
        if(posY) {
            this.changeY = this.y > posY ? -1 * Math.abs(changeY) : Math.abs(changeY);    
        } else {
            if(this.y > window.innerHeight - 50 || this.y < 100) {
                this.changeY = -1 * this.changeY;
            }
        }
    
        this.y += this.changeY;
    }
}

function generateRandomChange() {
    let rand1 = Math.floor(Math.random() * 10);
    return rand1 >= 0.5 ? -1 * rand1 - 1 : rand1 + 1;
}

for(let i = 0; i < 100; i++) {
    changeX = generateRandomChange();
    changeY = generateRandomChange();
    const circle = new Circle(changeX, changeY);
    circles.push(circle);
}

function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); 

    ctx.lineWidth = "10";
    circles.forEach(circle => {
        circle.updateX();
        circle.updateY();
        ctx.beginPath();
        ctx.arc(circle.x,  circle.y, 50, 0, Math.PI * 2);
        ctx.strokeStyle = circle.color;
        ctx.stroke();
    });
    requestAnimationFrame(animate);
}   

canvas.addEventListener("mousemove", event => {
    posX = event.x;
    posY = event.y;
});

canvas.addEventListener("mouseleave", event => {
    posX = null;
    posY = null;
    circles.forEach(circle => {
        circle.changeX = circle.oldChangeX;
        circle.changeY = circle.oldChangeY;
    });

});


animate();