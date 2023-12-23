import Particle from "./objs/Particle.js";
import Impulse from "./objs/Impulse.js";

export const opts = {
    NUMBER_OF_PARTICLES: 200,
    MAX_DIST: 200,

    // Connections style
    CONNECTIONS_STROKE_STYLE: 'rgba(72, 217, 247, 0.5)',
    CONNECTIONS_LINE_WIDTH: 0.5,
    MAX_CONNECTIONS: 10,

    IMPULSE_DIST_AUTONOMY: 10000,
    IMPULSE_SPEED: 20,
    IMPULSE_SPEED_OFFSET: 0,
    IMPULSE_SIZE: 1.5,
    MAX_IMPULSES: 5,

    // Particles
    PARTICLE_MAX_SIZE: 2.5,
    PARTICLE_MIN_SIZE: 0.6,
    PARTICLE_ACTIVE_DELAY: 1000,
    PARTICLE_COLOR_1: 'rgb(255, 255, 255)',
    PARTICLE_COLOR_2: 'rgb(72, 217, 247)',
    PARTICLE_COLOR_3: 'rgb(50, 130, 240)',

}

export function particles() {
    const canvas = document.querySelector("canvas");
    document.body.style.height = "100vh";
    canvas.height = document.body.clientHeight;
    canvas.width = document.body.clientWidth;

    const ctx = canvas.getContext("2d");

    const particles = [];
    const impulses = [];
    let mouseX;
    let mouseY;

    init();
    sortNeighbors();

    // Initialize particles
    function init() {
        for (let i = 0; i < opts.NUMBER_OF_PARTICLES; i++) {
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

    // Sort neighbors based on distance
    function sortNeighbors() {
        setInterval(() => {
            particles.forEach(particle => {
                const sorted = [...particles].sort((a, b) => getDist(particle.x, particle.y, a.x, a.y) - getDist(particle.x, particle.y, b.x, b.y));
                particle.setNeighbors(sorted.slice(0, opts.MAX_CONNECTIONS));
            });
        }, 250);
    }

    // Draw connections between neighbors
    function drawConnections() {
        ctx.strokeStyle = opts.CONNECTIONS_STROKE_STYLE;
        ctx.lineWidth = opts.CONNECTIONS_LINE_WIDTH;

        particles.forEach(particle => {
            particle.neighbors.forEach(neighbor => {
                const dist = getDist(particle.x, particle.y, neighbor.x, neighbor.y);
                
                // draw connections between particles
                if (dist < opts.MAX_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(neighbor.x, neighbor.y);
                    ctx.globalAlpha = 1.2 - dist / opts.MAX_DIST;
                    ctx.stroke();
                }
  
                // draw connections with mouse
                const distToMouse = getDist(particle.x, particle.y, mouseX, mouseY);
                if (distToMouse < opts.MAX_DIST) {
                  ctx.beginPath();
                  ctx.moveTo(particle.x, particle.y);
                  ctx.lineTo(mouseX, mouseY);
                  ctx.globalAlpha = 0.1;
                  ctx.stroke();
                }
            });
        });
    }
    
    // Get next neighbor for impulse
    function getNextNeighbor(origin, particle) {
        return particle.neighbors.find(neighbor => getDist(particle.x, particle.y, neighbor.x, neighbor.y) < opts.MAX_DIST && neighbor !== origin && !neighbor.active);
    }

    // Create impulses
    function createImpulse() {
        particles.forEach(particle => {
            const distToMouse = getDist(particle.x, particle.y, mouseX, mouseY);
            if (distToMouse < opts.MAX_DIST && !particle.active && impulses.length < opts.MAX_IMPULSES) {
                particle.activateTimer();
                
                const neighbor = particle.neighbors.find(n => getDist(mouseX, mouseY, particle.x, particle.y) < opts.MAX_DIST);
                if (neighbor) {
                    impulses.push(new Impulse(mouseX, mouseY, particle, neighbor));
                }
            }
        })
    }

    // Draw impulses
    function drawImpulses() {
        ctx.globalAlpha = 1.0;

        impulses.forEach((impulse, index) => {
            if (impulse.distAutonomy <= 0 || !impulse.target) {
                impulses.splice(index, 1);
                return;
            }

            if (getDist(impulse.x, impulse.y, impulse.target.x, impulse.target.y) < 10) {
                const nextTarget = getNextNeighbor(impulse.particle, impulse.target);
                if (nextTarget) {
                    impulse.particle = impulse.target;
                    impulse.target = nextTarget;
                    nextTarget.activateTimer();
                } else {
                    impulses.splice(index, 1);
                    return;
                }
            }

            impulse.draw(ctx);
        });
    }

    // Animate the particles
    function anim() {
        requestAnimationFrame(anim);

        // draw base canvas rectangle
        ctx.globalCompositeOperation = 'source-over';
        // ctx.fillStyle = "rgba(0,0,0,0.5)";
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw connections and lights
        ctx.globalCompositeOperation = 'lighter';
        drawConnections();
        createImpulse();
        drawImpulses();


        // draw particles
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'source-over';
        particles.forEach(particle => particle.draw(ctx));
        
    }

      // Mousemove event listener
      canvas.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
}