import ParticleJS from "./ParticleJS.js";
import { opts } from "../Particles.js";
import { getDist } from "./utilsJS.js";

export default class ParticlesManagerJS {
    
    ctx
    particles
    
    constructor(ctx, numberOfParticles, canvas) {
        this.ctx = ctx;
        this.particles = [];
        
        // Initialize particles
        for (let i = 0; i < numberOfParticles; i++) {
            this.particles.push(new ParticleJS(canvas))
        }
    }

    // Update position of each Particle
    update(scaleFPS) {
        this.particles.forEach(particle => particle.updatePosition(scaleFPS))
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
        this.particles.forEach(particle => {
            const sorted = [...this.particles].sort((a, b) => getDist(particle.x, particle.y, a.x, a.y) - getDist(particle.x, particle.y, b.x, b.y));
            particle.setNeighbors(sorted.slice(0, opts.PARTICLE_MAX_CONNECTIONS));
        });
    }

    // Get Particles
    getParticles() {
        return this.particles;
    }
}