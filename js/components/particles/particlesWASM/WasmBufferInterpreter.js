import { opts } from "../Particles.js";
import { getDist } from "../particlesJS/utilsJS.js";

// indices and size of the `Particle` struct from Rust
// Needs to be changed manually if an element is added  
// or deleted from the Particle Struct on the Rust side
const particle = {
    RUST_PARTICLE_SIZE: 20,

    // Index of each element in the Particle structure
    X: 0,
    Y: 1,
    SPEED_X: 2,
    SPEED_Y: 3,
    SIZE: 4,
    ACTIVE_SIZE: 5,
    COLOR_RED: 6,
    COLOR_GREEN: 7,
    COLOR_BLUE: 8,
    ACTIVE: 9,
    NEIGHBOR_1: 10,
    NEIGHBOR_2: 11,
    NEIGHBOR_3: 12,
    NEIGHBOR_4: 13,
    NEIGHBOR_5: 14,
    NEIGHBOR_6: 15,
    NEIGHBOR_7: 16,
    NEIGHBOR_8: 17,
    NEIGHBOR_9: 18,
    NEIGHBOR_10: 19,
}

// indices and size of the `MousePosition` struct from Rust
const mouseTracker = {
    RUST_MOUSE_TRACKER_SIZE: 3,

    // Index of each element in the MouseTracket structure
    POS_X: 0,
    POS_Y: 1,
    MOUSE_IS_OVER_CANVAS: 2,
}

// indices and size of the `Impulse` struct from Rust
const impulse = {
    RUST_IMPULSE_SIZE: 8,

    // Index of each element in the `Impulse` structure
    X: 0,
    Y: 1,
    PARTICLE_INDEX: 2,
    TARGET_INDEX: 3,
    TARGET_X: 4,
    TARGET_Y: 5,
    SPEED: 6,
    DIST_AUTONOMY: 7
}

const connection = {
    RUST_CONNECTION_SIZE: 7,

    PARTICLE_INDEX: 0,
    NEIGHBOR_INDEX: 1,
    GLOBAL_ALPHA: 2,
    X: 3,
    Y: 4,
    NEIGHBOR_X: 5,
    NEIGHBOR_Y: 6
}

export class WasmBufferInterpreter {

    wasmMemory
    wasmParticlesBuffer
    wasmMousePositionBuffer
    wasmImpulsesBuffer
    wasmConnectionsBuffer
    numberOfParticles

    constructor(wasmMemory) {
        this.wasmMemory = wasmMemory;
        this.numberOfParticles = opts.NUMBER_OF_PARTICLES;
    }

    setWasmParticlesBuffer(particlesPtr) {
        this.wasmParticlesBuffer = new Float32Array(
            this.wasmMemory.buffer, 
            particlesPtr, 
            opts.MAX_NUMBER_OF_PARTICLES * particle.RUST_PARTICLE_SIZE
        );
    }

    setWasmMousePositionBuffer(mousePositionPtr) {
        this.wasmMousePositionBuffer = new Uint32Array(
            this.wasmMemory.buffer,
            mousePositionPtr,
            mouseTracker.RUST_MOUSE_TRACKER_SIZE
        );
    }

    setWasmConnectionsBuffer(connectionsPtr) {
        this.wasmConnectionsBuffer = new Float32Array(
            this.wasmMemory.buffer,
            connectionsPtr,
            connection.RUST_CONNECTION_SIZE * 10000
        )
    }

    setWasmImpulsesBuffer(impulsesPtr) {
        this.wasmImpulsesBuffer = new Float32Array(
            this.wasmMemory.buffer,
            impulsesPtr,
            opts.MAX_IMPULSES * impulse.RUST_IMPULSE_SIZE
        );
    }

    getWasmParticlesBuffer() {
        return this.wasmParticlesBuffer;
    }

