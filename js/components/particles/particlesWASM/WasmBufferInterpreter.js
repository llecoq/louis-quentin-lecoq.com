import { opts } from "../Particles.js";

// Needs to be changed manually if an element is added or deleted from the Particle Struct on the Rust side
const RUST_PARTICLE_SIZE = 19;

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

}