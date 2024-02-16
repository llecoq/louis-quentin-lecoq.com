import { opts } from "../Particles.js";
import { getDist } from "./utilsJS.js";

export default class ImpulseJS {
    
    particle
    x
    y
    target
    speed
    distAutonomy
    connectionMaxDist

    // Constructor
    constructor(x, y, particle, neighbor, connectionMaxDist, distAutonomy = opts.IMPULSE_DIST_AUTONOMY) {
        this.x = x;
        this.y = y;
        this.particle = particle;
        this.target = neighbor;
        this.speed = Math.random() * opts.IMPULSE_SPEED + opts.IMPULSE_SPEED_OFFSET;
        this.distAutonomy = distAutonomy;
        this.connectionMaxDist = connectionMaxDist;
    }

    // Update impulse position
    updateImpulsePosition(scaleFPS, steps = 5) {
        for (let i = 0; i < steps; i++) {
            let dx = this.target.x - this.x;
            let dy = this.target.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
       
            dx /= distance;
            dy /= distance;

            this.x += dx * this.speed * scaleFPS;
            this.y += dy * this.speed * scaleFPS;
        }

        this.distAutonomy -= this.speed * steps * scaleFPS;
    }

    // Render impulse
    render(ctx, scaleFPS) {
        if (opts.SHOOTING_STARS === false 
            && getDist(this.x, this.y, this.target.x, this.target.y) > this.connectionMaxDist) 
            return false;
        ctx.moveTo( this.x, this.y );
        this.updateImpulsePosition(scaleFPS, opts.IMPULSE_UPDATE_STEPS);
        ctx.lineTo( this.x, this.y );
        return true;
    }

    // Get up to two neighbors
    getNextNeighbors(origin, particle) {
        const neighbors = particle.neighbors.filter(neighbor => 
            getDist(particle.x, particle.y, neighbor.x, neighbor.y) < this.connectionMaxDist &&
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
                // Duplicate Impulse
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

    setConnectionMaxDist(value) {
        this.connectionMaxDist = value;
    }
}