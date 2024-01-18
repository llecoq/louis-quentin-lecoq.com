import ParticleJS from "./ParticleJS.js";
import { opts } from "../Particles.js";
import { getDist } from "./utilsJS.js";

export default class ParticlesManagerJS {
    
    ctx
    particles
    
    constructor(ctx, numberOfParticles) {
        this.ctx = ctx;
        this.particles = [];
        
        // Initialize particles
        for (let i = 0; i < numberOfParticles; i++) {
            this.particles.push(new ParticleJS(canvas))
        }
    }

    // Set the data of each Particle from the wasm buffer
    setParticlesDataFromWASM(wasmBufferInterpreter) {
        this.particles.forEach((particle, index) => {
            particle.setParticleData(wasmBufferInterpreter.getParticleData(index));
        })
    }

    // Sort neighbors based on distance
    sortNeighbors() {
        return setInterval(() => {
            this.particles.forEach(particle => {
                const sorted = [...this.particles].sort((a, b) => getDist(particle.x, particle.y, a.x, a.y) - getDist(particle.x, particle.y, b.x, b.y));
                particle.setNeighbors(sorted.slice(0, opts.PARTICLE_MAX_CONNECTIONS));
            });
        }, 250);
    }   

    // Draw connections between neighbors
    drawConnections(mouseX, mouseY, mouseIsOverCanvas) {
        this.ctx.strokeStyle = opts.CONNECTIONS_STROKE_STYLE;
        this.ctx.lineWidth = opts.CONNECTIONS_LINE_WIDTH;

        this.particles.forEach(particle => {
            particle.drawConnections(this.ctx, mouseX, mouseY, mouseIsOverCanvas);
        });
    }

    // Get Particles
    getParticles() {
        return this.particles;
    }

    // Draw particles
    drawParticles(scaleFPS) {
        this.particles.forEach(particle => particle.draw(this.ctx, scaleFPS));
    }
}