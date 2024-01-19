import { ParticlesManagerWASM } from "../../../pkg/louis_quentin_lecoq.js";
import ImpulseManagerJS from "./particlesJS/ImpulsesManagerJS.js";
import ParticlesManagerJS from "./particlesJS/ParticlesManagerJS.js";
import { WasmBufferInterpreter } from "./particlesWASM/WasmBufferInterpreter.js";
import { opts } from "./Particles.js";

export class AnimationRenderer {

    ctx
    particlesManagerJS
    particlesManagerWASM
    impulsesManagerJS
    impulsesManagerWASM
    wasmBufferInterpreter

    constructor(ctx) {
        this.ctx = ctx;
    }

    // init AnimationRenderer
    init(canvasHeight, canvasWidth) {
        // Init particlesManager from WASM
        this.particlesManagerWASM = ParticlesManagerWASM.new(canvasHeight, canvasWidth);
        this.particlesManagerWASM.init();
        
        // Accessing memory of the wasm module and instanciating a WASM buffer interpreter
        const memory = this.particlesManagerWASM.memory();
        const particlesPtr = this.particlesManagerWASM.get_particles_ptr();
        this.wasmBufferInterpreter = new WasmBufferInterpreter(memory, particlesPtr);

        this.particlesManagerJS = new ParticlesManagerJS(this.ctx, opts.NUMBER_OF_PARTICLES);
        this.particlesManagerJS.setParticlesDataFromWASM(this.wasmBufferInterpreter);
        this.impulsesManagerJS = new ImpulseManagerJS(this.ctx, this.particlesManagerJS.getParticles());

    }

    // clear canvas rectangle
    clearCanvasRectangle() {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // render connections
    renderConnections() {
        this.ctx.globalCompositeOperation = 'lighter';
        this.particlesManagerJS.drawConnections(this.mouseX, this.mouseY, this.mouseIsOverCanvas);
    }

    // render impulses
    renderImpulses(scaleFPS) {
        this.impulsesManagerJS.drawImpulses(scaleFPS);
    }

    // create impulses
    createImpulses(mouseX, mouseY) {
        this.impulsesManagerJS.createImpulses(mouseX, mouseY);
    }

    // render particles
    renderParticles(scaleFPS) {
        this.ctx.globalAlpha = 1.0;
        this.ctx.globalCompositeOperation = 'source-over';
        this.particlesManagerJS.drawParticles(scaleFPS);
    }
    
    sortNeighbors() {
        return this.particlesManagerJS.sortNeighbors();
    }
}