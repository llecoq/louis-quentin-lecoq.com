import { opts } from "./Particles.js";

export class AnimationRenderer {

    ctx
    wasmBufferInterpreter

    constructor(ctx, wasmBufferInterpreter) {
        this.ctx = ctx;
        this.wasmBufferInterpreter = wasmBufferInterpreter;
    }

    // Clear canvas rectangle
    clearCanvasRectangle() {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Render connections
    renderConnections(animationMode, particles, mouseX, mouseY, mouseIsOverCanvas) {
        this.ctx.globalCompositeOperation = 'lighter';
        this.ctx.strokeStyle = opts.CONNECTIONS_STROKE_STYLE;
        this.ctx.lineWidth = opts.CONNECTIONS_LINE_WIDTH;

        switch (animationMode) {
            case "WASM":
                this.wasmBufferInterpreter.renderConnections(this.ctx);
                break;
            case "JS":
                particles.forEach(particle => particle.renderConnections(this.ctx, mouseX, mouseY, mouseIsOverCanvas))
        }
    }

    // Render impulses
    renderImpulses(scaleFPS, animationMode, impulses) {
        this.ctx.globalAlpha = 1.0;

        switch (animationMode) {
            case "WASM":


            case "JS":
                impulses.forEach((impulse, index) => {
                    if (impulse.isExpired() || impulse.move(impulses) === false) {
                        impulses.splice(index, 1);
                        return;
                    }
                    if (impulse.render(this.ctx, scaleFPS) === false)
                        impulses.splice(index, 1);
                });
        }
    }

    // Render particles
    renderParticles(animationMode, particles) {
        this.ctx.globalAlpha = 1.0;
        this.ctx.globalCompositeOperation = 'source-over';

        switch (animationMode) {
            case "WASM":
                this.wasmBufferInterpreter.renderParticles(this.ctx);
            break;
            case "JS":
                particles.forEach(particle => particle.render(this.ctx));
        }
    }
}