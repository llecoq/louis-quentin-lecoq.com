import { opts } from "../Particles.js";
// import ImpulseManagerJS from "./objs/ImpulsesManagerJS.js";
// import ParticlesManagerJS from "./objs/ParticlesManagerJS.js";

export default class AnimationControllerWASM {

    ctx
    animationFrameId
    sortNeighborsId
    isAnimating
    particlesManager
    impulsesManager
    lastTimestamp
    mouseX
    mouseY
    mouseIsOverCanvas

    constructor(ctx) {
        // this.ctx = ctx;
        // this.isAnimating = false;
        // this.lastTimestamp = 0;
        // this.mouseIsOverCanvas = false;
    }

    init() {
        // Initialize particles and impulses
        // this.particlesManager = new ParticlesManagerJS(this.ctx, opts.NUMBER_OF_PARTICLES);
        // this.impulsesManager = new ImpulseManagerJS(this.ctx, this.particlesManager.getParticles());
    }    

    // Animate the particles and impulses
    animate(timestamp) {
        // if (!this.lastTimestamp) this.lastTimestamp = timestamp;

        // const delta = timestamp - this.lastTimestamp;
        // const scaleFPS = delta / opts.BASE_DELTA;

        // // clear canvas rectangle
        // this.ctx.globalCompositeOperation = 'source-over';
        // this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // // draw connections and lights
        // this.ctx.globalCompositeOperation = 'lighter';
        // this.particlesManager.drawConnections(this.mouseX, this.mouseY, this.mouseIsOverCanvas);
        // if (this.mouseIsOverCanvas) this.impulsesManager.createImpulses(this.mouseX, this.mouseY);
        // this.impulsesManager.drawImpulses(scaleFPS);
        
        // // draw particles
        // this.ctx.globalAlpha = 1.0;
        // this.ctx.globalCompositeOperation = 'source-over';
        // this.particlesManager.drawParticles(scaleFPS);

        // this.lastTimestamp = timestamp;
        // this.animationFrameId = requestAnimationFrame(this.animate.bind(this));        
    }

    // Start Animation
    start() {
        // if (this.isAnimating === false) {
        //     this.isAnimating = true;
        //     this.lastTimestamp = 0;
        //     this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
        //     this.sortNeighborsId = this.particlesManager.sortNeighbors();
        // }
    }

    // Stop Animation
    stop() {
        // if (this.isAnimating === true) {
        //     this.isAnimating = false;
        //     cancelAnimationFrame(this.animationFrameId);
        //     clearInterval(this.sortNeighborsId);
        // }
    }

    // Update mouse position
    updateMousePosition(x, y) {
        // this.mouseX = x;
        // this.mouseY = y;
    }

    // Set mouseIsOverCanvas to a given value
    setMouseIsOverCanvas(value) {
        // this.mouseIsOverCanvas = value;
    }
}