import EventListener from './EventListener.js'

export const opts = {
    SHOOTING_STARS: false,
    WEB_WORKERS: 4,

    // Particles
    NUMBER_OF_PARTICLES: 800, // Do not exceed MAX_NUMBER_OF_PARTICLES
    MAX_NUMBER_OF_PARTICLES: 1500, // Change this number only to match max range of id='particles-number-range'
    PARTICLE_MAX_SIZE: 2.1,
    PARTICLE_MIN_SIZE: 0.6,
    PARTICLE_ACTIVE_DELAY: 1000,
    PARTICLE_ACTIVE_COLOR: 'rgb(0, 150, 255)',
    PARTICLE_ACTIVE_SIZE_SCALE: 1.2,
    PARTICLE_COLOR_1: 'rgb(255, 255, 255)',
    PARTICLE_COLOR_2: 'rgb(72, 217, 247)',
    PARTICLE_COLOR_3: 'rgb(50, 130, 240)',
    ARC_RAD: Math.PI * 2,

    // Connections
    CONNECTION_MAX_DIST: 60,
    CONNECTIONS_STROKE_STYLE: 'rgba(72, 217, 247, 0.5)',
    CONNECTIONS_LINE_WIDTH: 0.7,
    CONNECTIONS_GLOBAL_ALPHA: 1.2,
    ACTIVE_CONNECTIONS_GLOBAL_ALPHA: 1.6, 
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

    SORT_NEIGHBORS_REFRESH_RATE: 250 // in ms
}

export class Particles {

    eventListener
    worker
    particlesRangeSlider
    particlesNumberOutput
    
    init() {
        document.body.style.height = "100vh";
        // Creation of an OffscreenCanvas
        const offscreen = document.querySelector('canvas').transferControlToOffscreen();
        // Creation of a new module Worker
        this.worker = new Worker('js/components/particles/AnimationController.js', {
            type: 'module'
        });
        offscreen.height = document.body.clientHeight;
        offscreen.width = document.body.clientWidth;
        // Sending the context to the worker
        this.worker.postMessage({
            type: 'initAnimation',
            canvas: offscreen,
        }, [offscreen]);
    
        // // EventListener
        this.eventListener = new EventListener(this.worker);
        this.eventListener.init();

        this.handleParticlesNumberRange();
    }

    handleParticlesNumberRange() {
        
        this.particlesRangeSlider = document.getElementById("particles-number-range");
        this.particlesNumberOutput = document.getElementById("particles-number");
        this.particlesRangeSlider.value = opts.NUMBER_OF_PARTICLES;
        this.particlesNumberOutput.innerHTML = this.particlesRangeSlider.value;
        this.particlesRangeSlider.oninput = () => {
            this.particlesNumberOutput.innerHTML = this.particlesRangeSlider.value;
            this.worker.postMessage({
                type: 'numberOfParticlesChange',
                numberOfParticles: this.particlesRangeSlider.value
            });
        };
    }
}

// Export opts to expose it to wasm_bindgen
export function getOpts() {
    return opts;
}

self.getOpts = getOpts;


