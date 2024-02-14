import ParticleJS from "./ParticleJS.js";
import { getDist } from "./utilsJS.js";
import { opts } from "../Particles.js";

export default class ParticlesManagerJS {
    
    ctx
    particles
    numberOfParticles
    
    constructor(ctx, maxNumberOfParticles, canvas) {
        this.ctx = ctx;
        this.particles = [];
        this.numberOfParticles = opts.NUMBER_OF_PARTICLES;

        // Initialize particles
        for (let i = 0; i < maxNumberOfParticles; i++) {
            this.particles.push(new ParticleJS(canvas))
        }
    }

    // Update position of each Particle
    update(scaleFPS) {
        this.particles.forEach((particle, index) => {
            if (index < this.numberOfParticles) {
                particle.updatePosition(scaleFPS);
            }
        });
    }

    // Set the data of each Particle from the wasm buffer
    setParticlesDataFromWASM(wasmBufferInterpreter) {
        this.particles.forEach((particle, index) => {
            let data = wasmBufferInterpreter.getParticleData(index);
            
            if (data.active === 1.0 || data.active === 2.0) {
                data.active = 0;
            }

            particle.setParticleData(data);
        })
    }

    // Sort neighbors based on distance
    sort_neighbors() {
        this.particles.slice(0, this.numberOfParticles).forEach(particle => {
            const sorted = [...this.particles.slice(0, this.numberOfParticles)]
                .sort((a, b) => getDist(particle.x, particle.y, a.x, a.y) - getDist(particle.x, particle.y, b.x, b.y));
            particle.setNeighbors(sorted.slice(0, 10));
        });
    }

    // Get Particles
    getParticles() {
        return this.particles;
    }

    changeNumberOfParticles(value) {
        this.numberOfParticles = value;
    }
}