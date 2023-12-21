export function initParticles() {
  const canvas = document.querySelector("canvas");
  document.body.style.height = "100vh";
  canvas.height = document.body.clientHeight;
  canvas.width = document.body.clientWidth;

  const ctx = canvas.getContext("2d");
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "rgba(255,255,255,0.1)";

  const particles = [];
  const impulses = [];

  const NUMBER_OF_PARTICLES = 200;
  const IMPULSE_SPEED = 10;
  const IMPULSE_DIST_AUTONOMY = 800;
  const MAX_DIST = 200;
  const MIN_DIST = 25;
  const PARTICLE_ACTIVE_DELAY = 1000;

  function getDist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

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
          x,
          y,
          size,
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

  function sortNeighbors() {
    setInterval(() => {
      const copy = [...particles];
      for (let i = 0; i < particles.length; i++) {
        const x = particles[i].x;
        const y = particles[i].y;
      
        copy.sort((a, b) => {
          const x1 = a.x;
          const x2 = b.x;
          const y1 = a.y;
          const y2 = b.y;
          const dist1 = getDist(x, y, x1, y1);
          const dist2 = getDist(x, y, x2, y2);
          return dist1 - dist2;
        });
      
        particles[i].neighbors = copy.slice(1, 10);
      }
    }, 250);
  }

  function newImpulse(particle, origin) {
    const neighbors = particle.neighbors;

    for (let i = 0; i < neighbors.length; i++) {
      const x = particle.x;
      const y = particle.y;
      const neighbor = neighbors[i];
      const dist = getDist(x, y, neighbor.x, neighbor.y);

      if (dist < MAX_DIST && neighbor != origin) {
        impulses.push({
          particle: particle,
          x: particle.x,
          y: particle.y,
          target: neighbor,
          speed: IMPULSE_SPEED,
          distAutonomy: IMPULSE_DIST_AUTONOMY,
        })
        break;
      }
    }
  }

  function updateImpulsePosition(impulse, target) {
    // Calculer le vecteur de déplacement
    let dx = target.x - impulse.x;
    let dy = target.y - impulse.y;

    // Normaliser le vecteur
    let length = Math.sqrt(dx * dx + dy * dy);
    dx /= length;
    dy /= length;

    // Appliquer la vitesse
    impulse.x += dx * impulse.speed;
    impulse.y += dy * impulse.speed;

    impulse.distAutonomy -= 10;
  }

  function getNextNeighbor(origin, particle) {
    const neighbors = particle.neighbors;

    for (let i = 0; i < neighbors.length; i++) {
      const x = particle.x;
      const y = particle.y;
      const neighbor = neighbors[i];
      const dist = getDist(x, y, neighbor.x, neighbor.y);

      if (dist < MAX_DIST && neighbor != origin && neighbor.active === false) {
        neighbor.activateTimer();
        return neighbor;
      }
    } 
    return null;
  }

  function drawImpulses() {
    for (let i = 0; i < impulses.length; i++) {
      const x = impulses[i].x;
      const y = impulses[i].y;
      const target = impulses[i].target;

      if (target === null)
        continue;

      if (impulses[i].distAutonomy <= 0) {
        impulses.splice(i, 1);
        continue;
      }
      if (getDist(x, y, target.x, target.y) < 5) {
        impulses[i].particle = target;
        impulses[i].target = getNextNeighbor(impulses[i], target);
        continue;
      }

      ctx.moveTo(x, y);
      ctx.arc(x, y, 1.0, 0, Math.PI * 2);

      updateImpulsePosition(impulses[i], impulses[i].target);
    }
    ctx.fill();
  }

  function drawNeighborsLinks() { 
    for (let i = 0; i < particles.length; i++) {
      const x = particles[i].x;
      const y = particles[i].y;
      const neighbors = particles[i].neighbors;
      for (let j = 0; j < neighbors.length; j++) {
        const x1 = neighbors[j].x;
        const y1 = neighbors[j].y;
        const dist = getDist(x, y, x1, y1);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x1, y1);
          ctx.globalAlpha = 1.2 - dist / 200;
          ctx.stroke();

          ctx.globalAlpha = 1.0;
        }
      }
    }
  }

  function drawParticles() {
    for (let i = 0; i < particles.length; i++) {
      let x = particles[i].x + particles[i].speedX;
      let y = particles[i].y + particles[i].speedY;
      let size = particles[i].size;
      if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
        x = Math.floor(Math.random() * canvas.width);
        y = Math.floor(Math.random() * canvas.height);
      }

      const x1 = mouseX || 2000;
      const y1 = mouseY || 2000;
      const dist = getDist(x, y, x1, y1);
      if (dist < MIN_DIST && particles[i].active === false) {
        particles[i].activateTimer();
        newImpulse(particles[i], null);
      }

      ctx.moveTo(x, y);
      ctx.arc(x, y, size, 0, Math.PI * 2);
      particles[i].x = x;
      particles[i].y = y;
    }
    ctx.fill();
  }

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

  let mouseX;
  let mouseY;

  canvas.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    setTimeout(() => {
      if (mouseX === e.clientX && mouseY === e.clientY) {
        for (let i = 0; i < particles.length; i++) {
          let x = particles[i].x;
          let y = particles[i].y;
          const x1 = e.clientX;
          const y1 = e.clientY;
          const dist = getDist(x, y, x1, y1);

          if (dist < MIN_DIST && particles[i].active === false) {
            particles[i].activateTimer();
            newImpulse(particles[i], null);
          }
          particles[i].x = x;
          particles[i].y = y;
        }
      }
    }, 10);
  });

  sortNeighbors();
}
