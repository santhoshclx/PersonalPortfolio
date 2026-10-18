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
  // 2. AMBIENT LIQUID CANVAS (NEURAL NODES + GRADIENT LIGHT FIELDS)
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

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    // Ambient floating orbs (Liquid light fields)
    const orbs = [
      { x: 0.15, y: 0.2, r: 240, vx: 0.0003, vy: 0.0002, hue: 195, alpha: 0.12 },
      { x: 0.85, y: 0.35, r: 280, vx: -0.0002, vy: 0.0003, hue: 230, alpha: 0.10 },
      { x: 0.5, y: 0.8, r: 260, vx: 0.0002, vy: -0.0002, hue: 270, alpha: 0.08 }
    ];

    // Neural network particles
    const particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 28000), 45);
    let particles = [];

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          size: Math.random() * 2 + 1,
          alpha: Math.random() * 0.3 + 0.2
        });
      }
    }

    let mouseX = -9999;
    let mouseY = -9999;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    let lastTime = 0;
    function animate(time = 0) {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

      // 1. Draw smooth liquid light orbs
      orbs.forEach(orb => {
        orb.x += Math.sin(time * orb.vx) * 0.0008;
        orb.y += Math.cos(time * orb.vy) * 0.0008;

        const posX = orb.x * width;
        const posY = orb.y * height;
        const grad = ctx.createRadialGradient(posX, posY, 0, posX, posY, orb.r);

        const orbAlpha = isDark ? orb.alpha : orb.alpha * 0.6;
        grad.addColorStop(0, `hsla(${orb.hue}, 85%, ${isDark ? '60%' : '50%'}, ${orbAlpha})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(posX, posY, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw neural network particles & connections
      const maxConnectDist = 130;
      const lineColor = isDark ? '56, 189, 248' : '2, 132, 199'; // cyan/blue

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Subtle mouse pull
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < 180) {
          const factor = (180 - distToMouse) / 180;
          p.x += (dx / distToMouse) * factor * 0.4;
          p.y += (dy / distToMouse) * factor * 0.4;
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${lineColor}, ${isDark ? p.alpha : p.alpha * 0.7})`;
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < maxConnectDist) {
            const alpha = (1 - dist / maxConnectDist) * (isDark ? 0.18 : 0.10);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();
    animate();
  }

  // =========================================================================
  // 3. CURSOR-RESPONSIVE GLASS SPOTLIGHT & CARD 3D TILT
  // =========================================================================
  function initGlassCardPhysics() {
    // Check if device supports hover / precise pointer (desktop)
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
      curX += (targetX - curX) * 0.15;
      curY += (targetY - curY) * 0.15;
      cursorLight.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
      requestAnimationFrame(renderCursorGlow);
    }
    renderCursorGlow();

    // 3D Glass Card Tilt & Specular border reflection on interactive cards
    const cardSelectors = '.project-card, .skill-category-card, .cert-card, .metric-pill, .hero-box';

    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest(cardSelectors);
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Set CSS variables for radial specular spotlight
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Gentle subtle 3D tilt (max 3 degrees for premium restraint)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -2.5;
      const rotateY = ((x - centerX) / centerX) * 2.5;

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
  // 4. INTERACTIVE EDGE-TO-CLOUD AI PIPELINE VISUALIZER (HERO SECTION)
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
        spec: 'GStreamer nvv4l2decoder hardware pipeline ingesting RTSP video feeds across facilities with 0 dropped frames.'
      },
      {
        id: 'stage-inference',
        name: 'AI Model Inference',
        icon: 'hardware-chip-outline',
        pill: 'YOLO · 35–45 FPS',
        badge: 'Jetson Orin Nano',
        spec: 'Custom fine-tuned YOLO models accelerated with TensorRT running 35–45 FPS at ~91% mAP@0.5 detection accuracy.'
      },
      {
        id: 'stage-embeddings',
        name: 'Vector Embeddings',
        icon: 'finger-print-outline',
        pill: 'ArcFace · pgvector',
        badge: 'HNSW Search',
        spec: '512-D InsightFace facial embeddings indexed via PostgreSQL pgvector with sub-millisecond similarity lookups.'
      },
      {
        id: 'stage-mlops',
        name: 'Cloud MLOps',
        icon: 'cloudy-outline',
        pill: 'SageMaker ml.g5',
        badge: 'AWS Infrastructure',
        spec: 'Containerized inference endpoints on Amazon SageMaker with CodePipeline CI/CD and automated model telemetry.'
      },
      {
        id: 'stage-security',
        name: 'Zero-Trust Security',
        icon: 'shield-checkmark-outline',
        pill: 'SSM · KMS · 80% Score',
        badge: 'HIPAA & SOC 2',
        spec: 'SSM ProxyCommand tunneling eliminating public SSH ports, automated KMS encryption, and 80% cloud security benchmark.'
      }
    ];

    container.innerHTML = `
      <div class="pipeline-header">
        <div class="pipeline-title-wrap">
          <span class="live-dot pulse"></span>
          <span class="pipeline-title">Edge-to-Cloud AI Architecture Flow</span>
        </div>
        <span class="pipeline-subtitle">Hover or tap nodes to inspect production engineering specs</span>
      </div>

      <div class="pipeline-flow-track">
        <div class="pipeline-glow-path" aria-hidden="true"></div>
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
          </div>
          <h4 class="spec-title" id="pipeline-spec-title">${pipelineStages[0].name}</h4>
          <p class="spec-desc" id="pipeline-spec-desc">${pipelineStages[0].spec}</p>
        </div>
      </div>
    `;

    // Interactive inspection on hover or focus
    const nodeEls = container.querySelectorAll('.pipeline-node');
    const badgeEl = container.querySelector('#pipeline-spec-badge');
    const pillEl = container.querySelector('#pipeline-spec-pill');
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
  // 5. SCROLL-TRIGGERED REVEAL ANIMATIONS
  // =========================================================================
  function initScrollReveals() {
    if (prefersReducedMotion) {
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
      return;
    }

    const revealElements = document.querySelectorAll(
      '.service-item, .skill-category-card, .project-card, .timeline-item, .cert-card, .blog-post-item, .metric-pill, .contact-card-box'
    );

    revealElements.forEach((el, index) => {
      el.classList.add('liquid-reveal-init');
      // Subtle stagger delay
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
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // =========================================================================
  // 6. BACK TO TOP QUICK TRIGGER
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
  // INITIALIZATION ON DOM READY & DATASOURCE EVENTS
  // =========================================================================
  function bootstrap() {
    initScrollProgress();
    initAmbientCanvas();
    initGlassCardPhysics();
    initInteractiveHeroPipeline();
    initScrollReveals();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

  // Re-run reveals when datasource hydrates or page changes
  document.addEventListener('datasource:ready', () => {
    setTimeout(() => {
      initInteractiveHeroPipeline();
      initScrollReveals();
    }, 50);
  });

  window.LiquidFX = {
    refreshReveals: initScrollReveals,
    refreshPipeline: initInteractiveHeroPipeline
  };

})();
