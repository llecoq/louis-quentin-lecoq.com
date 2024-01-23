import { opts } from "../Particles.js";
import { getDist } from "../particlesJS/utilsJS.js";

// Needs to be changed manually if an element is added  
// or deleted from the Particle Struct on the Rust side
const particle = {
    RUST_PARTICLE_SIZE: 19,
    // Index of each element in the Particle structure
    X: 0,
    Y: 1,
    SPEED_X: 2,
    SPEED_Y: 3,
    SIZE: 4,
    COLOR_RED: 5,
    COLOR_GREEN: 6,
    COLOR_BLUE: 7,
    ACTIVE: 8,
    NEIGHBOR_1: 9,
    NEIGHBOR_2: 10,
    NEIGHBOR_3: 11,
    NEIGHBOR_4: 12,
    NEIGHBOR_5: 13,
    NEIGHBOR_6: 14,
    NEIGHBOR_7: 15,
    NEIGHBOR_8: 16,
    NEIGHBOR_9: 17,
    NEIGHBOR_10: 18,
}

export class WasmBufferInterpreter {

    wasmMemory
    wasmParticlesBuffer
    wasmMousePositionBuffer

    constructor(wasmMemory) {
        this.wasmMemory = wasmMemory;
    }

    setWasmParticlesBuffer(particlesPtr) {
        this.wasmParticlesBuffer = new Float32Array(
            this.wasmMemory.buffer, 
            particlesPtr, 
            opts.NUMBER_OF_PARTICLES * particle.RUST_PARTICLE_SIZE
        );
    }

    setWasmMousePositionBuffer(mousePositionPtr) {
        this.wasmMousePositionBuffer = new Uint32Array(
            this.wasmMemory.buffer,
            mousePositionPtr,
            3
        );
    }

    // Returns the Particle data of a given index from the wasmParticlesBuffer
    getParticleData(index) {
        const baseIndex = index * particle.RUST_PARTICLE_SIZE;
        const colorRed = this.wasmParticlesBuffer[baseIndex + particle.COLOR_RED];
        const colorGreen = this.wasmParticlesBuffer[baseIndex + particle.COLOR_GREEN];
        const colorBlue = this.wasmParticlesBuffer[baseIndex + particle.COLOR_BLUE];

        return {
            x: this.wasmParticlesBuffer[baseIndex + particle.X],
            y: this.wasmParticlesBuffer[baseIndex + particle.Y],
            speedX: this.wasmParticlesBuffer[baseIndex + particle.SPEED_X],
            speedY: this.wasmParticlesBuffer[baseIndex + particle.SPEED_Y],
            size: this.wasmParticlesBuffer[baseIndex + particle.SIZE],
            color: `rgb(${colorRed}, ${colorGreen}, ${colorBlue})`,
            active: this.wasmParticlesBuffer[baseIndex + particle.ACTIVE],
            neighbor_1: this.wasmParticlesBuffer[baseIndex + particle.NEIGHBOR_1],
            neighbor_2: this.wasmParticlesBuffer[baseIndex + particle.NEIGHBOR_2],
            neighbor_3: this.wasmParticlesBuffer[baseIndex + particle.NEIGHBOR_3],
            neighbor_4: this.wasmParticlesBuffer[baseIndex + particle.NEIGHBOR_4],
            neighbor_5: this.wasmParticlesBuffer[baseIndex + particle.NEIGHBOR_5],
            neighbor_6: this.wasmParticlesBuffer[baseIndex + particle.NEIGHBOR_6],
            neighbor_7: this.wasmParticlesBuffer[baseIndex + particle.NEIGHBOR_7],
            neighbor_8: this.wasmParticlesBuffer[baseIndex + particle.NEIGHBOR_8],
            neighbor_9: this.wasmParticlesBuffer[baseIndex + particle.NEIGHBOR_9],
            neighbor_10: this.wasmParticlesBuffer[baseIndex + particle.NEIGHBOR_10],
        };
    }

    // Returns the WASM shared buffer of particles
    getParticles() {
        return this.wasmParticlesBuffer;
    }

