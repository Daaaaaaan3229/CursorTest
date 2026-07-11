// ===== Calculator Logic =====
class FlashyCalculator {
  constructor(displayEl, subDisplayEl) {
    this.displayEl = displayEl;
    this.subDisplayEl = subDisplayEl;
    this.current = "0";
    this.previous = null;
    this.operator = null;
    this.waitingForOperand = false;
    this.lastExpression = "";
  }

  inputDigit(digit) {
    if (this.waitingForOperand) {
      this.current = digit;
      this.waitingForOperand = false;
    } else {
      this.current = this.current === "0" ? digit : this.current + digit;
    }
    this.updateDisplay();
  }

  inputDecimal() {
    if (this.waitingForOperand) {
      this.current = "0.";
      this.waitingForOperand = false;
    } else if (!this.current.includes(".")) {
      this.current += ".";
    }
    this.updateDisplay();
  }

  clear() {
    this.current = "0";
    this.previous = null;
    this.operator = null;
    this.waitingForOperand = false;
    this.lastExpression = "";
    this.updateDisplay();
  }

  toggleSign() {
    if (this.current === "0") return;
    this.current = this.current.startsWith("-")
      ? this.current.slice(1)
      : "-" + this.current;
    this.updateDisplay();
  }

  percent() {
    const val = parseFloat(this.current);
    this.current = String(val / 100);
    this.updateDisplay();
  }

  setOperator(op) {
    const inputValue = parseFloat(this.current);

    if (this.previous === null) {
      this.previous = inputValue;
    } else if (!this.waitingForOperand) {
      const result = this.calculate(this.previous, inputValue, this.operator);
      this.current = this.formatResult(result);
      this.previous = result;
    }

    this.waitingForOperand = true;
    this.operator = op;
    this.lastExpression = `${this.formatResult(this.previous)} ${this.opSymbol(op)}`;
    this.updateDisplay();
  }

  equals() {
    if (this.operator === null || this.previous === null) return null;

    const inputValue = parseFloat(this.current);
    const result = this.calculate(this.previous, inputValue, this.operator);
    this.lastExpression = `${this.formatResult(this.previous)} ${this.opSymbol(this.operator)} ${this.formatResult(inputValue)} =`;
    this.current = this.formatResult(result);
    this.previous = null;
    this.operator = null;
    this.waitingForOperand = true;
    this.updateDisplay();
    return result;
  }

  calculate(a, b, op) {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? NaN : a / b;
      default: return b;
    }
  }

  opSymbol(op) {
    return { "+": "+", "-": "−", "*": "×", "/": "÷" }[op] || op;
  }

  formatResult(num) {
    if (isNaN(num) || !isFinite(num)) return "エラー";
    const str = String(num);
    if (str.length > 12) {
      return num.toPrecision(10).replace(/\.?0+$/, "");
    }
    return str;
  }

  updateDisplay() {
    this.displayEl.textContent = this.current;
    this.subDisplayEl.textContent = this.lastExpression;
  }
}

// ===== Particle System =====
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
  }

  burst(x, y, count, colors, intensity = 1) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = (2 + Math.random() * 6) * intensity;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.015 + Math.random() * 0.02,
        size: 2 + Math.random() * 4 * intensity,
        color: colors[Math.floor(Math.random() * colors.length)],
        gravity: 0.08,
      });
    }
  }

  confetti(count = 120) {
    const colors = ["#ff006e", "#00f5ff", "#ffbe0b", "#8338ec", "#06ffa5", "#ff006e"];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.w,
        y: -20,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 6,
        life: 1,
        decay: 0.004 + Math.random() * 0.004,
        size: 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        gravity: 0.05,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.2,
      });
    }
  }

  update() {
    this.ctx.clearRect(0, 0, this.w, this.h);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life -= p.decay;
      if (p.spin) p.rotation += p.spin;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = p.color;

      if (p.rotation) {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        this.ctx.restore();
      } else {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    this.ctx.globalAlpha = 1;
    this.ctx.shadowBlur = 0;
    requestAnimationFrame(() => this.update());
  }
}

// ===== Starfield Background =====
class Starfield {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.stars = [];
    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.initStars();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
  }

  initStars() {
    this.stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      hue: Math.random() * 60 + 260,
      twinkle: Math.random() * Math.PI * 2,
    }));
  }

  draw() {
    this.ctx.fillStyle = "rgba(10, 0, 20, 0.25)";
    this.ctx.fillRect(0, 0, this.w, this.h);

    const t = Date.now() * 0.001;
    for (const s of this.stars) {
      s.y -= s.speed;
      if (s.y < 0) {
        s.y = this.h;
        s.x = Math.random() * this.w;
      }
      const alpha = 0.3 + 0.7 * Math.abs(Math.sin(t * 2 + s.twinkle));
      this.ctx.fillStyle = `hsla(${s.hue}, 80%, 70%, ${alpha})`;
      this.ctx.shadowBlur = 4;
      this.ctx.shadowColor = `hsl(${s.hue}, 80%, 70%)`;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.shadowBlur = 0;
    requestAnimationFrame(() => this.draw());
  }
}

