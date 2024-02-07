import EventListener from './EventListener.js'

export const opts = {
    SHOOTING_STARS: false,
    WEB_WORKERS: 4,

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

    eventListener
    
    init() {
        document.body.style.height = "100vh";
        // Creation of an OffscreenCanvas
        const offscreen = document.querySelector('canvas').transferControlToOffscreen();
        // Creation of a new module Worker
        const worker = new Worker('js/components/particles/AnimationController.js', {
            type: 'module'
        });
        offscreen.height = document.body.clientHeight;
        offscreen.width = document.body.clientWidth;
        // Sending the context to the worker
        worker.postMessage({
            type: 'initAnimation',
            canvas: offscreen
        }, [offscreen]);
    
        // // EventListener
        this.eventListener = new EventListener(worker);
        this.eventListener.init();
    }
}

// Export opts to expose it to wasm_bindgen
export function getOpts() {
    return opts;
}

self.getOpts = getOpts;