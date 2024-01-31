export default class ImpulsesManagerJS {

    ctx
    impulses
    particles
    mouseX
    mouseY

    constructor(ctx, particles) {
        this.ctx = ctx;
        this.impulses = [];
        this.particles = particles;
    }

    // Create impulses
    create_impulses() {
        this.particles.forEach(particle => {
            if (particle.canCreateImpulse(this.mouseX, this.mouseY, this.impulses.length)) {
                const impulse = particle.createImpulse(this.mouseX, this.mouseY);
                if (impulse) this.impulses.push(impulse);
            }
        });
    }

    getImpulses() {
        return this.impulses;
    }

    setMousePosition(mouseX, mouseY) {
        this.mouseX = mouseX;
        this.mouseY = mouseY;
    }

    // setImpulsesDataFromWASM(wasmBufferInterpreter) {
    //     this.impulses.forEach((impulse, index) => {
    //         impulse.setParticleData(wasmBufferInterpreter.getImpulseData(index));
    //     })
    // }
}