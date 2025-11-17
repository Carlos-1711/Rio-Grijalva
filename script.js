const canvas = document.getElementById('water-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = document.querySelector('.hero').offsetWidth;
  canvas.height = document.querySelector('.hero').offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let particlesArray = [];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 3 + 1;
    this.speedY = Math.random() * 1 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.2;
  }
  update() {
    this.y -= this.speedY;
    if (this.y < 0) {
      this.y = canvas.height;
      this.x = Math.random() * canvas.width;
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  particlesArray = [];
  for (let i = 0; i < 150; i++) {
    particlesArray.push(new Particle());
  }
}
initParticles();

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();
