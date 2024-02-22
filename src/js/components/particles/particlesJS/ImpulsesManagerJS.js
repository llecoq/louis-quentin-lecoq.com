import { opts } from "../Particles.js"

export default class ImpulsesManagerJS {

    ctx
    impulses
    particles
    mouseX
    mouseY
    numberOfParticles
    connectionMaxDist

    constructor(ctx, particles) {
        this.ctx = ctx;
        this.impulses = [];
        this.particles = particles;
        this.numberOfParticles = opts.NUMBER_OF_PARTICLES;
        this.connectionMaxDist = opts.CONNECTION_MAX_DIST;
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

    setConnectionMaxDist(value) {
        this.connectionMaxDist = value;

        this.impulses.forEach(impulse => {
            impulse.setConnectionMaxDist(value);
        })
    }
}