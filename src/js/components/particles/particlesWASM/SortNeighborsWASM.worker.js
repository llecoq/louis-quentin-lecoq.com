import init, {SortNeighborsFromWorker} from "/rs/pkg/louis_quentin_lecoq.js";

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
                    worker.sortNeighbors(e.data.buffer, e.data.numberOfParticles);
                    break;
                case "changeNumberOfParticles":
                    worker.changeNumberOfParticles(e.data);
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
            )
            postMessage({
                type: 'workerInitialized',
                workerIndex: this.workerIndex
            });

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
            type: 'setNeighbors',
            workerIndex: this.workerIndex,
            buffer: buffer
        }, [buffer])    
    }

    changeNumberOfParticles(data) {
        this.wasmModule.change_number_of_particles(data.value, data.startIndex, data.endIndex);
    }
}