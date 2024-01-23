import { opts } from "../Particles.js";
import { getDist } from "./utilsJS.js";

export default class ImpulseJS {
    
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

    // Render impulse
    render(ctx, scaleFPS) {
        if (getDist(this.x, this.y, this.target.x, this.target.y) <= opts.CONNECTION_MAX_DIST) {
            this.updateImpulsePosition(scaleFPS, 1);
            ctx.beginPath();
            ctx.strokeStyle = opts.IMPULSE_STROKE_STYLE;
            ctx.lineWidth = opts.IMPULSE_SIZE;
            ctx.moveTo( this.x, this.y );
            this.updateImpulsePosition(scaleFPS);
            ctx.lineTo( this.x, this.y );
            ctx.stroke();
            return true;
        }
        return false;
    }

    // Get up to two neighbors
    getNextNeighbors(origin, particle) {
        const neighbors = particle.neighbors.filter(neighbor => 
            getDist(particle.x, particle.y, neighbor.x, neighbor.y) < opts.CONNECTION_MAX_DIST &&
            neighbor !== origin && 
            !neighbor.active
        );

        return neighbors.length > 1 ? neighbors.slice(0, 2) : neighbors;
    }

    // Returns true if the `Impulse` is expired
    isExpired() {
        return this.distAutonomy <= 0 || this.target === false
    }

    // Move to next target
    move(impulses) {
        if (getDist(this.x, this.y, this.target.x, this.target.y) < 10) {
            const neighbors = this.getNextNeighbors(this.particle, this.target);

            switch (true) {
                // Dulplicate Impulse
                case neighbors.length === 2: {
                    const nextTarget = neighbors[1];
                    const duplicateImpulse = new ImpulseJS(this.target.x, this.target.y, this.target, nextTarget, this.distAutonomy);

                    nextTarget.activateTimer();
                    impulses.push(duplicateImpulse);
                }
                case neighbors.length > 0: {
                    const nextTarget = neighbors[0];

                    this.particle = this.target;
                    this.target = nextTarget;
                    nextTarget.activateTimer();
                    return true;
                }

            }
            return false;
        }
    }
}