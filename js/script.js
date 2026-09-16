document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("loveCanvas");
  const ctx = canvas.getContext("2d");
  const ambient = document.getElementById("ambientBackground");
  const music = document.getElementById("myAudio");
  const lines = [...document.querySelectorAll(".say")];
  const typedText = document.getElementById("typedText");

  /* Romantic animated background — no source code is displayed. */
  function makeAmbientBackground() {
    ambient.innerHTML = "";
    const small = window.innerWidth < 700;
    const heartCount = small ? 11 : 25;
    const sparkCount = small ? 28 : 70;
    const petalCount = small ? 8 : 18;
    const orbCount = small ? 3 : 7;

    for (let i = 0; i < heartCount; i++) {
      const heart = document.createElement("span");
      heart.className = "ambient-heart";
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.top = `${70 + Math.random() * 55}%`;
      heart.style.animationDuration = `${11 + Math.random() * 15}s`;
      heart.style.animationDelay = `${-Math.random() * 20}s`;
      heart.style.opacity = `${.12 + Math.random() * .4}`;
      heart.style.transform = `rotate(45deg) scale(${.35 + Math.random() * .85})`;
      ambient.appendChild(heart);
    }

    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement("span");
      spark.className = "ambient-spark";
      spark.style.left = `${Math.random() * 100}%`;
      spark.style.top = `${Math.random() * 100}%`;
      spark.style.animationDuration = `${1.6 + Math.random() * 4}s`;
      spark.style.animationDelay = `${-Math.random() * 6}s`;
      ambient.appendChild(spark);
    }

    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement("span");
      petal.className = "ambient-petal";
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.top = `${-20 - Math.random() * 30}%`;
      petal.style.animationDuration = `${12 + Math.random() * 14}s`;
      petal.style.animationDelay = `${-Math.random() * 18}s`;
      petal.style.opacity = `${.18 + Math.random() * .42}`;
      ambient.appendChild(petal);
    }

    for (let i = 0; i < orbCount; i++) {
      const orb = document.createElement("span");
      orb.className = "ambient-orb";
      orb.style.left = `${Math.random() * 100}%`;
      orb.style.top = `${Math.random() * 100}%`;
      orb.style.animationDuration = `${5 + Math.random() * 7}s`;
      orb.style.animationDelay = `${-Math.random() * 7}s`;
      orb.style.transform = `scale(${.55 + Math.random() * 1.2})`;
      ambient.appendChild(orb);
    }
  }

  makeAmbientBackground();
  window.addEventListener("resize", makeAmbientBackground);

  /* Autoplay. Audible autoplay may be blocked by the browser; the first interaction starts it. */
  music.play().catch(() => {
    const startMusic = () => {
      music.play().catch(() => {});
      window.removeEventListener("pointerdown", startMusic);
      window.removeEventListener("keydown", startMusic);
      window.removeEventListener("touchstart", startMusic);
    };
    window.addEventListener("pointerdown", startMusic, { once: true });
    window.addEventListener("keydown", startMusic, { once: true });
    window.addEventListener("touchstart", startMusic, { once: true });
  });

  /* Carousel is intentionally manual: hover the < or > arrows to navigate all 15 memories. */

  /* Love message typewriter. */
  const message =
    "Happy 42nd Monthssary!! May our relationship be blessed by God. " +
    "Basta I'm always here for youuu, through bad and GOOD TIMES. ❤️";

  let char = 0;
  function typeMessage() {
    if (char < message.length) {
      typedText.textContent += message[char++];
      setTimeout(typeMessage, 30);
    }
  }

  lines.forEach((line, index) => {
    setTimeout(() => line.classList.add("show"), 500 + index * 340);
  });
  setTimeout(typeMessage, 1100);

  /* Heart-tree animation: trunk grows, branches appear, then the heart canopy blooms. */
  const particles = [];
  const floatingHearts = [];
  let W = 0;
  let H = 0;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    W = rect.width;
    H = rect.height;
    buildHeartParticles();
    buildFloatingHearts();
  }

  function heartEquation(x, y) {
    const a = x * x + y * y - 1;
    return a * a * a - x * x * y * y * y;
  }

  function buildHeartParticles() {
    particles.length = 0;
    const cx = W > 900 ? W * 0.72 : W * 0.64;
    const cy = H * 0.43;
    const sx = Math.min(W * 0.29, 350);
    const sy = Math.min(H * 0.34, 300);

    for (let i = 0; i < 2700; i++) {
      const x = Math.random() * 2.35 - 1.175;
      const y = Math.random() * 2.2 - 1.1;
      if (heartEquation(x, y) <= 0) {
        particles.push({
          targetX: cx + x * sx,
          targetY: cy + y * sy,
          x: cx + (Math.random() - .5) * 70,
          y: H + Math.random() * 190,
          size: 2 + Math.random() * 4.7,
          delay: Math.random() * .72,
          phase: Math.random() * Math.PI * 2,
          hue: Math.random()
        });
      }
    }
  }

  function buildFloatingHearts() {
    floatingHearts.length = 0;
    const count = W < 700 ? 26 : 52;
    for (let i = 0; i < count; i++) {
      floatingHearts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: 2 + Math.random() * 5,
        speed: .08 + Math.random() * .22,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random()
      });
    }
  }

  function drawHeart(x, y, size, rotation, alpha, hue) {
    const colors = ["#ff3e91", "#ff5fa6", "#ff82bd", "#ff2f83", "#ffb1d0", "#e91e73", "#ff6f9f", "#ffd1e3"];
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = colors[Math.floor(hue * colors.length)];
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 7;
    ctx.beginPath();
    ctx.moveTo(0, size * .72);
    ctx.bezierCurveTo(-size * 1.35, -size * .05, -size * .92, -size * 1.05, 0, -size * .34);
    ctx.bezierCurveTo(size * .92, -size * 1.05, size * 1.35, -size * .05, 0, size * .72);
    ctx.fill();
    ctx.restore();
  }

  function drawFloatingHearts(time) {
    floatingHearts.forEach((p, i) => {
      p.y -= p.speed;
      if (p.y < -20) p.y = H + 20;
      drawHeart(
        p.x + Math.sin(time * .0008 + p.phase) * 15,
        p.y,
        p.size,
        Math.sin(time * .001 + p.phase) * .2,
        .18 + .22 * Math.sin(time * .0015 + i) ** 2,
        p.hue
      );
    });
  }

  function drawTree(time) {
    const cx = W > 900 ? W * .72 : W * .64;
    const base = H * .95;
    const elapsed = time % 8200;
    const growth = Math.min(1, Math.max(0, elapsed / 2300));
    const canopyProgress = Math.min(1, Math.max(0, (elapsed - 900) / 3000));
    const pulse = 1 + Math.sin(time * .0015) * .024;

    const glow = ctx.createRadialGradient(cx, H * .56, 10, cx, H * .56, Math.min(W, H) * .48);
    glow.addColorStop(0, "rgba(255, 81, 160, .22)");
    glow.addColorStop(1, "rgba(255, 81, 160, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    /* Growing trunk and branches — a visual version of the reference's build sequence. */
    const trunkTop = H * (.62 - .12 * growth);
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(255, 154, 194, .95)";
    ctx.shadowColor = "rgba(255, 68, 145, .5)";
    ctx.shadowBlur = 16;
    ctx.lineWidth = Math.max(8, W * .008);
    ctx.beginPath();
    ctx.moveTo(cx, base);
    ctx.quadraticCurveTo(cx - 10, H * .80, cx, trunkTop);
    ctx.stroke();

    const branches = [-1.2, -.86, -.54, -.2, .18, .52, .86, 1.18];
    ctx.lineWidth = Math.max(3, W * .0032);
    branches.forEach((dir, i) => {
      const branchGrowth = Math.min(1, Math.max(0, growth * 1.25 - i * .08));
      if (branchGrowth <= 0) return;
      const startY = H * (.75 - (i % 3) * .04);
      const reach = Math.min(W * .18, 205) * (1 - Math.abs(dir) * .17) * branchGrowth;
      ctx.beginPath();
      ctx.moveTo(cx, startY);
      ctx.quadraticCurveTo(cx + dir * reach * .30, startY - H * .08, cx + dir * reach, startY - H * (.14 + (i % 2) * .025));
      ctx.stroke();
    });
    ctx.restore();

    particles.forEach((p, index) => {
      const local = Math.max(0, Math.min(1, canopyProgress * 1.35 - p.delay));
      const eased = local * local * (3 - 2 * local);
      const x = p.x + (p.targetX - p.x) * eased + Math.sin(time * .0017 + p.phase) * 2.3;
      const y = p.y + (p.targetY - p.y) * eased + Math.cos(time * .0014 + p.phase) * 2.1;
      drawHeart(
        cx + (x - cx) * pulse,
        H * .43 + (y - H * .43) * pulse,
        p.size,
        Math.sin(time * .001 + p.phase) * .16,
        .60 + .30 * Math.sin(time * .002 + index) ** 2,
        p.hue
      );
    });

    drawFloatingHearts(time);
  }

  function animate(time) {
    ctx.clearRect(0, 0, W, H);
    drawTree(time);
    requestAnimationFrame(animate);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  requestAnimationFrame(animate);
});
