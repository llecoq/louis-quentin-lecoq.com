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
    create_impulses(mouseX, mouseY) {
        this.particles.forEach(particle => {
            if (particle.canCreateImpulse(mouseX, mouseY, this.impulses.length)) {
                const impulse = particle.createImpulse(mouseX, mouseY);
                if (impulse) this.impulses.push(impulse);
            }
        });
    }

    get_impulses() {
        return this.impulses;
    }

    // // Draw impulses
    // render(scaleFPS, index) {
    //     this.impulses.forEach((impulse, index) => {
    //         if (impulse.isExpired() || impulse.move(this.impulses) === false) {
    //             this.impulses.splice(index, 1);
    //             return;
    //         }
    //         if (impulse.draw(this.ctx, scaleFPS) === false)
    //             this.impulses.splice(index, 1);
    //     });
    // }

}