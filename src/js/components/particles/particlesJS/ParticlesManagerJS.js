import ParticleJS from "./ParticleJS.js";
import { getDist } from "./utilsJS.js";
import { opts } from "../opts.js";
import ConnectionsManager from "./ConnectionsManager.js";

export default class ParticlesManagerJS {
    
    ctx
    particles
    numberOfParticles
    connectionManager
    connectionMaxDist
    
    constructor(ctx, maxNumberOfParticles, canvas, numberOfParticles) {
        this.ctx = ctx;
        this.particles = [];
        this.numberOfParticles = numberOfParticles;
        this.connectionManager = new ConnectionsManager();
        this.connectionMaxDist = opts.CONNECTION_MAX_DIST;

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

            particle.setParticleData(data, index);
        })
    }

    setConnectionMaxDist(value) {
        this.connectionMaxDist = value;
        this.connectionManager.setConnectionMaxDist(value);
        this.particles.forEach(particle => {
            particle.setConnectionMaxDist(value);
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

    create_connections(mouseIsOverCanvas, mouseX, mouseY) {
        this.particles.slice(0, this.numberOfParticles).forEach(particle => {
            // Create connections between Particles
            const neighbors = particle.getNeighbors();

            neighbors.forEach(neighbor => {
                if (neighbor.index < this.numberOfParticles) {
                    const dist = getDist(particle.x, particle.y, neighbor.x, neighbor.y);
                    
                    if (dist < this.connectionMaxDist)
                        this.connectionManager.addConnection(particle, neighbor, dist);
                }
            })

            // Create connections between Particles and Mouse
            if (mouseIsOverCanvas) {
                const distToMouse = getDist(particle.x, particle.y, mouseX, mouseY)

                if (distToMouse < this.connectionMaxDist) {
                    const mouse = new ParticleJS();
                    mouse.setForMouse(mouseX, mouseY);
                    
                    this.connectionManager.addConnection(particle, mouse, distToMouse);
                }
            }
        })
    }

    // Get Particles
    getParticles() {
        return this.particles;
    }

    changeNumberOfParticles(value) {
        this.numberOfParticles = value;
    }

    getConnections() {
        return this.connectionManager.getConnections();
    }

    clearConnections() {
        this.connectionManager.clearConnections();
    }

    clear_neighbors() {
        this.particles.forEach(particle => {
            particle.clearNeighbors();
        })
    }
}