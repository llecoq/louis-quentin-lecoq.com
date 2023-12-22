import Particle from "./objs/Particle.js";
// import Data from "./objs/Data.js";

export function particles() {
    const canvas = document.querySelector("canvas");
    document.body.style.height = "100vh";
    canvas.height = document.body.clientHeight;
    canvas.width = document.body.clientWidth;

    const ctx = canvas.getContext("2d");

    const NUMBER_OF_PARTICLES = 200;
    const MAX_DIST = 200;

    // Connections style
    const CONNECTIONS_STROKE_STYLE = 'rgba(72, 217, 247, 0.2)';
    const CONNECTIONS_LINE_WIDTH = 0.5;
    const MAX_CONNECTIONS = 10;

    const IMPULSE_DIST_AUTONOMY = 10000;
    const IMPULSE_SPEED = 20;
    const IMPULSE_SPEED_OFFSET = 0;
    const IMPULSE_SIZE = 1;
    const MAX_IMPULSES = 5;

    const particles = [];
    const impulses = [];
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

    // Create a new impulse
    function newImpulse(x, y, particle) {
        const neighbor = particle.neighbors.find(n => getDist(x, y, n.x, n.y) < MAX_DIST);
        if (neighbor) {
            impulses.push({
                particle,
                x: x,
                y: y,
                target: neighbor,
                speed: Math.random() * IMPULSE_SPEED + IMPULSE_SPEED_OFFSET,
                distAutonomy: IMPULSE_DIST_AUTONOMY,
            });
        }
    }

    // Update impulse position
    function updateImpulsePosition(impulse, target) {
        let dx = target.x - impulse.x;
        let dy = target.y - impulse.y;
        let length = Math.sqrt(dx * dx + dy * dy);
        dx /= length;
        dy /= length;

        impulse.x += dx * impulse.speed;
        impulse.y += dy * impulse.speed;
        impulse.distAutonomy -= 10;
    }
    
    // Get next neighbor for impulse
    function getNextNeighbor(origin, particle) {
        return particle.neighbors.find(neighbor => getDist(particle.x, particle.y, neighbor.x, neighbor.y) < MAX_DIST && neighbor !== origin && !neighbor.active);
    }

    // Draw impulses
    function drawImpulses() {
        impulses.forEach((impulse, index) => {
            if (impulse.distAutonomy <= 0 || !impulse.target) {
                impulses.splice(index, 1);
                return;
            }

            if (getDist(impulse.x, impulse.y, impulse.target.x, impulse.target.y) < 5) {
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

            updateImpulsePosition(impulse, impulse.target);
            ctx.beginPath();
            ctx.strokeStyle = 'rgb(72, 217, 247)';
            ctx.lineWidth = IMPULSE_SIZE;
            ctx.moveTo( impulse.x, impulse.y );
            updateImpulsePosition(impulse, impulse.target);
            updateImpulsePosition(impulse, impulse.target);
            updateImpulsePosition(impulse, impulse.target);
            updateImpulsePosition(impulse, impulse.target);
            updateImpulsePosition(impulse, impulse.target);
            updateImpulsePosition(impulse, impulse.target);
            updateImpulsePosition(impulse, impulse.target);
            updateImpulsePosition(impulse, impulse.target);
            ctx.lineTo( impulse.x, impulse.y );
            ctx.stroke();

            // ctx.beginPath();
            // ctx.fillStyle = 'rgb(72, 217, 247)';
            // ctx.arc(impulse.x, impulse.y, IMPULSE_SIZE, 0, Math.PI * 2);
            // ctx.fill();
        });
    }


    function getRandomRedToOrangeColor() {
        // Rouge pur : (255, 0, 0)
        // Orange : (255, 165, 0)
        // Interpoler uniquement la composante verte
        const green = Math.floor(Math.random() * 166); // De 0 à 165
    
        return `rgb(255, ${green}, 0)`;
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
        particles.forEach(particle => {
            const distToMouse = getDist(particle.x, particle.y, mouseX, mouseY);
            if (distToMouse < MAX_DIST && !particle.active && impulses.length < MAX_IMPULSES) {
                particle.activateTimer();
                newImpulse(mouseX, mouseY, particle);
            }
        })
        ctx.globalAlpha = 1.0;
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