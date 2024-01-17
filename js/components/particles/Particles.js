import AnimationController from './AnimationController.js'
import EventListener from './EventListener.js'

export const opts = {
    // Particles
    NUMBER_OF_PARTICLES: 100,
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
    animationController
    eventListener
    useWASM

    constructor() {
        // Canvas + Style
        document.body.style.height = "100vh";
        this.canvas = document.querySelector("canvas");
        this.canvas.height = document.body.clientHeight;
        this.canvas.width = document.body.clientWidth;
        this.ctx = canvas.getContext("2d");

        // AnimationController
        this.animationController = new AnimationController(this.ctx);

        // EventListener
        this.eventListener = new EventListener(this.canvas, this.animationController);
        this.useWASM = true;

        // Anim
        document.getElementById("animation-toggle-switch").addEventListener("change", this.toggleAnimation.bind(this));
    }

    init() {
        this.animationController.init(this.canvas.height, this.canvas.width);
        this.eventListener.init();
    }
    
    // must create new methods `startAnimationJS` and `startAnimationWASM` for animationController
    toggleAnimation() {
        if (this.useWASM === true) {
            this.useWASM = false;
            // this.wasmAnimation.stop();
            // this.animationController.startAnimationWASM();
            this.animationController.start();
            console.log('JS anim')
        } else {
            this.useWASM = true;
            this.animationController.stop();
            // this.wasmAnimation.start();
            console.log('WASM anim')
        }
    }
}

// Export opts to expose it to wasm_bindgen
export function getOpts() {
    return opts;
}

window.getOpts = getOpts;