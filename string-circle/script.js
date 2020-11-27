const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

class Circle {
    constructor(id, ctx, x, y, r, color = "gold"){
        this.id = id;
        this.ctx = ctx;
        this.startX = x;
        this.startY = y;
        this.startR = r;
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
        this.moveX = Math.random() * 10 * (Math.random() >= 0.5 ? 1 : -1);
        this.moveY = Math.random() * 10 * (Math.random() >= 0.5 ? 1 : -1);
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    move(back = false) {
        if(back) {
            this.x -= this.moveX;
            this.y -= this.moveY;
        } else {
            this.x += this.moveX;
            this.y += this.moveY;
        }
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.r = this.startR;
    }
}

class CircleString {
    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {string} str 
     */
    constructor(ctx, str, r = 5, dx = 20) {
        this.ctx = ctx;
        this.r = r;
        this.dx = dx;
        this.width = str.length * r * 16 + dx * str.length - 1;
        this.height = r * 16;
        this.chars = str.toUpperCase().split("");
        this.circles = [];
        this.interval = null;
        this.movedCircles = new Set();
    };

    getMatrixForChar(char) {
        let charSequence = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let index = charSequence.indexOf(char);
        if(index > -1) {
            return charMatrixes[index];
        }
    };

    drawChar(char, x, y) {
        let currentX = x;
        let currentY = y;
        const matrix = this.getMatrixForChar(char);
        matrix.forEach( row => {
            row.forEach(val => {
                if(val) {
                    const circle = new Circle(this.circles.length + 1,this.ctx, currentX, currentY, this.r);
                    this.circles.push(circle);
                    circle.draw();
                }
                currentX += 2 * this.r;
            })
            currentY += 2 * this.r;
            currentX = x;
        });
    };

    draw(x = null, y = null) {
        if(x === null) {
            x = this.ctx.canvas.width / 2 - this.width / 2;
        }

        if(y === null) {
            y = this.ctx.canvas.height / 2 - this.height / 2
        }

        this.chars.forEach( char => {
            this.drawChar(char, x, y, this.r);
            x += this.r * 16 + this.dx;
        })
    };

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    resetAllCircles() {
        this.circles.forEach(circle => circle.reset());
    }

    shuffle() {
        if(this.interval) {
            return;
        }
        this.resetAllCircles();
        let distance = 0;
        this.interval = setInterval(() => {
            if(distance > 100) {
                if(this.interval) {
                    clearInterval(this.interval);
                    this.interval = null;
                    this.rollback();
                }
            }
            this.clear();
            this.circles.forEach(circle => {
                circle.move();
                circle.draw();
            });
            distance++;
        }, 20);
    }

    rollback() {
        if(this.interval) {
            return;
        }
        let distance = 0;
        this.interval = setInterval(() => {
            if(distance > 100) {
                if(this.interval) {
                    clearInterval(this.interval);
                    this.interval = null;
                }
            }
            this.clear();
            this.circles.forEach(circle => {
                circle.move(true);
                circle.draw();
            });
            distance++;
        }, 20);
    }

    zoomOut(x, y, d = 50) {
        if(this.interval) {
            return;
        }
        this.clear();
        this.circles.forEach(circle => {
            if(Math.abs(circle.x - x) < d && Math.abs(circle.y - y) < d ) {
                circle.r = 3;
            } else {
                circle.r = circle.startR;
                circle.x = circle.startX;
                circle.y = circle.startY
            }
            circle.draw();
        });
    }

    zoomIn(x, y, d = 50) {
        if(this.interval) {
            return;
        }
        this.clear();
        this.circles.forEach(circle => {
            if(Math.abs(circle.startX - x) >= d || Math.abs(circle.startY - y) >= d ) {
                circle.r = circle.startR;
                circle.x = circle.startX;
                circle.y = circle.startY;
                circle.draw();
            }

        });
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(x - 2 * d, y - 2 * d, 4 * d, 4 * d);
        this.circles.forEach(circle => {
            if(Math.abs(circle.startX - x) < d && Math.abs(circle.startY - y) < d ) {
                // this.movedCircles.add(circle);
                // circle.x = circle.startX + 10;
                circle.r = 10;
                if(circle.startY < y) {
                    circle.y = circle.startY - Math.floor(Math.abs(circle.startY - y) / 10) * 10;
                } else {
                    if(circle.startY > y) {
                        circle.y = circle.startY + Math.floor(Math.abs(circle.startY - y) / 10) * 10;
                    }
                }
                
                if(circle.startX < x) {
                    circle.x = circle.startX - Math.floor(Math.abs(circle.startX - x) / 10) * 10;
                } else {
                    if(circle.startX > x) {
                        circle.x = circle.startX + Math.floor(Math.abs(circle.startX - x) / 10) * 10;
                    }
                }
                circle.draw();
            } 
        });
    }

}

let str = new CircleString(ctx, "Canvas", 5);
str.draw();

canvas.addEventListener("click", () => {
    str.shuffle();
});

canvas.addEventListener("mousemove", (e) => {
    str.zoomOut(e.x, e.y);
    // str.zoomIn(e.x, e.y);
});


