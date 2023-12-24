import Particle from "./objs/Particle.js";

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
    MAX_CONNECTIONS: 10,

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
    const particles = [];
    const impulses = [];
    let mouseX;
    let mouseY;
    let lastTimestamp = 0;
    let mouseIsOverCanvas = false;
    let animationIsActive = false;
    let animationFrameId;
    let sortNeighborsId;

    // Initialize particles
    function init() {
        // create and push particles
        for (let i = 0; i < opts.NUMBER_OF_PARTICLES; i++) {
            particles.push(new Particle(canvas, ctx))
        }
        // sort particles from smallest to biggest
        particles.sort(function(a, b) {return a.size - b.size;});

        // Start animation
        animationIsActive = true;
        animationFrameId = requestAnimationFrame(anim);
    }

    // Sort neighbors based on distance
    function sortNeighbors() {
        return setInterval(() => {
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
            particle.drawConnections(ctx, mouseX, mouseY, mouseIsOverCanvas);
        });
    }

    // Create impulses
    function createImpulses() {
        particles.forEach(particle => {
            if (particle.canCreateImpulse(mouseX, mouseY, impulses.length)) {
                const impulse = particle.createImpulse(mouseX, mouseY);
                if (impulse) impulses.push(impulse);
            }
        });
    }

    // Draw impulses
    function drawImpulses(delta) {
        ctx.globalAlpha = 1.0;

        impulses.forEach((impulse, index) => {
            if (impulse.isExpired() || impulse.move(impulses) === false) {
                impulses.splice(index, 1);
                return;
            }
            if (impulse.draw(ctx, delta) === false)
                impulses.splice(index, 1);
        });
    }

    // Animate the particles
    function anim(timestamp) {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const delta = timestamp - lastTimestamp;
        const scaleFPS = delta / opts.BASE_DELTA;

        // clear canvas rectangle
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // draw connections and lights
        ctx.globalCompositeOperation = 'lighter';
        drawConnections();
        if (mouseIsOverCanvas) createImpulses();
        drawImpulses(scaleFPS);
        
        // draw particles
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'source-over';
        particles.forEach(particle => particle.draw(ctx, scaleFPS));

        lastTimestamp = timestamp;
        animationFrameId = requestAnimationFrame(anim);
    }

    //------------------------------------------ Mouse event listeners
    canvas.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    canvas.addEventListener("mouseenter", () => {
        mouseIsOverCanvas = true;
    });

    canvas.addEventListener("mouseleave", () => {
        mouseIsOverCanvas = false;
    });

    // Stop animation if the viewer's tab is not active
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            startAnimation();
        } else {
            stopAnimation();
        }
    });    

    // Start Animation
    function startAnimation() {
        if (animationIsActive === false) {
            animationIsActive = true;
            lastTimestamp = 0;
            animationFrameId = requestAnimationFrame(anim);
            sortNeighborsId = sortNeighbors();
        }
    }

    // Stop Animation
    function stopAnimation() {
        if (animationIsActive === true) {
            animationIsActive = false;
            cancelAnimationFrame(animationFrameId);
            clearInterval(sortNeighborsId);
        }
    }

    // Check if the obsever is viewing the canvas or not    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Canvas is in the viewport
                startAnimation();
            } else {
                // Canvas is not in the viewport
                stopAnimation();
            }
        });
    }, { threshold: 0.0 }); // Adjust threshold as needed
    
    init();
    sortNeighborsId = sortNeighbors();
    observer.observe(canvas);
}

// Calculate distance between two points
export function getDist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}