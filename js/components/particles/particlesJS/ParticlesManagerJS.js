import ParticleJS from "./ParticleJS.js";
import { opts } from "../Particles.js";
import { getDist } from "./utilsJS.js";

const sharedBuffer = {
    INDEX: 0,
    X: 1,
    Y: 2
}

class WorkerData {
    
    worker
    startIndex
    endIndex
    buffer
    busy = false

    constructor(worker, startIndex, endIndex) {
        this.worker = worker;
        this.startIndex = startIndex;
        this.endIndex = endIndex;

        const float32Size = 4; // 4 bytes 
        const dataSize = 10; // 10 neighbors per Particles
        const bufferSize = (endIndex - startIndex) * float32Size * dataSize;
        this.buffer = new ArrayBuffer(bufferSize);
        this.sortedNeighborsArray = new Float32Array(this.buffer);
    }

    setBusy(value) {this.busy = value}
}

export default class ParticlesManagerJS {
    
    ctx
    particles
    workers
    sharedParticlesData
    numberOfWorkers
    
    constructor(ctx, numberOfParticles, canvas) {
        this.ctx = ctx;
        this.particles = [];
        this.workers = [];
        this.numberOfWorkers = opts.WEB_WORKERS;
        
        // Initialize particles
        for (let i = 0; i < numberOfParticles; i++) {
            this.particles.push(new ParticleJS(canvas))
        }

        // Creation of a given number of workers for sort_neighbors() JS
        if (opts.WEB_WORKERS) {
            this.initSharedParticlesData();
            this.initWorkers();
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
                data.size /= opts.PARTICLE_ACTIVE_SIZE_SCALE;
            }

            particle.setParticleData(data);
        })

        if (opts.WEB_WORKERS) {
            this.updateSharedParticlesData();
        }
    }

    // Sort neighbors based on distance
    sort_neighbors() {
        if (opts.WEB_WORKERS) {
            this.updateSharedParticlesData();
            
            // Send transferable buffer to each worker
            this.workers.forEach((elem, index) => {
                if (elem.busy === false) {
                    const float32Array = this.workers[index].sortedNeighborsArray;
                    let buffer = float32Array.buffer;
                    
                    elem.worker.postMessage({
                        type: 'sortNeighbors',
                        buffer: buffer,
                    }, [buffer]);
                    
                    // Set worker as "busy"
                    elem.setBusy(true);
                }
            })
        } else {
            this.particles.forEach(particle => {
                const sorted = [...this.particles].sort((a, b) => getDist(particle.x, particle.y, a.x, a.y) - getDist(particle.x, particle.y, b.x, b.y));
                particle.setNeighbors(sorted.slice(0, opts.PARTICLE_MAX_CONNECTIONS));
            });
        }
    }

    // Get Particles
    getParticles() {
        return this.particles;
    }

    // Init workers 
    initWorkers() {
        const workerBatchSize = Math.floor(opts.NUMBER_OF_PARTICLES / this.numberOfWorkers);

        for (let i = 0; i < this.numberOfWorkers; i++) {
            const startIndex = i * workerBatchSize;
            const endIndex = i === this.numberOfWorkers - 1 
                ? opts.NUMBER_OF_PARTICLES 
                : startIndex + workerBatchSize;

            const worker = new Worker('/js/components/particles/particlesJS/setNeighborsWorker.js');
            worker.postMessage({
                type: 'initWorker',
                workerIndex: i,
                numberOfParticles: opts.NUMBER_OF_PARTICLES,
                startIndex: startIndex,
                endIndex: endIndex,
                buffer: this.sharedParticlesData
            });

            worker.onmessage = this.setNeighborsFromWorker.bind(this);

            this.workers.push(new WorkerData(worker, startIndex, endIndex));
        }
    }

    initSharedParticlesData() {
        const particleDataLength = 3; // x, y, and particleIndex
        const float32Size = 4; // 4 bytes
        const bufferSize = opts.NUMBER_OF_PARTICLES * particleDataLength * float32Size;
        const sharedBuffer = new SharedArrayBuffer(bufferSize);
        this.sharedParticlesData = new Float32Array(sharedBuffer);
    }

    updateSharedParticlesData() {
        const particleDataLength = 3;

        for (let i = 0; i < opts.NUMBER_OF_PARTICLES; i++) {
            const particle = this.particles[i];

            this.sharedParticlesData[i * particleDataLength + sharedBuffer.INDEX] = i;
            this.sharedParticlesData[i * particleDataLength + sharedBuffer.X] = particle.x;
            this.sharedParticlesData[i * particleDataLength + sharedBuffer.Y] = particle.y;
        }
    }

    setNeighborsFromWorker(event) {
        const workerIndex = event.data.workerIndex;
        const worker = this.workers[workerIndex];

        worker.buffer = event.data.buffer;
        worker.sortedNeighborsArray = new Float32Array(worker.buffer);
   
        // For each Particle from startIndex to endIndex
        for (let i = worker.startIndex; i < worker.endIndex; i++) {
            const particle = this.particles[i];
            
            // For each neighbors, set Particle's neighbor from its position
            for (let position = 0; position < 10; position++) {
                const neighborIndex = worker.sortedNeighborsArray[(i - worker.startIndex) * 10 + position];
                const neighbor = this.particles[neighborIndex];

                particle.setNeighborFromPosition(neighbor, position);
            }
        }
        worker.setBusy(false);
    }
}