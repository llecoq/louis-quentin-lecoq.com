import { opts } from "../particles.js";
import { getDist } from "../particles.js";

export default class Impulse {
    
    particle
    x
    y
    target
    speed
    distAutonomy

    // Constructor
    constructor(x, y, particle, neighbor, distAutonomy = opts.IMPULSE_DIST_AUTONOMY) {
        this.x = x;
        this.y = y;
        this.particle = particle;
        this.target = neighbor;
        this.speed = Math.random() * opts.IMPULSE_SPEED + opts.IMPULSE_SPEED_OFFSET;
        this.distAutonomy = distAutonomy;
    }

    // Update impulse position
    updateImpulsePosition(scaleFPS, steps = 8) {
        for (let i = 0; i < steps; i++) {
            let dx = this.target.x - this.x;
            let dy = this.target.y - this.y;
            let length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;

            this.x += dx * this.speed * scaleFPS;
            this.y += dy * this.speed * scaleFPS;
        }

        this.distAutonomy -= this.speed * steps * scaleFPS;
    }

    // Draw impulse
    draw(ctx, scaleFPS) {
        this.updateImpulsePosition(scaleFPS, 1);
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(72, 217, 247)';
        ctx.lineWidth = opts.IMPULSE_SIZE;
        ctx.moveTo( this.x, this.y );
        this.updateImpulsePosition(scaleFPS);
        ctx.lineTo( this.x, this.y );
        ctx.stroke();
    }

    // Get next neighbor
    getNextNeighbor(origin, particle) {
        return particle.neighbors.find(neighbor => getDist(particle.x, particle.y, neighbor.x, neighbor.y) < opts.MAX_DIST && neighbor !== origin && !neighbor.active);
    }

    // Returns true if the `Impulse` is expired
    isExpired() {
        return this.distAutonomy <= 0 || this.target === false
    }

    // Move to next target
    move() {
        if (getDist(this.x, this.y, this.target.x, this.target.y) < 10) {
            const nextTarget = this.getNextNeighbor(this.particle, this.target);
            if (nextTarget) {
                this.particle = this.target;
                this.target = nextTarget;
                nextTarget.activateTimer();
                return true;
            }
            return false;
        }
    }
}