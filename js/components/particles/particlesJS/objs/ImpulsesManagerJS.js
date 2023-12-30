export default class ImpulseManagerJS {

    ctx
    impulses
    particles

    constructor(ctx, particles) {
        this.ctx = ctx;
        this.impulses = [];
        this.particles = particles;
    }

     // Create impulses
    createImpulses(mouseX, mouseY) {
        this.particles.forEach(particle => {
            if (particle.canCreateImpulse(mouseX, mouseY, this.impulses.length)) {
                const impulse = particle.createImpulse(mouseX, mouseY);
                if (impulse) this.impulses.push(impulse);
            }
        });
    }

    // Draw impulses
    drawImpulses(scaleFPS) {
        this.ctx.globalAlpha = 1.0;

        this.impulses.forEach((impulse, index) => {
            if (impulse.isExpired() || impulse.move(this.impulses) === false) {
                this.impulses.splice(index, 1);
                return;
            }
            if (impulse.draw(this.ctx, scaleFPS) === false)
                this.impulses.splice(index, 1);
        });
    }

}