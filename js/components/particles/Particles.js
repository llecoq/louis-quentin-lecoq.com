import EventListener from './EventListener.js'

export const opts = {
    SHOOTING_STARS: false,
    NUMBER_OF_WEB_WORKERS: 4,

    // Particles
    NUMBER_OF_PARTICLES: 750, // Do not exceed MAX_NUMBER_OF_PARTICLES
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
    workersRangeSlider
    workersNumberOutput    
    connectionDistanceRangeSlider
    connectionDistanceOutput    

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
        this.handleWorkersNumberRange();
        this.handleConnectionMaxDistanceRange();
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

    handleWorkersNumberRange() {
        this.workersRangeSlider = document.getElementById("workers-number-range");
        this.workersNumberOutput = document.getElementById("workers-number");
        this.workersRangeSlider.value = opts.NUMBER_OF_WEB_WORKERS;
        this.workersNumberOutput.innerHTML = this.workersRangeSlider.value;
        this.workersRangeSlider.oninput = () => {
            this.workersNumberOutput.innerHTML = this.workersRangeSlider.value;
            this.worker.postMessage({
                type: 'numberOfWorkersChange',
                numberOfWorkers: this.workersRangeSlider.value
            });
        };
    }

    handleConnectionMaxDistanceRange() {
        this.connectionDistanceRangeSlider = document.getElementById("connection-max-distance-range");
        this.connectionDistanceOutput = document.getElementById("connection-max-distance");
        this.connectionDistanceRangeSlider.value = opts.CONNECTION_MAX_DIST;
        this.connectionDistanceOutput.innerHTML = this.connectionDistanceRangeSlider.value;
        this.connectionDistanceRangeSlider.oninput = () => {
            this.connectionDistanceOutput.innerHTML = this.connectionDistanceRangeSlider.value;
            this.worker.postMessage({
                type: 'connectionMaxDistChange',
                connectionMaxDist: this.connectionDistanceRangeSlider.value
            });
        };
    }
}

// Export opts to expose it to wasm_bindgen
export function getOpts() {
    return opts;
}

self.getOpts = getOpts;


