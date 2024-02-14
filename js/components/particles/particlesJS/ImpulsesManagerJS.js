import { opts } from "../Particles.js"

export default class ImpulsesManagerJS {

    ctx
    impulses
    particles
    mouseX
    mouseY
    numberOfParticles

    constructor(ctx, particles) {
        this.ctx = ctx;
        this.impulses = [];
        this.particles = particles;
        this.numberOfParticles = opts.NUMBER_OF_PARTICLES;
    }

    // Create impulses
    create_impulses() {
        this.particles.slice(0, this.numberOfParticles).forEach(particle => {
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

    changeNumberOfParticles(value) {
        this.numberOfParticles = value;
    }

    // setImpulsesDataFromWASM(wasmBufferInterpreter) {
    //     this.impulses.forEach((impulse, index) => {
    //         impulse.setParticleData(wasmBufferInterpreter.getImpulseData(index));
    //     })
    // }
}