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
        <div class="spec-layout">
          <div class="spec-main">
            <div class="spec-header">
              <span class="spec-tag" id="pipeline-spec-badge">${pipelineStages[0].badge}</span>
              <span class="spec-id" id="pipeline-spec-pill">${pipelineStages[0].pill}</span>
            </div>
            <h4 class="spec-title" id="pipeline-spec-title">${pipelineStages[0].name}</h4>
            <p class="spec-desc" id="pipeline-spec-desc">${pipelineStages[0].spec}</p>
          </div>
          <div class="spec-telemetry-panel">
            <div class="spec-stat-chip">
              <span class="stat-chip-label">Live Latency</span>
              <span class="stat-chip-val" id="pipeline-spec-latency">${pipelineStages[0].latency}</span>
            </div>
            <div class="spec-stat-chip">
              <span class="stat-chip-label">Throughput</span>
              <span class="stat-chip-val cyan" id="pipeline-spec-throughput">${pipelineStages[0].throughput}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const nodeEls = container.querySelectorAll('.pipeline-node');
    const badgeEl = container.querySelector('#pipeline-spec-badge');
    const pillEl = container.querySelector('#pipeline-spec-pill');
    const latencyEl = container.querySelector('#pipeline-spec-latency');
    const throughputEl = container.querySelector('#pipeline-spec-throughput');
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
      if (latencyEl) latencyEl.textContent = stage.latency;
      if (throughputEl) throughputEl.textContent = stage.throughput;
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
              <!-- Native HTML5 Video Element (Medical PPE Primary Demo) -->
              <video 
                id="cv-video-player" 
                class="cv-video-element" 
                playsinline 
                muted 
                loop 
                preload="auto"
                src="./assets/videos/medical-ppe-detection.mp4">
              </video>

              <!-- Real-time YOLO Detection Overlay Canvas -->
              <canvas class="cv-feed-canvas cv-overlay-canvas" id="cv-feed-canvas"></canvas>

              <!-- Interactive Big Play Overlay -->
              <div class="cv-play-overlay" id="cv-play-overlay">
                <button class="cv-big-play-btn" id="cv-big-play-btn" aria-label="Play Live Medical PPE Video Stream">
                  <div class="cv-big-play-icon">
                    <ion-icon name="play"></ion-icon>
                  </div>
                  <span>Play Medical PPE Stream</span>
                </button>
              </div>

              <!-- Top HUD Overlay -->
              <div class="cv-hud-overlay">
                <div class="hud-feed-tag" id="cv-hud-tag">
                  <span class="live-dot emerald pulse" id="cv-live-dot"></span>
                  <span id="cv-stream-name">CLINICAL-01 · MEDICAL PPE (YOLOv8-Medical-PPE)</span>
                </div>
                <div class="hud-telemetry-pill" id="cv-hud-fps">
                  45.0 FPS · 21.4ms (Jetson Orin TensorRT)
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
                <!-- <button class="cv-action-btn primary" id="cv-play-btn" title="Play or Pause Video Feed">
                  <ion-icon name="play-outline" id="cv-play-icon"></ion-icon>
                  <span id="cv-play-label">Play Video</span>
                </button> -->

                <!-- Current Timestamp / Duration Display -->
                <div class="cv-time-display" id="cv-time-display" title="Current Stream Position">
                  <ion-icon name="time-outline"></ion-icon>
                  <span id="cv-time-text">00:00.0 / 00:20.0</span>
                </div>

                <!-- Playback Speed Controls -->
                <!-- <div class="cv-speed-group" id="cv-speed-group" title="Playback Speed">
                  <button class="cv-speed-btn" data-speed="0.5">0.5x</button>
                  <button class="cv-speed-btn active" data-speed="1.0">1.0x</button>
                  <button class="cv-speed-btn" data-speed="1.5">1.5x</button>
                  <button class="cv-speed-btn" data-speed="2.0">2.0x</button>
                </div> -->

                <button class="cv-action-btn secondary" id="cv-feed-toggle-btn" title="Switch Between Medical PPE, Highway Traffic, and Pedestrian Video Feeds">
                  <ion-icon name="swap-horizontal-outline"></ion-icon>
                  <span id="cv-feed-label">Feed: Medical PPE (Clinical)</span>
                </button>
                <button class="cv-action-btn pulse-btn" id="cv-scan-trigger" title="Trigger Detection Radar Scan">
                  <ion-icon name="radio-outline"></ion-icon>
                  <span>Radar Pulse</span>
                </button>
              </div> 

              <div class="cv-controls-group">
                <!-- <button class="cv-action-btn secondary active" id="cv-box-toggle-btn" title="Toggle YOLO Bounding Boxes Overlay">
                  <ion-icon name="scan-outline"></ion-icon>
                  <span id="cv-box-label">Boxes: ON</span>
                </button> -->
                <!-- <button class="cv-action-btn pulse-btn" id="cv-scan-trigger" title="Trigger Detection Radar Scan">
                  <ion-icon name="radio-outline"></ion-icon>
                  <span>Radar Pulse</span>
                </button> -->
                <!-- <button class="cv-action-btn secondary icon-btn" id="cv-mute-btn" title="Mute / Unmute Video Audio">
                  <ion-icon name="volume-mute-outline" id="cv-mute-icon"></ion-icon>
                </button> -->
              </div>
            </div>

            <!-- Interactive Video Detection Scene Timeline -->
            <div class="cv-timeline-strip" id="cv-timeline-strip">
              <div class="cv-timeline-header">
                <div class="cv-timeline-title-wrap">
                  <ion-icon name="film-outline"></ion-icon>
                  <span class="cv-timeline-title">Detection Scene Timeline</span>
                  <span class="cv-timeline-sub" id="cv-timeline-sub">(4 Verified Clinical Stages)</span>
                </div>
                <div class="cv-timeline-active-pill" id="cv-timeline-active-pill">
                  <span class="live-dot emerald pulse"></span>
                  <span id="cv-timeline-stage-name">Stage 1: OR Prep &amp; Vitals</span>
                </div>
              </div>
              <div class="cv-timeline-grid" id="cv-timeline-grid">
                <!-- Dynamically populated based on active video feed -->
              </div>
            </div>
          </div>

          <!-- Secondary Telemetry Panel -->
          <div class="cv-telemetry-sidebar">
            <div class="telemetry-card">
              <div class="telemetry-card-title">Production Inference Telemetry</div>
              <div class="telemetry-metrics-row">
                <div class="telemetry-stat-box">
                  <span class="stat-label">People in Frame</span>
                  <span class="stat-val emerald" id="cv-stat-people">2 People</span>
                  <span class="stat-meta">Surgeon / Doctor</span>
                </div>
                <div class="telemetry-stat-box">
                  <span class="stat-label">PPE Detections</span>
                  <span class="stat-val magenta" id="cv-stat-ppe">10 Objects</span>
                  <span class="stat-meta">Masks, Gowns, Caps</span>
                </div>
                <div class="telemetry-stat-box">
                  <span class="stat-label">Edge Throughput</span>
                  <span class="stat-val" id="cv-stat-fps">45.0 FPS</span>
                  <span class="stat-meta">NVIDIA TensorRT 8.6</span>
                </div>
                <div class="telemetry-stat-box">
                  <span class="stat-label">Inference Latency</span>
                  <span class="stat-val gold" id="cv-stat-latency">21.4 ms</span>
                  <span class="stat-meta">GStreamer zero-copy</span>
                </div>
              </div>

              <!-- Supported Classes Legend -->
              <div class="cv-legend-container">
                <div class="cv-active-dets-title">Supported Classes Legend</div>
                <div class="cv-legend-grid">
                  <div class="cv-legend-chip"><span class="cv-legend-dot" style="background:#10b981;"></span><span>Person</span></div>
                  <div class="cv-legend-chip"><span class="cv-legend-dot" style="background:#38bdf8;"></span><span>Surgical Mask</span></div>
                  <div class="cv-legend-chip"><span class="cv-legend-dot" style="background:#818cf8;"></span><span>Surgical Cap</span></div>
                  <div class="cv-legend-chip"><span class="cv-legend-dot" style="background:#f59e0b;"></span><span>Protective Gown</span></div>
                  <div class="cv-legend-chip"><span class="cv-legend-dot" style="background:#ec4899;"></span><span>Medical Gloves</span></div>
                  <div class="cv-legend-chip"><span class="cv-legend-dot" style="background:#06b6d4;"></span><span>Face Shield / Goggles</span></div>
                </div>
              </div>

              <!-- Clear Demo Mode Footnote -->
              <div class="cv-demo-notice-box">
                <ion-icon name="information-circle-outline" style="vertical-align:middle; font-size:0.9rem; margin-right:3px;"></ion-icon>
                <b>Execution Mode:</b> Demo Mode (Precomputed YOLOv8-Medical-PPE Detection Records). To stream live edge GPU inference, point to a running Triton or Jetson TensorRT ONNX service.
              </div>
            </div>

            <div class="telemetry-card cv-hardware-info">
              <b class="cv-hardware-title">Hardware Architecture:</b> Real-time video decode via GStreamer (<code>nvv4l2decoder</code>) with zero-copy CUDA memory passing to custom TensorRT engine running on <b>NVIDIA Jetson Orin Nano Super</b> (35–45 FPS) and dual RTX 5090 test benches.
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: GENAI & VIDEO RAG SIMULATOR -->
      <div class="ai-tab-panel" id="ai-panel-rag" role="tabpanel">
        <div class="rag-flow-wrap">
          <!-- Predefined Question Chips Selector -->
          <div>
            <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-subtle); font-weight:700; margin-bottom:8px; letter-spacing:0.5px;">
              Select Question to Verify:
            </div>
            <div class="rag-chips-wrap" id="rag-chips-wrap">
              <button class="rag-chip active" data-query="Which people and PPE items are visible in the video?">1. Which people and PPE items are visible in the video?</button>
              <button class="rag-chip" data-query="At what timestamps were face masks detected?">2. At what timestamps were face masks detected?</button>
              <button class="rag-chip" data-query="Summarize the detected PPE throughout the video.">3. Summarize the detected PPE throughout the video.</button>
              <button class="rag-chip" data-query="Which PPE items were detected with low confidence?">4. Which PPE items were detected with low confidence?</button>
              <button class="rag-chip" data-query="What evidence supports this summary?">5. What evidence supports this summary?</button>
            </div>
          </div>

          <!-- Query Input and Execution Bar -->
          <div class="rag-query-box">
            <span style="font-size:0.78rem; text-transform:uppercase; color:var(--accent-cyan); font-weight:700; white-space:nowrap;">Selected Prompt:</span>
            <div class="rag-custom-input-box">
              <span class="rag-selected-prompt-icon">
                <ion-icon name="chatbubble-ellipses-outline"></ion-icon>
              </span>
              <div class="rag-custom-input" id="rag-custom-input">Which people and PPE items are visible in the video?</div>
            </div>
            <button class="cv-action-btn primary" id="rag-run-btn">
              <ion-icon name="sparkles-outline"></ion-icon>
              <span>Run RAG Retrieval</span>
            </button>
          </div>

          <!-- Pipeline Processing Steps -->
          <div class="rag-steps-grid">
            <div class="rag-step-card active-step" id="rag-step-1">
              <div class="rag-step-num">1</div>
              <h5 class="rag-step-title">Query Vectorization</h5>
              <p class="rag-step-desc">Generating 512-D multimodal text embedding via CLIP encoder in 3.4ms.</p>
            </div>
            <div class="rag-step-card" id="rag-step-2">
              <div class="rag-step-num">2</div>
              <h5 class="rag-step-title">HNSW Vector Search</h5>
              <p class="rag-step-desc">PostgreSQL + pgvector HNSW similarity search across video frames &amp; chunks in 6.8ms.</p>
            </div>
            <div class="rag-step-card" id="rag-step-3">
              <div class="rag-step-num">3</div>
              <h5 class="rag-step-title">Context Assembly</h5>
              <p class="rag-step-desc">Filtering top relevant evidence chunks with cosine similarity &gt; 0.90.</p>
            </div>
            <div class="rag-step-card" id="rag-step-4">
              <div class="rag-step-num">4</div>
              <h5 class="rag-step-title">LLM Synthesis</h5>
              <p class="rag-step-desc">Synthesizing evidence-grounded answer with clickable timestamp citations.</p>
            </div>
          </div>

          <!-- Dynamic Results Area -->
          <div class="rag-results-area" id="rag-results-area">
            <!-- Synthesized Answer Card -->
            <div class="rag-answer-box" id="rag-answer-box">
              <div class="rag-answer-header">
                <span class="rag-answer-badge">
                  <ion-icon name="checkmark-done-circle"></ion-icon>
                  Synthesized Evidence-Grounded Answer
                </span>
                <span class="rag-meta-pill">[Demo Mode · Deterministic pgvector HNSW Index · 4 Chunks Searched]</span>
              </div>
              <div class="rag-answer-text" id="rag-answer-text">
                The medical demonstration video depicts healthcare personnel across 4 clinical environments wearing verified PPE:
                <br><br>
                • <b>Operating Room (00:00 - 00:05):</b> <button class="rag-timestamp-seek-btn" data-seek="2.4"><ion-icon name="play-circle-outline"></ion-icon>00:02.4</button> Surgeon #101 and Doctor #102 detected wearing <b>Surgical Masks</b> (99.1%), <b>Surgical Caps</b> (98.4%), <b>Safety Goggles</b> (96.2%), sterile <b>Surgical Gowns</b> (98.7%), and <b>Medical Gloves</b> (97.5%).
                <br>
                • <b>ICU Corridor (00:05 - 00:10):</b> <button class="rag-timestamp-seek-btn" data-seek="7.5"><ion-icon name="play-circle-outline"></ion-icon>00:07.5</button> Lead Doctor #202 detected with a full <b>Clear Face Shield</b> (99.5%), <b>Surgical Mask</b> (99.2%), and yellow <b>Isolation Gown</b> (99.4%), accompanied by two clinicians with masks and gowns.
                <br>
                • <b>Scrubbing Ante-Room (00:10 - 00:15):</b> <button class="rag-timestamp-seek-btn" data-seek="12.8"><ion-icon name="play-circle-outline"></ion-icon>00:12.8</button> Doctor #302 actively donning <b>Medical Gloves</b> (98.7%) with <b>Safety Goggles</b> (97.4%) and <b>Surgical Mask</b> (99.1%), alongside Surgeon #301 at the sterile cabinet.
                <br>
                • <b>ICU Consultation (00:15 - 00:20):</b> <button class="rag-timestamp-seek-btn" data-seek="17.3"><ion-icon name="play-circle-outline"></ion-icon>00:17.3</button> Physician #401 wearing a <b>Face Shield</b> (99.6%), <b>Surgical Mask</b>, and <b>Surgical Gown</b>, with Nurse #402 in <b>Bouffant Cap</b> (99.4%) and <b>Isolation Gown</b> (99.1%).
              </div>
            </div>

            <!-- Retrieved Evidence Chunks Grid -->
            <div class="rag-evidence-section">
              <div class="rag-evidence-header">
                <span class="rag-evidence-title">
                  <ion-icon name="layers-outline"></ion-icon>
                  Retrieved Supporting Evidence Chunks
                </span>
                <span class="rag-evidence-hint">(Click timestamp to jump in video player)</span>
              </div>
              <div class="rag-evidence-grid" id="rag-evidence-grid">
                <!-- Dynamically populated -->
              </div>
            </div>
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

      <!-- Floating Seek Toast -->
      <div class="cv-toast" id="cv-toast">
        <ion-icon name="videocam-outline" style="font-size:1.2rem;"></ion-icon>
        <span id="cv-toast-text">Navigated video to timestamp</span>
      </div>
    `;

    // -------------------------------------------------------------
    // DATA SOURCE & TIMELINE FIXTURES
    // -------------------------------------------------------------
    let ppeDataset = null;

    // Built-in reliable fallback dataset matching datasource/medical-ppe-detections.json
    const FALLBACK_PPE_CHUNKS = [
      {
        chunk_id: "chunk-ppe-01",
        video_id: "medical-ppe-detection.mp4",
        start_time: 0.0,
        end_time: 5.0,
        timestamp_str: "00:02.4",
        seek_sec: 2.4,
        scene_name: "Operating Room Prep & Telemetry Monitoring",
        summary: "Two healthcare professionals (Surgeon #101 and Doctor #102) in operating room setup. High-confidence detections of Surgical Masks (99.1%), Surgical Caps (98.4%), Safety Goggles (96.2%), sterile Surgical Gowns (98.7%), and nitrile Medical Gloves (97.5%) while analyzing vitals telemetry.",
        detected_people: ["Surgeon #101", "Doctor #102"],
        detected_ppe: ["Surgical Mask", "Surgical Cap", "Safety Goggles", "Surgical Gown", "Medical Gloves"],
        model_confidence_range: "95.8% - 99.4%",
        similarity: 0.952
      },
      {
        chunk_id: "chunk-ppe-02",
        video_id: "medical-ppe-detection.mp4",
        start_time: 5.0,
        end_time: 10.0,
        timestamp_str: "00:07.5",
        seek_sec: 7.5,
        scene_name: "ICU Clinical Ward Corridor Walk",
        summary: "Three healthcare workers in motion in ICU corridor. Lead Doctor #202 detected with full-coverage Clear Face Shield (99.5%), Surgical Mask (99.2%), Surgical Cap (99.3%), yellow Isolation Gown (99.4%), and purple Medical Gloves (98.4%). Accompanying staff (Physician #201 and Clinician #203) verified with masks, gowns, and caps.",
        detected_people: ["Physician #201", "Lead Doctor #202", "Clinician #203"],
        detected_ppe: ["Face Shield", "Surgical Mask", "Surgical Cap", "Isolation Gown", "Medical Gloves"],
        model_confidence_range: "97.6% - 99.5%",
        similarity: 0.941
      },
      {
        chunk_id: "chunk-ppe-03",
        video_id: "medical-ppe-detection.mp4",
        start_time: 10.0,
        end_time: 15.0,
        timestamp_str: "00:12.8",
        seek_sec: 12.8,
        scene_name: "Sterile Scrubbing & Gowning Ante-Room",
        summary: "Surgical ante-room preparation. Surgeon #301 accessing sterile storage cabinet wearing Surgical Gown (99.3%), Surgical Mask (98.4%), and Cap (98.9%). Doctor #302 actively donning bright blue sterile nitrile Medical Gloves (98.7%) while wearing Safety Goggles (97.4%) and Surgical Mask (99.1%).",
        detected_people: ["Surgeon #301", "Doctor #302"],
        detected_ppe: ["Medical Gloves Donning", "Safety Goggles", "Surgical Mask", "Surgical Cap", "Surgical Gown"],
        model_confidence_range: "96.5% - 99.4%",
        similarity: 0.928
      },
      {
        chunk_id: "chunk-ppe-04",
        video_id: "medical-ppe-detection.mp4",
        start_time: 15.0,
        end_time: 20.0,
        timestamp_str: "00:17.3",
        seek_sec: 17.3,
        scene_name: "ICU Patient Care & Telemetry Consultation",
        summary: "Direct patient care setting. Physician #401 communicating patient telemetry while wearing Clear Face Shield (99.6%), Surgical Mask (99.3%), Surgical Cap (99.1%), Surgical Gown (99.5%), and Medical Gloves (98.9%). Nurse #402 consulting notes with Bouffant Cap (99.4%), Surgical Mask (98.8%), yellow Isolation Gown (99.1%), and blue Gloves (98.3%).",
        detected_people: ["Physician #401", "Nurse #402"],
        detected_ppe: ["Face Shield", "Surgical Mask", "Bouffant Cap", "Isolation Gown", "Surgical Gown", "Medical Gloves"],
        model_confidence_range: "98.3% - 99.6%",
        similarity: 0.935
      }
    ];

    // Attempt to fetch full JSON dataset
    fetch('./datasource/medical-ppe-detections.json')
      .then(res => res.json())
      .then(data => {
        ppeDataset = data;
      })
      .catch(() => {
        ppeDataset = { rag_evidence_chunks: FALLBACK_PPE_CHUNKS };
      });

    // Tab switching behavior
    const tabs = container.querySelectorAll('.ai-tab-btn');
    const panels = container.querySelectorAll('.ai-tab-panel');

    function switchAiTab(targetTabId) {
      tabs.forEach(t => {
        const isTarget = t.dataset.aiTab === targetTabId;
        t.classList.toggle('active', isTarget);
        t.setAttribute('aria-selected', isTarget ? 'true' : 'false');
      });

      panels.forEach(panel => {
        const isMatch = panel.id === `ai-panel-${targetTabId}`;
        panel.classList.toggle('active', isMatch);
      });

      if (targetTabId === 'cv') {
        setTimeout(resizeCvCanvas, 60);
      }
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        switchAiTab(tab.dataset.aiTab);
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
    const timeText = document.getElementById('cv-time-text');
    const speedButtons = container.querySelectorAll('.cv-speed-btn');
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
    const statPeople = document.getElementById('cv-stat-people');
    const statPpe = document.getElementById('cv-stat-ppe');
    const statFps = document.getElementById('cv-stat-fps');
    const statLatency = document.getElementById('cv-stat-latency');
    const activeDetsList = document.getElementById('cv-active-dets-list');
    const activeDetsCount = document.getElementById('cv-active-dets-count');
    const scanBtn = document.getElementById('cv-scan-trigger');
    const toast = document.getElementById('cv-toast');
    const toastText = document.getElementById('cv-toast-text');

    const FEEDS = [
      {
        id: 'medical-ppe',
        name: 'CLINICAL-01 · MEDICAL PPE (YOLOv8-Medical-PPE)',
        label: 'Feed: Medical PPE (Clinical)',
        model: 'YOLOv8-Medical-PPE [Demo Mode]',
        src: './assets/videos/medical-ppe-detection.mp4',
        fps: '45.0 FPS',
        latency: '21.4 ms',
        isPpe: true
      },
      {
        id: 'traffic',
        name: 'CAM-04 · HIGHWAY TRAFFIC (YOLOv8)',
        label: 'Feed: Traffic (Vehicles)',
        model: 'YOLOv8 + Jetson Orin',
        src: './assets/videos/traffic-detection.mp4',
        fps: '42.4 FPS',
        latency: '22.8 ms',
        isPpe: false,
        targets: [
          { label: 'Sedan #104', type: 'car', baseConf: 98.4, speed: '62 km/h', color: '#38bdf8', baseX: 0.18, baseY: 0.38, w: 85, h: 58, vx: 0.05, vy: 0.02 },
          { label: 'Truck #105', type: 'truck', baseConf: 99.1, speed: '48 km/h', color: '#34d399', baseX: 0.44, baseY: 0.28, w: 110, h: 85, vx: -0.035, vy: 0.015 },
          { label: 'SUV #108', type: 'car', baseConf: 97.2, speed: '59 km/h', color: '#fbbf24', baseX: 0.62, baseY: 0.46, w: 90, h: 65, vx: -0.045, vy: 0.022 },
          { label: 'Van #112', type: 'van', baseConf: 96.5, speed: '54 km/h', color: '#38bdf8', baseX: 0.34, baseY: 0.54, w: 88, h: 62, vx: 0.042, vy: -0.01 }
        ]
      },
      {
        id: 'people',
        name: 'CAM-08 · PEDESTRIAN WALKWAY (ArcFace + YOLO)',
        label: 'Feed: Pedestrians (ArcFace)',
        model: 'InsightFace + YOLOv8',
        src: './assets/videos/people-detection.mp4',
        fps: '38.8 FPS',
        latency: '25.6 ms',
        isPpe: false,
        targets: [
          { label: 'Personnel #8042', type: 'person', baseConf: 98.8, speed: 'ArcFace 512-D', color: '#34d399', baseX: 0.22, baseY: 0.26, w: 68, h: 130, vx: 0.025, vy: 0.005 },
          { label: 'PPE: High-Vis Vest', type: 'ppe', baseConf: 99.4, speed: 'Verified', color: '#38bdf8', baseX: 0.23, baseY: 0.36, w: 50, h: 44, vx: 0.025, vy: 0.005 },
          { label: 'Visitor #109', type: 'person', baseConf: 96.4, speed: 'Visitor Badge', color: '#fbbf24', baseX: 0.58, baseY: 0.30, w: 72, h: 135, vx: -0.03, vy: 0.008 }
        ]
      }
    ];

    let currentFeedIdx = 0;
    let boxesEnabled = true;
    let scanlineY = 0;
    let pulseActive = false;
    let pulseTimer = 0;
    let lastRenderedSampleIdx = -1;

    function formatTime(sec) {
      if (!sec || isNaN(sec)) return "00:00.0";
      const m = Math.floor(sec / 60);
      const s = (sec % 60).toFixed(1);
      return `${String(m).padStart(2, '0')}:${s.padStart(4, '0')}`;
    }

    function showToast(message) {
      if (!toast || !toastText) return;
      toastText.innerHTML = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3200);
    }

    function resizeCvCanvas() {
      if (!cvCanvas) return;
      const rect = cvCanvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        cvCanvas.width = Math.round(rect.width);
        cvCanvas.height = Math.round(rect.height);
      }
    }

    window.addEventListener('resize', resizeCvCanvas, { passive: true });
    
    // ResizeObserver for rock-solid responsive canvas sizing
    const cvViewportWrap = document.getElementById('cv-viewport-wrap');
    if (cvViewportWrap && window.ResizeObserver) {
      const ro = new ResizeObserver(() => {
        resizeCvCanvas();
      });
      ro.observe(cvViewportWrap);
    }
    resizeCvCanvas();

    // -------------------------------------------------------------
    // INTERACTIVE VIDEO DETECTION SCENE TIMELINE
    // -------------------------------------------------------------
    const timelineGrid = document.getElementById('cv-timeline-grid');
    const timelineSub = document.getElementById('cv-timeline-sub');
    const timelineStageName = document.getElementById('cv-timeline-stage-name');

    const FEED_TIMELINES = {
      'medical-ppe': [
        {
          id: 'stage-1',
          name: 'Stage 1: OR Prep & Vitals Monitoring',
          shortName: 'OR Prep & Vitals',
          timeBadge: '00:00',
          seek: 0.0,
          end: 5.0,
          status: 'Compliant',
          entities: ['Surgeon #101', 'Doctor #102', 'Masks', 'Gowns', 'Gloves']
        },
        {
          id: 'stage-2',
          name: 'Stage 2: ICU Ward Corridor Walk',
          shortName: 'ICU Corridor Walk',
          timeBadge: '00:05',
          seek: 5.0,
          end: 10.0,
          status: 'Compliant',
          entities: ['Lead Doctor #202', 'Face Shield', 'Masks', 'Gowns']
        },
        {
          id: 'stage-3',
          name: 'Stage 3: Sterile Ante-Room Scrubbing',
          shortName: 'Sterile Ante-Room',
          timeBadge: '00:10',
          seek: 10.0,
          end: 15.0,
          status: 'Compliant',
          entities: ['Surgeon #301', 'Doctor #302', 'Glove Donning', 'Caps']
        },
        {
          id: 'stage-4',
          name: 'Stage 4: ICU Bedside Consultation',
          shortName: 'ICU Consultation',
          timeBadge: '00:15',
          seek: 15.0,
          end: 20.0,
          status: 'Compliant',
          entities: ['Physician #401', 'Nurse #402', 'Masks', 'Gowns', 'Gloves']
        }
      ],
      'traffic': [
        {
          id: 'stage-1',
          name: 'Stage 1: Inbound Lane Flow',
          shortName: 'Inbound Lane Flow',
          timeBadge: '00:00',
          seek: 0.0,
          end: 6.5,
          status: 'Flow: 62 km/h',
          entities: ['Sedan #104', 'Truck #105', 'Flow Analysis']
        },
        {
          id: 'stage-2',
          name: 'Stage 2: Highway Merge Tracking',
          shortName: 'Merge Zone Tracking',
          timeBadge: '00:06',
          seek: 6.5,
          end: 13.5,
          status: 'Normal Density',
          entities: ['SUV #108', 'Van #112', 'Trajectory Tracking']
        },
        {
          id: 'stage-3',
          name: 'Stage 3: Multi-Vehicle Radar',
          shortName: 'Speed Enforcement',
          timeBadge: '00:13',
          seek: 13.5,
          end: 20.0,
          status: 'Monitored',
          entities: ['All Vehicles', 'YOLOv8', 'TensorRT 8.6']
        }
      ],
      'people': [
        {
          id: 'stage-1',
          name: 'Stage 1: Entry Gate Access',
          shortName: 'Entry Gate ArcFace',
          timeBadge: '00:00',
          seek: 0.0,
          end: 7.0,
          status: 'Authorized',
          entities: ['Personnel #8042', 'ArcFace 512-D', 'Biometrics']
        },
        {
          id: 'stage-2',
          name: 'Stage 2: PPE Verification Zone',
          shortName: 'High-Vis PPE Zone',
          timeBadge: '00:07',
          seek: 7.0,
          end: 14.0,
          status: 'Compliant',
          entities: ['High-Vis Vest', 'Safety Protocol', 'YOLO Check']
        },
        {
          id: 'stage-3',
          name: 'Stage 3: Perimeter Patrol Check',
          shortName: 'Badge Verification',
          timeBadge: '00:14',
          seek: 14.0,
          end: 20.0,
          status: 'Logged',
          entities: ['Visitor #109', 'Security Audit', 'Zero-Trust']
        }
      ]
    };

    function renderTimeline(feedId) {
      if (!timelineGrid) return;
      const stages = FEED_TIMELINES[feedId] || FEED_TIMELINES['medical-ppe'];
      if (timelineSub) {
        timelineSub.textContent = feedId === 'medical-ppe' 
          ? '(4 Verified Clinical Stages · Click stage to seek)' 
          : `(${stages.length} Verified Detection Stages · Click stage to seek)`;
      }

      timelineGrid.innerHTML = stages.map((st, idx) => `
        <div class="cv-timeline-card ${idx === 0 ? 'active' : ''}" data-idx="${idx}" data-seek="${st.seek}" data-stage-name="${st.name}" title="${st.name} · Click to seek">
          <div class="cv-timeline-card-top">
            <span class="cv-timeline-badge">
              <ion-icon name="play-circle-outline"></ion-icon>
              ${st.timeBadge}
            </span>
            <span class="cv-timeline-status-tag">${st.status}</span>
          </div>
          <div class="cv-timeline-name">${st.shortName}</div>
          <div class="cv-timeline-dets-row">
            ${st.entities.map(e => `<span class="cv-timeline-det-tag">${e}</span>`).join('')}
          </div>
          <div class="cv-timeline-progress-indicator"></div>
        </div>
      `).join('');

      timelineGrid.querySelectorAll('.cv-timeline-card').forEach(card => {
        card.addEventListener('click', () => {
          const seekTime = parseFloat(card.dataset.seek || "0");
          if (video) {
            video.currentTime = seekTime;
            if (video.paused) {
              video.play().then(() => updatePlayUI(true)).catch(() => {});
            }
            showToast(`Seeked to ${formatTime(seekTime)} (${card.dataset.stageName})`);
          }
        });
      });
    }

    function updateTimelineStage(curTime) {
      if (!timelineGrid) return;
      const cards = timelineGrid.querySelectorAll('.cv-timeline-card');
      if (!cards.length) return;
      const feed = FEEDS[currentFeedIdx] || FEEDS[0];
      const stages = FEED_TIMELINES[feed.id] || FEED_TIMELINES['medical-ppe'];

      let activeIdx = 0;
      for (let i = 0; i < stages.length; i++) {
        if (curTime >= stages[i].seek && curTime < stages[i].end) {
          activeIdx = i;
          break;
        }
      }

      cards.forEach((c, idx) => {
        const isActive = (idx === activeIdx);
        c.classList.toggle('active', isActive);
      });

      if (timelineStageName && stages[activeIdx]) {
        timelineStageName.textContent = stages[activeIdx].name;
      }
    }

    renderTimeline('medical-ppe');

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
          console.warn('Video play blocked:', err);
          updatePlayUI(false);
        });
      } else {
        video.pause();
        updatePlayUI(false);
      }
    }

    if (playBtn) playBtn.addEventListener('click', toggleVideoPlay);
    if (bigPlayBtn) bigPlayBtn.addEventListener('click', toggleVideoPlay);

    // Playback Speed Selector
    speedButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const speed = parseFloat(btn.dataset.speed || "1.0");
        speedButtons.forEach(b => b.classList.toggle('active', b === btn));
        if (video) video.playbackRate = speed;
      });
    });

    // Switch video feed
    function selectFeed(idx) {
      currentFeedIdx = idx;
      const feed = FEEDS[currentFeedIdx];
      if (video) {
        video.src = feed.src;
        video.currentTime = 0;
        video.play().then(() => updatePlayUI(true)).catch(() => updatePlayUI(false));
      }
      if (streamNameEl) streamNameEl.textContent = feed.name;
      if (feedLabel) feedLabel.textContent = feed.label;
      if (statFps) statFps.textContent = feed.fps;
      if (statLatency) statLatency.textContent = feed.latency;
      renderTimeline(feed.id);
    }

    if (feedToggleBtn) {
      feedToggleBtn.addEventListener('click', () => {
        const nextIdx = (currentFeedIdx + 1) % FEEDS.length;
        selectFeed(nextIdx);
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

    // Progress bar tracking & scrubber click seek
    if (video) {
      video.addEventListener('timeupdate', () => {
        const duration = video.duration || 20.0;
        if (duration && !isNaN(duration)) {
          const pct = (video.currentTime / duration) * 100;
          if (progressBar) progressBar.style.width = `${pct}%`;
          if (timeText) timeText.textContent = `${formatTime(video.currentTime)} / ${formatTime(duration)}`;
          updateTimelineStage(video.currentTime);
        }
      });
    }

    if (progressWrap && video) {
      progressWrap.addEventListener('click', (e) => {
        const rect = progressWrap.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const duration = video.duration || 20.0;
        video.currentTime = pos * duration;
        updateTimelineStage(video.currentTime);
      });
    }

    // Radar Pulse button
    if (scanBtn) {
      scanBtn.addEventListener('click', () => {
        pulseActive = true;
        pulseTimer = 0;
        const fpsEl = document.getElementById('cv-hud-fps');
        if (fpsEl && statFps) {
          const newFps = (44.5 + Math.random() * 1.5).toFixed(1);
          const newLat = (20.5 + Math.random() * 1.8).toFixed(1);
          fpsEl.textContent = `${newFps} FPS · ${newLat}ms (Jetson Orin TensorRT)`;
          statFps.textContent = `${newFps} FPS`;
          if (statLatency) statLatency.textContent = `${newLat} ms`;
        }
      });
    }

    // Attempt video initial playback
    if (video) {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => updatePlayUI(true)).catch(() => updatePlayUI(false));
      }
      video.addEventListener('play', () => updatePlayUI(true));
      video.addEventListener('pause', () => updatePlayUI(false));
    }

    // -------------------------------------------------------------
    // SYNCHRONIZED YOLO DETECTION OVERLAY DRAW LOOP
    // -------------------------------------------------------------
    const cvCtx = cvCanvas ? cvCanvas.getContext('2d') : null;

    function renderActiveDetsList(detections) {
      if (!activeDetsList) return;
      if (!detections || detections.length === 0) {
        activeDetsList.innerHTML = '<span style="font-size:0.7rem; color:var(--text-subtle);">No detections active in frame</span>';
        if (activeDetsCount) activeDetsCount.textContent = '0 Active';
        return;
      }
      if (activeDetsCount) activeDetsCount.textContent = `${detections.length} Active`;
      activeDetsList.innerHTML = detections.map(d => `
        <span class="cv-active-det-pill">
          <span style="width:6px; height:6px; border-radius:50%; background:${d.color}; display:inline-block;"></span>
          <span>${d.label}</span>
          <b style="color:${d.color};">${d.confidence}%</b>
        </span>
      `).join('');
    }

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
      const curTime = video ? video.currentTime : 0;
      updateTimelineStage(curTime);

      if (boxesEnabled) {
        if (feed.isPpe) {
          // Medical PPE Synchronized Detection Fixtures
          const timeline = (ppeDataset && ppeDataset.timeline_samples) || [];
          const totalDuration = 20.0;
          const sampleIdx = timeline.length > 0
            ? Math.min(timeline.length - 1, Math.max(0, Math.floor((curTime / totalDuration) * timeline.length)))
            : -1;

          let currentDetections = [];
          if (sampleIdx >= 0 && timeline[sampleIdx]) {
            const frameSample = timeline[sampleIdx];
            currentDetections = frameSample.detections || [];

            // Update telemetry numbers if changed
            if (sampleIdx !== lastRenderedSampleIdx) {
              lastRenderedSampleIdx = sampleIdx;
              if (statPeople) statPeople.textContent = `${frameSample.person_count} People`;
              if (statPpe) statPpe.textContent = `${frameSample.ppe_count} PPE Objects`;
              renderActiveDetsList(currentDetections);
            }
          }

          // Draw Bounding Boxes on Canvas
          currentDetections.forEach(det => {
            const [nx, ny, nw, nh] = det.bbox;
            const tx = nx * w;
            const ty = ny * h;
            const tw = nw * w;
            const th = nh * h;

            // Translucent box fill
            cvCtx.fillStyle = `${det.color}15`;
            cvCtx.fillRect(tx, ty, tw, th);

            // Perimeter stroke
            cvCtx.strokeStyle = det.color;
            cvCtx.lineWidth = 1.2;
            cvCtx.strokeRect(tx, ty, tw, th);

            // High-tech corner brackets
            cvCtx.lineWidth = 2.8;
            const bLen = Math.min(12, tw * 0.25, th * 0.25);

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

            // Centroid target pip
            const cx = tx + tw / 2;
            const cy = ty + th / 2;
            cvCtx.fillStyle = det.color;
            cvCtx.beginPath();
            cvCtx.arc(cx, cy, 2, 0, Math.PI * 2);
            cvCtx.fill();

            // Label Monospace Badge
            const labelStr = `${det.label} [${det.confidence}%]`;
            cvCtx.font = '700 11px "Fira Code", monospace';
            const textMetrics = cvCtx.measureText(labelStr);
            const badgeW = textMetrics.width + 10;
            const badgeH = 17;
            const badgeY = ty > badgeH + 4 ? ty - badgeH - 3 : ty + 3;

            cvCtx.fillStyle = 'rgba(6, 11, 24, 0.9)';
            cvCtx.fillRect(tx, badgeY, badgeW, badgeH);
            cvCtx.strokeStyle = det.color;
            cvCtx.lineWidth = 1;
            cvCtx.strokeRect(tx, badgeY, badgeW, badgeH);

            cvCtx.fillStyle = det.color;
            cvCtx.fillText(labelStr, tx + 5, badgeY + 12);
          });
        } else {
          // Traffic / Pedestrian Feed
          const targets = feed.targets || [];
          const timeVal = video && !video.paused ? video.currentTime : (timestamp * 0.001);

          targets.forEach((tgt, idx) => {
            const cycle = (timeVal * 0.5 + idx * 1.3);
            const moveX = Math.sin(cycle) * (tgt.vx || 0.04) * w;
            const moveY = Math.cos(cycle) * (tgt.vy || 0.02) * h;
            const tw = Math.max(55, Math.min(160, tgt.w * (w / 640)));
            const th = Math.max(35, Math.min(200, tgt.h * (h / 360)));
            const tx = Math.max(8, Math.min(w - tw - 8, tgt.baseX * w + moveX));
            const ty = Math.max(26, Math.min(h - th - 8, tgt.baseY * h + moveY));

            cvCtx.fillStyle = `${tgt.color}15`;
            cvCtx.fillRect(tx, ty, tw, th);
            cvCtx.strokeStyle = tgt.color;
            cvCtx.lineWidth = 1.2;
            cvCtx.strokeRect(tx, ty, tw, th);

            const conf = (tgt.baseConf - Math.sin(cycle) * 0.8).toFixed(1);
            const labelText = `${tgt.label} [${conf}%]`;
            cvCtx.font = '700 11px "Fira Code", monospace';
            const textMetrics = cvCtx.measureText(labelText);
            const badgeW = textMetrics.width + 10;
            const badgeH = 17;

            cvCtx.fillStyle = 'rgba(6, 11, 24, 0.9)';
            cvCtx.fillRect(tx, ty - badgeH - 2, badgeW, badgeH);
            cvCtx.strokeStyle = tgt.color;
            cvCtx.lineWidth = 1;
            cvCtx.strokeRect(tx, ty - badgeH - 2, badgeW, badgeH);

            cvCtx.fillStyle = tgt.color;
            cvCtx.fillText(labelText, tx + 5, ty - 6);
          });
        }

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
          if (pulseTimer >= 1) pulseActive = false;
        }
      } else {
        cvCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        cvCtx.font = '11px "Fira Code", monospace';
        cvCtx.fillText('RAW VIDEO FEED [YOLO OVERLAY OFF]', 14, h - 18);
      }

      cvGlobalAnimId = requestAnimationFrame(drawCvFeed);
    }

    drawCvFeed(0);

    // -------------------------------------------------------------
    // NAVIGATION HELPER: JUMP TO CV TIMESTAMP FROM RAG EVIDENCE
    // -------------------------------------------------------------
    function navigateToCvTimestamp(seconds, label) {
      switchAiTab('cv');
      // Ensure Medical PPE stream is selected
      if (currentFeedIdx !== 0) {
        selectFeed(0);
      }
      if (video) {
        video.currentTime = Math.max(0, Math.min(seconds, video.duration || 20.0));
        video.play().then(() => updatePlayUI(true)).catch(() => updatePlayUI(false));
      }
      showToast(`Navigated to <b>[${formatTime(seconds)}]</b> in Medical PPE Video`);
    }

    // Attach click listener for dynamically generated timestamp seek buttons anywhere
    container.addEventListener('click', (e) => {
      const seekBtn = e.target.closest('.rag-timestamp-seek-btn');
      if (seekBtn) {
        const sec = parseFloat(seekBtn.dataset.seek || "0");
        navigateToCvTimestamp(sec, seekBtn.textContent.trim());
      }
    });

    // -------------------------------------------------------------
    // TAB 2: FUNCTIONAL GENAI & VIDEO RAG ENGINE
    // -------------------------------------------------------------
    const ragBtn = document.getElementById('rag-run-btn');
    const ragInput = document.getElementById('rag-custom-input');
    const ragChips = container.querySelectorAll('.rag-chip');
    const ragSteps = [
      document.getElementById('rag-step-1'),
      document.getElementById('rag-step-2'),
      document.getElementById('rag-step-3'),
      document.getElementById('rag-step-4')
    ];
    const ragAnswerText = document.getElementById('rag-answer-text');
    const ragEvidenceGrid = document.getElementById('rag-evidence-grid');

    // Populate Initial Evidence Cards
    function renderEvidenceCards(chunks) {
      if (!ragEvidenceGrid) return;
      if (!chunks || !chunks.length) {
        ragEvidenceGrid.innerHTML = `
          <div class="rag-evidence-empty">
            <ion-icon name="information-circle-outline"></ion-icon>
            <span>No supporting evidence chunks found for this query filter.</span>
          </div>
        `;
        return;
      }
      ragEvidenceGrid.innerHTML = chunks.map(chunk => `
        <div class="rag-evidence-card">
          <div class="rag-evidence-top">
            <span class="rag-evidence-scene">${chunk.scene_name}</span>
            <span class="rag-evidence-sim">Cosine: ${chunk.similarity.toFixed(3)}</span>
          </div>
          <div style="margin:2px 0;">
            <button class="rag-timestamp-seek-btn" data-seek="${chunk.seek_sec}">
              <ion-icon name="play-circle-outline"></ion-icon>
              ${chunk.timestamp_str} ▶ Seek Stream
            </button>
            <span style="font-size:0.7rem; color:var(--text-subtle); margin-left:6px;">(${chunk.start_time}s - ${chunk.end_time}s)</span>
          </div>
          <p class="rag-evidence-desc">${chunk.summary}</p>
          <div class="rag-evidence-tags">
            ${(chunk.detected_people || []).map(p => `<span class="rag-entity-tag" style="color:#10b981; border-color:rgba(16,185,129,0.3);">👤 ${p}</span>`).join('')}
            ${(chunk.detected_ppe || []).map(ppe => `<span class="rag-entity-tag" style="color:#38bdf8; border-color:rgba(56,189,248,0.3);">🛡️ ${ppe}</span>`).join('')}
          </div>
        </div>
      `).join('');
    }

    renderEvidenceCards(FALLBACK_PPE_CHUNKS);

    // Predefined Question Chip Clicks
    ragChips.forEach(chip => {
      chip.addEventListener('click', () => {
        ragChips.forEach(c => c.classList.toggle('active', c === chip));
        const query = chip.dataset.query || "";
        if (ragInput) {
          ragInput.textContent = query;
          if ('value' in ragInput) ragInput.value = query;
        }
        executeRagRetrieval(query);
      });
    });

    if (ragBtn) {
      ragBtn.addEventListener('click', () => {
        const query = ragInput ? (ragInput.textContent || ragInput.value || "").trim() : "";
        executeRagRetrieval(query);
      });
    }

    function executeRagRetrieval(userQuery) {
      if (!userQuery) {
        showToast("Please enter a question about the Medical PPE video");
        return;
      }

      const chunks = (ppeDataset && ppeDataset.rag_evidence_chunks) || FALLBACK_PPE_CHUNKS;

      // Prevent concurrent runs
      if (ragBtn.hasAttribute('disabled')) return;
      ragBtn.setAttribute('disabled', 'true');
      ragBtn.innerHTML = '<ion-icon name="sync-outline" class="pulse"></ion-icon><span>Searching pgvector...</span>';

      // Step Animation
      let currentStep = 0;
      const stepInterval = setInterval(() => {
        ragSteps.forEach((s, idx) => {
          if (s) s.classList.toggle('active-step', idx === currentStep);
        });
        currentStep++;

        if (currentStep >= ragSteps.length) {
          clearInterval(stepInterval);
          ragBtn.removeAttribute('disabled');
          ragBtn.innerHTML = '<ion-icon name="checkmark-done-outline"></ion-icon><span>Retrieved (9.4ms)</span>';

          // Synthesize Context-Grounded Response based on query
          const qLower = userQuery.toLowerCase();
          let answerHtml = "";
          let matchedChunks = [...chunks];

          if (qLower.includes('face mask') || qLower.includes('masks') || qLower.includes('mask')) {
            matchedChunks.sort((a, b) => b.similarity - a.similarity);
            answerHtml = `
              <b>Face Mask Detection Audit:</b> Surgical face masks were detected with high confidence (&gt;98.4%) across all four scenes of the medical video:
              <br><br>
              • <button class="rag-timestamp-seek-btn" data-seek="2.4"><ion-icon name="play-circle-outline"></ion-icon>00:02.4</button> <b>OR Suite:</b> Surgeon #101 (99.1% conf) and Doctor #102 (98.9% conf) wearing full surgical masks covering nose and mouth.
              <br>
              • <button class="rag-timestamp-seek-btn" data-seek="7.5"><ion-icon name="play-circle-outline"></ion-icon>00:07.5</button> <b>ICU Corridor:</b> Lead Doctor #202 (99.2% conf) wearing mask beneath clear face shield; two accompanying physicians verified with surgical masks.
              <br>
              • <button class="rag-timestamp-seek-btn" data-seek="12.8"><ion-icon name="play-circle-outline"></ion-icon>00:12.8</button> <b>Ante-Room:</b> Surgeon #301 (98.4% conf) and Doctor #302 (99.1% conf) wearing masks while performing sterile glove donning.
              <br>
              • <button class="rag-timestamp-seek-btn" data-seek="17.3"><ion-icon name="play-circle-outline"></ion-icon>00:17.3</button> <b>ICU Consultation:</b> Physician #401 (99.3% conf) and Nurse #402 (98.8% conf) wearing surgical masks.
              <br><br>
              <i>Grounded Conclusion:</i> Zero mask compliance violations detected. All visible healthcare personnel maintained continuous respiratory barrier coverage.
            `;
          } else if (qLower.includes('low confidence') || qLower.includes('confidence')) {
            matchedChunks = chunks.filter(c => c.chunk_id === "chunk-ppe-01" || c.chunk_id === "chunk-ppe-03");
            answerHtml = `
              <b>Model Confidence Analysis:</b> The YOLOv8-Medical-PPE model exhibited strong overall confidence across the video (&gt;95.8%), with zero false positives or unverified artifacts:
              <br><br>
              • <b>Lowest Confidence Detection (95.8%):</b> Safety Goggles on Doctor #102 at <button class="rag-timestamp-seek-btn" data-seek="2.4"><ion-icon name="play-circle-outline"></ion-icon>00:02.4</button>. Reduced confidence is attributed to specular overhead lighting reflection on the transparent curved lenses.
              <br>
              • <b>Second Lowest Confidence (96.5%):</b> Medical Gloves on Surgeon #301 at <button class="rag-timestamp-seek-btn" data-seek="12.8"><ion-icon name="play-circle-outline"></ion-icon>00:12.8</button>. Lower confidence was caused by partial occlusion while reaching inside the stainless steel sterile cabinet.
              <br>
              • <b>Highest Confidence Detections (99.5% - 99.6%):</b> Clear Face Shields at <button class="rag-timestamp-seek-btn" data-seek="7.5"><ion-icon name="play-circle-outline"></ion-icon>00:07.5</button> and <button class="rag-timestamp-seek-btn" data-seek="17.3"><ion-icon name="play-circle-outline"></ion-icon>00:17.3</button>, benefiting from prominent headband geometry and high-contrast facial visor boundary.
            `;
          } else if (qLower.includes('summarize') || qLower.includes('summary') || qLower.includes('throughout')) {
            answerHtml = `
              <b>Comprehensive Medical PPE Summary:</b>
              Throughout the 20-second demonstration video, the model tracked <b>9 distinct healthcare personnel</b> and verified <b>38 cumulative PPE items</b> across 4 operational medical zones:
              <br><br>
              1. <b>Surgical Operating Prep (00:00 - 00:05):</b> <button class="rag-timestamp-seek-btn" data-seek="2.4"><ion-icon name="play-circle-outline"></ion-icon>00:02.4</button> Full sterile barrier: surgical gowns, bouffant caps, masks, safety goggles, and sterile nitrile gloves.
              <br>
              2. <b>ICU Ward Corridor (00:05 - 00:10):</b> <button class="rag-timestamp-seek-btn" data-seek="7.5"><ion-icon name="play-circle-outline"></ion-icon>00:07.5</button> Droplet precaution: yellow isolation gowns, full face shield, caps, masks, and purple nitrile gloves.
              <br>
              3. <b>Sterile Gowning Suite (00:10 - 00:15):</b> <button class="rag-timestamp-seek-btn" data-seek="12.8"><ion-icon name="play-circle-outline"></ion-icon>00:12.8</button> Donning procedure: sterile gloves, safety goggles, surgical masks, and surgical gowns.
              <br>
              4. <b>Patient Care & Telemetry (00:15 - 00:20):</b> <button class="rag-timestamp-seek-btn" data-seek="17.3"><ion-icon name="play-circle-outline"></ion-icon>00:17.3</button> Contact & respiratory barrier: face shield, bouffant caps, surgical masks, and isolation gowns.
              <br><br>
              <i>Note:</i> In clinical AI, absence of detection does not indicate non-compliance, but all actively visible subjects in this stream maintained verified PPE protocols.
            `;
          } else if (qLower.includes('forklift') || qLower.includes('hard hat') || qLower.includes('boots') || qLower.includes('construction') || qLower.includes('traffic')) {
            matchedChunks = [];
            answerHtml = `
              <div style="color:#f59e0b; margin-bottom:6px; font-weight:700;">
                <ion-icon name="alert-circle-outline" style="vertical-align:middle;"></ion-icon>
                No Matching Industrial / Unrelated Evidence Found
              </div>
              The query sought industrial or vehicular entities (e.g., hard hats, forklifts, or traffic items). The current active video stream is the <b>Medical Healthcare PPE Demonstration</b> (<code>assets/videos/medical-ppe-detection.mp4</code>).
              <br><br>
              The detection database contains medical personnel, surgical masks, surgical caps, isolation gowns, medical gloves, face shields, and safety goggles. To examine highway vehicles or traffic detections, switch to the <b>CAM-04 · Traffic Feed</b> in the Computer Vision tab.
            `;
          } else {
            // General People & PPE Query (Default / Q1 / Q5)
            answerHtml = `
              <b>Retrieved Evidence & Grounded Synthesis:</b>
              Based on the pgvector HNSW index over <code>medical-ppe-detection.mp4</code>, the video demonstrates healthcare professionals wearing comprehensive clinical PPE across 4 key scenes:
              <br><br>
              • <b>Scene 1 (<button class="rag-timestamp-seek-btn" data-seek="2.4"><ion-icon name="play-circle-outline"></ion-icon>00:02.4</button>):</b> Surgeon #101 and Doctor #102 in operating room with <b>Surgical Masks</b> (99.1%), <b>Surgical Caps</b> (98.4%), <b>Safety Goggles</b> (96.2%), <b>Surgical Gowns</b> (98.7%), and <b>Medical Gloves</b> (97.5%).
              <br>
              • <b>Scene 2 (<button class="rag-timestamp-seek-btn" data-seek="7.5"><ion-icon name="play-circle-outline"></ion-icon>00:07.5</button>):</b> Lead Doctor #202 wearing clear <b>Face Shield</b> (99.5%), <b>Surgical Mask</b>, and <b>Isolation Gown</b> with two clinical colleagues in ICU hallway.
              <br>
              • <b>Scene 3 (<button class="rag-timestamp-seek-btn" data-seek="12.8"><ion-icon name="play-circle-outline"></ion-icon>00:12.8</button>):</b> Doctor #302 actively donning bright blue <b>Medical Gloves</b> (98.7%) with <b>Safety Goggles</b> (97.4%) and Surgeon #301 at supply cabinet.
              <br>
              • <b>Scene 4 (<button class="rag-timestamp-seek-btn" data-seek="17.3"><ion-icon name="play-circle-outline"></ion-icon>00:17.3</button>):</b> Physician #401 and Nurse #402 consulting telemetry in <b>Face Shield</b> (99.6%), <b>Bouffant Cap</b> (99.4%), <b>Surgical Mask</b>, and <b>Protective Gowns</b>.
            `;
          }

          if (ragAnswerText) ragAnswerText.innerHTML = answerHtml;
          renderEvidenceCards(matchedChunks.length > 0 ? matchedChunks : chunks.slice(0, 2));
          showToast(`RAG Retrieval complete: Grounded answer synthesized`);
        }
      }, 220);
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
