const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const circles = [];

function Circle(changeX, changeY) {
    this.x =  Math.floor(Math.random() * (window.innerWidth - 110) + 55);
    this.y =  Math.floor(Math.random() * (window.innerHeight - 110) + 55);
    this.color =  "#" + Math.floor(Math.random()*16777215).toString(16) + "75";
    this.changeX = changeX;
    this.changeY = changeY;
    this.updateX = function(){
        if(this.x > window.innerWidth - 50 || this.x < 50) {
            this.changeX = -1 * this.changeX;
        } 
        this.x += this.changeX;
    }
    this.updateY = function() {
        if(this.y > window.innerHeight - 50 || this.y < 50) {
            this.changeY = -1 * this.changeY;
        } 
        this.y += this.changeY;
    }
}

for(let i = 0; i < 100; i++) {
    let rand1 = Math.floor(Math.random() * 10) / 10;
    let rand2 = Math.floor(Math.random() * 10) / 10;
    let changeX = rand1 >= 0.5 ? -1 * rand1 - 1 : rand1 + 1;
    let changeY = rand2 >= 0.5 ? -1 * rand2 - 1: rand2 + 1;
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

animate();