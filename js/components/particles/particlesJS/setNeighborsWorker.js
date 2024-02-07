const particlesView = {
    SIZE: 3,

    INDEX: 0,
    X: 1,
    Y: 2
}

let worker;

onmessage = function (e) {
    if (e.data.type == "initWorker") {
        const data = e.data;
        worker = new setNeighborsWorker(data);
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

class setNeighborsWorker {

    workerIndex
    numberOfParticles
    sharedParticlesView
    startIndex
    endIndex

    constructor(data) {
        this.workerIndex = data.workerIndex;
        this.numberOfParticles = data.numberOfParticles;
        this.startIndex = data.startIndex;
        this.endIndex = data.endIndex;
        this.sharedParticlesView = data.buffer;
    }

    sortNeighbors(buffer) {
        const sortedNeighborsView = new Float32Array(buffer);

        // For each Particle
        for (let i = this.startIndex; i < this.endIndex; i++) {
            const x = this.sharedParticlesView[i * particlesView.SIZE + particlesView.X];
            const y = this.sharedParticlesView[i * particlesView.SIZE + particlesView.Y];
            let distances = [];

            // Compute distance with other particles
            for (let j = 0; j < this.numberOfParticles; j++) {
                if (i !== j) {
                    const neighborX = this.sharedParticlesView[j * particlesView.SIZE + particlesView.X];
                    const neighborY = this.sharedParticlesView[j * particlesView.SIZE + particlesView.Y];

                    const dist = this.getDist(x, y, neighborX, neighborY);
                    distances.push({ index: j, distance: dist });
                }
            }
            // Sort distances from closest to farthest
            distances.sort((a, b) => a.distance - b.distance);

            // Put the indices of the 10 closest neighbors for each particle within the transferable array buffer
            for (let k = 0; k < 10; k++) {
                sortedNeighborsView[(i - this.startIndex) * 10 + k] = distances[k].index;
            }
        }

        // send buffer back
        postMessage({
            workerIndex: this.workerIndex,
            buffer: buffer
        }, [buffer])
    }
    
    getDist(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
}