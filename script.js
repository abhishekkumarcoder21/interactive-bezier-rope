const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ---------- Vector ----------
class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(v) { return new Vec2(this.x + v.x, this.y + v.y); }
  sub(v) { return new Vec2(this.x - v.x, this.y - v.y); }
  mul(s) { return new Vec2(this.x * s, this.y * s); }
  length() { return Math.sqrt(this.x * this.x + this.y * this.y); }
  normalize() {
    const l = this.length();
    return l === 0 ? new Vec2(0, 0) : this.mul(1 / l);
  }
}

// ---------- Control Points ----------
const P0 = new Vec2(150, canvas.height / 2);
const P3 = new Vec2(canvas.width - 150, canvas.height / 2);

let P1 = new Vec2(canvas.width / 2 - 120, canvas.height / 2);
let P2 = new Vec2(canvas.width / 2 + 120, canvas.height / 2);

let v1 = new Vec2(0, 0);
let v2 = new Vec2(0, 0);

let target = new Vec2(canvas.width / 2, canvas.height / 2);

// ---------- Physics ----------
const k = 0.08;
const damping = 0.85;

// ---------- Input (Mouse) ----------
window.addEventListener("mousemove", e => {
  target.x = e.clientX;
  target.y = e.clientY;
});

// ---------- Input (Touch) ----------
window.addEventListener("touchmove", e => {
  const t = e.touches[0];
  target.x = t.clientX;
  target.y = t.clientY;
});

// ---------- Input (Gyroscope) ----------
function enableGyro() {
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    DeviceOrientationEvent.requestPermission().then(res => {
      if (res === "granted") {
        window.addEventListener("deviceorientation", handleOrientation);
      }
    });
  } else {
    window.addEventListener("deviceorientation", handleOrientation);
  }
}

function handleOrientation(e) {
  const x = e.gamma || 0; // left-right
  const y = e.beta || 0;  // front-back
  target.x = canvas.width / 2 + x * 10;
  target.y = canvas.height / 2 + y * 10;
}

// ---------- Bézier Math ----------
function bezierPoint(t, P0, P1, P2, P3) {
  const u = 1 - t;
  return P0.mul(u ** 3)
    .add(P1.mul(3 * u * u * t))
    .add(P2.mul(3 * u * t * t))
    .add(P3.mul(t ** 3));
}

function bezierTangent(t, P0, P1, P2, P3) {
  const u = 1 - t;
  return P1.sub(P0).mul(3 * u * u)
    .add(P2.sub(P1).mul(6 * u * t))
    .add(P3.sub(P2).mul(3 * t * t));
}

// ---------- Update ----------
function update() {
  const f1 = target.sub(P1).mul(k);
  v1 = v1.add(f1).mul(damping);
  P1 = P1.add(v1);

  const f2 = target.sub(P2).mul(k);
  v2 = v2.add(f2).mul(damping);
  P2 = P2.add(v2);
}

// ---------- Draw ----------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Curve
  ctx.beginPath();
  for (let t = 0; t <= 1; t += 0.01) {
    const p = bezierPoint(t, P0, P1, P2, P3);
    t === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  }
  ctx.strokeStyle = "#00ffcc";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Tangents
  for (let t = 0; t <= 1; t += 0.1) {
    const p = bezierPoint(t, P0, P1, P2, P3);
    const tan = bezierTangent(t, P0, P1, P2, P3).normalize().mul(30);

    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + tan.x, p.y + tan.y);
    ctx.strokeStyle = "#ff5555";
    ctx.stroke();
  }

  // Control points
  [P0, P1, P2, P3].forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = i === 1 || i === 2 ? "#ffaa00" : "#ffffff";
    ctx.fill();
  });
}

// ---------- Loop ----------
function animate() {
  update();
  draw();
  requestAnimationFrame(animate);
}
animate();
