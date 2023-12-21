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
  const IMPULSE_DIST_AUTONOMY = 800;
  const MAX_DIST = 200;
  const MIN_DIST = 25;
  const PARTICLE_ACTIVE_DELAY = 1000;
  let mouseX;
  let mouseY;

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
  function newImpulse(particle, origin) {
      const neighbor = particle.neighbors.find(n => getDist(particle.x, particle.y, n.x, n.y) < MAX_DIST && n !== origin);
      if (neighbor) {
          impulses.push({
              particle,
              x: particle.x,
              y: particle.y,
              target: neighbor,
              speed: Math.random() * 10 + 5,
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

          ctx.beginPath();
          ctx.arc(impulse.x, impulse.y, 1.0, 0, Math.PI * 2);
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
              if (getDist(mouseX, mouseY, particle.x, particle.y) < MAX_DIST) {
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
          if (distToMouse < MIN_DIST && !particle.active) {
              particle.activateTimer();
              newImpulse(particle, null);
          }

          ctx.beginPath();
          ctx.arc(x, y, particle.size, 0, Math.PI * 2);
          particle.x = x;
          particle.y = y;
          ctx.fill();
      });
  }

  // Main draw function
  function draw() {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#FFFFFF";

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