// ===== Sound Engine (Web Audio) =====
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  init() {
    if (this.enabled) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.enabled = true;
    } catch {
      /* silent fail */
    }
  }

  play(type) {
    if (!this.enabled || !this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;

    switch (type) {
      case "digit":
        osc.type = "sine";
        osc.frequency.setValueAtTime(440 + Math.random() * 200, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      case "op":
        osc.type = "square";
        osc.frequency.setValueAtTime(660, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      case "equals":
        [523, 659, 784, 1047].forEach((freq, i) => {
          const o = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          o.connect(g);
          g.connect(this.ctx.destination);
          o.type = "sawtooth";
          o.frequency.setValueAtTime(freq, now + i * 0.08);
          g.gain.setValueAtTime(0.12, now + i * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
          o.start(now + i * 0.08);
          o.stop(now + i * 0.08 + 0.3);
        });
        break;
      case "clear":
        osc.type = "triangle";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.2);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      case "error":
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.setValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
    }
  }
}

// ===== Haptic Feedback =====
function vibrate(pattern) {
  if ("vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

// ===== Main =====
const displayEl = document.getElementById("display");
const subDisplayEl = document.getElementById("display-sub");
const flashOverlay = document.getElementById("flash-overlay");
const calc = new FlashyCalculator(displayEl, subDisplayEl);
const particles = new ParticleSystem(document.getElementById("fx-canvas"));
const starfield = new Starfield(document.getElementById("bg-canvas"));
const sound = new SoundEngine();

particles.update();
starfield.draw();

const COLORS = {
  digit: ["#8338ec", "#ff006e", "#00f5ff"],
  op: ["#00f5ff", "#06ffa5"],
  func: ["#ff006e", "#ffbe0b"],
  equals: ["#ff006e", "#ffbe0b", "#00f5ff", "#8338ec", "#06ffa5"],
};

function getButtonCenter(btn) {
  const rect = btn.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function triggerFlash() {
  flashOverlay.classList.add("active");
  setTimeout(() => flashOverlay.classList.remove("active"), 80);
}

function triggerShake() {
  document.body.classList.add("screen-shake");
  displayEl.classList.add("shake");
  setTimeout(() => {
    document.body.classList.remove("screen-shake");
    displayEl.classList.remove("shake");
  }, 500);
}

function triggerGlitch() {
  displayEl.classList.remove("glitch");
  void displayEl.offsetWidth;
  displayEl.classList.add("glitch");
  setTimeout(() => displayEl.classList.remove("glitch"), 400);
}

function addRipple(btn) {
  btn.classList.remove("ripple");
  void btn.offsetWidth;
  btn.classList.add("ripple");
}

document.querySelector(".keypad").addEventListener("click", (e) => {
  const btn = e.target.closest(".key");
  if (!btn) return;

  sound.init();

  const action = btn.dataset.action;
  const value = btn.dataset.value;
  const { x, y } = getButtonCenter(btn);

  addRipple(btn);
  triggerGlitch();

  switch (action) {
    case "digit":
      calc.inputDigit(value);
      particles.burst(x, y, 12, COLORS.digit);
      sound.play("digit");
      vibrate(10);
      break;
    case "decimal":
      calc.inputDecimal();
      particles.burst(x, y, 8, COLORS.digit);
      sound.play("digit");
      vibrate(10);
      break;
    case "operator":
      calc.setOperator(value);
      particles.burst(x, y, 20, COLORS.op, 1.2);
      sound.play("op");
      vibrate(20);
      break;
    case "clear":
      calc.clear();
      particles.burst(x, y, 30, COLORS.func, 1.5);
      sound.play("clear");
      vibrate([30, 20, 30]);
      break;
    case "toggle-sign":
      calc.toggleSign();
      particles.burst(x, y, 15, COLORS.func);
      sound.play("op");
      vibrate(15);
      break;
    case "percent":
      calc.percent();
      particles.burst(x, y, 15, COLORS.func);
      sound.play("op");
      vibrate(15);
      break;
    case "equals": {
      const result = calc.equals();
      particles.burst(x, y, 40, COLORS.equals, 2);
      particles.confetti(150);
      triggerFlash();
      triggerShake();
      sound.play("equals");
      vibrate([50, 30, 80, 30, 120]);

      if (result !== null && (isNaN(result) || !isFinite(result))) {
        sound.play("error");
        displayEl.style.color = "#ff006e";
        setTimeout(() => { displayEl.style.color = ""; }, 600);
      }
      break;
    }
  }
});

// Prevent double-tap zoom on iOS
let lastTouchEnd = 0;
document.addEventListener("touchend", (e) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) e.preventDefault();
  lastTouchEnd = now;
}, { passive: false });

// Prevent pull-to-refresh on iOS
document.body.addEventListener("touchmove", (e) => {
  if (e.target === document.body) e.preventDefault();
}, { passive: false });
