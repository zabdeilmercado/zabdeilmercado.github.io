document.getElementById('year').textContent = new Date().getFullYear();

// Site-wide code field inspired by ThreeUI's Particle Drift, implemented in
// vanilla Canvas to preserve the portfolio's dependency-free architecture.
(() => {
  const canvas = document.querySelector('.code-field');
  const context = canvas?.getContext('2d');
  if (!canvas || !context) return;

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const MOTION_SPEED = 1.60;
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*'.split('');
  let width = 0, height = 0, scale = 1, frame = 0, previous = 0;
  let nodes = [], beams = [], pointer = null;

  function seed() {
    const nodeCount = width < 640 ? 32 : Math.min(72, Math.round(width / 19));
    const beamCount = width < 640 ? 7 : Math.min(18, Math.round(width / 82));
    nodes = Array.from({length: nodeCount}, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 0.045 + Math.random() * 0.12,
      character: characters[Math.floor(Math.random() * characters.length)]
    }));
    beams = Array.from({length: beamCount}, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 42 + Math.random() * 92,
      speed: 0.42 + Math.random() * 0.75,
      alpha: 0.09 + Math.random() * 0.16
    }));
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    scale = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    seed();
    if (motion.matches) render(0, false);
  }

  function render(time, advance = true) {
    const delta = (previous && advance ? Math.min((time - previous) / 16.667, 2) : 1) * MOTION_SPEED;
    previous = time;
    context.clearRect(0, 0, width, height);

    for (const beam of beams) {
      if (advance) beam.y -= beam.speed * delta;
      if (beam.y + beam.length < 0) {
        beam.y = height + beam.length;
        beam.x = Math.random() * width;
      }
      const gradient = context.createLinearGradient(beam.x, beam.y, beam.x, beam.y + beam.length);
      gradient.addColorStop(0, `rgba(96,222,196,${beam.alpha})`);
      gradient.addColorStop(1, 'rgba(96,222,196,0)');
      context.strokeStyle = gradient;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(beam.x, beam.y);
      context.lineTo(beam.x, beam.y + beam.length);
      context.stroke();
    }

    context.lineWidth = 0.55;
    for (let i = 0; i < nodes.length; i++) {
      const first = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const second = nodes[j];
        const distance = Math.hypot(first.x - second.x, first.y - second.y);
        if (distance < 112) {
          context.strokeStyle = `rgba(96,222,196,${0.09 * (1 - distance / 112)})`;
          context.beginPath();
          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);
          context.stroke();
        }
      }
    }

    context.font = '11px Consolas, monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    for (const node of nodes) {
      if (advance) node.y += node.speed * delta;
      if (node.y > height + 16) { node.y = -16; node.x = Math.random() * width; }
      const distance = pointer ? Math.hypot(pointer.x - node.x, pointer.y - node.y) : Infinity;
      if (advance && (distance < 150 || Math.random() > 0.996)) {
        node.character = characters[Math.floor(Math.random() * characters.length)];
      }
      if (pointer && distance < 150) {
        context.strokeStyle = `rgba(96,222,196,${0.22 * (1 - distance / 150)})`;
        context.beginPath();
        context.moveTo(node.x, node.y);
        context.lineTo(pointer.x, pointer.y);
        context.stroke();
      }
      context.fillStyle = distance < 150 ? 'rgba(96,222,196,.64)' : 'rgba(153,171,197,.24)';
      context.fillText(node.character, node.x, node.y);
    }

    if (advance && !document.hidden && !motion.matches) frame = requestAnimationFrame(render);
    else frame = 0;
  }

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
  }

  function start() {
    stop();
    if (!document.hidden && !motion.matches) frame = requestAnimationFrame(render);
    else render(0, false);
  }

  addEventListener('pointermove', event => {
    if (motion.matches || event.pointerType === 'touch') return;
    const bounds = canvas.getBoundingClientRect();
    pointer = {x: event.clientX - bounds.left, y: event.clientY - bounds.top};
  }, {passive:true});
  document.addEventListener('pointerleave', () => { pointer = null; });
  addEventListener('resize', () => { resize(); start(); }, {passive:true});
  document.addEventListener('visibilitychange', start);
  motion.addEventListener('change', start);
  resize();
  start();
})();

