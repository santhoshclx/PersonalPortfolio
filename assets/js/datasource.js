/**
 * datasource.js - Centralized Data Access & UI Hydration Layer
 * Single Source of Truth for PersonalPortfolio
 */

(function () {
  'use strict';

  const DATASOURCE_BASE = './datasource/';

  // In-memory cache of datasource
  const dataStore = {
    siteConfig: null,
    profile: null,
    socialLinks: null,
    skills: null,
    experience: null,
    projects: null,
    certifications: null,
    education: null,
    achievements: null,
    navigation: null,
    blogs: null,
    isLoaded: false
  };

  /**
   * Helper to fetch JSON safely with fallback
   */
  async function fetchJson(filename) {
    try {
      const response = await fetch(`${DATASOURCE_BASE}${filename}?t=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      console.warn(`[Datasource] Warning loading ${filename}:`, err.message);
      return null;
    }
  }

  /**
   * Load all datasource files in parallel
   */
  async function loadAllDatasources() {
    try {
      const [
        siteConfig,
        profile,
        socialLinks,
        skills,
        experience,
        projects,
        certifications,
        education,
        achievements,
        navigation,
        blogs
      ] = await Promise.all([
        fetchJson('site-config.json'),
        fetchJson('profile.json'),
        fetchJson('social-links.json'),
        fetchJson('skills.json'),
        fetchJson('experience.json'),
        fetchJson('projects.json'),
        fetchJson('certifications.json'),
        fetchJson('education.json'),
        fetchJson('achievements.json'),
        fetchJson('navigation.json'),
        fetchJson('blogs.json')
      ]);

      dataStore.siteConfig = siteConfig;
      dataStore.profile = profile;
      dataStore.socialLinks = socialLinks;
      dataStore.skills = skills;
      dataStore.experience = experience;
      dataStore.projects = projects;
      dataStore.certifications = certifications;
      dataStore.education = education;
      dataStore.achievements = achievements;
      dataStore.navigation = navigation;
      dataStore.blogs = blogs;
      dataStore.isLoaded = true;

      return true;
    } catch (err) {
      console.error('[Datasource] Critical error loading datasource:', err);
      return false;
    }
  }

  // =============================================================
  // COMPONENT RENDERERS
  // =============================================================

  /**
   * Hydrate Site Metadata & SEO
   */
  function renderSiteConfig() {
    const cfg = dataStore.siteConfig;
    if (!cfg) return;

    // ---------------------------------------------------------
    // Overall Website & Font Size Scaling Control
    // Single value controls all website scaling + font sizes
    // ---------------------------------------------------------
    const scaleConfig = cfg.scaling || {};
    const uiScale = cfg.websiteScale ?? cfg.uiScale ?? cfg.scale ?? scaleConfig.websiteScale ?? scaleConfig.uiScale ?? scaleConfig.scale ?? 1.0;
    const fontScale = cfg.fontScale ?? scaleConfig.fontScale ?? 1.0;
    const baseFontSize = cfg.baseFontSize ?? scaleConfig.baseFontSize ?? '16px';

    const root = document.documentElement;
    root.style.setProperty('--ui-scale', uiScale);
    root.style.setProperty('--font-scale', fontScale);
    root.style.setProperty('--base-font-size', typeof baseFontSize === 'number' ? `${baseFontSize}px` : baseFontSize);

    if (cfg.siteTitle) document.title = cfg.siteTitle;

    const metaTitle = document.querySelector('meta[name="title"]');
    if (metaTitle && cfg.siteTitle) metaTitle.setAttribute('content', cfg.siteTitle);

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && cfg.siteDescription) metaDesc.setAttribute('content', cfg.siteDescription);

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && Array.isArray(cfg.keywords)) {
      metaKeywords.setAttribute('content', cfg.keywords.join(', '));
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && cfg.siteTitle) ogTitle.setAttribute('content', cfg.siteTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && cfg.siteDescription) ogDesc.setAttribute('content', cfg.siteDescription);

    const twTitle = document.querySelector('meta[property="twitter:title"]');
    if (twTitle && cfg.siteTitle) twTitle.setAttribute('content', cfg.siteTitle);

    const twDesc = document.querySelector('meta[property="twitter:description"]');
    if (twDesc && cfg.siteDescription) twDesc.setAttribute('content', cfg.siteDescription);

    // Footer info
    const footerText = document.querySelector('[data-footer-text]');
    if (footerText && cfg.footer) {
      footerText.innerHTML = `&copy; <span id="current-year">${cfg.footer.copyrightYear || new Date().getFullYear()}</span> <b>${cfg.footer.author || 'Santhoshkumar R'}</b>. ${cfg.footer.text || ''}`;
    }
    const footerTagline = document.querySelector('[data-footer-tagline]');
    if (footerTagline && cfg.footer?.tagline) {
      footerTagline.textContent = cfg.footer.tagline;
    }

    // ---------------------------------------------------------
    // Theme Configuration (default theme, toggle, storage key)
    // ---------------------------------------------------------
    if (cfg.theme) {
      const themeCfg = cfg.theme;
      const storageKey = themeCfg.storageKey || 'portfolio-theme';
      const defaultTheme = themeCfg.default || 'dark';
      const savedTheme = localStorage.getItem(storageKey);
      const activeTheme = savedTheme || defaultTheme;

      document.documentElement.setAttribute('data-theme', activeTheme);

      if (window.PortfolioTheme && typeof window.PortfolioTheme.updateThemeIcon === 'function') {
        window.PortfolioTheme.updateThemeIcon(activeTheme);
      } else {
        const toggleBtn = document.querySelector('[data-theme-btn]');
        if (toggleBtn) {
          const icon = toggleBtn.querySelector('ion-icon');
          const isLight = activeTheme === 'light';
          if (icon) {
            icon.setAttribute('name', isLight ? 'moon-outline' : 'sunny-outline');
            toggleBtn.setAttribute('title', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
            toggleBtn.setAttribute('aria-label', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
          }
        }
      }

      const toggleBtn = document.querySelector('[data-theme-btn]');
      if (toggleBtn && themeCfg.allowToggle === false) {
        toggleBtn.style.display = 'none';
      }
    }
  }

  /**
   * Hydrate Sidebar Profile & Contacts
   */
  function renderProfile() {
    const prof = dataStore.profile;
    const cfg = dataStore.siteConfig;
    const socials = dataStore.socialLinks || [];
    if (!prof) return;

    // Avatar
    const avatarImg = document.querySelector('[data-profile-avatar]');
    if (avatarImg && prof.avatar) {
      avatarImg.setAttribute('src', prof.avatar);
      avatarImg.setAttribute('alt', prof.name || 'Avatar');
    }

    // Name & Title
    const nameEl = document.querySelector('[data-profile-name]');
    if (nameEl && prof.name) {
      nameEl.textContent = prof.name;
      nameEl.setAttribute('title', prof.name);
    }

    const titleEl = document.querySelector('[data-profile-title]');
    if (titleEl && prof.headline) {
      titleEl.textContent = prof.headline;
    }

    // Credential Badge
    const credBadge = document.querySelector('[data-profile-cred-badge]');
    if (credBadge && prof.credentialsBadge) {
      credBadge.setAttribute('title', prof.credentialsBadge.tooltip || '');
      credBadge.innerHTML = `
        <ion-icon name="${prof.credentialsBadge.icon || 'shield-checkmark'}"></ion-icon>
        <span>${prof.credentialsBadge.label || ''}</span>
      `;
    }

    // Contacts List
    const contactsList = document.querySelector('[data-profile-contacts]');
    if (contactsList) {
      contactsList.innerHTML = `
        <li class="contact-item">
          <div class="icon-box">
            <ion-icon name="briefcase-outline"></ion-icon>
          </div>
          <div class="contact-info">
            <p class="contact-title">Current Role</p>
            <span>${prof.currentRole || ''}</span>
          </div>
        </li>
        <li class="contact-item">
          <div class="icon-box">
            <ion-icon name="mail-outline"></ion-icon>
          </div>
          <div class="contact-info">
            <p class="contact-title">Email</p>
            <a href="mailto:${prof.email || ''}" class="contact-link" title="${prof.email || ''}">${prof.email || ''}</a>
          </div>
        </li>
        <li class="contact-item">
          <div class="icon-box">
            <ion-icon name="location-outline"></ion-icon>
          </div>
          <div class="contact-info">
            <p class="contact-title">Location</p>
            <address>${prof.location?.display || ''}</address>
          </div>
        </li>
        <li class="contact-item">
          <div class="icon-box">
            <ion-icon name="school-outline"></ion-icon>
          </div>
          <div class="contact-info">
            <p class="contact-title">Education</p>
            <span>${prof.educationBrief || ''}</span>
          </div>
        </li>
      `;
    }

    // Social Links
    const socialList = document.querySelector('[data-profile-socials]');
    if (socialList && Array.isArray(socials)) {
      socialList.innerHTML = socials
        .filter(s => s.showInSidebar)
        .map(s => `
          <li class="social-item">
            <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="social-link" title="${s.title || s.platform}">
              <ion-icon name="${s.icon}"></ion-icon>
            </a>
          </li>
        `).join('');
    }

    // Resume Download Buttons
    const resumePath = cfg?.resume?.path || './assets/Santhoshkumar-R-Resume-20260718.pdf';
    const resumeFilename = cfg?.resume?.filename || 'Resume.pdf';
    const resumeLabel = cfg?.resume?.label || 'Download Resume';

    document.querySelectorAll('[data-resume-link]').forEach(el => {
      el.setAttribute('href', resumePath);
      el.setAttribute('download', resumeFilename);
      const span = el.querySelector('span');
      if (span) span.textContent = el.dataset.resumeLabel || resumeLabel;
    });

    // Hero Section
    if (prof.hero) {
      const heroBadges = document.querySelector('[data-hero-badges]');
      if (heroBadges && Array.isArray(prof.hero.badges)) {
        heroBadges.innerHTML = prof.hero.badges.map(b => {
          const pillClass = b.type ? `tag-pill ${b.type}` : 'tag-pill';
          const iconHtml = b.icon ? `<ion-icon name="${b.icon}"></ion-icon>` : '';
          const dotHtml = b.dot ? '<span class="live-dot"></span>' : '';
          return `<span class="${pillClass}">${iconHtml}${dotHtml} ${b.text}</span>`;
        }).join('');
      }

      const heroTitle = document.querySelector('[data-hero-title]');
      if (heroTitle && prof.hero.title) {
        heroTitle.innerHTML = prof.hero.title;
      }

      const heroSubtitle = document.querySelector('[data-hero-subtitle]');
      if (heroSubtitle && prof.hero.subtitle) {
        heroSubtitle.innerHTML = prof.hero.subtitle;
      }
    }

    // About Paragraphs
    const aboutText = document.querySelector('[data-about-paragraphs]');
    if (aboutText && prof.about?.paragraphs) {
      aboutText.innerHTML = prof.about.paragraphs.map(p => `<p>${p}</p>`).join('');
    }

    // Core Disciplines / Services
    const disciplinesList = document.querySelector('[data-core-disciplines]');
    if (disciplinesList && Array.isArray(prof.coreDisciplines)) {
      disciplinesList.innerHTML = prof.coreDisciplines.map(d => `
        <li class="service-item">
          <div class="service-icon-box">
            <ion-icon name="${d.icon || 'sparkles-outline'}"></ion-icon>
          </div>
          <div class="service-content-box">
            <h4 class="h4 service-item-title">${d.title}</h4>
            <p class="service-item-text">${d.description}</p>
          </div>
        </li>
      `).join('');
    }
  }

  /**
   * Hydrate Hero Metrics from Achievements
   */
  function renderAchievements() {
    const ach = dataStore.achievements;
    if (!ach || !Array.isArray(ach.metrics)) return;

    const metricsGrid = document.querySelector('[data-hero-metrics]');
    if (metricsGrid) {
      metricsGrid.innerHTML = ach.metrics.map(m => {
        const numClass = m.highlight ? `metric-number ${m.highlight}` : 'metric-number';
        return `
          <div class="metric-pill">
            <div class="${numClass}">${m.value}</div>
            <div class="metric-desc">${m.label}</div>
          </div>
        `;
      }).join('');
    }
  }

  /**
   * Hydrate Experience Timeline
   */
  function renderExperience() {
    const exp = dataStore.experience;
    if (!exp || !Array.isArray(exp.history)) return;

    const timelineList = document.querySelector('[data-experience-timeline]');
    if (timelineList) {
      timelineList.innerHTML = exp.history.map(job => {
        const bulletsHtml = job.bullets.map(b => {
          if (typeof b === 'string') return `<li>${b}</li>`;
          return `<li><b>${b.heading}:</b> ${b.text}</li>`;
        }).join('');

        return `
          <li class="timeline-item">
            <h4 class="timeline-item-title">${job.jobTitle}</h4>
            <div class="timeline-company">
              <span>${job.company}</span>
              ${job.type ? `<span class="tag-pill">${job.type}</span>` : ''}
              ${job.location ? `<span class="tag-pill emerald">${job.location}</span>` : ''}
            </div>
            <span class="timeline-date">${job.dateDisplay}</span>
            <ul class="timeline-bullets">
              ${bulletsHtml}
            </ul>
          </li>
        `;
      }).join('');
    }
  }

  /**
   * Hydrate Skills Matrix
   */
  function renderSkills() {
    const skillsData = dataStore.skills;
    if (!skillsData || !Array.isArray(skillsData.categories)) return;

    const skillsGrid = document.querySelector('[data-skills-grid]');
    if (skillsGrid) {
      skillsGrid.innerHTML = skillsData.categories.map(cat => {
        const tagsHtml = cat.tags.map(t => {
          if (typeof t === 'string') return `<span class="tag-pill">${t}</span>`;
          const cls = t.type ? `tag-pill ${t.type}` : 'tag-pill';
          return `<span class="${cls}">${t.name}</span>`;
        }).join('');

        const bulletsHtml = cat.bullets.map(b => `<li>${b}</li>`).join('');

        return `
          <div class="skill-category-card">
            <div class="skill-cat-header">
              <div class="icon-box">
                <ion-icon name="${cat.icon || 'sparkles-outline'}"></ion-icon>
              </div>
              <h3 class="skill-cat-title">${cat.title}</h3>
            </div>
            <div class="skill-tags-wrap">
              ${tagsHtml}
            </div>
            <ul class="skill-detail-bullets">
              ${bulletsHtml}
            </ul>
          </div>
        `;
      }).join('');
    }
  }

  /**
   * Hydrate Projects & Filter Tabs
   */
  function renderProjects() {
    const projData = dataStore.projects;
    if (!projData || !Array.isArray(projData.projects)) return;

    // Filters
    const filterList = document.querySelector('[data-project-filters]');
    if (filterList && Array.isArray(projData.categories)) {
      filterList.innerHTML = projData.categories.map((cat, idx) => `
        <li class="filter-item">
          <button class="${idx === 0 ? 'active' : ''}" data-filter-btn>${cat}</button>
        </li>
      `).join('');
    }

    // Projects Grid
    const projectsContainer = document.querySelector('[data-projects-container]');
    if (projectsContainer) {
      const visibleProjects = projData.projects
        .filter(p => p.visible !== false)
        .sort((a, b) => (a.order || 99) - (b.order || 99));

      projectsContainer.innerHTML = visibleProjects.map(p => {
        const badgeClass = p.badge?.type ? `tag-pill ${p.badge.type}` : 'tag-pill';
        const badgeHtml = p.badge?.text ? `
          <div class="project-badge-overlay">
            <span class="${badgeClass}">${p.badge.text}</span>
          </div>
        ` : '';

        return `
          <div class="project-item active" data-filter-item data-category="${p.filterCategory || ''}">
            <div class="project-card">
              <div class="project-img-wrap">
                <img src="${p.thumbnail}" alt="${p.imageAlt || p.title}" loading="lazy">
                ${badgeHtml}
              </div>
              <div class="project-content">
                ${p.metaPill ? `<span class="project-meta-pill">${p.metaPill}</span>` : ''}
                <h3 class="project-title">${p.title}</h3>
                <p class="project-summary">${p.summary}</p>
                <div class="project-card-footer">
                  <a href="#" onclick="loadProjectContent('${p.detailUrl}'); return false;" class="project-action-btn">
                    <ion-icon name="${p.actionIcon || 'layers-outline'}"></ion-icon>
                    <span>${p.actionLabel || 'View Details'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  /**
   * Hydrate Certifications & Education
   */
  function renderCertificationsAndEducation() {
    const certsData = dataStore.certifications;
    const eduData = dataStore.education;

    // Certifications
    if (certsData && Array.isArray(certsData.certifications)) {
      const certGrid = document.querySelector('[data-certifications-grid]');
      if (certGrid) {
        certGrid.innerHTML = certsData.certifications.map(c => {
          const featuredClass = c.featured ? 'cert-card featured' : 'cert-card';
          const iconStyleAttr = c.iconStyle ? `style="${c.iconStyle}"` : '';

          let badgeHtml = '';
          if (c.tag) {
            const cls = c.tagColor ? `tag-pill ${c.tagColor}` : 'tag-pill';
            badgeHtml = `<p><span class="${cls}">${c.tag}</span></p>`;
          }

          let datesHtml = '';
          if (c.issueDate) {
            datesHtml += `<b>Issue Date:</b> ${c.issueDate}`;
            if (c.expirationDate) datesHtml += ` · <b>Expiration Date:</b> ${c.expirationDate}`;
            datesHtml = `<p>${datesHtml}</p>`;
          }

          let valIdHtml = '';
          if (c.validationId) {
            valIdHtml = `<p><b>Validation ID:</b> <code>${c.validationId}</code></p>`;
          }

          let linksHtml = '';
          if (Array.isArray(c.verificationLinks) && c.verificationLinks.length > 0) {
            linksHtml = `
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${c.verificationLinks.map(l => `
                  <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="cert-verify-link">
                    <ion-icon name="${l.icon || 'open-outline'}"></ion-icon>
                    <span>${l.label}</span>
                  </a>
                `).join('')}
              </div>
            `;
          }

          return `
            <div class="${featuredClass}">
              <div class="cert-header">
                <div class="cert-icon" ${iconStyleAttr}>
                  <ion-icon name="${c.icon || 'shield-checkmark'}"></ion-icon>
                </div>
                <div>
                  <h4 class="cert-title">${c.name}</h4>
                  <p class="cert-issuer">${c.issuer} ${c.credentialCode ? `· Credential ${c.credentialCode}` : ''}</p>
                </div>
              </div>
              <div class="cert-details">
                ${badgeHtml}
                ${datesHtml}
                ${valIdHtml}
                <p style="margin-top: 6px;">${c.description}</p>
              </div>
              ${linksHtml}
            </div>
          `;
        }).join('');
      }
    }

    // Education
    if (eduData && Array.isArray(eduData.degrees)) {
      const eduTimeline = document.querySelector('[data-education-timeline]');
      if (eduTimeline) {
        eduTimeline.innerHTML = eduData.degrees.map(d => {
          const tagClass = d.tagColor ? `tag-pill ${d.tagColor}` : 'tag-pill';
          return `
            <li class="timeline-item">
              <h4 class="timeline-item-title">${d.degree}</h4>
              <div class="timeline-company">
                <span>${d.institution}</span>
                ${d.tag ? `<span class="${tagClass}">${d.tag}</span>` : ''}
              </div>
              <p class="about-text" style="margin-bottom: 0;">
                ${d.description}
              </p>
            </li>
          `;
        }).join('');
      }
    }
  }

  /**
   * Hydrate Blog Posts
   */
  function renderBlogs() {
    const blogData = dataStore.blogs;
    if (!blogData || !Array.isArray(blogData.articles)) return;

    const blogList = document.querySelector('[data-blog-list]');
    if (blogList) {
      blogList.innerHTML = blogData.articles.map(art => {
        const tagClass = art.tagColor ? `tag-pill ${art.tagColor}` : 'tag-pill';
        return `
          <li class="blog-post-item">
            <a href="#" onclick="loadProjectContent('${art.detailUrl}'); return false;">
              <figure class="blog-banner-box">
                <img src="${art.thumbnail}" alt="${art.imageAlt || art.title}" loading="lazy">
              </figure>
              <div class="blog-content">
                <div class="blog-meta">
                  <span class="${tagClass}">${art.tag}</span>
                  <span class="dot"></span>
                  <time datetime="${art.date}">${art.dateDisplay}</time>
                </div>
                <h3 class="blog-item-title">${art.title}</h3>
                <p class="blog-text">${art.summary}</p>
              </div>
            </a>
          </li>
        `;
      }).join('');
    }
  }

  /**
   * Hydrate Contact Cards
   */
  function renderContact() {
    const prof = dataStore.profile;
    const socials = dataStore.socialLinks || [];
    const cfg = dataStore.siteConfig;
    if (!prof) return;

    const cardsGrid = document.querySelector('[data-contact-cards]');
    if (cardsGrid) {
      const cards = [];

      // Direct Email Card
      if (prof.email) {
        cards.push(`
          <a href="mailto:${prof.email}" class="contact-card-box">
            <div class="icon-box">
              <ion-icon name="mail-outline"></ion-icon>
            </div>
            <div class="contact-details">
              <p class="contact-title">Direct Email</p>
              <span class="contact-link">${prof.email}</span>
            </div>
          </a>
        `);
      }

      // Social Links configured for contact section
      socials.filter(s => s.showInContact).forEach(s => {
        cards.push(`
          <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="contact-card-box">
            <div class="icon-box">
              <ion-icon name="${s.icon}"></ion-icon>
            </div>
            <div class="contact-details">
              <p class="contact-title">${s.contactCardTitle || s.platform}</p>
              <span class="contact-link">${s.displayHandle || s.platform}</span>
            </div>
          </a>
        `);
      });

      // Resume Card
      const resumePath = cfg?.resume?.path || './assets/Santhoshkumar-R-Resume-20260718.pdf';
      const resumeFilename = cfg?.resume?.filename || 'Resume.pdf';
      cards.push(`
        <a href="${resumePath}" download="${resumeFilename}" class="contact-card-box" data-resume-link>
          <div class="icon-box">
            <ion-icon name="document-text-outline"></ion-icon>
          </div>
          <div class="contact-details">
            <p class="contact-title">Verified Resume</p>
            <span class="contact-link">Download PDF (${cfg?.resume?.badge || 'Latest'})</span>
          </div>
        </a>
      `);

      cardsGrid.innerHTML = cards.join('');
    }
  }

  /**
   * Hydrate all components from loaded datasource
   */
  function hydrateAllComponents() {
    if (!dataStore.isLoaded) return;
    renderSiteConfig();
    renderProfile();
    renderAchievements();
    renderExperience();
    renderSkills();
    renderProjects();
    renderCertificationsAndEducation();
    renderBlogs();
    renderContact();
  }

  // =============================================================
  // PUBLIC API
  // =============================================================

  window.PortfolioDatasource = {
    getSiteConfig: () => dataStore.siteConfig,
    getProfile: () => dataStore.profile,
    getSocialLinks: () => dataStore.socialLinks,
    getSkills: () => dataStore.skills,
    getExperience: () => dataStore.experience,
    getProjects: () => dataStore.projects,
    getCertifications: () => dataStore.certifications,
    getEducation: () => dataStore.education,
    getAchievements: () => dataStore.achievements,
    getNavigation: () => dataStore.navigation,
    getBlogs: () => dataStore.blogs,
    hydrateAll: hydrateAllComponents,
    reload: async function () {
      const ok = await loadAllDatasources();
      if (ok) {
        hydrateAllComponents();
        document.dispatchEvent(new CustomEvent('datasource:ready', { detail: dataStore }));
      }
      return ok;
    }
  };

  // Initialize datasource and hydrate UI
  async function init() {
    if (document.readyState === 'loading') {
      await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
    }
    const ok = await loadAllDatasources();
    if (ok) {
      hydrateAllComponents();
      document.dispatchEvent(new CustomEvent('datasource:ready', { detail: dataStore }));
    }
  }

  init();

})();
