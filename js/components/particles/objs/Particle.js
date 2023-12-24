import { opts } from "../particles.js";
import { getDist } from "../particles.js";
import Impulse from "./Impulse.js";

export default class Particle {
    
    canvas
    ctx
    x
    y
    size
    color
    activeColor
    speedX
    speedY
    neighbors = []
    active = false

    // Constructor
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
        this.activeColor = opts.PARTICLE_ACTIVE_COLOR;
        this.speedX = speedX * dirX;
        this.speedY = speedY * dirY;
    }

    // Draw the Particle on the canvas
    draw(ctx, scaleFPS) {
        this.x += this.speedX * scaleFPS;
        this.y += this.speedY * scaleFPS;

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
        ctx.fillStyle = this.active ? this.activeColor : this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    // Set the Particle to `active` and set a timer to desactive it aftera given delay
    activateTimer() {
        this.active = true;
        this.size *= opts.PARTICLE_ACTIVE_SIZE_SCALE;
        setTimeout(() => {
            this.active = false;
            this.size /= opts.PARTICLE_ACTIVE_SIZE_SCALE;
        }, opts.PARTICLE_ACTIVE_DELAY);
    }

    // Set neighbors[]
    setNeighbors(sortedSlice) {
        this.neighbors = sortedSlice;
    }

    // Draw connections between `Particle` on the canvas
    drawConnections(ctx, mouseX, mouseY) {
        this.neighbors.forEach(neighbor => {
            const dist = getDist(this.x, this.y, neighbor.x, neighbor.y);
            
            // draw connections between particles
            if (dist < opts.CONNECTION_MAX_DIST) {
                const globalAlpha = this.active && neighbor.active ? opts.ACTIVE_CONNECTIONS_GLOBAL_ALPHA : opts.CONNECTIONS_GLOBAL_ALPHA;

                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(neighbor.x, neighbor.y);
                ctx.globalAlpha = globalAlpha - dist / opts.CONNECTION_MAX_DIST;
                ctx.stroke();
            }

            // draw connections with mouse
            const distToMouse = getDist(this.x, this.y, mouseX, mouseY);
            if (distToMouse < opts.CONNECTION_MAX_DIST) {
              ctx.beginPath();
              ctx.moveTo(this.x, this.y);
              ctx.lineTo(mouseX, mouseY);
              ctx.globalAlpha = 0.1;
              ctx.stroke();
            }
        });
    }

    // Check if possible to create a new `Impulse`
    canCreateImpulse(mouseX, mouseY, numberOfActiveImpules) {
        const distToMouse = getDist(this.x, this.y, mouseX, mouseY);

        if (distToMouse < opts.CONNECTION_MAX_DIST 
                && this.active === false
                && numberOfActiveImpules < opts.MAX_IMPULSES) {
            return true;
        }
        return false;
    }

    // Create a new `Impulse` and returns it on success
    createImpulse(mouseX, mouseY) {
        const neighbor = this.neighbors.find(n => getDist(mouseX, mouseY, this.x, this.y) < opts.CONNECTION_MAX_DIST);
        if (neighbor) {
            this.activateTimer();
            return new Impulse(mouseX, mouseY, this, neighbor);
        }
        return null;
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