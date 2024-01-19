import { opts } from "./Particles.js";
import { AnimationRenderer } from "./AnimationRenderer.js";

export default class AnimationController {

    animationMode
    animationRenderer
    animationFrameId
    sortNeighborsId
    isAnimating
    wasmBufferInterpreter
    lastTimestamp
    mouseX
    mouseY
    mouseIsOverCanvas

    constructor() {
        this.animationMode = "WASM";
        this.isAnimating = false;
        this.lastTimestamp = 0;
        this.mouseIsOverCanvas = false;
    }

    init(canvasHeight, canvasWidth, ctx) {
        this.animationRenderer = new AnimationRenderer(ctx);
        this.animationRenderer.init(canvasHeight, canvasWidth);
    }

    // Animate the particles and impulses
    animate(timestamp) {
        if (!this.lastTimestamp) this.lastTimestamp = timestamp;

        const delta = timestamp - this.lastTimestamp;
        const scaleFPS = delta / opts.BASE_DELTA;

        if (this.mouseIsOverCanvas) {
            this.animationRenderer.createImpulses(this.mouseX, this.mouseY);
        }

        // Rendering animation
        this.animationRenderer.clearCanvasRectangle();
        this.animationRenderer.renderConnections();
        this.animationRenderer.renderImpulses(scaleFPS);
        this.animationRenderer.renderParticles(scaleFPS);

        this.lastTimestamp = timestamp;
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));        
    }

    // Start Animation
    start() {
        if (this.isAnimating === false) {
            this.isAnimating = true;
            this.lastTimestamp = 0;
            this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
            this.sortNeighborsId = this.animationRenderer.sortNeighbors();
        }
    }

    // Stop Animation
    stop() {
        if (this.isAnimating === true) {
            this.isAnimating = false;
            cancelAnimationFrame(this.animationFrameId);
            clearInterval(this.sortNeighborsId);
        }
    }

    // Update mouse position
    updateMousePosition(x, y) {
        this.mouseX = x;
        this.mouseY = y;
    }

    // Set mouseIsOverCanvas to a given value
    setMouseIsOverCanvas(value) {
        this.mouseIsOverCanvas = value;
    }

    // Change AnimationMode
    changeAnimationMode() {
        if (this.animationMode === "WASM") {
            this.animationMode = "JS";
            console.log(this.animationMode);
            // this.particlesManagerJS.setParticlesDataFromWASM(this.wasmBufferInterpreter);
            // stop WASM anim
            // start JS anim
        }
        else {
            this.animationMode = "WASM";
            console.log(this.animationMode);
            // setParticlesDataFromJS
            // stop JS anim
            // start WASM anim
        }
    }
}