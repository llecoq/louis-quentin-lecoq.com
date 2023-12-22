import Particle from "./objs/Particle.js";
import Data from "./objs/Data.js";

export function particles() {
    const canvas = document.querySelector("canvas");
    document.body.style.height = "100vh";
    canvas.height = document.body.clientHeight;
    canvas.width = document.body.clientWidth;

    const ctx = canvas.getContext("2d");

    const NUMBER_OF_PARTICLES = 200;
    const PARTICLE_ACTIVE_DELAY = 1000;
    const MAX_DIST = 200;

    // Connections style
    const CONNECTIONS_STROKE_STYLE = 'rgba(255, 255, 255, 0.3)';
    const CONNECTIONS_LINE_WIDTH = 0.3;
    const MAX_CONNECTIONS = 10;

    const particles = [];
    const connections = [];
    const data = [];
    let mouseX;
    let mouseY;

    init();
    sortNeighbors();

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

    // Sort neighbors based on distance
    function sortNeighbors() {
        setInterval(() => {
            particles.forEach(particle => {
                const sorted = [...particles].sort((a, b) => getDist(particle.x, particle.y, a.x, a.y) - getDist(particle.x, particle.y, b.x, b.y));
                particle.setNeighbors(sorted.slice(0, MAX_CONNECTIONS));
            });
        }, 250);
    }

    // Draw connections between neighbors
    function drawConnections() {
        ctx.strokeStyle = CONNECTIONS_STROKE_STYLE;
        ctx.lineWidth = CONNECTIONS_LINE_WIDTH;

        particles.forEach(particle => {
            particle.neighbors.forEach(neighbor => {
                const dist = getDist(particle.x, particle.y, neighbor.x, neighbor.y);
                
                // draw connections between particles
                if (dist < MAX_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(neighbor.x, neighbor.y);
                    ctx.globalAlpha = 1.2 - dist / MAX_DIST;
                    ctx.stroke();
                }
  
                // draw connections with mouse
                const distToMouse = getDist(particle.x, particle.y, mouseX || 2000, mouseY || 2000);
                if (distToMouse < MAX_DIST) {
                  ctx.beginPath();
                  ctx.moveTo(particle.x, particle.y);
                  ctx.lineTo(mouseX, mouseY);
                  ctx.globalAlpha = 0.1;
                  ctx.stroke();
                }
            });
        });
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
        drawConnections();

        // draw particles
        ctx.globalCompositeOperation = 'source-over';
        particles.forEach(particle => particle.draw(ctx));
        ctx.globalAlpha = 1.0;

        
    }

      // Mousemove event listener
      canvas.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
}