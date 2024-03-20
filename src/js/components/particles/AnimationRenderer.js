import { opts } from "./opts.js";

export class AnimationRenderer {

    ctx
    canvas
    wasmBufferInterpreter
    particlesManagerJS
    particlesJS
    impulsesJS
    numberOfParticles

    constructor(ctx, wasmBufferInterpreter, particlesJS, impulsesJS, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.wasmBufferInterpreter = wasmBufferInterpreter;
        this.particlesJS = particlesJS;
        this.impulsesJS = impulsesJS;
        this.ctx.font = "20px Arial";
        this.numberOfParticles = opts.NUMBER_OF_PARTICLES;
    }

    // Clear canvas rectangle
    clearCanvasRectangle() {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Render connections
    renderConnections(animationMode, connections_len) {
        this.ctx.globalCompositeOperation = 'lighter';
        this.ctx.strokeStyle = opts.CONNECTIONS_STROKE_STYLE;
        this.ctx.lineWidth = opts.CONNECTIONS_LINE_WIDTH;

        switch (animationMode) {
            case "WASM":
                this.wasmBufferInterpreter.renderConnections(this.ctx, connections_len);
                break;
            case "JS": {
                const connections = this.particlesManagerJS.getConnections();
                
                if (connections) {
                    connections.forEach(connection => {
                        this.ctx.beginPath();
                        this.ctx.globalAlpha = connection.globalAlpha;
                        this.ctx.moveTo(connection.particle.x, connection.particle.y);
                        this.ctx.lineTo(connection.neighbor.x, connection.neighbor.y);
                        this.ctx.stroke();
                    });
                    
                    this.particlesManagerJS.clearConnections();
                }
            }
        }
    }

    // Render impulses
    renderImpulses(scaleFPS, animationMode, activeImpulsesManager) {
        this.ctx.globalAlpha = 1.0;
        this.ctx.strokeStyle = opts.IMPULSE_STROKE_STYLE;
        this.ctx.lineWidth = opts.IMPULSE_SIZE;
        this.ctx.beginPath();

        switch (animationMode) {
            case "WASM":
                activeImpulsesManager.remove_expired_impulses();
                activeImpulsesManager.move_and_duplicate_impulses();
                this.wasmBufferInterpreter.renderImpulses(this.ctx, scaleFPS, activeImpulsesManager);
                break;
            case "JS":
                this.impulsesJS.forEach((impulse, index) => {
                    if (impulse.isExpired() || impulse.move(this.impulsesJS) === false) {
                        this.impulsesJS.splice(index, 1);
                        return;
                    }
                    if (impulse.render(this.ctx, scaleFPS) === false)
                        this.impulsesJS.splice(index, 1);
                });
        }

        this.ctx.stroke();
    }

    // Render particles
    renderParticles(animationMode) {
        this.ctx.globalAlpha = 1.0;
        this.ctx.globalCompositeOperation = 'source-over';

        switch (animationMode) {
            case "WASM":
                this.wasmBufferInterpreter.renderParticles(this.ctx);
                break;
            case "JS":
                this.particlesJS.forEach((particle, index) => {
                    if (index < this.numberOfParticles)
                        particle.render(this.ctx)
                });
        }
    }

    // Render FPS count
    renderFPS(fps) {
        this.ctx.fillStyle = opts.PARTICLE_ACTIVE_COLOR;
        this.ctx.fillText(Math.round(fps), this.canvas.width * 0.015, this.canvas.height * 0.95);
    }

    changeNumberOfParticles(value) {
        this.numberOfParticles = value;
    }

    setParticlesManagerJS(particlesManagerJS) {
        this.particlesManagerJS = particlesManagerJS;
    }
}