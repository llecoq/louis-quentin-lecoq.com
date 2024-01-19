import { opts } from "../Particles.js";
import { getDist } from "./utilsJS.js";
import ImpulseJS from "./ImpulseJS.js";

export default class ParticleJS {
    
    canvas
    x
    y
    size
    color
    speedX
    speedY
    neighbors = []
    active = false

    // Constructor
    constructor(canvas) {
        this.canvas = canvas;
        this.x = 0;
        this.y = 0;
        this.size = 0;
        this.color = 'rgb(255, 255, 255)';
        this.speedX = 0;
        this.speedY = 0;
    }

    setParticleData(data) {
        this.x = data.x;
        this.y = data.y;
        this.size = data.size;
        this.color = data.color;
        this.speedX = data.speedX;
        this.speedY = data.speedY;
        this.active = data.active == 1 ? this.activateTimer() : false;
    }

    // Update Particle's position
    updatePosition(scaleFPS) {
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
    }

    // Render the Particle on the canvas
    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.active ? opts.PARTICLE_ACTIVE_COLOR : this.color;
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

    // Render connections between `Particle` on the canvas
    renderConnections(ctx, mouseX, mouseY, mouseIsOverCanvas) {
        this.neighbors.forEach(neighbor => {
            const dist = getDist(this.x, this.y, neighbor.x, neighbor.y);
            
            // render connections between particles
            if (dist < opts.CONNECTION_MAX_DIST) {
                const globalAlpha = this.active && neighbor.active ? opts.ACTIVE_CONNECTIONS_GLOBAL_ALPHA : opts.CONNECTIONS_GLOBAL_ALPHA;

                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(neighbor.x, neighbor.y);
                ctx.globalAlpha = globalAlpha - dist / opts.CONNECTION_MAX_DIST;
                ctx.stroke();
            }

            // render connections with mouse
            if (mouseIsOverCanvas) {
                const distToMouse = getDist(this.x, this.y, mouseX, mouseY);
                if (distToMouse < opts.CONNECTION_MAX_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.globalAlpha = 0.1;
                    ctx.stroke();
                }
            }
        });
    }

    // Check if possible to create a new `ImpulseJS`
    canCreateImpulse(mouseX, mouseY, numberOfActiveImpules) {
        const distToMouse = getDist(this.x, this.y, mouseX, mouseY);

        if (distToMouse < opts.CONNECTION_MAX_DIST 
                && this.active === false
                && numberOfActiveImpules < opts.MAX_IMPULSES) {
            return true;
        }
        return false;
    }

    // Create a new `ImpulseJS` and returns it on success
    createImpulse(mouseX, mouseY) {
        const neighbor = this.neighbors.find(n => getDist(mouseX, mouseY, this.x, this.y) < opts.CONNECTION_MAX_DIST);
        if (neighbor) {
            this.activateTimer();
            return new ImpulseJS(mouseX, mouseY, this, neighbor);
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