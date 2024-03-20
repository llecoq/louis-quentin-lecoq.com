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
    PARTICLE_COLOR_4: 'rgb(72, 163, 247)',
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

// Export opts to expose it to wasm_bindgen
export function getOpts() {
    return opts;
}

self.getOpts = getOpts;