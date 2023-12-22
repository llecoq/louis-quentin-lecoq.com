export default class Data {
    x
    y
    targetParticle
    speed

    constructor(x, y, targetParticle) {
        this.x = x;
        this.y = y;
        this.targetParticle = targetParticle;
        this.speed = 0.05; // Speed of the data point
    }

    // Update the position of the data point
    update() {
        // Calculate the distance to the target particle
        const dx = this.targetParticle.x - this.x;
        const dy = this.targetParticle.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If the data point is close to the target, choose a new target particle
        if (distance < this.speed) {
            if (this.targetParticle.neighbors && this.targetParticle.neighbors.length > 0) {
                // Choose a random neighbor as the new target
                const randomIndex = Math.floor(Math.random() * this.targetParticle.neighbors.length);
                this.targetParticle = this.targetParticle.neighbors[randomIndex];
            }
        } else {
            // Move towards the target particle
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }

    // Draw the data point on the canvas
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2); // Draw a circle
        ctx.fillStyle = 'rgba(255, 0, 0, 0.7)'; // Red color
        ctx.fill();
    }
}
