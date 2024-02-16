import Connection from "./Connection.js";

export default class ConnectionsManager {
    connections

    constructor() {
        this.connections = new Map();
    }

    addConnection(particle, neighbor, dist) {
        const connection = new Connection(particle, neighbor, dist);
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
}