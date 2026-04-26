/**
 * starfield.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Three.js 3D starfield that:
 *   • Sits fixed in the background (z-index: -1, pointer-events: none).
 *   • Maps window.scrollY → camera.position.z  (500 → -500 fly-through).
 *   • Adds a very slow auto-rotation on the Y axis for a "living" feel.
 *   • Tilts slightly (±5°) with mouse movement.
 *
 * Requires Three.js r128 loaded BEFORE this script:
 *   <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
 *   <script src="assets/js/starfield.js"></script>
 * ─────────────────────────────────────────────────────────────────────────────
 */
(function () {
  'use strict';

  /* ── Wait until Three.js is available ───────────────────────────────────── */
  if (typeof THREE === 'undefined') {
    console.error('[starfield.js] THREE is not defined. Make sure three.min.js is loaded first.');
    return;
  }

  /* ══════════════════════════════════════════════════════════════════════════
     1 · RENDERER / SCENE / CAMERA
  ══════════════════════════════════════════════════════════════════════════ */
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  /* Fixed background canvas */
  const canvas = renderer.domElement;
  Object.assign(canvas.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: '-1',
    pointerEvents: 'none',
    display: 'block',
  });
  document.body.appendChild(canvas);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,                                   // fov
    window.innerWidth / window.innerHeight, // aspect
    0.1,                                  // near
    3000                                  // far – stars live in ±1000 z space
  );
  /* Start position: outside the field, looking in */
  camera.position.z = 500;

  /* ══════════════════════════════════════════════════════════════════════════
     2 · STAR GEOMETRY
  ══════════════════════════════════════════════════════════════════════════ */
  const STAR_COUNT = 7000;
  const FIELD_HALF = 1000; // stars span −1000 … +1000 on each axis

  const positions = new Float32Array(STAR_COUNT * 3);
  const colors    = new Float32Array(STAR_COUNT * 3);
  const sizes     = new Float32Array(STAR_COUNT);

  /* Color palette: white, light-blue, light-yellow */
  const palette = [
    new THREE.Color(1.00, 1.00, 1.00),   // pure white
    new THREE.Color(0.85, 0.93, 1.00),   // light blue-white
    new THREE.Color(0.80, 0.90, 1.00),   // soft blue
    new THREE.Color(1.00, 0.97, 0.82),   // warm yellow-white
    new THREE.Color(1.00, 0.95, 0.70),   // light gold
  ];

  for (let i = 0; i < STAR_COUNT; i++) {
    /* Random position spread across a cube */
    positions[i * 3 + 0] = (Math.random() - 0.5) * FIELD_HALF * 2; // X
    positions[i * 3 + 1] = (Math.random() - 0.5) * FIELD_HALF * 2; // Y
    positions[i * 3 + 2] = (Math.random() - 0.5) * FIELD_HALF * 2; // Z

    /* Pick a palette color with slight brightness variation */
    const base  = palette[Math.floor(Math.random() * palette.length)].clone();
    const boost = 0.85 + Math.random() * 0.15; // 0.85–1.0
    colors[i * 3 + 0] = Math.min(base.r * boost, 1);
    colors[i * 3 + 1] = Math.min(base.g * boost, 1);
    colors[i * 3 + 2] = Math.min(base.b * boost, 1);

    /* Random size: 0.5–4.5 px */
    sizes[i] = 0.5 + Math.random() * 4.0;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color',    new THREE.BufferAttribute(colors,    3));
  geometry.setAttribute('size',     new THREE.BufferAttribute(sizes,     1));

  /* ── Circular sprite texture (smooth round star) ───────────────────────── */
  const spriteCanvas = document.createElement('canvas');
  spriteCanvas.width  = 64;
  spriteCanvas.height = 64;
  const ctx = spriteCanvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0,    'rgba(255,255,255,1)');
  gradient.addColorStop(0.25, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(0.6,  'rgba(255,255,255,0.2)');
  gradient.addColorStop(1,    'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const starTexture = new THREE.CanvasTexture(spriteCanvas);

  const material = new THREE.PointsMaterial({
    size:            3,
    sizeAttenuation: true,         // far stars look smaller
    vertexColors:    true,
    map:             starTexture,
    transparent:     true,
    depthWrite:      false,
    blending:        THREE.AdditiveBlending,
  });

  const stars = new THREE.Points(geometry, material);
  scene.add(stars);

  /* ══════════════════════════════════════════════════════════════════════════
     3 · INPUT STATE
  ══════════════════════════════════════════════════════════════════════════ */
  /* Mouse tilt target (normalised −1 … +1) */
  let mouseNX = 0; // normalised X  (right = +1)
  let mouseNY = 0; // normalised Y  (down  = +1)

  window.addEventListener('mousemove', (e) => {
    mouseNX = (e.clientX / window.innerWidth)  * 2 - 1; //  −1 … +1
    mouseNY = (e.clientY / window.innerHeight) * 2 - 1; //  −1 … +1
  });

  /* Scroll → camera Z */
  const CAM_Z_START =  500;  // at scrollY = 0     → outside the field
  const CAM_Z_END   = -500;  // at scrollY = max   → deep inside the field

  function getTargetCameraZ() {
    const scrollMax = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const t = Math.min(1, window.scrollY / scrollMax); // 0 … 1
    return CAM_Z_START + (CAM_Z_END - CAM_Z_START) * t;
  }

  /* ══════════════════════════════════════════════════════════════════════════
     4 · ANIMATION LOOP
  ══════════════════════════════════════════════════════════════════════════ */
  const MAX_TILT = (5 * Math.PI) / 180; // 5 degrees in radians

  /* Smoothed values for lerp */
  let smoothCamZ    = CAM_Z_START;
  let smoothTiltX   = 0;
  let smoothTiltY   = 0;

  function animate() {
    requestAnimationFrame(animate);

    /* ── 4a · Scroll-driven camera Z (smooth lerp) ─── */
    const targetZ = getTargetCameraZ();
    smoothCamZ += (targetZ - smoothCamZ) * 0.06;
    camera.position.z = smoothCamZ;

    /* ── 4b · Mouse tilt on camera (smooth lerp, ±5°) ─ */
    smoothTiltY += ( mouseNX * MAX_TILT - smoothTiltY) * 0.04;
    smoothTiltX += (-mouseNY * MAX_TILT - smoothTiltX) * 0.04;
    camera.rotation.y = smoothTiltY;
    camera.rotation.x = smoothTiltX;

    /* ── 4c · Very slow auto-rotation on scene Y ─────── */
    scene.rotation.y += 0.0001;

    renderer.render(scene, camera);
  }

  animate();

  /* ══════════════════════════════════════════════════════════════════════════
     5 · RESIZE HANDLER
  ══════════════════════════════════════════════════════════════════════════ */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

})();