    setNeighborFromPosition(particleIndex, neighborIndex, position) {
        const baseIndex = particleIndex * particle.RUST_PARTICLE_SIZE;
        const neighborPosition = position + particle.NEIGHBOR_1;

        this.wasmParticlesBuffer[baseIndex + neighborPosition] = neighborIndex;
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
            activeSize: this.wasmParticlesBuffer[baseIndex + particle.ACTIVE_SIZE],
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

    getParticleXandY(index) {
        const baseIndex = index * particle.RUST_PARTICLE_SIZE;

        return {
            x: this.wasmParticlesBuffer[baseIndex + particle.X],
            y: this.wasmParticlesBuffer[baseIndex + particle.Y],            
        }
    }

    // Returns the Impulse data of a given index from the wasmImpulsesBuffer
    getImpulseData(index) {
        const baseIndex = index * impulse.RUST_IMPULSE_SIZE;

        return {
            x: this.wasmImpulsesBuffer[baseIndex + impulse.X],
            y: this.wasmImpulsesBuffer[baseIndex + impulse.Y],
            particleIndex: this.wasmImpulsesBuffer[baseIndex + impulse.PARTICLE_INDEX],
            targetIndex: this.wasmImpulsesBuffer[baseIndex + impulse.TARGET_INDEX],
            speed: this.wasmImpulsesBuffer[baseIndex + impulse.SPEED],
            distAutonomy: this.wasmImpulsesBuffer[baseIndex + impulse.DIST_AUTONOMY],
        }
    }

    // Render the each `Particle` of the `wasmParticlesBuffer`
    renderParticles(ctx) {
        let baseIndex = 0;
        
        for (let i = 0; i < this.numberOfParticles; i++) {
            let x = this.wasmParticlesBuffer[baseIndex + particle.X];
            let y = this.wasmParticlesBuffer[baseIndex + particle.Y];
            let active = this.wasmParticlesBuffer[baseIndex + particle.ACTIVE];
            let color = `rgb(${this.wasmParticlesBuffer[baseIndex + particle.COLOR_RED]}, ${this.wasmParticlesBuffer[baseIndex + particle.COLOR_GREEN]}, ${this.wasmParticlesBuffer[baseIndex + particle.COLOR_BLUE]})`;
            let size = active ? this.wasmParticlesBuffer[baseIndex + particle.ACTIVE_SIZE] : this.wasmParticlesBuffer[baseIndex + particle.SIZE];
    
            ctx.beginPath();
            ctx.fillStyle = active ? opts.PARTICLE_ACTIVE_COLOR : color;
            ctx.arc(x, y, size, 0, opts.ARC_RAD);
            ctx.fill();
    
            if (active === 2.0) {
                this.updateActiveStateDelayed(baseIndex + particle.ACTIVE);
            }
    
            baseIndex += particle.RUST_PARTICLE_SIZE;
        }
    }
    
    updateActiveStateDelayed(activeIndex) {
        this.wasmParticlesBuffer[activeIndex] = 1.0;
        setTimeout(() => {
            this.wasmParticlesBuffer[activeIndex] = 0.0;
        }, opts.PARTICLE_ACTIVE_DELAY);
    }

    renderConnections(ctx, connections_len) {
        let baseIndex = 0;
        for (let i = 0; i < connections_len; i++) {
            ctx.beginPath();
            ctx.globalAlpha = this.wasmConnectionsBuffer[baseIndex + connection.GLOBAL_ALPHA];
            ctx.moveTo(this.wasmConnectionsBuffer[baseIndex + connection.X], this.wasmConnectionsBuffer[baseIndex + connection.Y]);
            ctx.lineTo(this.wasmConnectionsBuffer[baseIndex + connection.NEIGHBOR_X], this.wasmConnectionsBuffer[baseIndex + connection.NEIGHBOR_Y]);
            ctx.stroke();
    
            baseIndex += connection.RUST_CONNECTION_SIZE;
        }

        ctx.globalAlpha = 1.0; // Reset globalAlpha
    }

    renderImpulses(ctx, scaleFPS, impulsesManager) {
        let numberOfActiveImpulses = impulsesManager.get_impulses_len();
        let updatedPositions = [];
    
        // For each active `Impulse`
        for (let i = 0; i < numberOfActiveImpulses; i++) {
            let baseIndex = i * impulse.RUST_IMPULSE_SIZE;
            let x = this.wasmImpulsesBuffer[baseIndex + impulse.X];
            let y = this.wasmImpulsesBuffer[baseIndex + impulse.Y];
               
            // Store updated positions in the array
            updatedPositions.push({ x, y });
        }
    
        // Update all impulses positions in one call
        impulsesManager.update_impulses_position(scaleFPS);
    
        // Draw lines using the updated positions
        for (let i = 0; i < numberOfActiveImpulses; i++) {
            ctx.moveTo(updatedPositions[i].x, updatedPositions[i].y);
            ctx.lineTo(this.wasmImpulsesBuffer[i * impulse.RUST_IMPULSE_SIZE + impulse.X], this.wasmImpulsesBuffer[i * impulse.RUST_IMPULSE_SIZE + impulse.Y]);
        }
    }

    setParticlesDataFromJS(particles) {
        let xIndex = particle.X;
        let yIndex = particle.Y;
        let activeIndex = particle.ACTIVE;
        
        for (let i = 0; i < this.numberOfParticles; i++) {
            let active = particles[i].active;
            let size = particles[i].size;

            if (active) {
                active = 0.0;
            }

            // Find particle's data in the wasmParticlesBuffer
            this.wasmParticlesBuffer[xIndex] = particles[i].x;
            this.wasmParticlesBuffer[yIndex] = particles[i].y;
            this.wasmParticlesBuffer[activeIndex] = active;
        
            // Increment indices
            xIndex += particle.RUST_PARTICLE_SIZE;
            yIndex += particle.RUST_PARTICLE_SIZE;
            activeIndex += particle.RUST_PARTICLE_SIZE;
        }        
    }

    setMousePosition(mouseX, mouseY) {
        this.wasmMousePositionBuffer[mouseTracker.POS_X] = mouseX;
        this.wasmMousePositionBuffer[mouseTracker.POS_Y] = mouseY;
    }

    setMouseIsOverCanvas(value) {
        this.wasmMousePositionBuffer[mouseTracker.MOUSE_IS_OVER_CANVAS] = value;
    }

    changeNumberOfParticles(newNumberOfParticles) {
        this.numberOfParticles = newNumberOfParticles;
    }
}