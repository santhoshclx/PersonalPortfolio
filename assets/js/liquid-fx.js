/**
 * liquid-fx.js - Liquid Glass, Ambient Motion & Interactive Visualizations
 * High-performance, zero-dependency canvas & DOM interaction engine
 * Designed for Santhoshkumar R's PersonalPortfolio
 */

(function () {
  'use strict';

  // Check user motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =========================================================================
  // 1. TOP READING / SCROLL PROGRESS BAR
  // =========================================================================
  function initScrollProgress() {
    let progressBar = document.querySelector('.liquid-scroll-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'liquid-scroll-progress';
      progressBar.setAttribute('aria-hidden', 'true');
      document.body.prepend(progressBar);
    }

    const updateProgress = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = scrolled + '%';
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // =========================================================================
  // 2. VIBRANT MULTI-LAYERED AMBIENT CANVAS
  //    (Mesh Gradient Fields, Flowing Light Ribbons, Neural Synapses, Holographic Grid)
  // =========================================================================
  function initAmbientCanvas() {
    if (prefersReducedMotion) return;

    let canvas = document.getElementById('liquid-ambient-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'liquid-ambient-canvas';
      canvas.className = 'liquid-ambient-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId = null;
    let isVisible = true;

    // Handle visibility changes to save CPU/battery
    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
      if (isVisible && !animationFrameId) {
        animate();
      }
    });

    // Ambient floating orbs (Chromatic Light Pools)
    const orbs = [
      { x: 0.15, y: 0.22, r: 320, vx: 0.00028, vy: 0.00018, hue: 195, baseAlpha: 0.14 }, // Cyan
      { x: 0.82, y: 0.32, r: 360, vx: -0.00022, vy: 0.00024, hue: 255, baseAlpha: 0.12 }, // Ultraviolet
      { x: 0.48, y: 0.78, r: 340, vx: 0.00025, vy: -0.00020, hue: 305, baseAlpha: 0.11 }, // Magenta
      { x: 0.90, y: 0.85, r: 300, vx: -0.00018, vy: -0.00022, hue: 215, baseAlpha: 0.10 }, // Electric Blue
      { x: 0.12, y: 0.70, r: 280, vx: 0.00020, vy: 0.00015, hue: 170, baseAlpha: 0.09 }   // Teal
    ];

    // Flowing Translucent Light Ribbons (Liquid Bezier Waves)
    const ribbons = [
      { yRatio: 0.30, amplitude: 65, frequency: 0.0018, speed: 0.0007, hue1: 190, hue2: 260, alpha: 0.055, thickness: 160 },
      { yRatio: 0.62, amplitude: 80, frequency: 0.0015, speed: -0.0006, hue1: 250, hue2: 315, alpha: 0.050, thickness: 190 },
      { yRatio: 0.85, amplitude: 55, frequency: 0.0022, speed: 0.0008, hue1: 210, hue2: 175, alpha: 0.045, thickness: 140 }
    ];

    // Neural Network Particles & Traveling Synaptic Packets
    let particles = [];
    let synapticPackets = [];
    let maxConnectDist = 190;

    function initParticles() {
      // Dynamic connection distance and grid tailored to browser viewport
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1200;

      // Calculate cellular grid to evenly fit and distribute across the entire site
      const cols = isMobile ? 5 : isTablet ? 7 : Math.min(11, Math.max(8, Math.round(width / 165)));
      const rows = isMobile ? 6 : isTablet ? 6 : Math.min(8, Math.max(5, Math.round(height / 165)));
      const cellW = width / cols;
      const cellH = height / rows;

      maxConnectDist = Math.min(220, Math.max(160, Math.round(Math.max(cellW, cellH) * 1.15)));

      particles = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Even cellular placement with natural organic jitter so whole screen is covered
          const jX = (Math.random() - 0.5) * cellW * 0.75;
          const jY = (Math.random() - 0.5) * cellH * 0.75;
          particles.push({
            x: (c + 0.5) * cellW + jX,
            y: (r + 0.5) * cellH + jY,
            vx: (Math.random() - 0.5) * 0.28,
            vy: (Math.random() - 0.5) * 0.28,
            size: Math.random() * 1.8 + 1.2,
            alpha: Math.random() * 0.35 + 0.25,
            hue: Math.random() > 0.45 ? 195 : 275
          });
        }
      }

      // Fast, glowing synaptic data packets flowing smoothly between connected nodes
      synapticPackets = [];
      const packetCount = isMobile ? 14 : 26;
      for (let i = 0; i < packetCount; i++) {
        const p1Idx = Math.floor(Math.random() * particles.length);
        synapticPackets.push({
          sourceIdx: p1Idx,
          targetIdx: findNearestConnectedNode(p1Idx),
          progress: Math.random(),
          speed: 0.0045 + Math.random() * 0.004,
          hue: Math.random() > 0.5 ? 190 : 310
        });
      }
    }

    function findNearestConnectedNode(sourceIdx) {
      const p1 = particles[sourceIdx];
      if (!p1) return (sourceIdx + 1) % (particles.length || 1);
      let closestIdx = -1;
      let closestDist = Infinity;
      for (let i = 0; i < particles.length; i++) {
        if (i === sourceIdx) continue;
        const d = Math.hypot(p1.x - particles[i].x, p1.y - particles[i].y);
        if (d < maxConnectDist && d < closestDist) {
          closestDist = d;
          closestIdx = i;
        }
      }
      return closestIdx !== -1 ? closestIdx : Math.floor(Math.random() * particles.length);
    }

    // Floating Glass Diamond Wireframes
    const glassShapes = [
      { x: 0.18, y: 0.40, size: 26, rot: 0, rotSpeed: 0.003, hue: 190 },
      { x: 0.86, y: 0.20, size: 34, rot: 0.8, rotSpeed: -0.0025, hue: 270 },
      { x: 0.75, y: 0.75, size: 28, rot: 1.5, rotSpeed: 0.002, hue: 310 },
      { x: 0.28, y: 0.88, size: 22, rot: 2.2, rotSpeed: -0.0035, hue: 170 }
    ];

    let mouseX = -9999;
    let mouseY = -9999;
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      targetParallaxX = (e.clientX - width / 2) * 0.02;
      targetParallaxY = (e.clientY - height / 2) * 0.02;
    }, { passive: true });

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };

    function animate(time = 0) {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      // Smooth parallax interpolation
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.05;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

      // -------------------------------------------------------------
      // LAYER 1: Ambient Floating Gradient Orbs (Liquid Mesh Light)
      // -------------------------------------------------------------
      orbs.forEach((orb, idx) => {
        const oscX = Math.sin(time * orb.vx + idx) * (width * 0.06);
        const oscY = Math.cos(time * orb.vy + idx) * (height * 0.06);
        const posX = orb.x * width + oscX + currentParallaxX * 0.8;
        const posY = orb.y * height + oscY + currentParallaxY * 0.8;

        const grad = ctx.createRadialGradient(posX, posY, 0, posX, posY, orb.r);
        const alpha = isDark ? orb.baseAlpha : orb.baseAlpha * 0.5;

        // Subtle color drift over time
        const dynamicHue = (orb.hue + Math.sin(time * 0.0002 + idx) * 18) % 360;
        grad.addColorStop(0, `hsla(${dynamicHue}, 85%, ${isDark ? '60%' : '50%'}, ${alpha})`);
        grad.addColorStop(0.5, `hsla(${(dynamicHue + 25) % 360}, 80%, ${isDark ? '55%' : '45%'}, ${alpha * 0.4})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(posX, posY, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // -------------------------------------------------------------
      // LAYER 2: Flowing Translucent Light Ribbons (Liquid Waves)
      // -------------------------------------------------------------
      ribbons.forEach((ribbon, rIdx) => {
        const baseY = ribbon.yRatio * height + Math.sin(time * 0.0004 + rIdx) * 20;
        const ribbonAlpha = isDark ? ribbon.alpha : ribbon.alpha * 0.45;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, baseY);

        const segments = 6;
        const segWidth = width / segments;

        for (let i = 0; i <= segments; i++) {
          const x = i * segWidth;
          const wavePhase = time * ribbon.speed + (i * 0.7);
          const yOffset = Math.sin(wavePhase) * ribbon.amplitude;
          const y = baseY + yOffset;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            const prevX = (i - 1) * segWidth;
            const prevWavePhase = time * ribbon.speed + ((i - 1) * 0.7);
            const prevY = baseY + Math.sin(prevWavePhase) * ribbon.amplitude;
            const cpX = (prevX + x) / 2;
            ctx.quadraticCurveTo(prevX + segWidth * 0.5, prevY, x, y);
          }
        }

        // Complete the filled ribbon polygon
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        const ribbonGrad = ctx.createLinearGradient(0, baseY - ribbon.thickness, width, baseY + ribbon.thickness);
        ribbonGrad.addColorStop(0, `hsla(${ribbon.hue1}, 90%, 65%, ${ribbonAlpha})`);
        ribbonGrad.addColorStop(0.5, `hsla(${ribbon.hue2}, 85%, 60%, ${ribbonAlpha * 0.8})`);
        ribbonGrad.addColorStop(1, `hsla(${(ribbon.hue1 + 60) % 360}, 90%, 55%, 0)`);

        ctx.fillStyle = ribbonGrad;
        ctx.fill();

        // Glowing Crest Highlight Stroke
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
          const x = i * segWidth;
          const wavePhase = time * ribbon.speed + (i * 0.7);
          const y = baseY + Math.sin(wavePhase) * ribbon.amplitude;
          if (i === 0) ctx.moveTo(x, y);
          else {
            const prevX = (i - 1) * segWidth;
            const prevWavePhase = time * ribbon.speed + ((i - 1) * 0.7);
            const prevY = baseY + Math.sin(prevWavePhase) * ribbon.amplitude;
            ctx.quadraticCurveTo((prevX + x) / 2, prevY, x, y);
          }
        }
        ctx.strokeStyle = `hsla(${ribbon.hue1}, 95%, 70%, ${ribbonAlpha * 2.2})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      });

      // -------------------------------------------------------------
      // LAYER 3: Cybernetic Micro Coordinates & Floating Diamonds
      // -------------------------------------------------------------
      glassShapes.forEach((shape, sIdx) => {
        shape.rot += shape.rotSpeed;
        const posX = shape.x * width + Math.sin(time * 0.0003 + sIdx) * 25 + currentParallaxX * 0.4;
        const posY = shape.y * height + Math.cos(time * 0.0003 + sIdx) * 25 + currentParallaxY * 0.4;

        ctx.save();
        ctx.translate(posX, posY);
        ctx.rotate(shape.rot);

        ctx.strokeStyle = `hsla(${shape.hue}, 85%, 65%, ${isDark ? 0.12 : 0.06})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);

        // Center micro node
        ctx.fillStyle = `hsla(${shape.hue}, 90%, 75%, ${isDark ? 0.25 : 0.12})`;
        ctx.fillRect(-1.5, -1.5, 3, 3);
        ctx.restore();
      });

      // -------------------------------------------------------------
      // LAYER 4: Neural Network Particles & Traveling Synaptic Packets
      // -------------------------------------------------------------
      const activeColor = isDark ? '56, 189, 248' : '2, 132, 199';
      const magentaColor = isDark ? '217, 70, 239' : '192, 38, 211';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries gracefully with margin
        const pad = 24;
        if (p.x < -pad) p.x = width + pad;
        if (p.x > width + pad) p.x = -pad;
        if (p.y < -pad) p.y = height + pad;
        if (p.y > height + pad) p.y = -pad;

        // Soft magnetic mouse pull
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distToMouse = Math.hypot(dx, dy);
        if (distToMouse < 200) {
          const factor = (200 - distToMouse) / 200;
          p.x += (dx / distToMouse) * factor * 0.42;
          p.y += (dy / distToMouse) * factor * 0.42;
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, ${isDark ? '68%' : '50%'}, ${isDark ? p.alpha : p.alpha * 0.6})`;
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < maxConnectDist) {
            const alpha = Math.pow(1 - dist / maxConnectDist, 1.4) * (isDark ? 0.22 : 0.10);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${activeColor}, ${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      // Connect interactive mouse cursor to nearest nodes across the site
      if (mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dist = Math.hypot(p.x - mouseX, p.y - mouseY);
          if (dist < 170) {
            const alpha = (1 - dist / 170) * (isDark ? 0.35 : 0.18);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = `rgba(${activeColor}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Render moving synaptic energy pulses along active connection paths (Ultra-fast 60 FPS)
      synapticPackets.forEach(pkt => {
        const p1 = particles[pkt.sourceIdx];
        const p2 = particles[pkt.targetIdx];
        if (!p1 || !p2) {
          pkt.sourceIdx = Math.floor(Math.random() * particles.length);
          pkt.targetIdx = findNearestConnectedNode(pkt.sourceIdx);
          return;
        }

        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist <= maxConnectDist * 1.15) {
          pkt.progress += pkt.speed;
          if (pkt.progress >= 1) {
            pkt.progress = 0;
            pkt.sourceIdx = pkt.targetIdx;
            pkt.targetIdx = findNearestConnectedNode(pkt.sourceIdx);
          }

          const curX = p1.x + (p2.x - p1.x) * pkt.progress;
          const curY = p1.y + (p2.y - p1.y) * pkt.progress;

          // Double-arc soft glow (fast 60 FPS without heavy shadowBlur)
          ctx.beginPath();
          ctx.arc(curX, curY, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${pkt.hue}, 95%, 70%, ${isDark ? 0.25 : 0.12})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(curX, curY, 2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${pkt.hue}, 100%, 80%, ${isDark ? 0.95 : 0.75})`;
          ctx.fill();
        } else {
          // If nodes separated beyond reach, redirect to connected pair
          pkt.sourceIdx = Math.floor(Math.random() * particles.length);
          pkt.targetIdx = findNearestConnectedNode(pkt.sourceIdx);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();
    animate();
  }

  // =========================================================================
  // 3. CURSOR-REACTIVE LIQUID GLASS NAVIGATION HIGHLIGHT PILL
  //    (Glides between tabs, fits target dimensions, returns to active)
  // =========================================================================
  function initLiquidNavPill() {
    const navbarList = document.querySelector('.navbar-list');
    if (!navbarList) return;

    // Inject shared sliding pill if not already present
    let pill = navbarList.querySelector('.navbar-liquid-pill');
    if (!pill) {
      pill = document.createElement('div');
      pill.className = 'navbar-liquid-pill';
      pill.setAttribute('aria-hidden', 'true');
      navbarList.prepend(pill);
    }

    let activeLink = navbarList.querySelector('.navbar-link.active') || navbarList.querySelector('.navbar-link');
    let isHovering = false;

    // Position pill to wrap a target link with precision
    function movePillTo(linkEl, opacity = 1) {
      if (!linkEl || !pill) return;
      const listRect = navbarList.getBoundingClientRect();
      const linkRect = linkEl.getBoundingClientRect();

      const left = linkRect.left - listRect.left;
      const top = linkRect.top - listRect.top;
      const width = linkRect.width;
      const height = linkRect.height;

      pill.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      pill.style.width = `${width}px`;
      pill.style.height = `${height}px`;
      pill.style.opacity = `${opacity}`;
    }

    // Refresh active reference and sync
    function syncToActive() {
      activeLink = navbarList.querySelector('.navbar-link.active') || navbarList.querySelector('.navbar-link');
      if (activeLink) {
        movePillTo(activeLink, 1);
      }
    }

    const navLinks = navbarList.querySelectorAll('.navbar-link');
    navLinks.forEach(link => {
      // Hover event
      link.addEventListener('mouseenter', () => {
        isHovering = true;
        movePillTo(link, 1);
      });

      // Keyboard accessibility (focus)
      link.addEventListener('focus', () => {
        movePillTo(link, 1);
      });

      // Click event
      link.addEventListener('click', () => {
        activeLink = link;
        movePillTo(link, 1);
      });
    });

    // When cursor leaves navbar entirely, glide back to active item
    navbarList.addEventListener('mouseleave', () => {
      isHovering = false;
      syncToActive();
    });

    navbarList.addEventListener('focusout', (e) => {
      if (!navbarList.contains(e.relatedTarget)) {
        syncToActive();
      }
    });

    // Initial setup with a slight delay for font loading / DOM reflow
    setTimeout(syncToActive, 60);
    window.addEventListener('resize', syncToActive, { passive: true });

    // Expose sync function to LiquidFX
    window._syncLiquidNavPill = syncToActive;
  }

  // =========================================================================
  // 4. CURSOR-RESPONSIVE GLASS SPOTLIGHT & CARD 3D TILT
  // =========================================================================
  function initGlassCardPhysics() {
    const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isDesktopPointer || prefersReducedMotion) return;

    // Desktop subtle pointer glow follower
    let cursorLight = document.querySelector('.liquid-cursor-glow');
    if (!cursorLight) {
      cursorLight = document.createElement('div');
      cursorLight.className = 'liquid-cursor-glow';
      cursorLight.setAttribute('aria-hidden', 'true');
      document.body.appendChild(cursorLight);
    }

    let curX = -200, curY = -200;
    let targetX = -200, targetY = -200;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    }, { passive: true });

    function renderCursorGlow() {
      curX += (targetX - curX) * 0.16;
      curY += (targetY - curY) * 0.16;
      cursorLight.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
      requestAnimationFrame(renderCursorGlow);
    }
    renderCursorGlow();

    // 3D Glass Card Tilt & Specular border reflection on interactive cards
    const cardSelectors = '.project-card, .skill-category-card, .cert-card, .metric-pill, .hero-box, .ai-interactive-suite, .timeline-item';

    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest(cardSelectors);
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Set CSS variables for radial specular spotlight
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Gentle subtle 3D tilt (max 2.5 degrees for premium restraint)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -2.2;
      const rotateY = ((x - centerX) / centerX) * 2.2;

      card.style.setProperty('--card-rot-x', `${rotateX.toFixed(2)}deg`);
      card.style.setProperty('--card-rot-y', `${rotateY.toFixed(2)}deg`);
    }, { passive: true });

    document.addEventListener('mouseleave', (e) => {
      const card = e.target.closest(cardSelectors);
      if (card) {
        card.style.removeProperty('--card-rot-x');
        card.style.removeProperty('--card-rot-y');
      }
    }, true);
  }

  // =========================================================================
  // 5. INTERACTIVE EDGE-TO-CLOUD AI PIPELINE (HERO SECTION)
  // =========================================================================
  function initInteractiveHeroPipeline() {
    const container = document.querySelector('[data-hero-pipeline]');
    if (!container) return;

    const pipelineStages = [
      {
        id: 'stage-edge',
        name: 'Edge Ingestion',
        icon: 'videocam-outline',
        pill: 'RTSP / Multi-Feed',
        badge: 'Edge Layer',
        latency: '<4.2ms',
        throughput: '12 Streams',
        spec: 'GStreamer nvv4l2decoder hardware pipeline ingesting RTSP video feeds across facilities with 0 dropped frames.'
      },
      {
        id: 'stage-inference',
        name: 'AI Model Inference',
        icon: 'hardware-chip-outline',
        pill: 'YOLO · 35–45 FPS',
        badge: 'Jetson Orin Nano',
        latency: '22.4ms',
        throughput: '41.8 FPS',
        spec: 'Custom fine-tuned YOLO models accelerated with TensorRT running 35–45 FPS at ~91% mAP@0.5 detection accuracy.'
      },
      {
        id: 'stage-embeddings',
        name: 'Vector Embeddings',
        icon: 'finger-print-outline',
        pill: 'ArcFace · pgvector',
        badge: 'HNSW Search',
        latency: '8.1ms',
        throughput: '512-D Vectors',
        spec: '512-D InsightFace facial embeddings indexed via PostgreSQL pgvector with sub-millisecond similarity lookups.'
      },
      {
        id: 'stage-mlops',
        name: 'Cloud MLOps',
        icon: 'cloudy-outline',
        pill: 'SageMaker ml.g5',
        badge: 'AWS Infrastructure',
        latency: 'Auto-scaled',
        throughput: '99.99% Uptime',
        spec: 'Containerized inference endpoints on Amazon SageMaker with CodePipeline CI/CD and automated model telemetry.'
      },
      {
        id: 'stage-security',
        name: 'Zero-Trust Security',
        icon: 'shield-checkmark-outline',
        pill: 'SSM · KMS · 80% Score',
        badge: 'HIPAA & SOC 2',
        latency: 'Zero Open Ports',
        throughput: '80% Benchmark',
        spec: 'SSM ProxyCommand tunneling eliminating public SSH ports, automated KMS encryption, and 80% cloud security benchmark.'
      }
    ];

    container.innerHTML = `
      <div class="pipeline-header">
        <div class="pipeline-title-wrap">
          <span class="live-dot pulse"></span>
          <span class="pipeline-title">Edge-to-Cloud AI Architecture Flow</span>
        </div>
        <span class="pipeline-subtitle">Hover or tap nodes to inspect live production telemetry &amp; specs</span>
      </div>

      <div class="pipeline-flow-track">
        <div class="pipeline-nodes-grid">
          ${pipelineStages.map((stage, idx) => `
            <div class="pipeline-node ${idx === 0 ? 'active' : ''}" data-stage-id="${stage.id}" tabindex="0" role="button" aria-expanded="${idx === 0}">
              <div class="node-icon-box">
                <ion-icon name="${stage.icon}"></ion-icon>
                <span class="node-seq">${idx + 1}</span>
              </div>
              <div class="node-info">
                <span class="node-pill">${stage.pill}</span>
                <h4 class="node-title">${stage.name}</h4>
                <span class="node-badge">${stage.badge}</span>
              </div>
              ${idx < pipelineStages.length - 1 ? `
                <div class="node-connector" aria-hidden="true">
                  <span class="pulse-packet"></span>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <div class="pipeline-spec-drawer" data-pipeline-drawer>
        <div class="spec-content">
          <div class="spec-header">
            <span class="spec-tag" id="pipeline-spec-badge">${pipelineStages[0].badge}</span>
            <span class="spec-id" id="pipeline-spec-pill">${pipelineStages[0].pill}</span>
            <span class="spec-telemetry" style="margin-left:auto; font-family:var(--ff-mono); font-size:0.75rem; color:#34d399;" id="pipeline-spec-telemetry">
              Latency: ${pipelineStages[0].latency} · Throughput: ${pipelineStages[0].throughput}
            </span>
          </div>
          <h4 class="spec-title" id="pipeline-spec-title">${pipelineStages[0].name}</h4>
          <p class="spec-desc" id="pipeline-spec-desc">${pipelineStages[0].spec}</p>
        </div>
      </div>
    `;

    const nodeEls = container.querySelectorAll('.pipeline-node');
    const badgeEl = container.querySelector('#pipeline-spec-badge');
    const pillEl = container.querySelector('#pipeline-spec-pill');
    const telemetryEl = container.querySelector('#pipeline-spec-telemetry');
    const titleEl = container.querySelector('#pipeline-spec-title');
    const descEl = container.querySelector('#pipeline-spec-desc');

    const updateSpec = (stage) => {
      nodeEls.forEach(n => {
        const isMatch = n.dataset.stageId === stage.id;
        n.classList.toggle('active', isMatch);
        n.setAttribute('aria-expanded', isMatch ? 'true' : 'false');
      });

      if (badgeEl) badgeEl.textContent = stage.badge;
      if (pillEl) pillEl.textContent = stage.pill;
      if (telemetryEl) telemetryEl.textContent = `Latency: ${stage.latency} · Throughput: ${stage.throughput}`;
      if (titleEl) titleEl.textContent = stage.name;
      if (descEl) descEl.textContent = stage.spec;
    };

    nodeEls.forEach((node, idx) => {
      const stage = pipelineStages[idx];
      node.addEventListener('mouseenter', () => updateSpec(stage));
      node.addEventListener('focus', () => updateSpec(stage));
      node.addEventListener('click', () => updateSpec(stage));
    });
  }

  // =========================================================================
  // 6. INTERACTIVE PRODUCTION AI SANDBOX
  //    (Live Video YOLO Detection, GenAI Video RAG, Cloud MLOps & Security)
  // =========================================================================
  let cvGlobalAnimId = null;

  function initAISimulator() {
    const container = document.querySelector('[data-ai-suite]');
    if (!container) return;

    if (cvGlobalAnimId) {
      cancelAnimationFrame(cvGlobalAnimId);
      cvGlobalAnimId = null;
    }

    container.innerHTML = `
      <div class="ai-suite-header">
        <div class="ai-suite-title-group">
          <span class="ai-suite-badge">
            <ion-icon name="hardware-chip-outline"></ion-icon>
            Interactive Production AI Sandbox
          </span>
          <h3 class="ai-suite-title">Live Vision AI, GenAI &amp; MLOps Architecture Simulator</h3>
          <p class="ai-suite-subtitle">
            Interact with live simulations of my production engineering systems: real-time TensorRT YOLO video inference on NVIDIA Jetson, vector search RAG, and automated cloud MLOps.
          </p>
        </div>

        <div class="ai-suite-tabs-nav" role="tablist">
          <button class="ai-tab-btn active" data-ai-tab="cv" role="tab" aria-selected="true">
            <ion-icon name="videocam-outline"></ion-icon>
            <span>Computer Vision (YOLO)</span>
          </button>
          <button class="ai-tab-btn" data-ai-tab="rag" role="tab" aria-selected="false">
            <ion-icon name="sparkles-outline"></ion-icon>
            <span>GenAI &amp; Video RAG</span>
          </button>
          <button class="ai-tab-btn" data-ai-tab="mlops" role="tab" aria-selected="false">
            <ion-icon name="cloud-done-outline"></ion-icon>
            <span>Cloud MLOps &amp; Security</span>
          </button>
        </div>
      </div>

      <!-- TAB 1: COMPUTER VISION (YOLO + VIDEO PLAYBACK) -->
      <div class="ai-tab-panel active" id="ai-panel-cv" role="tabpanel">
        <div class="cv-sim-layout">
          <div class="cv-player-card">
            <div class="cv-viewport-wrap" id="cv-viewport-wrap">
              <!-- Native HTML5 Video Element -->
              <video 
                id="cv-video-player" 
                class="cv-video-element" 
                playsinline 
                muted 
                loop 
                preload="metadata"
                src="./assets/videos/traffic-detection.mp4">
              </video>

              <!-- Real-time YOLO Detection Overlay Canvas -->
              <canvas class="cv-feed-canvas cv-overlay-canvas" id="cv-feed-canvas"></canvas>

              <!-- Interactive Big Play Overlay -->
              <div class="cv-play-overlay" id="cv-play-overlay">
                <button class="cv-big-play-btn" id="cv-big-play-btn" aria-label="Play Live Video Stream">
                  <div class="cv-big-play-icon">
                    <ion-icon name="play"></ion-icon>
                  </div>
                  <span>Play Live YOLO Stream</span>
                </button>
              </div>

              <!-- Top HUD Overlay -->
              <div class="cv-hud-overlay">
                <div class="hud-feed-tag" id="cv-hud-tag">
                  <span class="live-dot emerald pulse" id="cv-live-dot"></span>
                  <span id="cv-stream-name">CAM-04 · HIGHWAY TRAFFIC (YOLOv8)</span>
                </div>
                <div class="hud-telemetry-pill" id="cv-hud-fps">
                  42.4 FPS · 22.8ms
                </div>
              </div>

              <!-- Interactive Video Timeline / Scrubber Bar -->
              <div class="cv-video-progress-wrap" id="cv-video-progress-wrap" title="Click to seek stream">
                <div class="cv-video-progress-bar" id="cv-video-progress-bar"></div>
              </div>
            </div>

            <!-- Bottom Video & AI Controls Bar -->
            <div class="cv-controls-bar">
              <div class="cv-controls-group">
                <button class="cv-action-btn primary" id="cv-play-btn" title="Play or Pause Video Feed">
                  <ion-icon name="play-outline" id="cv-play-icon"></ion-icon>
                  <span id="cv-play-label">Play Video</span>
                </button>
                <button class="cv-action-btn secondary" id="cv-feed-toggle-btn" title="Switch Between Traffic and Pedestrian Video Feeds">
                  <ion-icon name="swap-horizontal-outline"></ion-icon>
                  <span id="cv-feed-label">Feed: Traffic (Vehicles)</span>
                </button>
                <button class="cv-action-btn secondary active" id="cv-box-toggle-btn" title="Toggle YOLO Bounding Boxes Overlay">
                  <ion-icon name="scan-outline"></ion-icon>
                  <span id="cv-box-label">Boxes: ON</span>
                </button>
              </div>

              <div class="cv-controls-group">
                <button class="cv-action-btn pulse-btn" id="cv-scan-trigger" title="Trigger Detection Pulse Radar">
                  <ion-icon name="radio-outline"></ion-icon>
                  <span>Radar Pulse</span>
                </button>
                <button class="cv-action-btn secondary icon-btn" id="cv-mute-btn" title="Mute / Unmute Video Audio">
                  <ion-icon name="volume-mute-outline" id="cv-mute-icon"></ion-icon>
                </button>
              </div>
            </div>
          </div>

          <div class="cv-telemetry-sidebar">
            <div class="telemetry-card">
              <div class="telemetry-card-title">Production Inference Telemetry</div>
              <div class="telemetry-metrics-row">
                <div class="telemetry-stat-box">
                  <span class="stat-label">Model Accuracy</span>
                  <span class="stat-val emerald">~91.2%</span>
                  <span class="stat-meta">mAP@0.5 Boosted from ~82%</span>
                </div>
                <div class="telemetry-stat-box">
                  <span class="stat-label">Edge Throughput</span>
                  <span class="stat-val" id="cv-stat-fps">42.4 FPS</span>
                  <span class="stat-meta">NVIDIA TensorRT 8.6</span>
                </div>
                <div class="telemetry-stat-box">
                  <span class="stat-label">Inference Latency</span>
                  <span class="stat-val gold" id="cv-stat-latency">22.8 ms</span>
                  <span class="stat-meta">GStreamer NVMM zero-copy</span>
                </div>
                <div class="telemetry-stat-box">
                  <span class="stat-label">Active Detections</span>
                  <span class="stat-val magenta" id="cv-stat-detections">5 Vehicles</span>
                  <span class="stat-meta" id="cv-stat-model">YOLOv8 + Jetson Orin</span>
                </div>
              </div>
            </div>

            <div class="telemetry-card cv-hardware-info">
              <b class="cv-hardware-title">Hardware Acceleration:</b> Real-time video decode via GStreamer (<code>nvv4l2decoder</code>) with zero-copy CUDA memory passing to TensorRT 8.6 engine running on <b>NVIDIA Jetson Orin Nano Super</b> (35–45 FPS) and dual RTX 5090 test benches.
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: GENAI & VIDEO RAG SIMULATOR -->
      <div class="ai-tab-panel" id="ai-panel-rag" role="tabpanel">
        <div class="rag-flow-wrap">
          <div class="rag-query-box">
            <span style="font-size:0.78rem; text-transform:uppercase; color:var(--accent-cyan); font-weight:700;">Query Prompt:</span>
            <div class="rag-query-input" id="rag-query-text">"Find unauthorized perimeter approach in Sector-B loading bay after 22:00"</div>
            <button class="cv-action-btn primary" id="rag-run-btn">
              <ion-icon name="play-outline"></ion-icon>
              <span>Run RAG Retrieval</span>
            </button>
          </div>

          <div class="rag-steps-grid">
            <div class="rag-step-card active-step" id="rag-step-1">
              <div class="rag-step-num">1</div>
              <h5 class="rag-step-title">Query Vectorization</h5>
              <p class="rag-step-desc">Extracting 512-D multimodal text/image embedding via CLIP/ArcFace encoder in 4.1ms.</p>
            </div>
            <div class="rag-step-card" id="rag-step-2">
              <div class="rag-step-num">2</div>
              <h5 class="rag-step-title">HNSW Vector Search</h5>
              <p class="rag-step-desc">PostgreSQL + pgvector HNSW similarity search over 850,000 CCTV frames in 8.2ms.</p>
            </div>
            <div class="rag-step-card" id="rag-step-3">
              <div class="rag-step-num">3</div>
              <h5 class="rag-step-title">Context Assembly</h5>
              <p class="rag-step-desc">Filtering top-3 verified event records with high cosine similarity (>0.88) and metadata.</p>
            </div>
            <div class="rag-step-card" id="rag-step-4">
              <div class="rag-step-num">4</div>
              <h5 class="rag-step-title">LLM Synthesis</h5>
              <p class="rag-step-desc">Generating verified audit report with timestamped frame citations and security alert status.</p>
            </div>
          </div>

          <div class="rag-output-box" id="rag-output-box">
            <div style="color:var(--accent-cyan); margin-bottom:6px; font-weight:700;">[RAG PIPELINE RESULT · Aurora PostgreSQL pgvector · Latency: 12.3ms]</div>
            <div>[22:14:08] Target matched ArcFace vector cluster #4092 (Cosine: 0.941). Personnel detected in restricted Sector-B perimeter without required High-Vis PPE (Confidence: 96.8%). Incident logged to CloudWatch with automated SNS alert.</div>
          </div>
        </div>
      </div>

      <!-- TAB 3: CLOUD MLOPS & ZERO-TRUST SECURITY -->
      <div class="ai-tab-panel" id="ai-panel-mlops" role="tabpanel">
        <div class="cv-sim-layout">
          <div class="telemetry-card">
            <div class="telemetry-card-title">Production AWS MLOps Blueprint</div>
            <div style="display:flex; flex-direction:column; gap:12px; margin-top:10px;">
              <div class="mlops-step-card step-cyan">
                <ion-icon name="git-branch-outline" style="font-size:1.4rem; color:var(--accent-blue); flex-shrink:0;"></ion-icon>
                <div>
                  <div class="mlops-step-title">1. Git Commit &amp; CodePipeline</div>
                  <div class="mlops-step-desc">Automated webhook triggers Docker container build in AWS ECR with GPU CUDA 12.2.</div>
                </div>
              </div>
              <div class="mlops-step-card step-emerald">
                <ion-icon name="cloud-upload-outline" style="font-size:1.4rem; color:#059669; flex-shrink:0;"></ion-icon>
                <div>
                  <div class="mlops-step-title">2. SageMaker ml.g5 Serverless Deploy</div>
                  <div class="mlops-step-desc">Blue-Green canary deployment with zero downtime and automatic rollback protection.</div>
                </div>
              </div>
              <div class="mlops-step-card step-gold">
                <ion-icon name="shield-checkmark-outline" style="font-size:1.4rem; color:#d97706; flex-shrink:0;"></ion-icon>
                <div>
                  <div class="mlops-step-title">3. Zero-Trust SSM Tunnel (No Open Ports)</div>
                  <div class="mlops-step-desc">Public SSH ports eliminated; zero-attack-surface administration via AWS Systems Manager Session Manager.</div>
                </div>
              </div>
            </div>
          </div>

          <div class="cv-telemetry-sidebar">
            <div class="telemetry-card">
              <div class="telemetry-card-title">Verified Security &amp; Financial Impact</div>
              <div class="telemetry-metrics-row">
                <div class="telemetry-stat-box">
                  <span class="stat-label">Cloud Cost Reduction</span>
                  <span class="stat-val gold">40%</span>
                  <span class="stat-meta">Eliminated idle EC2 endpoints</span>
                </div>
                <div class="telemetry-stat-box">
                  <span class="stat-label">Security Benchmark</span>
                  <span class="stat-val emerald">80%</span>
                  <span class="stat-meta">AWS Certified Security verified</span>
                </div>
                <div class="telemetry-stat-box">
                  <span class="stat-label">Compliance Controls</span>
                  <span class="stat-val magenta">HIPAA · SOC 2</span>
                  <span class="stat-meta">Type II Encrypted KMS audit</span>
                </div>
                <div class="telemetry-stat-box">
                  <span class="stat-label">CI/CD Turnaround</span>
                  <span class="stat-val">100% Auto</span>
                  <span class="stat-meta">Zero-downtime model rollouts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Tab switching behavior
    const tabs = container.querySelectorAll('.ai-tab-btn');
    const panels = container.querySelectorAll('.ai-tab-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.dataset.aiTab;
        tabs.forEach(t => {
          const isTarget = t === tab;
          t.classList.toggle('active', isTarget);
          t.setAttribute('aria-selected', isTarget ? 'true' : 'false');
        });

        panels.forEach(panel => {
          const isMatch = panel.id === `ai-panel-${targetId}`;
          panel.classList.toggle('active', isMatch);
        });

        if (targetId === 'cv') {
          setTimeout(resizeCvCanvas, 60);
        }
      });
    });

    // -------------------------------------------------------------
    // VIDEO & YOLO OVERLAY IMPLEMENTATION
    // -------------------------------------------------------------
    const video = document.getElementById('cv-video-player');
    const cvCanvas = document.getElementById('cv-feed-canvas');
    const playOverlay = document.getElementById('cv-play-overlay');
    const bigPlayBtn = document.getElementById('cv-big-play-btn');
    const playBtn = document.getElementById('cv-play-btn');
    const playIcon = document.getElementById('cv-play-icon');
    const playLabel = document.getElementById('cv-play-label');
    const feedToggleBtn = document.getElementById('cv-feed-toggle-btn');
    const feedLabel = document.getElementById('cv-feed-label');
    const boxToggleBtn = document.getElementById('cv-box-toggle-btn');
    const boxLabel = document.getElementById('cv-box-label');
    const muteBtn = document.getElementById('cv-mute-btn');
    const muteIcon = document.getElementById('cv-mute-icon');
    const streamNameEl = document.getElementById('cv-stream-name');
    const liveDot = document.getElementById('cv-live-dot');
    const progressBar = document.getElementById('cv-video-progress-bar');
    const progressWrap = document.getElementById('cv-video-progress-wrap');
    const statDetections = document.getElementById('cv-stat-detections');
    const statModel = document.getElementById('cv-stat-model');
    const scanBtn = document.getElementById('cv-scan-trigger');

    const FEEDS = [
      {
        id: 'traffic',
        name: 'CAM-04 · HIGHWAY TRAFFIC (YOLOv8)',
        label: 'Feed: Traffic (Vehicles)',
        model: 'YOLOv8 + Jetson Orin',
        src: './assets/videos/traffic-detection.mp4',
        objectsCount: '5 Vehicles',
        targets: [
          { label: 'Sedan #104', type: 'car', baseConf: 98.4, speed: '62 km/h', color: '#38bdf8', baseX: 0.18, baseY: 0.38, w: 85, h: 58, vx: 0.05, vy: 0.02 },
          { label: 'Truck #105', type: 'truck', baseConf: 99.1, speed: '48 km/h', color: '#34d399', baseX: 0.44, baseY: 0.28, w: 110, h: 85, vx: -0.035, vy: 0.015 },
          { label: 'SUV #108', type: 'car', baseConf: 97.2, speed: '59 km/h', color: '#fbbf24', baseX: 0.62, baseY: 0.46, w: 90, h: 65, vx: -0.045, vy: 0.022 },
          { label: 'Van #112', type: 'van', baseConf: 96.5, speed: '54 km/h', color: '#38bdf8', baseX: 0.34, baseY: 0.54, w: 88, h: 62, vx: 0.042, vy: -0.01 },
          { label: 'Compact #115', type: 'car', baseConf: 95.8, speed: '66 km/h', color: '#f472b6', baseX: 0.10, baseY: 0.22, w: 72, h: 48, vx: 0.058, vy: 0.018 }
        ]
      },
      {
        id: 'people',
        name: 'CAM-08 · PEDESTRIAN WALKWAY (ArcFace + YOLO)',
        label: 'Feed: Pedestrians (ArcFace)',
        model: 'InsightFace + YOLOv8',
        src: './assets/videos/people-detection.mp4',
        objectsCount: '4 Persons',
        targets: [
          { label: 'Personnel #8042', type: 'person', baseConf: 98.8, speed: 'ArcFace 512-D', color: '#34d399', baseX: 0.22, baseY: 0.26, w: 68, h: 130, vx: 0.025, vy: 0.005 },
          { label: 'PPE: High-Vis Vest', type: 'ppe', baseConf: 99.4, speed: 'Verified', color: '#38bdf8', baseX: 0.23, baseY: 0.36, w: 50, h: 44, vx: 0.025, vy: 0.005 },
          { label: 'Visitor #109', type: 'person', baseConf: 96.4, speed: 'Visitor Badge', color: '#fbbf24', baseX: 0.58, baseY: 0.30, w: 72, h: 135, vx: -0.03, vy: 0.008 },
          { label: 'PPE: Safety Glasses', type: 'ppe', baseConf: 97.9, speed: 'Compliant', color: '#f472b6', baseX: 0.60, baseY: 0.33, w: 32, h: 20, vx: -0.03, vy: 0.008 }
        ]
      }
    ];

    let currentFeedIdx = 0;
    let boxesEnabled = true;
    let scanlineY = 0;
    let pulseActive = false;
    let pulseTimer = 0;

    function resizeCvCanvas() {
      if (!cvCanvas) return;
      const rect = cvCanvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        cvCanvas.width = Math.round(rect.width);
        cvCanvas.height = Math.round(rect.height);
      }
    }

    window.addEventListener('resize', resizeCvCanvas, { passive: true });
    resizeCvCanvas();

    function updatePlayUI(playing) {
      if (playIcon) playIcon.setAttribute('name', playing ? 'pause-outline' : 'play-outline');
      if (playLabel) playLabel.textContent = playing ? 'Pause Video' : 'Play Video';
      if (playOverlay) {
        if (playing) {
          playOverlay.classList.add('hidden');
        } else {
          playOverlay.classList.remove('hidden');
        }
      }
      if (liveDot) {
        liveDot.className = playing ? 'live-dot emerald pulse' : 'live-dot gold';
      }
    }

    function toggleVideoPlay() {
      if (!video) return;
      if (video.paused || video.ended) {
        video.play().then(() => {
          updatePlayUI(true);
        }).catch(err => {
          console.warn('Video play blocked or error:', err);
          updatePlayUI(false);
        });
      } else {
        video.pause();
        updatePlayUI(false);
      }
    }

    if (playBtn) playBtn.addEventListener('click', toggleVideoPlay);
    if (bigPlayBtn) bigPlayBtn.addEventListener('click', toggleVideoPlay);

    // Switch video feed
    if (feedToggleBtn && video) {
      feedToggleBtn.addEventListener('click', () => {
        currentFeedIdx = (currentFeedIdx + 1) % FEEDS.length;
        const feed = FEEDS[currentFeedIdx];
        video.src = feed.src;
        video.currentTime = 0;
        if (streamNameEl) streamNameEl.textContent = feed.name;
        if (feedLabel) feedLabel.textContent = feed.label;
        if (statDetections) statDetections.textContent = feed.objectsCount;
        if (statModel) statModel.textContent = feed.model;
        video.play().then(() => updatePlayUI(true)).catch(() => updatePlayUI(false));
      });
    }

    // Toggle bounding boxes
    if (boxToggleBtn) {
      boxToggleBtn.addEventListener('click', () => {
        boxesEnabled = !boxesEnabled;
        if (boxLabel) boxLabel.textContent = boxesEnabled ? 'Boxes: ON' : 'Boxes: OFF';
        boxToggleBtn.classList.toggle('active', boxesEnabled);
      });
    }

    // Mute toggle
    if (muteBtn && video) {
      muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        if (muteIcon) {
          muteIcon.setAttribute('name', video.muted ? 'volume-mute-outline' : 'volume-high-outline');
        }
        muteBtn.title = video.muted ? 'Unmute Video' : 'Mute Video';
      });
    }

    // Progress bar tracking & click seek
    if (video && progressBar) {
      video.addEventListener('timeupdate', () => {
        if (video.duration && !isNaN(video.duration)) {
          const pct = (video.currentTime / video.duration) * 100;
          progressBar.style.width = `${pct}%`;
        }
      });
    }

    if (progressWrap && video) {
      progressWrap.addEventListener('click', (e) => {
        const rect = progressWrap.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        if (video.duration && !isNaN(video.duration)) {
          video.currentTime = pos * video.duration;
        }
      });
    }

    // Radar Pulse button
    if (scanBtn) {
      scanBtn.addEventListener('click', () => {
        pulseActive = true;
        pulseTimer = 0;
        const fpsEl = document.getElementById('cv-hud-fps');
        const statFpsEl = document.getElementById('cv-stat-fps');
        const statLatEl = document.getElementById('cv-stat-latency');
        if (fpsEl && statFpsEl) {
          const newFps = (41.5 + Math.random() * 2.5).toFixed(1);
          const newLat = (21.8 + Math.random() * 2.2).toFixed(1);
          fpsEl.textContent = `${newFps} FPS · ${newLat}ms`;
          statFpsEl.textContent = `${newFps} FPS`;
          if (statLatEl) statLatEl.textContent = `${newLat} ms`;
        }
      });
    }

    // Attempt video initial playback
    if (video) {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          updatePlayUI(true);
        }).catch(() => {
          updatePlayUI(false);
        });
      }

      video.addEventListener('play', () => updatePlayUI(true));
      video.addEventListener('pause', () => updatePlayUI(false));
    }

    // -------------------------------------------------------------
    // YOLO DETECTION OVERLAY DRAW LOOP
    // -------------------------------------------------------------
    const cvCtx = cvCanvas ? cvCanvas.getContext('2d') : null;

    function drawCvFeed(timestamp) {
      if (!cvCtx || !cvCanvas) return;
      const w = cvCanvas.width;
      const h = cvCanvas.height;
      if (w === 0 || h === 0) {
        cvGlobalAnimId = requestAnimationFrame(drawCvFeed);
        return;
      }

      cvCtx.clearRect(0, 0, w, h);

      const feed = FEEDS[currentFeedIdx] || FEEDS[0];
      const timeVal = video && !video.paused ? video.currentTime : (timestamp * 0.001);

      if (boxesEnabled) {
        feed.targets.forEach((tgt, idx) => {
          // Synchronized motion based on video playback time
          const cycle = (timeVal * 0.5 + idx * 1.3);
          const moveX = Math.sin(cycle) * (tgt.vx || 0.04) * w;
          const moveY = Math.cos(cycle) * (tgt.vy || 0.02) * h;

          const tw = Math.max(55, Math.min(160, tgt.w * (w / 640)));
          const th = Math.max(35, Math.min(200, tgt.h * (h / 360)));
          const tx = Math.max(8, Math.min(w - tw - 8, tgt.baseX * w + moveX));
          const ty = Math.max(26, Math.min(h - th - 8, tgt.baseY * h + moveY));

          // Bounding box fill tint
          cvCtx.fillStyle = 'rgba(56, 189, 248, 0.08)';
          cvCtx.fillRect(tx, ty, tw, th);

          // Subtle full perimeter box
          cvCtx.strokeStyle = tgt.color;
          cvCtx.lineWidth = 1;
          cvCtx.strokeRect(tx, ty, tw, th);

          // Bold corner brackets
          cvCtx.lineWidth = 3;
          const bLen = Math.min(14, tw * 0.28, th * 0.28);

          // Top-left
          cvCtx.beginPath();
          cvCtx.moveTo(tx, ty + bLen);
          cvCtx.lineTo(tx, ty);
          cvCtx.lineTo(tx + bLen, ty);
          cvCtx.stroke();

          // Top-right
          cvCtx.beginPath();
          cvCtx.moveTo(tx + tw - bLen, ty);
          cvCtx.lineTo(tx + tw);
          cvCtx.lineTo(tx + tw, ty + bLen);
          cvCtx.stroke();

          // Bottom-left
          cvCtx.beginPath();
          cvCtx.moveTo(tx, ty + th - bLen);
          cvCtx.lineTo(tx, ty + th);
          cvCtx.lineTo(tx + bLen, ty + th);
          cvCtx.stroke();

          // Bottom-right
          cvCtx.beginPath();
          cvCtx.moveTo(tx + tw - bLen, ty + th);
          cvCtx.lineTo(tx + tw, ty + th);
          cvCtx.lineTo(tx + tw, ty + th - bLen);
          cvCtx.stroke();

          // Centroid target crosshair
          const cx = tx + tw / 2;
          const cy = ty + th / 2;
          cvCtx.fillStyle = tgt.color;
          cvCtx.beginPath();
          cvCtx.arc(cx, cy, 2.5, 0, Math.PI * 2);
          cvCtx.fill();

          // Direction velocity vector arrow
          cvCtx.strokeStyle = tgt.color;
          cvCtx.lineWidth = 1.2;
          cvCtx.beginPath();
          cvCtx.moveTo(cx, cy);
          cvCtx.lineTo(cx + Math.cos(cycle) * 12, cy + Math.sin(cycle) * 12);
          cvCtx.stroke();

          // Label Pill
          const conf = (tgt.baseConf - Math.sin(cycle) * 0.8).toFixed(1);
          const labelText = `${tgt.label} [${conf}%] · ${tgt.speed}`;
          cvCtx.font = '700 11px "Fira Code", monospace';
          const textMetrics = cvCtx.measureText(labelText);
          const badgeW = textMetrics.width + 10;
          const badgeH = 18;

          cvCtx.fillStyle = 'rgba(6, 11, 24, 0.9)';
          cvCtx.fillRect(tx, ty - badgeH - 2, badgeW, badgeH);
          cvCtx.strokeStyle = tgt.color;
          cvCtx.lineWidth = 1;
          cvCtx.strokeRect(tx, ty - badgeH - 2, badgeW, badgeH);

          cvCtx.fillStyle = tgt.color;
          cvCtx.fillText(labelText, tx + 5, ty - 6);
        });

        // Laser scanline sweeping down
        scanlineY = (scanlineY + 1.8) % h;
        cvCtx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        cvCtx.lineWidth = 1.5;
        cvCtx.beginPath();
        cvCtx.moveTo(0, scanlineY);
        cvCtx.lineTo(w, scanlineY);
        cvCtx.stroke();

        // Expanding radar wave if pulse active
        if (pulseActive) {
          pulseTimer += 0.035;
          const radius = pulseTimer * w * 0.65;
          cvCtx.beginPath();
          cvCtx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
          cvCtx.strokeStyle = `rgba(52, 211, 153, ${Math.max(0, 1 - pulseTimer)})`;
          cvCtx.lineWidth = 3;
          cvCtx.stroke();

          if (pulseTimer >= 1) {
            pulseActive = false;
          }
        }
      } else {
        // Subtle watermark when overlay is toggled off
        cvCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        cvCtx.font = '10px "Fira Code", monospace';
        cvCtx.fillText('RAW VIDEO FEED [YOLO OVERLAY OFF]', 14, h - 18);
      }

      cvGlobalAnimId = requestAnimationFrame(drawCvFeed);
    }

    drawCvFeed(0);

    // -------------------------------------------------------------
    // RAG Simulator Button
    // -------------------------------------------------------------
    const ragBtn = document.getElementById('rag-run-btn');
    const ragSteps = [
      document.getElementById('rag-step-1'),
      document.getElementById('rag-step-2'),
      document.getElementById('rag-step-3'),
      document.getElementById('rag-step-4')
    ];
    const ragOutput = document.getElementById('rag-output-box');

    if (ragBtn && ragOutput) {
      ragBtn.addEventListener('click', () => {
        ragBtn.setAttribute('disabled', 'true');
        ragBtn.innerHTML = '<ion-icon name="sync-outline" class="pulse"></ion-icon><span>Searching pgvector...</span>';

        let step = 0;
        const interval = setInterval(() => {
          ragSteps.forEach((s, idx) => {
            if (s) s.classList.toggle('active-step', idx === step);
          });
          step++;

          if (step >= ragSteps.length) {
            clearInterval(interval);
            ragBtn.removeAttribute('disabled');
            ragBtn.innerHTML = '<ion-icon name="checkmark-done-outline"></ion-icon><span>Retrieved (8.2ms)</span>';
            ragOutput.innerHTML = `
              <div style="color:#34d399; margin-bottom:6px; font-weight:700;">[QUERY MATCH VERIFIED · Similarity: 0.948 · Cosine Distance: 0.052]</div>
              <div><b>Incident Audit #2026-B04:</b> CCTV stream matches prompt target at 22:14:08. Personnel face cluster verified against ArcFace database. Zero-trust security event triggered without open ingress ports.</div>
            `;
          }
        }, 350);
      });
    }
  }

  // =========================================================================
  // 7. SCROLL-TRIGGERED REVEAL ANIMATIONS
  // =========================================================================
  function initScrollReveals() {
    if (prefersReducedMotion) {
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
      return;
    }

    const revealElements = document.querySelectorAll(
      '.service-item, .skill-category-card, .project-card, .timeline-item, .cert-card, .blog-post-item, .metric-pill, .contact-card-box, .ai-interactive-suite'
    );

    revealElements.forEach((el, index) => {
      el.classList.add('liquid-reveal-init');
      el.style.setProperty('--reveal-delay', `${(index % 4) * 0.08}s`);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('liquid-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // =========================================================================
  // 8. BACK TO TOP QUICK TRIGGER
  // =========================================================================
  function initBackToTop() {
    let topBtn = document.querySelector('.liquid-back-to-top');
    if (!topBtn) {
      topBtn = document.createElement('button');
      topBtn.className = 'liquid-back-to-top';
      topBtn.setAttribute('title', 'Return to Top');
      topBtn.setAttribute('aria-label', 'Return to Top');
      topBtn.innerHTML = '<ion-icon name="arrow-up-outline"></ion-icon>';
      document.body.appendChild(topBtn);
    }

    const toggleVisibility = () => {
      const scrolled = window.scrollY || document.documentElement.scrollTop;
      topBtn.classList.toggle('visible', scrolled > 450);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // BOOTSTRAP ENGINE
  // =========================================================================
  function bootstrap() {
    initScrollProgress();
    initAmbientCanvas();
    initLiquidNavPill();
    initGlassCardPhysics();
    initInteractiveHeroPipeline();
    initAISimulator();
    initScrollReveals();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

  // Synchronize on datasource hydration
  document.addEventListener('datasource:ready', () => {
    setTimeout(() => {
      initLiquidNavPill();
      initInteractiveHeroPipeline();
      initAISimulator();
      initScrollReveals();
    }, 50);
  });

  // Public Interface
  window.LiquidFX = {
    refreshReveals: initScrollReveals,
    refreshPipeline: initInteractiveHeroPipeline,
    refreshAISimulator: initAISimulator,
    updateNavPill: () => {
      if (typeof window._syncLiquidNavPill === 'function') {
        window._syncLiquidNavPill();
      }
    }
  };

})();
