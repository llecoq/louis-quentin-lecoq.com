import { opts } from "../opts.js";
import { getDist } from "./utilsJS.js";
import ImpulseJS from "./ImpulseJS.js";

export default class ParticleJS {
    
    index
    canvas
    x
    y
    size
    activeSize
    color
    speedX
    speedY
    neighbors = []
    active = false
    connectionMaxDist

    // Constructor
    constructor(canvas) {
        this.canvas = canvas;
        this.x = 0;
        this.y = 0;
        this.size = 0;
        this.activeSize = 0;
        this.color = 'rgb(255, 255, 255)';
        this.speedX = 0;
        this.speedY = 0;
        this.connectionMaxDist = opts.CONNECTION_MAX_DIST;
    }

    setParticleData(data, index) {
        this.index = index;
        this.x = data.x;
        this.y = data.y;
        this.size = data.size;
        this.activeSize = data.activeSize;
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
        ctx.arc(this.x, this.y, this.active ? this.activeSize : this.size, 0, opts.ARC_RAD);
        ctx.fill();
    }

    // Set the Particle to `active` and set a timer to desactive it aftera given delay
    activateTimer() {
        this.active = true;
        setTimeout(() => {
            this.active = false;
        }, opts.PARTICLE_ACTIVE_DELAY);
    }

    // Set neighbors[]
    setNeighbors(sortedSlice) {
        this.neighbors = sortedSlice;
    }

    setNeighborFromPosition(neighbor, neighborPosition) {
        this.neighbors[neighborPosition] = neighbor;
    }

    setConnectionMaxDist(value) {
        this.connectionMaxDist = value;
    }

    // Render connections between `Particle` on the canvas
    renderConnections(ctx, mouseX, mouseY, mouseIsOverCanvas) {
        this.neighbors.forEach(neighbor => {
            const dist = getDist(this.x, this.y, neighbor.x, neighbor.y);
            
            // render connections between particles
            if (dist < this.connectionMaxDist) {
                const globalAlpha = this.active && neighbor.active ? opts.ACTIVE_CONNECTIONS_GLOBAL_ALPHA : opts.CONNECTIONS_GLOBAL_ALPHA;
                ctx.globalAlpha = globalAlpha - dist / this.connectionMaxDist;

                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(neighbor.x, neighbor.y);
                ctx.stroke();
            }

            // render connections with mouse
            if (mouseIsOverCanvas) {
                const distToMouse = getDist(this.x, this.y, mouseX, mouseY);

                if (distToMouse < this.connectionMaxDist) {
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

        if (distToMouse < this.connectionMaxDist 
                && this.active === false
                && numberOfActiveImpules < opts.MAX_IMPULSES) {
            return true;
        }
        return false;
    }

    // Create a new `ImpulseJS` and returns it on success
    createImpulse(mouseX, mouseY) {
        const neighbor = this.neighbors.find(neighbor => getDist(neighbor.x, neighbor.y, this.x, this.y) < this.connectionMaxDist);
        if (neighbor) {
            this.activateTimer();
            return new ImpulseJS(mouseX, mouseY, this, neighbor, this.connectionMaxDist);
        }
        return null;
    }

    getNeighbors() {
        return this.neighbors;
    }

    setForMouse(mouseX, mouseY) {
        this.index = -1;
        this.x = mouseX;
        this.y = mouseY;
    }

    clearNeighbors() {
        this.neighbors = [];
    }
}