import { opts } from "../particles.js";

export default class Particle {
    canvas
    ctx
    x
    y
    size
    color
    speedX
    speedY
    neighbors = []
    active = false

    constructor(canvas) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radiusX = canvas.width * 0.3; 
        const radiusY = canvas.height * 0.3;
        const theta = Math.random() * 2 * Math.PI;
        const speedX = Math.random();
        const speedY = Math.random();
        const dirX = Math.random() > 0.5 ? 1 : -1;
        const dirY = Math.random() > 0.5 ? 1 : -1;
        
        this.canvas = canvas;
        this.x = centerX + radiusX * Math.cos(theta);
        this.y = centerY + radiusY * Math.sin(theta);
        this.size = Math.random() * (opts.PARTICLE_MAX_SIZE - opts.PARTICLE_MIN_SIZE) + opts.PARTICLE_MIN_SIZE;
        this.color = getRandomParticleColor();
        this.speedX = speedX * dirX;
        this.speedY = speedY * dirY;
    }

    draw(ctx) {
        this.x += this.speedX;
        this.y += this.speedY;

        switch (true) {
            case this.x < 0:
                this.x = this.canvas.width;
                break;
            case this.x > this.canvas.width:
                this.x = 0;
                break;
            case this.y < 0:
                this.y = this.canvas.height;
                break;
            case this.y > this.canvas.height:
                this.y = 0;
                break;
        }

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    activateTimer() {
        this.active = true;
        setTimeout(() => {
            this.active = false;
        }, opts.PARTICLE_ACTIVE_DELAY);
    }

    setNeighbors(sortedSlice) {
        this.neighbors = sortedSlice;
    }

}

// Returns RGB values for the color of each particle
function getRandomParticleColor() {
    var chance = Math.random();
    if (chance < 0.70) {
        return opts.PARTICLE_COLOR_1;
    } else if (chance < 0.90) {
        return opts.PARTICLE_COLOR_2;
    } else {
        return opts.PARTICLE_COLOR_3;
    }
}