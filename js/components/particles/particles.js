import Particle from "./objs/Particle.js";

export function particles() {
    const canvas = document.querySelector("canvas");
    document.body.style.height = "100vh";
    canvas.height = document.body.clientHeight;
    canvas.width = document.body.clientWidth;

    const ctx = canvas.getContext("2d");

    const NUMBER_OF_PARTICLES = 200;
    const PARTICLE_ACTIVE_DELAY = 1000;

    const particles = []
    const connections = []
    const data = []

    init();

    // Initialize particles
    function init() {
        for (let i = 0; i < NUMBER_OF_PARTICLES; i++) {
            particles.push(new Particle(canvas, ctx))
        }
        // sort particles from smallest to biggest
        particles.sort(function(a, b) {return a.size - b.size;});
        // Start animation
        requestAnimationFrame(anim);
    }

    // Calculate distance between two points
    function getDist(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    // Animate the particles
    function anim() {
        requestAnimationFrame(anim);

        // draw base canvas rectangle
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // draw connections and lights
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath();
        // all.map( function( item ){ item.step(); } );
        ctx.stroke();

        // draw particles
        ctx.globalCompositeOperation = 'source-over';
        particles.forEach(particle => particle.draw());
        
    }
}