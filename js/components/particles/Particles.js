import AnimationController from './AnimationController.js'
import EventListener from './EventListener.js'

export const opts = {
    SHOOTING_STARS: false,

    // Particles
    NUMBER_OF_PARTICLES: 800,
    PARTICLE_MAX_SIZE: 2.7,
    PARTICLE_MIN_SIZE: 0.6,
    PARTICLE_ACTIVE_DELAY: 1000,
    PARTICLE_ACTIVE_COLOR: 'rgb(0, 150, 255)',
    PARTICLE_ACTIVE_SIZE_SCALE: 1.5,
    PARTICLE_COLOR_1: 'rgb(255, 255, 255)',
    PARTICLE_COLOR_2: 'rgb(72, 217, 247)',
    PARTICLE_COLOR_3: 'rgb(50, 130, 240)',
    
    // Connections
    CONNECTION_MAX_DIST: 60,
    CONNECTIONS_STROKE_STYLE: 'rgba(72, 217, 247, 0.5)',
    CONNECTIONS_LINE_WIDTH: 0.4,
    CONNECTIONS_GLOBAL_ALPHA: 1.1,
    ACTIVE_CONNECTIONS_GLOBAL_ALPHA: 1.4, 
    PARTICLE_MAX_CONNECTIONS: 10,

    // Impulses
    IMPULSE_DIST_AUTONOMY: 10000,
    IMPULSE_SPEED: 20,
    IMPULSE_SPEED_OFFSET: 2,
    IMPULSE_SIZE: 0.5,
    MAX_IMPULSES: 50,
    IMPULSE_STROKE_STYLE: 'rgb(72, 217, 247)',
    IMPULSE_UPDATE_STEPS: 5,

    // FPS / DELTA
    BASE_DELTA: 100 / 6,
}

export class Particles {

    canvas
    ctx
    animationController
    eventListener

    constructor() {
        // Canvas + Style
        document.body.style.height = "100vh";
        this.canvas = document.querySelector("canvas");
        this.canvas.height = document.body.clientHeight;
        this.canvas.width = document.body.clientWidth;
        
        // AnimationController
        this.ctx = canvas.getContext("2d");
        this.animationController = new AnimationController();

        // EventListener
        this.eventListener = new EventListener(this.canvas, this.animationController);
    }

    init() {
        this.animationController.init(this.canvas.height, this.canvas.width, this.ctx);
        this.eventListener.init();
    }
}

// Export opts to expose it to wasm_bindgen
export function getOpts() {
    return opts;
}

window.getOpts = getOpts;