import { opts } from "./Particles.js"

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

        const uint16Size = 2; // 2 bytes 
        const dataSize = 10; // 10 neighbors per Particles
        const bufferSize = (endIndex - startIndex) * uint16Size * dataSize;
        this.buffer = new ArrayBuffer(bufferSize);
        this.sortedNeighborsArray = new Uint16Array(this.buffer);
    }

    setBusy(value) {this.busy = value}
}

export default class WorkersManager {

    animationMode
    workers = []
    particlesManagerJS
    wasmBufferInterpreter
    sharedParticlesData
    numberOfWorkers

    constructor(particlesManagerJS, wasmBufferInterpreter) {
        this.animationMode = "WASM";
        this.particlesManagerJS = particlesManagerJS;
        this.wasmBufferInterpreter = wasmBufferInterpreter;
        this.numberOfWorkers = opts.WEB_WORKERS;

        if (opts.WEB_WORKERS) {
            this.initSharedParticlesData();
            this.setupWorkersManager();
        }
    }
        
    sortNeighbors() {
        if (opts.WEB_WORKERS) {
            this.updateSharedParticlesData();
            
            // Send transferable buffer to each worker
            this.workers.forEach((workerData, index) => {
                if (workerData.busy === false) {
                    const uint16Array = this.workers[index].sortedNeighborsArray;
                    let buffer = uint16Array.buffer;
                    
                    workerData.worker.postMessage({
                        type: 'sortNeighbors',
                        buffer: buffer,
                    }, [buffer]);
                    
                    // Set worker as "busy"
                    workerData.setBusy(true);
                }
            })
        }
    }

    changeAnimationMode() {
        this.terminateWorkers();

        if (this.animationMode === "JS")
            this.animationMode = "WASM"
        else
            this.animationMode = "JS"

        this.setupWorkersManager();
    }

    setupWorkersManager() {
        if (opts.WEB_WORKERS) {
            this.initWorkers();
            this.updateSharedParticlesData();
        }
    }

    // Init workers 
    initWorkers() {
        const workerBatchSize = Math.floor(opts.NUMBER_OF_PARTICLES / this.numberOfWorkers);
        const workerPath = this.getWorkerPath();

        for (let i = 0; i < this.numberOfWorkers; i++) {
            const startIndex = i * workerBatchSize;
            const endIndex = i === this.numberOfWorkers - 1 
                ? opts.NUMBER_OF_PARTICLES 
                : startIndex + workerBatchSize;

            const worker = new Worker(workerPath, {
                type: 'module'
            });
            
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

    getWorkerPath() {
        switch (this.animationMode) {
            case "JS":
                return '/js/components/particles/particlesJS/SortNeighborsWorkerJS.js';
            case "WASM":
                return '/js/components/particles/particlesWASM/SortNeighborsWorkerWASM.js';
        }
    }

    terminateWorkers() {
        if (opts.WEB_WORKERS) {
            this.workers.forEach(workerData => {
                workerData.worker.terminate();
            })
            this.workers = [];
        }
    }

    initSharedParticlesData() {
        const particleDataLength = 3; // x, y, and particleIndex
        const float32Size = 4; // 4 bytes
        const bufferSize = opts.NUMBER_OF_PARTICLES * particleDataLength * float32Size;
        const sharedBuffer = new SharedArrayBuffer(bufferSize);
        this.sharedParticlesData = new Float32Array(sharedBuffer);
    }

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    updateSharedParticlesData() {
        const particleDataLength = 3;
        const particles = this.particlesManagerJS.getParticles();

        for (let i = 0; i < opts.NUMBER_OF_PARTICLES; i++) {
            const particle = this.animationMode === "JS"
                ? particles[i]
                : this.wasmBufferInterpreter.getParticleXandY(i);

            this.sharedParticlesData[i * particleDataLength + sharedBuffer.INDEX] = i;
            this.sharedParticlesData[i * particleDataLength + sharedBuffer.X] = particle.x;
            this.sharedParticlesData[i * particleDataLength + sharedBuffer.Y] = particle.y;
        }
    }

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    setNeighborsFromWorker(event) {
        const workerIndex = event.data.workerIndex;
        const worker = this.workers[workerIndex];

        worker.buffer = event.data.buffer;
        worker.sortedNeighborsArray = new Uint16Array(worker.buffer);
   
        // For each Particle from startIndex to endIndex
        for (let i = worker.startIndex; i < worker.endIndex; i++) {
            switch (this.animationMode) {
                case "JS":
                    this.setNeighborsFromWorkerInJS(i, worker);
                    break;
                case "WASM":
                    this.setNeighborsFromWorkerInWASM(i, worker);
            }
        }
        worker.setBusy(false);
    }

    setNeighborsFromWorkerInJS(particleIndex, worker) {
        const particles = this.particlesManagerJS.getParticles();
        const particle = particles[particleIndex];
            
        // For each neighbors, set Particle's neighbor from its position
        for (let position = 0; position < 10; position++) {
            const neighborIndex = worker.sortedNeighborsArray[(particleIndex - worker.startIndex) * 10 + position];
            const neighbor = particles[neighborIndex];

            particle.setNeighborFromPosition(neighbor, position);
        }
    }

    setNeighborsFromWorkerInWASM(particleIndex, worker) {
        for (let position = 0; position < 10; position++) {
            const neighborIndex = worker.sortedNeighborsArray[(particleIndex - worker.startIndex) * 10 + position];
            
            this.wasmBufferInterpreter.setNeighborFromPosition(particleIndex, neighborIndex, position);
        }
    }

    setAnimationMode(value) {
        this.animationMode = value;
    }
}