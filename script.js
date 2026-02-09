const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-button");
const overlay = document.querySelector(".overlay");
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

  particles.forEach((particle) => {
    if (particle.tx === undefined || particle.ty === undefined) {
      return;
    }
    const dx = particle.tx - particle.x;
    const dy = particle.ty - particle.y;
    particle.vx += dx * 0.02;
    particle.vy += dy * 0.02;
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
  } catch (error) {
    setTimeout(() => {
      audio.play().catch(() => {});
    }, 3000);
  }

  advancePhrase();
  animate();
};

startButton.addEventListener("click", startAnimation);

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
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
assignTargets(
  Array.from({ length: config.particleCount }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
  })),
  config.colorIdle
);
animate();
