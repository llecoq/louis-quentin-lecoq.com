import { opts } from "./Particles.js";
import { AnimationRenderer } from "./AnimationRenderer.js";
import { ParticlesManagerWASM } from "../../../pkg/louis_quentin_lecoq.js";
import ImpulseManagerJS from "./particlesJS/ImpulsesManagerJS.js";
import ParticlesManagerJS from "./particlesJS/ParticlesManagerJS.js";
import { WasmBufferInterpreter } from "./particlesWASM/WasmBufferInterpreter.js";

export default class AnimationController {

    animationMode
    animationRenderer
    animationFrameId
    activeParticlesManager
    activeImpulsesManager
    particlesManagerJS
    particlesManagerWASM
    impulsesManagerJS
    impulsesManagerWASM
    sortNeighborsId
    isAnimating
    wasmBufferInterpreter
    lastTimestamp
    mouseX
    mouseY
    mouseIsOverCanvas

    constructor() {
        this.animationMode = "JS";
        this.isAnimating = false;
        this.lastTimestamp = 0;
        this.mouseIsOverCanvas = false;
    }

    init(canvasHeight, canvasWidth, ctx) {
        // Init particlesManager from WASM
        this.particlesManagerWASM = ParticlesManagerWASM.new(canvasHeight, canvasWidth);
        this.particlesManagerWASM.init();
        
        // Accessing memory of the wasm module and instanciating a WASM buffer interpreter
        const memory = this.particlesManagerWASM.memory();
        const particlesPtr = this.particlesManagerWASM.get_particles_ptr();
        this.wasmBufferInterpreter = new WasmBufferInterpreter(memory, particlesPtr);
        
        this.particlesManagerJS = new ParticlesManagerJS(ctx, opts.NUMBER_OF_PARTICLES);
        this.particlesManagerJS.setParticlesDataFromWASM(this.wasmBufferInterpreter);
        this.impulsesManagerJS = new ImpulseManagerJS(ctx, this.particlesManagerJS.get_particles());

        // Create a new AnimationRenderer
        this.animationRenderer = new AnimationRenderer(ctx);

        // Setup the active ParticlesManager
        this.activeParticlesManager = this.particlesManagerJS;
        this.activeImpulsesManager = this.impulsesManagerJS;
    }


    // Animate the particles and impulses
    animate(timestamp) {
        if (!this.lastTimestamp) this.lastTimestamp = timestamp;

        const delta = timestamp - this.lastTimestamp;
        const scaleFPS = delta / opts.BASE_DELTA;

        if (this.mouseIsOverCanvas) {
            this.activeImpulsesManager.create_impulses(this.mouseX, this.mouseY);
        }

        // Update positions
        this.activeParticlesManager.update(scaleFPS);

        // Render animation
        this.animationRenderer.clearCanvasRectangle();
        this.animationRenderer.renderConnections(this.animationMode, this.activeParticlesManager.get_particles(), this.mouseX, this.mouseY, this.mouseIsOverCanvas);
        this.animationRenderer.renderImpulses(scaleFPS, this.animationMode, this.activeImpulsesManager.get_impulses());
        this.animationRenderer.renderParticles(this.animationMode, this.activeParticlesManager.get_particles());

        this.lastTimestamp = timestamp;
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));        
    }

    // Start Animation
    start() {
        if (this.isAnimating === false) {
            this.isAnimating = true;
            this.lastTimestamp = 0;
            this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
            this.sortNeighborsId = this.particlesManagerJS.sortNeighbors();
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
        switch (this.animationMode) {
            case "WASM":
                this.animationMode = "JS";
                console.log(this.animationMode);
                // this.particlesManagerJS.setParticlesDataFromWASM(this.wasmBufferInterpreter);
                // stop WASM anim
                // start JS anim
                break;
            case "JS":
                this.animationMode = "WASM";
                console.log(this.animationMode);
                // setParticlesDataFromJS
                // stop JS anim
                // start WASM anim
        }
    }
}