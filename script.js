const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-button");
const overlay = document.querySelector(".overlay");
const muteButton = document.getElementById("mute-button");
const audio = document.getElementById("bg-audio");

const config = {
  particleCount: 1400,
  particleSize: 2.1,
  backgroundParticleCount: 260,
  backgroundParticleSize: 1.4,
  colorIdle: "rgba(255,255,255,0.7)",
  colorActive: "rgba(255, 92, 162, 0.9)",
  backgroundFade: 0.15,
  phraseDuration: 3800,
  transitionDuration: 900,
  heartColor: "rgba(255, 64, 96, 0.95)",
  hoverRadius: 80,
  hoverForce: 3.5,
  idleJitter: 0.12,
};

const phrases = [
  "amor",
  "te quiero",
  "tu tienes",
  "mi corazon",
  "en este dia",
  "te lo recuerdo",
  "lo importante",
  "que eres",
  "para mi",
  "eres",
  "mi vida",
  "eres",
  "mi todo",
  "te quiero",
  "mi amor",
];

let particles = [];
let backgroundParticles = [];
const audio = document.getElementById("bg-audio");

const config = {
  particleCount: 1200,
  particleSize: 2.2,
  colorIdle: "rgba(255,255,255,0.7)",
  colorActive: "rgba(255, 92, 162, 0.9)",
  backgroundFade: 0.15,
  phraseDuration: 4200,
  transitionDuration: 900,
  heartColor: "rgba(255, 64, 96, 0.95)",
};

const phrases = ["Daian", "Quiero decirte", "que esto es", "un demo base"];

let particles = [];
let targets = [];
let currentPhraseIndex = 0;
let animationId = null;
let phraseTimer = null;
let started = false;
let hovered = false;
let mouse = { x: 0, y: 0 };
let audioReady = false;

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

const createParticles = () => {
  particles = Array.from({ length: config.particleCount }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: 0,
    vy: 0,
    color: config.colorIdle,
    tx: Math.random() * canvas.width,
    ty: Math.random() * canvas.height,
  }));
};

const createBackgroundParticles = () => {
  backgroundParticles = Array.from(
    { length: config.backgroundParticleCount },
    () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: 0.35 + Math.random() * 0.35,
    })
  );
};

const getTextTargets = (text) => {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  const maxWidth = canvas.width * 0.75;
  const fontSize = Math.min(canvas.width, canvas.height) * 0.14;
  }));
};

const getTextTargets = (text) => {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  const maxWidth = canvas.width * 0.8;
  const fontSize = Math.min(canvas.width, canvas.height) * 0.16;

  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
  tempCtx.fillStyle = "white";
  tempCtx.textAlign = "center";
  tempCtx.textBaseline = "middle";
  tempCtx.font = `600 ${fontSize}px Poppins, sans-serif`;

  const lines = wrapText(tempCtx, text, maxWidth);
  const lineHeight = fontSize * 1.1;
  const startY = canvas.height / 2 - (lines.length - 1) * lineHeight * 0.5;

  lines.forEach((line, index) => {
    tempCtx.fillText(line, canvas.width / 2, startY + index * lineHeight);
  });

  return sampleCanvas(tempCtx, tempCanvas.width, tempCanvas.height, 6);
  return sampleCanvas(tempCtx, tempCanvas.width, tempCanvas.height, 7);
};

const wrapText = (context, text, maxWidth) => {
  const words = text.split(" ");
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const test = current ? `${current} ${word}` : word;
    const { width } = context.measureText(test);
    if (width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  });

  if (current) {
    lines.push(current);
  }

  return lines;
};

const sampleCanvas = (context, width, height, gap) => {
  const imageData = context.getImageData(0, 0, width, height).data;
  const points = [];
  for (let y = 0; y < height; y += gap) {
    for (let x = 0; x < width; x += gap) {
      const alpha = imageData[(y * width + x) * 4 + 3];
      if (alpha > 128) {
        points.push({ x, y });
      }
    }
  }
  return points;
};

