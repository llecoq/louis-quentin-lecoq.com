import { opts } from "../Particles.js";

export default class Connection {
    particle
    neighbor
    globalAlpha

    constructor(particle, neighbor, dist) {
        this.particle = particle;
        this.neighbor = neighbor;
        this.globalAlpha = particle.active && neighbor.active ? opts.ACTIVE_CONNECTIONS_GLOBAL_ALPHA : opts.CONNECTIONS_GLOBAL_ALPHA;
        this.globalAlpha -= dist / opts.CONNECTION_MAX_DIST;
    }

    uniqueKey() {
        const indices = [this.particle.index, this.neighbor.index].sort();
        return `${indices[0]}-${indices[1]}`;
    }
}