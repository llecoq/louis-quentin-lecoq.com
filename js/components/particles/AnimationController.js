import { opts } from "./Particles.js";
import { AnimationRenderer } from "./AnimationRenderer.js";
import { ParticlesWASM } from "../../../pkg/louis_quentin_lecoq.js";
import ImpulsesManagerJS from "./particlesJS/ImpulsesManagerJS.js";
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
        this.animationMode = "WASM";
        this.isAnimating = false;
        this.lastTimestamp = 0;
        this.mouseIsOverCanvas = false;
    }

    init(canvasHeight, canvasWidth, ctx) {
        // Init animation from WASM side
        const particlesWASM = ParticlesWASM.new(canvasHeight, canvasWidth);
        this.particlesManagerWASM = particlesWASM.get_particles_manager();
        this.particlesManagerWASM.init();
        this.impulsesManagerWASM = particlesWASM.get_impulses_manager();
        
        // Accessing memory of the WASM module and instanciating a WASM buffer interpreter
        const memory = particlesWASM.memory();

        // Setup Particles buffer
        const particlesPtr = this.particlesManagerWASM.get_particles_ptr();
        this.wasmBufferInterpreter = new WasmBufferInterpreter(memory);
        this.wasmBufferInterpreter.setWasmParticlesBuffer(particlesPtr);

        // Setup MousePosition buffer
        const mousePositionPtr = particlesWASM.get_mouse_position_ptr();
        this.wasmBufferInterpreter.setWasmMousePositionBuffer(mousePositionPtr);

        // Setup Impulses buffer
        const impulsesPtr = this.impulsesManagerWASM.get_impulses_ptr();
        this.wasmBufferInterpreter.setWasmImpulsesBuffer(impulsesPtr);

        // Init animation from JS side (empty, waiting for a toggle change from the client side)
        this.particlesManagerJS = new ParticlesManagerJS(ctx, opts.NUMBER_OF_PARTICLES);
        this.impulsesManagerJS = new ImpulsesManagerJS(ctx, this.particlesManagerJS.getParticles());

        // Create a new AnimationRenderer
        const particlesJS = this.particlesManagerJS.getParticles();
        const impulsesJS = this.impulsesManagerJS.getImpulses();
        this.animationRenderer = new AnimationRenderer(ctx, this.wasmBufferInterpreter, particlesJS, impulsesJS);

        // Setup the active ParticlesManager
        this.activeParticlesManager = this.particlesManagerWASM;
        this.activeImpulsesManager = this.impulsesManagerWASM;
    }


    // Animate the particles and impulses
    animate(timestamp) {
        if (!this.lastTimestamp) this.lastTimestamp = timestamp;

        const delta = timestamp - this.lastTimestamp;
        const scaleFPS = delta / opts.BASE_DELTA;

        if (this.mouseIsOverCanvas) {
            this.activeImpulsesManager.create_impulses();
        }

        // Update positions
        this.activeParticlesManager.update(scaleFPS);

        // Render animation
        this.animationRenderer.clearCanvasRectangle();
        this.animationRenderer.renderConnections(this.animationMode, this.mouseIsOverCanvas);
        this.animationRenderer.renderImpulses(scaleFPS, this.animationMode, this.activeImpulsesManager);
        this.animationRenderer.renderParticles(this.animationMode);

        this.lastTimestamp = timestamp;
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));        
    }

    // Start Animation
    start() {
        if (this.isAnimating === false) {
            this.isAnimating = true;
            this.lastTimestamp = 0;
            this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
            this.sortNeighborsId = this.sortNeighbors();
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
        switch (this.animationMode) {
            case "WASM": 
                this.wasmBufferInterpreter.setMousePosition(x, y);
                break;
            case "JS":
                this.impulsesManagerJS.setMousePosition(x, y);
        }
        this.animationRenderer.setMousePosition(x, y);
    }

    // Set mouseIsOverCanvas to a given value
    setMouseIsOverCanvas(value) {
        switch (this.animationMode) {
            case "WASM":
                this.wasmBufferInterpreter.setMouseIsOverCanvas(value)
            case "JS":
                this.mouseIsOverCanvas = value;
        }
    }

    // Change AnimationMode
    changeAnimationMode() {
        switch (this.animationMode) {
            case "WASM": // Switch animation in JS
                this.animationMode = "JS";
                this.particlesManagerJS.setParticlesDataFromWASM(this.wasmBufferInterpreter);
                this.activeImpulsesManager = this.impulsesManagerJS;
                this.activeParticlesManager = this.particlesManagerJS;
                break;
            case "JS": // Switch animation in WASM
                this.animationMode = "WASM";
                this.wasmBufferInterpreter.setParticlesDataFromJS(this.particlesManagerJS.getParticles());
                this.activeImpulsesManager = this.impulsesManagerWASM;
                this.activeParticlesManager = this.particlesManagerWASM;
            }

        clearInterval(this.sortNeighborsId);
        this.sortNeighborsId = this.sortNeighbors();
    }

    sortNeighbors() {
        return setInterval(() => this.activeParticlesManager.sort_neighbors(), 250);
    }
}