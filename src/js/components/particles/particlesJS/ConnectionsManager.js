import { opts } from "../opts.js";
import Connection from "./Connection.js";

export default class ConnectionsManager {
    connections
    connectionMaxDist

    constructor() {
        this.connections = new Map();
        this.connectionMaxDist = opts.CONNECTION_MAX_DIST;
    }

    addConnection(particle, neighbor, dist) {
        const connection = new Connection(particle, neighbor, dist, this.connectionMaxDist);
        const key = connection.uniqueKey();

        if (!this.connections.has(key)) {
            this.connections.set(key, connection);
        }
    }

    hasConnection(connection) {
        const key = connection.uniqueKey();

        return this.connections.has(key);
    }

    getConnection(connection) {
        const key = connection.uniqueKey();

        return this.connections.get(key);
    }

    clearConnections() {
        this.connections.clear();
    }

    getConnections() {
        return this.connections;
    }

    setConnectionMaxDist(value) {
        this.connectionMaxDist = value;
    }
}