    // Render the each `Particle` of the `wasmParticlesBuffer`
    renderParticles(ctx) {
        let xIndex = particle.X;
        let yIndex = particle.Y;
        let activeIndex = particle.ACTIVE;
        let colorRedIndex = particle.COLOR_RED;
        let colorGreenIndex = particle.COLOR_GREEN;
        let colorBlueIndex = particle.COLOR_BLUE;
        let sizeIndex = particle.SIZE;
        
        for (let i = 0; i < opts.NUMBER_OF_PARTICLES; i++) {
            // Find particle's data in the wasmParticlesBuffer
            let x = this.wasmParticlesBuffer[xIndex];
            let y = this.wasmParticlesBuffer[yIndex];
            let active = this.wasmParticlesBuffer[activeIndex];
            let colorRed = this.wasmParticlesBuffer[colorRedIndex];
            let colorGreen = this.wasmParticlesBuffer[colorGreenIndex];
            let colorBlue = this.wasmParticlesBuffer[colorBlueIndex];
            let size = this.wasmParticlesBuffer[sizeIndex];
            let color = `rgb(${colorRed}, ${colorGreen}, ${colorBlue})`;
        
            // Render particle
            ctx.beginPath();
            ctx.fillStyle = active ? opts.PARTICLE_ACTIVE_COLOR : color;
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        
            // Increment indexes
            xIndex += particle.RUST_PARTICLE_SIZE;
            yIndex += particle.RUST_PARTICLE_SIZE;
            activeIndex += particle.RUST_PARTICLE_SIZE;
            colorRedIndex += particle.RUST_PARTICLE_SIZE;
            colorGreenIndex += particle.RUST_PARTICLE_SIZE;
            colorBlueIndex += particle.RUST_PARTICLE_SIZE;
            sizeIndex += particle.RUST_PARTICLE_SIZE;
        }     
    }

    // Render the connections of the `wasmParticlesBuffer`
    renderConnections(ctx) {
        // For each `Particle`
        for (let i = 0; i < opts.NUMBER_OF_PARTICLES; i++) {
            let baseIndex = i * particle.RUST_PARTICLE_SIZE;
            let x = this.wasmParticlesBuffer[baseIndex + particle.X];
            let y = this.wasmParticlesBuffer[baseIndex + particle.Y];
            let active = this.wasmParticlesBuffer[baseIndex + particle.ACTIVE];

            // For each neighbor
            for (let j = 0; j < 10; j++) {
                let neighborIndex = this.wasmParticlesBuffer[baseIndex + particle.NEIGHBOR_1 + j] * particle.RUST_PARTICLE_SIZE;
                let neighborX = this.wasmParticlesBuffer[neighborIndex + particle.X];
                let neighborY = this.wasmParticlesBuffer[neighborIndex + particle.Y];
                let neighborActive = this.wasmParticlesBuffer[neighborIndex + particle.ACTIVE];
                let distance = getDist(x, y, neighborX, neighborY);
    
                // Render connections
                if (distance < opts.CONNECTION_MAX_DIST) {
                    const globalAlpha = active && neighborActive ? opts.ACTIVE_CONNECTIONS_GLOBAL_ALPHA : opts.CONNECTIONS_GLOBAL_ALPHA;
                    ctx.globalAlpha = globalAlpha - distance / opts.CONNECTION_MAX_DIST;
    
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(neighborX, neighborY);
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1.0; // Reset globalAlpha
    }

    setParticlesDataFromJS(particles) {
        let xIndex = particle.X;
        let yIndex = particle.Y;
        let activeIndex = particle.ACTIVE;
        let sizeIndex = particle.SIZE;
        
        for (let i = 0; i < opts.NUMBER_OF_PARTICLES; i++) {
            // Find particle's data in the wasmParticlesBuffer
            this.wasmParticlesBuffer[xIndex] = particles[i].x;
            this.wasmParticlesBuffer[yIndex] = particles[i].y;
            this.wasmParticlesBuffer[activeIndex] = particles[i].active;
            this.wasmParticlesBuffer[sizeIndex] = particles[i].size;
        
            // Increment indexes
            xIndex += particle.RUST_PARTICLE_SIZE;
            yIndex += particle.RUST_PARTICLE_SIZE;
            activeIndex += particle.RUST_PARTICLE_SIZE;
            sizeIndex += particle.RUST_PARTICLE_SIZE;
        }        
    }

    setMousePosition(mouseX, mouseY) {
        this.wasmMousePositionBuffer[0] = mouseX;
        this.wasmMousePositionBuffer[1] = mouseY;
    }
}