// Original Canvas particle interaction, using this portfolio's own portrait.
(() => {
  const frame = document.querySelector('.photo');
  const image = frame.querySelector('img');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;
  canvas.setAttribute('aria-hidden', 'true');
  frame.append(canvas);
  const button = document.createElement('button');
  button.className = 'portrait-scatter';
  button.type = 'button';
  button.textContent = 'Scatter portrait ↗';
  button.hidden = true;
  document.querySelector('.portrait').append(button);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const width = 340, height = 425;
  let points = [], animation = 0, previous = 0, active = false;
  let visible = true, pointer = null, pulseUntil = 0;

  function paint() {
    context.clearRect(0, 0, width, height);
    for (const p of points) {
      context.fillStyle = `rgba(96,222,196,${p.alpha})`;
      context.beginPath();
      context.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      context.fill();
    }
  }
  function stop() {
    cancelAnimationFrame(animation);
    animation = 0;
    previous = 0;
  }
  function wake() {
    if (!animation && visible && !document.hidden && !motion.matches && points.length) {
      previous = 0;
      animation = requestAnimationFrame(step);
    }
  }
  function step(time) {
    const dt = previous ? Math.min((time - previous) / 16.667, 2) : 1;
    previous = time;
    if (pulseUntil && time > pulseUntil) { pointer = null; pulseUntil = 0; }
    let moving = false;
    for (const p of points) {
      let ax = (p.homeX - p.x) * 0.025;
      let ay = (p.homeY - p.y) * 0.025;
      if (pointer) {
        const dx = p.x - pointer.x, dy = p.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 72) {
          const force = (1 - distance / 72) * 1.7;
          ax += (distance > 0.1 ? dx / distance : 1) * force;
          ay += (distance > 0.1 ? dy / distance : 0) * force;
        }
      }
      const damping = Math.pow(0.84, dt);
      p.vx = (p.vx + ax * dt) * damping;
      p.vy = (p.vy + ay * dt) * damping;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (Math.abs(p.homeX - p.x) + Math.abs(p.homeY - p.y) + Math.abs(p.vx) + Math.abs(p.vy) > 0.08) moving = true;
    }
    paint();
    if (pointer || moving) animation = requestAnimationFrame(step);
    else {
      for (const p of points) { p.x = p.homeX; p.y = p.homeY; p.vx = p.vy = 0; }
      paint(); stop();
    }
  }
  function release() { pointer = null; pulseUntil = 0; wake(); }
  function locate(event) {
    const rect = frame.getBoundingClientRect();
    pointer = {x:(event.clientX - rect.left) * width / rect.width, y:(event.clientY - rect.top) * height / rect.height};
    wake();
  }
  frame.addEventListener('pointermove', event => {
    if (event.pointerType !== 'touch') { pulseUntil = 0; locate(event); }
  });
  frame.addEventListener('pointerdown', event => {
    locate(event);
    pulseUntil = performance.now() + 450;
  });
  frame.addEventListener('pointerleave', release);
  frame.addEventListener('pointercancel', release);
  button.addEventListener('click', () => {
    if (motion.matches) return;
    for (const p of points) {
      const angle = Math.atan2(p.homeY - height / 2, p.homeX - width / 2);
      const force = 6 + Math.random() * 7;
      p.vx += Math.cos(angle) * force;
      p.vy += Math.sin(angle) * force;
    }
    wake();
  });
  function configureMotion() {
    stop(); pointer = null; pulseUntil = 0;
    for (const p of points) { p.x = p.homeX; p.y = p.homeY; p.vx = p.vy = 0; }
    button.hidden = motion.matches || !active;
    frame.classList.toggle('motion-reduced', motion.matches);
    paint();
  }
  motion.addEventListener('change', configureMotion);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { stop(); pointer = null; } else wake();
  });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) wake(); else { stop(); pointer = null; }
  }).observe(frame);

  function initialize() {
    if (active || !image.naturalWidth) return;
    try {
      const sample = document.createElement('canvas');
      sample.width = width; sample.height = height;
      const pixelsContext = sample.getContext('2d', {willReadFrequently:true});
      pixelsContext.drawImage(image, 0, 0, width, height);
      const data = pixelsContext.getImageData(0, 0, width, height).data;
      // Retain the brightest teal sample in each cell, discarding the navy backdrop.
      for (let y = 0; y < height - 3; y += 3) for (let x = 0; x < width - 3; x += 3) {
        let best = 0, px = x, py = y;
        for (let oy = 0; oy < 3; oy++) for (let ox = 0; ox < 3; ox++) {
          const i = ((y + oy) * width + x + ox) * 4;
          const value = data[i + 1] - data[i];
          if (data[i + 1] > 65 && value > best) { best = value; px = x + ox; py = y + oy; }
        }
        if (best > 24) points.push({x:px,y:py,homeX:px,homeY:py,vx:0,vy:0,alpha:Math.min(0.95, best / 145),radius:best > 80 ? 0.85 : 0.6});
      }
      if (!points.length) return;
      const scale = Math.min(devicePixelRatio || 1, 2);
      canvas.width = width * scale; canvas.height = height * scale;
      context.scale(scale, scale);
      active = true;
      configureMotion();
      frame.classList.add('particles-ready');
    } catch { /* Keep the static portrait if Canvas cannot read the image. */ }
  }
  if (image.complete) initialize(); else image.addEventListener('load', initialize, {once:true});
})();
