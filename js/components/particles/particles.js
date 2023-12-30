import AnimationController from "./particlesJS/objs/AnimationControllerJS.js";
import EventListener from "./particlesJS/objs/EventListenerJS.js";

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

export function particles() {
    const canvas = document.querySelector("canvas");
    document.body.style.height = "100vh";
    canvas.height = document.body.clientHeight;
    canvas.width = document.body.clientWidth;

    const ctx = canvas.getContext("2d");
    const animationController = new AnimationController(ctx);
    const eventListener = new EventListener(animationController, canvas);

    animationController.init();
    eventListener.init();
}