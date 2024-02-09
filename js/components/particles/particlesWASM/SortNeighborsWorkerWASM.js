import init, {SortNeighborsFromWorker} from "/pkg/louis_quentin_lecoq.js";

async function loadWasm() {
    await init();
}

let worker;

onmessage = function (e) {
    if (e.data.type == "initWorker") {
        const data = e.data;
        worker = new SetNeighborsWorkerWASM(data);
    } else {
        if (worker) {
            switch (e.data.type) {
                case "sortNeighbors":
                    worker.sortNeighbors(e.data.buffer);
                    break;
            }
        }
    }
}

class SetNeighborsWorkerWASM {

    workerIndex
    numberOfParticles
    sharedParticlesView
    startIndex
    endIndex
    wasmBuffer
    wasmModule

    constructor(data) {
        this.workerIndex = data.workerIndex;
        this.numberOfParticles = data.numberOfParticles;
        this.startIndex = data.startIndex;
        this.endIndex = data.endIndex;
        this.sharedParticlesView = data.buffer;

        loadWasm().then(() => {
            const wasmModule = SortNeighborsFromWorker.new(
                this.numberOfParticles,
                this.startIndex,
                this.endIndex
            );

            this.wasmModule = wasmModule;
        });
    }

    sortNeighbors(buffer) {
        const sortedNeighborsView = new Uint16Array(buffer);

        if (this.wasmModule) {
            this.wasmModule.sort_neighbors(this.sharedParticlesView, sortedNeighborsView);
        }

        // send buffer back
        postMessage({
            workerIndex: this.workerIndex,
            buffer: buffer
        }, [buffer])    
    }
}