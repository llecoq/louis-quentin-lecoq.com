import AnimationControllerJS from './particlesJS/AnimationControllerJS.js'
import AnimationControllerWASM from './particlesWASM/AnimationControllerWASM.js'
import EventListener from './EventListener.js'

export const opts = {
    // Particles
    NUMBER_OF_PARTICLES: 200,
    PARTICLE_MAX_SIZE: 2.5,
    PARTICLE_MIN_SIZE: 0.6,
    PARTICLE_ACTIVE_DELAY: 1000,
    PARTICLE_ACTIVE_COLOR: 'rgb(0, 150, 255)',
    PARTICLE_ACTIVE_SIZE_SCALE: 1.5,
    PARTICLE_COLOR_1: 'rgb(255, 255, 255)',
    PARTICLE_COLOR_2: 'rgb(72, 217, 247)',
    PARTICLE_COLOR_3: 'rgb(50, 130, 240)',
    
    // Connections
    CONNECTION_MAX_DIST: 200,
    CONNECTIONS_STROKE_STYLE: 'rgba(72, 217, 247, 0.5)',
    CONNECTIONS_LINE_WIDTH: 0.5,
    CONNECTIONS_GLOBAL_ALPHA: 1.1, 
    ACTIVE_CONNECTIONS_GLOBAL_ALPHA: 1.4, 
    PARTICLE_MAX_CONNECTIONS: 10,

    // Impulses
    IMPULSE_DIST_AUTONOMY: 10000,
    IMPULSE_SPEED: 20,
    IMPULSE_SPEED_OFFSET: 2,
    IMPULSE_SIZE: 1,
    MAX_IMPULSES: 20,

    // FPS / DELTA
    BASE_DELTA: 100 / 6,
}

export class Particles {

    canvas
    ctx
    animationControllerWASM
    animationControllerJS
    eventListener
    useWASM

    constructor() {
        // Canvas + Style
        document.body.style.height = "100vh";
        this.canvas = document.querySelector("canvas");
        this.canvas.height = document.body.clientHeight;
        this.canvas.width = document.body.clientWidth;
        this.ctx = canvas.getContext("2d");

        // Particles
        this.animationControllerJS = new AnimationControllerJS(this.ctx);
        this.animationControllerWASM = new AnimationControllerWASM(this.ctx);  

        // EventListener
        this.eventListener = new EventListener(this.canvas, this.animationControllerJS.animationControllerJS, this.animationControllerWASM.animationControllerWASM);
        this.useWASM = true;

        // Anim
        document.getElementById("animation-toggle-switch").addEventListener("change", this.toggleAnimation.bind(this));
    }

    init() {
        this.animationControllerJS.init();
    }
    
    toggleAnimation() {
        if (this.useWASM === true) {
            this.useWASM = false;
            // this.wasmAnimation.stop();
            this.animationControllerJS.start();
            console.log('JS anim')
        } else {
            this.useWASM = true;
            this.animationControllerJS.stop();
            // this.wasmAnimation.start();
            console.log('WASM anim')
        }
    }
}