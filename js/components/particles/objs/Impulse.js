import { opts } from "../particles.js";

export default class Impulse {
    
    particle;
    x;
    y;
    target;
    speed;
    distAutonomy;

    constructor(x, y, particle, neighbor) {
        this.x = x;
        this.y = y;
        this.particle = particle;
        this.target = neighbor;
        this.speed = Math.random() * opts.IMPULSE_SPEED + opts.IMPULSE_SPEED_OFFSET;
        this.distAutonomy = opts.IMPULSE_DIST_AUTONOMY;
    }

    // Update impulse position
    updateImpulsePosition() {
        let dx = this.target.x - this.x;
        let dy = this.target.y - this.y;
        let length = Math.sqrt(dx * dx + dy * dy);
        dx /= length;
        dy /= length;

        this.x += dx * this.speed;
        this.y += dy * this.speed;
        this.distAutonomy -= 10;
    }

    // Draw impulse
    draw(ctx) {
        this.updateImpulsePosition();
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(72, 217, 247)';
        ctx.lineWidth = opts.IMPULSE_SIZE;
        ctx.moveTo( this.x, this.y );
        this.updateImpulsePosition();
        this.updateImpulsePosition();
        this.updateImpulsePosition();
        this.updateImpulsePosition();
        this.updateImpulsePosition();
        this.updateImpulsePosition();
        this.updateImpulsePosition();
        this.updateImpulsePosition();
        ctx.lineTo( this.x, this.y );
        ctx.stroke();
    }
}