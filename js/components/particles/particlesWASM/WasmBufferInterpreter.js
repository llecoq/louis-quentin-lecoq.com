import { opts } from "../Particles.js";

// Needs to be changed manually if an element is added or deleted from the Particle Struct on the Rust side
const RUST_PARTICLE_SIZE = 19;
// Index of each element in the Particle structure
const X = 1;
const Y = 2;
const SPEED_X = 3;
const SPEED_Y = 4;
const SIZE = 5;
const COLOR_RED = 6;
const COLOR_GREEN = 7;
const COLOR_BLUE = 8;
const ACTIVE = 9;
const NEIGHBOR_1 = 10;
const NEIGHBOR_2 = 11;
const NEIGHBOR_3 = 12;
const NEIGHBOR_4 = 13;
const NEIGHBOR_5 = 14;
const NEIGHBOR_6 = 15;
const NEIGHBOR_7 = 16;
const NEIGHBOR_8 = 17;
const NEIGHBOR_9 = 18;
const NEIGHBOR_10 = 19;

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

        return {
            x: this.wasmParticlesBuffer[baseIndex + X - 1],
            y: this.wasmParticlesBuffer[baseIndex + Y - 1],
            speedX: this.wasmParticlesBuffer[baseIndex + SPEED_X - 1],
            speedY: this.wasmParticlesBuffer[baseIndex + SPEED_Y - 1],
            size: this.wasmParticlesBuffer[baseIndex + SIZE - 1],
            colorRed: this.wasmParticlesBuffer[baseIndex + COLOR_RED - 1],
            colorGreen: this.wasmParticlesBuffer[baseIndex + COLOR_GREEN - 1],
            colorBlue: this.wasmParticlesBuffer[baseIndex + COLOR_BLUE - 1],
            active: this.wasmParticlesBuffer[baseIndex + ACTIVE - 1],
            neighbor_1: this.wasmParticlesBuffer[baseIndex + NEIGHBOR_1 - 1],
            neighbor_2: this.wasmParticlesBuffer[baseIndex + NEIGHBOR_2 - 1],
            neighbor_3: this.wasmParticlesBuffer[baseIndex + NEIGHBOR_3 - 1],
            neighbor_4: this.wasmParticlesBuffer[baseIndex + NEIGHBOR_4 - 1],
            neighbor_5: this.wasmParticlesBuffer[baseIndex + NEIGHBOR_5 - 1],
            neighbor_6: this.wasmParticlesBuffer[baseIndex + NEIGHBOR_6 - 1],
            neighbor_7: this.wasmParticlesBuffer[baseIndex + NEIGHBOR_7 - 1],
            neighbor_8: this.wasmParticlesBuffer[baseIndex + NEIGHBOR_8 - 1],
            neighbor_9: this.wasmParticlesBuffer[baseIndex + NEIGHBOR_9 - 1],
            neighbor_10: this.wasmParticlesBuffer[baseIndex + NEIGHBOR_10 - 1],
        };
    }

}