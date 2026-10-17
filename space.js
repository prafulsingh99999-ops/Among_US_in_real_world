/**
 * LIVE SPACE CANVAS ENGINE
 * SPARK - IIIT Bhopal 2026
 * 
 * Features:
 * - 300+ multi-layer parallax stars responding to cursor movement
 * - Twinkling star glow & brightness pulsing
 * - Periodic shooting stars / meteors with glowing trails
 * - Deep space nebula dust clouds
 * - Tumbling ejected astronauts in the background
 * - Warp-speed hyperspace acceleration effect
 */

class SpaceEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Mouse Parallax coordinates
    this.mouseX = this.width / 2;
    this.mouseY = this.height / 2;
    this.targetMouseX = this.mouseX;
    this.targetMouseY = this.mouseY;

    // Stars collection
    this.stars = [];
    this.starCount = 280;

    // Shooting stars
    this.shootingStars = [];

    // Background drifting crewmates
    this.floatingCrewmates = [];

    // Nebula particles
    this.nebulas = [];

    // Warp mode
    this.isWarping = false;
    this.warpFactor = 1.0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse movement listener for smooth parallax
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = e.clientX;
      this.targetMouseY = e.clientY;
    });

    // Touch support for mobile parallax
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.targetMouseX = e.touches[0].clientX;
        this.targetMouseY = e.touches[0].clientY;
      }
    });

    // Generate stars
    this.generateStars();
    this.generateNebulas();
    this.spawnFloatingCrewmates();

    // Loop
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.render(t));

    // Periodic shooting stars
    setInterval(() => {
      if (Math.random() > 0.4 && this.shootingStars.length < 3) {
        this.spawnShootingStar();
      }
    }, 2800);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  generateStars() {
    this.stars = [];
    const colors = ['#ffffff', '#e0f2fe', '#fef08a', '#fed7aa', '#fbcfe8', '#a7f3d0'];

    for (let i = 0; i < this.starCount; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        z: Math.random() * 3 + 0.5, // Depth layer (0.5 = far, 3.5 = close)
        radius: Math.random() * 1.8 + 0.4,
        baseAlpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.05 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  generateNebulas() {
    this.nebulas = [
      { x: this.width * 0.2, y: this.height * 0.3, radius: 320, color: 'rgba(239, 68, 68, 0.07)' }, // Red
      { x: this.width * 0.8, y: this.height * 0.4, radius: 380, color: 'rgba(6, 182, 212, 0.08)' }, // Cyan
      { x: this.width * 0.5, y: this.height * 0.8, radius: 450, color: 'rgba(147, 51, 234, 0.07)' }, // Purple
      { x: this.width * 0.85, y: this.height * 0.85, radius: 300, color: 'rgba(245, 158, 11, 0.06)' } // Amber
    ];
  }

  spawnShootingStar() {
    const startX = Math.random() * this.width * 0.9;
    const startY = Math.random() * (this.height * 0.4);
    const length = Math.random() * 120 + 80;
    const angle = (Math.PI / 4) + (Math.random() * 0.3 - 0.15); // ~45 degrees downward
    const speed = Math.random() * 12 + 15;

    this.shootingStars.push({
      x: startX,
      y: startY,
      len: length,
      speed: speed,
      angle: angle,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
      decay: Math.random() * 0.02 + 0.015,
      color: Math.random() > 0.5 ? '#38FEDC' : '#ffffff'
    });
  }

  spawnFloatingCrewmates() {
    // 2 mini deep space tumbling astronauts
    this.floatingCrewmates = [
      {
        x: -50,
        y: this.height * 0.25,
        speedX: 0.35,
        speedY: 0.12,
        rotation: 0,
        rotationSpeed: 0.008,
        color: '#C51111', // Red
        scale: 0.32,
        opacity: 0.65
      },
      {
        x: this.width + 50,
        y: this.height * 0.7,
        speedX: -0.28,
        speedY: -0.08,
        rotation: 0,
        rotationSpeed: -0.006,
        color: '#38FEDC', // Cyan
        scale: 0.25,
        opacity: 0.5
      }
    ];
  }

  triggerWarp(duration = 2000) {
    this.isWarping = true;
    setTimeout(() => {
      this.isWarping = false;
    }, duration);
  }

  render(currentTime) {
    const delta = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Smooth mouse interpolation
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.04;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.04;

    const offsetX = (this.mouseX - this.width / 2) * 0.03;
    const offsetY = (this.mouseY - this.height / 2) * 0.03;

    // Clear with dark space void
    this.ctx.fillStyle = '#030712';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 1. Draw Nebula Clouds
    this.nebulas.forEach(nebula => {
      const grad = this.ctx.createRadialGradient(
        nebula.x - offsetX * 0.5,
        nebula.y - offsetY * 0.5,
        0,
        nebula.x - offsetX * 0.5,
        nebula.y - offsetY * 0.5,
        nebula.radius
      );
      grad.addColorStop(0, nebula.color);
      grad.addColorStop(1, 'transparent');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(nebula.x - offsetX * 0.5, nebula.y - offsetY * 0.5, nebula.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // 2. Draw Stars
    const currentSpeed = this.isWarping ? 25 : 1;
    this.stars.forEach(star => {
      // Twinkle calculation
      star.twinklePhase += star.twinkleSpeed;
      const twinkle = Math.sin(star.twinklePhase) * 0.3;
      const alpha = Math.max(0.1, Math.min(1, star.baseAlpha + twinkle));

      // Parallax coordinate
      const px = star.x - offsetX * star.z;
      let py = star.y - offsetY * star.z;

      // Warp speed stretch
      if (this.isWarping) {
        py += star.z * currentSpeed;
        if (py > this.height) py = 0;
        star.y = py;

        this.ctx.strokeStyle = star.color;
        this.ctx.lineWidth = star.radius * 1.5;
        this.ctx.globalAlpha = alpha;
        this.ctx.beginPath();
        this.ctx.moveTo(px, py);
        this.ctx.lineTo(px, py - star.z * 35);
        this.ctx.stroke();
      } else {
        // Normal drift
        star.y += star.z * 0.08;
        if (star.y > this.height) {
          star.y = 0;
          star.x = Math.random() * this.width;
        }

        this.ctx.fillStyle = star.color;
        this.ctx.globalAlpha = alpha;
        this.ctx.beginPath();
        this.ctx.arc(px, star.y, star.radius * (star.z * 0.45 + 0.5), 0, Math.PI * 2);
        this.ctx.fill();

        // Optional tiny star flare for large close stars
        if (star.radius > 1.8 && star.z > 2.5) {
          this.ctx.strokeStyle = star.color;
          this.ctx.lineWidth = 0.5;
          this.ctx.globalAlpha = alpha * 0.4;
          this.ctx.beginPath();
          this.ctx.moveTo(px - 5, star.y);
          this.ctx.lineTo(px + 5, star.y);
          this.ctx.moveTo(px, star.y - 5);
          this.ctx.lineTo(px, star.y + 5);
          this.ctx.stroke();
        }
      }
    });

    this.ctx.globalAlpha = 1.0;

    // 3. Draw & Update Shooting Stars
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;

      if (s.life <= 0 || s.x > this.width + 100 || s.y > this.height + 100) {
        this.shootingStars.splice(i, 1);
        continue;
      }

      const tailX = s.x - Math.cos(s.angle) * s.len * s.life;
      const tailY = s.y - Math.sin(s.angle) * s.len * s.life;

      const grad = this.ctx.createLinearGradient(tailX, tailY, s.x, s.y);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, s.color);

      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 2.5;
      this.ctx.globalAlpha = s.life;
      this.ctx.beginPath();
      this.ctx.moveTo(tailX, tailY);
      this.ctx.lineTo(s.x, s.y);
      this.ctx.stroke();

      // Bright head glow
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1.0;

    // 4. Render Deep Space Floating Crewmates
    this.floatingCrewmates.forEach(crew => {
      crew.x += crew.speedX;
      crew.y += crew.speedY;
      crew.rotation += crew.rotationSpeed;

      // Wrap around screen edges
      if (crew.speedX > 0 && crew.x > this.width + 100) {
        crew.x = -100;
        crew.y = Math.random() * (this.height * 0.8) + 50;
      } else if (crew.speedX < 0 && crew.x < -100) {
        crew.x = this.width + 100;
        crew.y = Math.random() * (this.height * 0.8) + 50;
      }

      this.ctx.save();
      this.ctx.translate(crew.x, crew.y);
      this.ctx.rotate(crew.rotation);
      this.ctx.scale(crew.scale, crew.scale);
      this.ctx.globalAlpha = crew.opacity;

      this.drawMiniAstronaut(this.ctx, crew.color);

      this.ctx.restore();
    });

    requestAnimationFrame((t) => this.render(t));
  }

  // Draw simplified silhouette/mini crewmate on canvas
  drawMiniAstronaut(ctx, color) {
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = color;

    const roundRectSafe = (x, y, w, h, r) => {
      if (ctx.roundRect) {
        ctx.roundRect(x, y, w, h, r);
      } else {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      }
    };

    // Backpack
    ctx.beginPath();
    roundRectSafe(-42, -15, 20, 48, 8);
    ctx.fill();
    ctx.stroke();

    // Body
    ctx.beginPath();
    roundRectSafe(-25, -35, 50, 70, 24);
    ctx.fill();
    ctx.stroke();

    // Legs split
    ctx.beginPath();
    ctx.rect(-6, 20, 12, 18);
    ctx.fillStyle = '#030712';
    ctx.fill();

    // Visor
    ctx.fillStyle = '#7dd3fc';
    ctx.beginPath();
    roundRectSafe(-4, -20, 36, 22, 10);
    ctx.fill();
    ctx.stroke();

    // Visor reflection
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    roundRectSafe(4, -17, 20, 7, 4);
    ctx.fill();
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.spaceEngine = new SpaceEngine('spaceCanvas');
});
