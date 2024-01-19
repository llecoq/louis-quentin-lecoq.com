import { opts } from "../Particles.js";

// Needs to be changed manually if an element is added  
// or deleted from the Particle Struct on the Rust side
const RUST_PARTICLE_SIZE = 19;
// Index of each element in the Particle structure
const X = 0;
const Y = 1;
const SPEED_X = 2;
const SPEED_Y = 3;
const SIZE = 4;
const COLOR_RED = 5;
const COLOR_GREEN = 6;
const COLOR_BLUE = 7;
const ACTIVE = 8;
const NEIGHBOR_1 = 9;
const NEIGHBOR_2 = 10;
const NEIGHBOR_3 = 11;
const NEIGHBOR_4 = 12;
const NEIGHBOR_5 = 13;
const NEIGHBOR_6 = 14;
const NEIGHBOR_7 = 15;
const NEIGHBOR_8 = 16;
const NEIGHBOR_9 = 17;
const NEIGHBOR_10 = 18;

export class WasmBufferInterpreter {

    wasmMemory
    wasmParticlesBuffer

    constructor(wasmMemory, particlesPtr) {
        this.wasmMemory = wasmMemory;
        this.particlesPtr = particlesPtr;
        this.wasmParticlesBuffer = new Float32Array(
            this.wasmMemory.buffer, 
            particlesPtr, 
            opts.NUMBER_OF_PARTICLES * RUST_PARTICLE_SIZE
        );
    }

    // Returns the Particle data of a given index from the wasmParticlesBuffer
    getParticleData(index) {
        const baseIndex = index * RUST_PARTICLE_SIZE;
        const colorRed = this.wasmParticlesBuffer[baseIndex + COLOR_RED];
        const colorGreen = this.wasmParticlesBuffer[baseIndex + COLOR_GREEN];
        const colorBlue = this.wasmParticlesBuffer[baseIndex + COLOR_BLUE];

        return {
            x: this.wasmParticlesBuffer[baseIndex + X],
            y: this.wasmParticlesBuffer[baseIndex + Y],
            speedX: this.wasmParticlesBuffer[baseIndex + SPEED_X],
            speedY: this.wasmParticlesBuffer[baseIndex + SPEED_Y],
            size: this.wasmParticlesBuffer[baseIndex + SIZE],
            color: `rgb(${colorRed}, ${colorGreen}, ${colorBlue})`,
            active: this.wasmParticlesBuffer[baseIndex + ACTIVE],
            neighbor_1: this.wasmParticlesBuffer[baseIndex + NEIGHBOR_1],
            neighbor_2: this.wasmParticlesBuffer[baseIndex + NEIGHBOR_2],
            neighbor_3: this.wasmParticlesBuffer[baseIndex + NEIGHBOR_3],
            neighbor_4: this.wasmParticlesBuffer[baseIndex + NEIGHBOR_4],
            neighbor_5: this.wasmParticlesBuffer[baseIndex + NEIGHBOR_5],
            neighbor_6: this.wasmParticlesBuffer[baseIndex + NEIGHBOR_6],
            neighbor_7: this.wasmParticlesBuffer[baseIndex + NEIGHBOR_7],
            neighbor_8: this.wasmParticlesBuffer[baseIndex + NEIGHBOR_8],
            neighbor_9: this.wasmParticlesBuffer[baseIndex + NEIGHBOR_9],
            neighbor_10: this.wasmParticlesBuffer[baseIndex + NEIGHBOR_10],
        };
    }

    // Returns the WASM shared buffer of particles
    getParticles() {
        return this.wasmParticlesBuffer;
    }

    // Render the WASM shared buffer of particles
    renderParticles(ctx) {
        let xIndex = X;
        let yIndex = Y;
        let activeIndex = ACTIVE;
        let colorRedIndex = COLOR_RED;
        let colorGreenIndex = COLOR_GREEN;
        let colorBlueIndex = COLOR_BLUE;
        let sizeIndex = SIZE;
        
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
            xIndex += RUST_PARTICLE_SIZE;
            yIndex += RUST_PARTICLE_SIZE;
            activeIndex += RUST_PARTICLE_SIZE;
            colorRedIndex += RUST_PARTICLE_SIZE;
            colorGreenIndex += RUST_PARTICLE_SIZE;
            colorBlueIndex += RUST_PARTICLE_SIZE;
            sizeIndex += RUST_PARTICLE_SIZE;
        }     
    }

    setWasmParticlesBufferFromJS(particles) {
        let xIndex = X;
        let yIndex = Y;
        let activeIndex = ACTIVE;
        let sizeIndex = SIZE;
        
        for (let i = 0; i < opts.NUMBER_OF_PARTICLES; i++) {
            // Find particle's data in the wasmParticlesBuffer
            this.wasmParticlesBuffer[xIndex] = particles[i].x;
            this.wasmParticlesBuffer[yIndex] = particles[i].y;
            this.wasmParticlesBuffer[activeIndex] = particles[i].active;
            this.wasmParticlesBuffer[sizeIndex] = particles[i].size;
        
            // Increment indexes
            xIndex += RUST_PARTICLE_SIZE;
            yIndex += RUST_PARTICLE_SIZE;
            activeIndex += RUST_PARTICLE_SIZE;
            sizeIndex += RUST_PARTICLE_SIZE;
        }        
    }

}