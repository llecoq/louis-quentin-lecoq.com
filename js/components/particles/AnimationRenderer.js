import { opts } from "./Particles.js";

export class AnimationRenderer {

    ctx
    wasmBufferInterpreter
    particlesJS
    impulsesJS
    mouseX
    mouseY

    constructor(ctx, wasmBufferInterpreter, particlesJS, impulsesJS) {
        this.ctx = ctx;
        this.wasmBufferInterpreter = wasmBufferInterpreter;
        this.particlesJS = particlesJS;
        this.impulsesJS = impulsesJS;
    }

    // Clear canvas rectangle
    clearCanvasRectangle() {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Render connections
    renderConnections(animationMode, mouseIsOverCanvas) {
        this.ctx.globalCompositeOperation = 'lighter';
        this.ctx.strokeStyle = opts.CONNECTIONS_STROKE_STYLE;
        this.ctx.lineWidth = opts.CONNECTIONS_LINE_WIDTH;

        switch (animationMode) {
            case "WASM":
                this.wasmBufferInterpreter.renderConnections(this.ctx, this.mouseX, this.mouseY, mouseIsOverCanvas);
                break;
            case "JS":
                this.particlesJS.forEach(particle => particle.renderConnections(this.ctx, this.mouseX, this.mouseY, mouseIsOverCanvas))
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
                this.particlesJS.forEach(particle => particle.render(this.ctx));
        }
    }

    setMousePosition(mouseX, mouseY) {
        this.mouseX = mouseX;
        this.mouseY = mouseY;
    }
}