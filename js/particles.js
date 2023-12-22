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
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radiusX = canvas.width * 0.3; 
        const radiusY = canvas.height * 0.3; 

        for (let i = 0; i < NUMBER_OF_PARTICLES; i++) {
            const theta = Math.random() * 2 * Math.PI;
            const x = centerX + radiusX * Math.cos(theta);
            const y = centerY + radiusY * Math.sin(theta);
            const speedX = Math.random();
            const speedY = Math.random();
            const dirX = Math.random() > 0.5 ? 1 : -1;
            const dirY = Math.random() > 0.5 ? 1 : -1;
            const size = Math.random() * (2.5 - 0.6) + 0.6;
            const color = getRandomParticleColor();
            const flickering = getRandomFlickering();
        
            particles.push({
                x, y, size, color, flickering,
                speedX: dirX * speedX,
                speedY: dirY * speedY,
                neighbors: [],
                active: false,
                activateTimer: function() {
                    this.active = true;
                    setTimeout(() => {
                        this.active = false;
                    }, PARTICLE_ACTIVE_DELAY);
                },
            });
        }

        // sort particles from smallest to biggest
        particles.sort(function(a, b) {return a.size - b.size;});
        // Start animation
        requestAnimationFrame(anim);
    }

    // Returns RGB values for the color of each particle
    function getRandomParticleColor() {
        var chance = Math.random();
        if (chance < 0.80) {
            // 80% chance of white
            return 'rgb(255, 255, 255)';
        } else if (chance < 0.90) {
            // 10% chance of 'rgb(248, 155, 73)'
            return 'rgb(248, 155, 73)';
        } else {
            // 10% chance of 'rgb(72, 217, 247)'
            return 'rgb(72, 217, 247)';
        }
    }

    // Draw particles
    function drawParticles() {
        particles.forEach(particle => {
            let x = particle.x + particle.speedX;
            let y = particle.y + particle.speedY;
            if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
                x = Math.floor(Math.random() * canvas.width);
                y = Math.floor(Math.random() * canvas.height);
            }

            ctx.beginPath();
            ctx.fillStyle = particle.color;
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            particle.x = x;
            particle.y = y;
        });
    }

    // 80% chance of having a flickering particle
    function getRandomFlickering() {
        var chance = Math.random();

        return chance > 0.80 ? Math.random() : 0.0;
    }

    // Adjust the brightness of a particle
    function adjustBrightness(rgb, percent) {
        var color = rgb.match(/\d+/g).map(Number);
        for (var i = 0; i < color.length; i++) {
            color[i] = color[i] * (1 + percent);
            color[i] = Math.max(0, Math.min(255, color[i]));
        }
        return 'rgb(' + color.join(', ') + ')';
    }

      // Calculate distance between two points
      function getDist(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    function anim() {
        requestAnimationFrame(anim);

        // draw base canvas rectangle
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // draw connections and lights
        // ctx.globalCompositeOperation = 'lighter';
        // ctx.beginPath();
        // all.map( function( item ){ item.step(); } );
        // ctx.stroke();

        // draw particles
        ctx.globalCompositeOperation = 'source-over';
        drawParticles();
        
    }
}