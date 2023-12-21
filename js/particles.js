export function initParticles() {
  const canvas = document.querySelector("canvas");
  document.body.style.height = "100vh";
  canvas.height = document.body.clientHeight;
  canvas.width = document.body.clientWidth;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "rgba(255,255,255,0.2)";

  const particles = [];
  const impulses = [];

  const NUMBER_OF_PARTICLES = 200;
  const IMPULSE_DIST_AUTONOMY = 1000;
  const IMPULSE_SPEED = 10;
  const IMPULSE_SPEED_OFFSET = 2;
  const MAX_DIST = 200;
  const PARTICLE_ACTIVE_DELAY = 1000;
  const MAX_ACTIVE_IMPULSES = 15;
  
  let mouseX;
  let mouseY;
  let activeImpulses = 0;

  // Calculate distance between two points
  function getDist(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

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
        
          particles.push({
              x, y, size,
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
      requestAnimationFrame(draw);
  }

  // Sort neighbors based on distance
  function sortNeighbors() {
      setInterval(() => {
          particles.forEach(particle => {
              const sorted = [...particles].sort((a, b) => getDist(particle.x, particle.y, a.x, a.y) - getDist(particle.x, particle.y, b.x, b.y));
              particle.neighbors = sorted.slice(0, 10);
          });
      }, 250);
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
              activeImpulses--;
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
                  activeImpulses--;
                  return;
              }
          }

          ctx.beginPath();
          ctx.fillStyle = getRandomRedToOrangeColor();
          ctx.arc(impulse.x, impulse.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
          updateImpulsePosition(impulse, impulse.target);
      });
  }

  // Draw links between neighbors
  function drawNeighborsLinks() {
      particles.forEach(particle => {
          particle.neighbors.forEach(neighbor => {
              const dist = getDist(particle.x, particle.y, neighbor.x, neighbor.y);
              if (dist < MAX_DIST) {
                  ctx.beginPath();
                  ctx.moveTo(particle.x, particle.y);
                  ctx.lineTo(neighbor.x, neighbor.y);
                  ctx.globalAlpha = 1.2 - dist / MAX_DIST;
                  ctx.stroke();
              }

              // draw link with mouse
              const distToMouse = getDist(particle.x, particle.y, mouseX || 2000, mouseY || 2000);
              if (distToMouse < MAX_DIST) {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(mouseX, mouseY);
                ctx.globalAlpha = 0.1;
                ctx.stroke();
              }

              // Reset globalAlpha
              ctx.globalAlpha = 1.0;
          });
      });
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

          const distToMouse = getDist(x, y, mouseX || 2000, mouseY || 2000);
          if (distToMouse < MAX_DIST && !particle.active && activeImpulses <= MAX_ACTIVE_IMPULSES) {
              particle.activateTimer();
              newImpulse(mouseX, mouseY, particle);
              activeImpulses++;
          }

          ctx.beginPath();
          ctx.fillStyle = "#FFFFF";
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          particle.x = x;
          particle.y = y;
      });
  }

  function getColor(time, frequency, phaseShift) {
    const red = Math.round(Math.sin(frequency * time + phaseShift) * 127.5 + 127.5);
    const green = Math.round(Math.sin(frequency * time + 2 * phaseShift) * 127.5 + 127.5);
    const blue = Math.round(Math.sin(frequency * time + 4 * phaseShift) * 127.5 + 127.5);
    return `rgb(${red}, ${green}, ${blue})`;
  }

  function getRandomRedToVioletColor() {
    // Rouge : (255, 0, 0)
    // Violet : (128, 0, 128)
    // Interpoler entre les composantes rouge et bleu
    const red = Math.floor(Math.random() * (255 - 128 + 1)) + 128; // De 128 à 255
    const blue = red; // Pour le violet, les composantes rouge et bleue sont égales

    return `rgb(${red}, 0, ${blue})`;
  }

  function getRandomRedToOrangeColor() {
    // Rouge pur : (255, 0, 0)
    // Orange : (255, 165, 0)
    // Interpoler uniquement la composante verte
    const green = Math.floor(Math.random() * 166); // De 0 à 165

    return `rgb(255, ${green}, 0)`;
  }

  // Main draw function
  function draw() {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // ctx.fillStyle = "#FFFFFF";

      drawParticles();
      drawNeighborsLinks();
      drawImpulses();
      requestAnimationFrame(draw);
  }

  init();
  sortNeighbors();

  // Mousemove event listener
  canvas.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
  });
}
