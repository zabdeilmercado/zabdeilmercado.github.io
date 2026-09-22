document.getElementById('year').textContent = new Date().getFullYear();

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