const getHeartTargets = () => {
  const points = [];
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const maxSize = Math.min(canvas.width, canvas.height) * 0.22;
  const scales = [1, 0.82, 0.66, 0.5, 0.36];

  scales.forEach((scale) => {
    const size = maxSize * scale;
    for (let t = 0; t < Math.PI * 2; t += 0.022) {
  const maxSize = Math.min(canvas.width, canvas.height) * 0.28;
  const minSize = maxSize * 0.45;

  [maxSize, minSize].forEach((size) => {
    for (let t = 0; t < Math.PI * 2; t += 0.02) {
      const x = size * 16 * Math.pow(Math.sin(t), 3);
      const y =
        -size *
        (13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t));
      points.push({ x: centerX + x, y: centerY + y });
    }
  });

  return points;
};

const assignTargets = (newTargets, color) => {
  particles.forEach((particle, index) => {
    const target = newTargets[index % newTargets.length];
  targets = newTargets;
  particles.forEach((particle, index) => {
    const target = targets[index % targets.length];
    particle.tx = target.x;
    particle.ty = target.y;
    particle.color = color;
  });
};

const animate = () => {
  ctx.fillStyle = `rgba(10, 10, 18, ${config.backgroundFade})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  backgroundParticles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < -20 || particle.x > canvas.width + 20) {
      particle.vx *= -1;
    }
    if (particle.y < -20 || particle.y > canvas.height + 20) {
      particle.vy *= -1;
    }

    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
    ctx.arc(
      particle.x,
      particle.y,
      config.backgroundParticleSize,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });

  particles.forEach((particle) => {
  particles.forEach((particle) => {
    if (particle.tx === undefined || particle.ty === undefined) {
      return;
    }
    const dx = particle.tx - particle.x;
    const dy = particle.ty - particle.y;
    particle.vx += dx * 0.02;
    particle.vy += dy * 0.02;

    if (hovered) {
      const mx = particle.x - mouse.x;
      const my = particle.y - mouse.y;
      const distance = Math.hypot(mx, my);
      if (distance < config.hoverRadius) {
        const force = (1 - distance / config.hoverRadius) * config.hoverForce;
        particle.vx += (mx / (distance || 1)) * force;
        particle.vy += (my / (distance || 1)) * force;
      }
    }

    particle.vx += (Math.random() - 0.5) * config.idleJitter;
    particle.vy += (Math.random() - 0.5) * config.idleJitter;

    particle.vx *= 0.82;
    particle.vy *= 0.82;
    particle.x += particle.vx;
    particle.y += particle.vy;

    ctx.beginPath();
    ctx.fillStyle = particle.color;
    ctx.arc(particle.x, particle.y, config.particleSize, 0, Math.PI * 2);
    ctx.fill();
  });

  animationId = requestAnimationFrame(animate);
};

const setPhrase = (text) => {
  const points = getTextTargets(text);
  assignTargets(points, config.colorActive);
};

const showHeart = () => {
  const points = getHeartTargets();
  assignTargets(points, config.heartColor);
};

const advancePhrase = () => {
  if (currentPhraseIndex < phrases.length) {
    setPhrase(phrases[currentPhraseIndex]);
    currentPhraseIndex += 1;
    phraseTimer = setTimeout(advancePhrase, config.phraseDuration);
  } else {
    showHeart();
    clearTimeout(phraseTimer);
  }
};

const startAnimation = async () => {
  if (started) {
    return;
  }
  started = true;
  overlay.classList.add("is-hidden");

  try {
    await audio.play();
    audioReady = true;
    muteButton.textContent = "🔊";
  } catch (error) {
    audioReady = false;
    muteButton.textContent = "🔇";
  } catch (error) {
    setTimeout(() => {
      audio.play().catch(() => {});
    }, 3000);
  }

  advancePhrase();
  animate();
};

startButton.addEventListener("click", startAnimation);
muteButton.addEventListener("click", () => {
  if (!audioReady) {
    audio
      .play()
      .then(() => {
        audioReady = true;
        muteButton.classList.remove("is-muted");
        muteButton.setAttribute("aria-pressed", "false");
        muteButton.textContent = "🔊";
      })
      .catch(() => {});
    return;
  }

  if (audio.paused) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
    muteButton.classList.remove("is-muted");
    muteButton.setAttribute("aria-pressed", "false");
    muteButton.textContent = "🔊";
  } else {
    audio.pause();
    audio.currentTime = 0;
    muteButton.classList.add("is-muted");
    muteButton.setAttribute("aria-pressed", "true");
    muteButton.textContent = "🔇";
  }
});

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  mouse = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
  hovered = true;
});

canvas.addEventListener("mouseleave", () => {
  hovered = false;
});

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
  createBackgroundParticles();
  if (started) {
    if (currentPhraseIndex <= phrases.length) {
      setPhrase(phrases[Math.max(currentPhraseIndex - 1, 0)] || "");
    } else {
      showHeart();
    }
  }
});

resizeCanvas();
createParticles();
createBackgroundParticles();
assignTargets(
  Array.from({ length: config.particleCount }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
  })),
  config.colorIdle
);
animate();
