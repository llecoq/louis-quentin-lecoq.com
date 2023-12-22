const PARTICLE_MAX_SIZE = 3
const PARTICLE_MIN_SIZE = 0.6

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
        this.size = Math.random() * (PARTICLE_MAX_SIZE - PARTICLE_MIN_SIZE) + PARTICLE_MIN_SIZE;
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
        }, PARTICLE_ACTIVE_DELAY);
    }

    setNeighbors(sortedSlice) {
        this.neighbors = sortedSlice;
    }

}

// Returns RGB values for the color of each particle
function getRandomParticleColor() {
    var chance = Math.random();
    if (chance < 0.70) {
        // 70% chance of white
        return 'rgb(255, 255, 255)';
    } else if (chance < 0.90) {
        // 20% chance of 'rgb(72, 217, 247)'
        return 'rgb(72, 217, 247)';
    } else {
        // 10% chance of 'rgb(248, 155, 73)'
        return 'rgb(248, 155, 73)';
    }
}