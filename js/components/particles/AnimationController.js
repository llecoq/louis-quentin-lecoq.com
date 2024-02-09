import { opts } from "./Particles.js";
import { AnimationRenderer } from "./AnimationRenderer.js";
import { ParticlesWASM } from "../../../pkg/louis_quentin_lecoq.js";
import ImpulsesManagerJS from "./particlesJS/ImpulsesManagerJS.js";
import ParticlesManagerJS from "./particlesJS/ParticlesManagerJS.js";
import { WasmBufferInterpreter } from "./particlesWASM/WasmBufferInterpreter.js";
import init from "../../../pkg/louis_quentin_lecoq.js";
import WorkersManager from "./WorkersManager.js";

async function loadWasm() {
    await init();
}

self.window = self;

let animationController;

// onmessage is triggered when the worker's parent is sending a message
onmessage = function (e) {
    if (e.data.type === 'initAnimation') {
        const canvas = e.data.canvas;
        const ctx = canvas.getContext("2d");
    
        loadWasm().then(() => {
            animationController = new AnimationController();
            animationController.init(canvas, ctx);
        });
    } else {
        if (animationController) { 
            switch (e.data.type) {
                case 'updateMousePosition':
                    animationController.updateMousePosition(e.data.x, e.data.y);
                    break;
                case 'setMouseIsOverCanvas':
                    animationController.setMouseIsOverCanvas(e.data.value);
                    break;
                case 'start':
                    animationController.start();
                    break;
                case 'stop':
                    animationController.stop();
                    break;
                case 'changeAnimationMode':
                    animationController.changeAnimationMode();
                    break;
            }
        }
    }
}

class AnimationController {

    animationMode
    animationRenderer
    animationFrameId
    activeParticlesManager
    activeImpulsesManager
    particlesManagerJS
    particlesManagerWASM
    impulsesManagerJS
    impulsesManagerWASM
    workersManager
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

    init(canvas, ctx) {

        // Init animation from WASM side
        const particlesWASM = ParticlesWASM.new(canvas.height, canvas.width);
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
        this.particlesManagerJS = new ParticlesManagerJS(ctx, opts.NUMBER_OF_PARTICLES, canvas);
        this.impulsesManagerJS = new ImpulsesManagerJS(ctx, this.particlesManagerJS.getParticles());

        // Create a new AnimationRenderer
        const particlesJS = this.particlesManagerJS.getParticles();
        const impulsesJS = this.impulsesManagerJS.getImpulses();
        this.animationRenderer = new AnimationRenderer(ctx, this.wasmBufferInterpreter, particlesJS, impulsesJS, canvas);

        // Setup the active ParticlesManager
        this.activeParticlesManager = this.particlesManagerWASM;
        this.activeImpulsesManager = this.impulsesManagerWASM;

        // Init WebWorkers
        this.workersManager = new WorkersManager(this.particlesManagerJS, this.wasmBufferInterpreter);

        // Start animation
        this.start();
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
            case "WASM": // Switch animation to JS
                this.animationMode = "JS";
                this.particlesManagerJS.setParticlesDataFromWASM(this.wasmBufferInterpreter);
                this.activeImpulsesManager = this.impulsesManagerJS;
                this.activeParticlesManager = this.particlesManagerJS;
                break;
            case "JS": // Switch animation to WASM
                this.animationMode = "WASM";
                this.wasmBufferInterpreter.setParticlesDataFromJS(this.particlesManagerJS.getParticles());
                this.activeImpulsesManager = this.impulsesManagerWASM;
                this.activeParticlesManager = this.particlesManagerWASM;
            }

        this.workersManager.changeAnimationMode();
        clearInterval(this.sortNeighborsId);
        this.sortNeighborsId = this.sortNeighbors();
    }

    sortNeighbors() {
        if (opts.WEB_WORKERS)
            return setInterval(() => this.workersManager.sortNeighbors(), 250);
        else
            return setInterval(() => this.activeParticlesManager.sort_neighbors(), 250);
    }
}