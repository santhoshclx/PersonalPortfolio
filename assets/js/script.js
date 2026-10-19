'use strict';

// -------------------------------------------------------------
// THEME MANAGEMENT (Dark / Light Mode)
// -------------------------------------------------------------
const getThemeConfig = () => {
  const siteConfig = window.PortfolioDatasource ? window.PortfolioDatasource.getSiteConfig() : null;
  const themeCfg = siteConfig?.theme || {};
  const defaultFromAttr = document.documentElement.getAttribute('data-theme');
  const defaultTheme = themeCfg.default || defaultFromAttr || 'dark';
  const storageKey = themeCfg.storageKey || 'portfolio-theme';
  const allowToggle = themeCfg.allowToggle !== false;
  return { defaultTheme, storageKey, allowToggle };
};

const updateThemeIcon = (theme) => {
  const toggleBtn = document.querySelector('[data-theme-btn]');
  if (!toggleBtn) return;
  const icon = toggleBtn.querySelector('ion-icon');
  const isLight = theme === 'light';
  if (icon) {
    icon.setAttribute('name', isLight ? 'moon-outline' : 'sunny-outline');
    toggleBtn.setAttribute('title', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    toggleBtn.setAttribute('aria-label', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
  }
};

const initTheme = (forcedDefault) => {
  const { defaultTheme, storageKey, allowToggle } = getThemeConfig();
  const effectiveDefault = forcedDefault || defaultTheme;
  const savedTheme = localStorage.getItem(storageKey);
  const activeTheme = savedTheme || effectiveDefault;
  
  document.documentElement.setAttribute('data-theme', activeTheme);
  updateThemeIcon(activeTheme);

  const toggleBtn = document.querySelector('[data-theme-btn]');
  if (toggleBtn) {
    toggleBtn.style.display = allowToggle ? '' : 'none';
  }
};

const toggleTheme = () => {
  const { storageKey } = getThemeConfig();
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem(storageKey, newTheme);
  updateThemeIcon(newTheme);
  document.dispatchEvent(new CustomEvent('theme:change', { detail: { theme: newTheme } }));
};

// Global theme API
window.PortfolioTheme = {
  initTheme,
  toggleTheme,
  updateThemeIcon,
  getThemeConfig
};

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  const themeBtn = document.querySelector('[data-theme-btn]');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
});

// Automatically sync when site-config.json finishes loading
document.addEventListener('datasource:ready', (e) => {
  const siteConfig = e.detail?.siteConfig || (window.PortfolioDatasource && window.PortfolioDatasource.getSiteConfig());
  if (siteConfig?.theme) {
    initTheme(siteConfig.theme.default);
  }
});

// -------------------------------------------------------------
// SIDEBAR TOGGLE FUNCTIONALITY (Mobile)
// -------------------------------------------------------------
const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');

if (sidebar && sidebarBtn) {
  sidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });
}

// -------------------------------------------------------------
// PAGE NAVIGATION
// -------------------------------------------------------------
// PAGE NAVIGATION
// -------------------------------------------------------------
const switchPage = (targetPageName) => {
  // Remove any open project detail before switching
  const projectDetail = document.querySelector('[data-page="project-detail"]');
  if (projectDetail) {
    projectDetail.remove();
  }

  const pages = document.querySelectorAll('[data-page]');
  pages.forEach(page => {
    if (page.dataset.page === targetPageName) {
      page.classList.add('active');
    } else {
      page.classList.remove('active');
    }
  });

  const navigationLinks = document.querySelectorAll('[data-nav-link]');
  navigationLinks.forEach(link => {
    if (link.dataset.navLink === targetPageName || link.innerText.trim().toLowerCase() === targetPageName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Refresh LiquidFX reveals & visualizer for newly active section
  if (window.LiquidFX) {
    if (window.LiquidFX.updateNavPill) window.LiquidFX.updateNavPill();
    setTimeout(() => {
      if (window.LiquidFX.refreshReveals) window.LiquidFX.refreshReveals();
      if (targetPageName === 'about') {
        if (window.LiquidFX.refreshPipeline) window.LiquidFX.refreshPipeline();
        if (window.LiquidFX.refreshAISimulator) window.LiquidFX.refreshAISimulator();
      }
    }, 50);
  }
};

// Event delegation for navigation links (supports dynamically rendered nav links)
document.addEventListener('click', function (e) {
  const navLink = e.target.closest('[data-nav-link]');
  if (navLink) {
    e.preventDefault();
    const targetPage = navLink.dataset.navLink || navLink.innerText.trim().toLowerCase();
    switchPage(targetPage);
  }
});

// Quick navigation triggers from Hero CTA buttons
window.navigateToSection = function(sectionName) {
  switchPage(sectionName);
};

// -------------------------------------------------------------
// PROJECT FILTERING
// -------------------------------------------------------------
const filterFunc = (selectedValue) => {
  const normVal = selectedValue.trim().toLowerCase();
  const filterItems = document.querySelectorAll('[data-filter-item]');
  filterItems.forEach(item => {
    const itemCat = (item.dataset.category || '').toLowerCase();
    if (normVal === 'all' || itemCat.includes(normVal)) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  if (window.LiquidFX && window.LiquidFX.refreshReveals) {
    setTimeout(window.LiquidFX.refreshReveals, 50);
  }
};

// Event delegation for filter buttons (supports dynamically rendered filter buttons)
document.addEventListener('click', function (e) {
  const filterBtn = e.target.closest('[data-filter-btn]');
  if (filterBtn) {
    const allBtns = document.querySelectorAll('[data-filter-btn]');
    allBtns.forEach(btn => btn.classList.remove('active'));
    filterBtn.classList.add('active');

    const selectedValue = filterBtn.innerText;
    const selectValue = document.querySelector('[data-select-value]');
    if (selectValue) selectValue.innerText = selectedValue;

    filterFunc(selectedValue);
  }
});

// Mobile filter dropdown select
document.addEventListener('click', function (e) {
  const select = e.target.closest('[data-select]');
  if (select) {
    select.classList.toggle('active');
  }

  const selectItem = e.target.closest('[data-select-item]');
  if (selectItem) {
    const selectedValue = selectItem.innerText;
    const selectValue = document.querySelector('[data-select-value]');
    if (selectValue) selectValue.innerText = selectedValue;
    const selectParent = document.querySelector('[data-select]');
    if (selectParent) selectParent.classList.remove('active');
    filterFunc(selectedValue);
  }
});

// -------------------------------------------------------------
// DYNAMIC PROJECT DETAIL LOADING
// -------------------------------------------------------------
window.loadProjectContent = function (projectUrl) {
  fetch(projectUrl)
    .then(response => {
      if (!response.ok) throw new Error('Network error: ' + response.statusText);
      return response.text();
    })
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const sourceContainer = doc.querySelector('article') || 
                              doc.querySelector('main') || 
                              doc.body;
      const clone = sourceContainer.cloneNode(true);
      // Remove any static standalone back button if present
      const existingBack = clone.querySelector('.back-btn');
      if (existingBack) existingBack.remove();
      const projectContent = clone.innerHTML;

      // Remove existing project detail if any
      const existing = document.querySelector('[data-page="project-detail"]');
      if (existing) existing.remove();

      const isFromBlog = projectUrl.includes('/blogs/');
      const originPage = isFromBlog ? 'blog' : 'projects';

      const projectArticle = document.createElement('article');
      projectArticle.className = 'project-detail active';
      projectArticle.setAttribute('data-page', 'project-detail');
      projectArticle.innerHTML = `
        <button onclick="closeProjectDetail('${originPage}')" class="back-btn" aria-label="Go back">
          <ion-icon name="arrow-back-outline"></ion-icon>
          <span>Back to ${isFromBlog ? 'Blog' : 'Projects'}</span>
        </button>
        <div class="project-inner-content">
          ${projectContent}
        </div>
      `;

      // Hide all standard pages and append the detail article
      const pages = document.querySelectorAll('[data-page]');
      pages.forEach(page => page.classList.remove('active'));
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.appendChild(projectArticle);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(error => {
      console.warn('Inline fetch failed, navigating directly to:', projectUrl, error);
      // Fallback gracefully to direct page navigation
      window.location.href = projectUrl;
    });
};

window.closeProjectDetail = function (targetPage = 'projects') {
  const projectDetail = document.querySelector('[data-page="project-detail"]');
  if (projectDetail) {
    projectDetail.remove();
  }
  switchPage(targetPage);
};

// -------------------------------------------------------------
// IMAGE LIGHTBOX MODAL (FIT TO WINDOW)
// -------------------------------------------------------------
window.openImageLightbox = function (imgSrc, title = '', subtitle = '') {
  const modal = document.getElementById('image-lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const titleEl = document.getElementById('lightbox-title');
  const subtitleEl = document.getElementById('lightbox-subtitle');

  if (!modal || !img) return;

  img.src = imgSrc;
  img.alt = title || 'Preview';
  if (titleEl) titleEl.textContent = title || 'Preview';
  if (subtitleEl) subtitleEl.textContent = subtitle || '';

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

window.closeImageLightbox = function () {
  const modal = document.getElementById('image-lightbox-modal');
  if (!modal) return;

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

// Keyboard ESC to close lightbox
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeImageLightbox();
  }
});

// -------------------------------------------------------------
// CONTACT FORM HANDLING
// -------------------------------------------------------------
const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');

if (form && formInputs.length > 0 && formBtn) {
  formInputs.forEach(input => {
    input.addEventListener('input', () => {
      if (form.checkValidity()) {
        formBtn.removeAttribute('disabled');
      } else {
        formBtn.setAttribute('disabled', '');
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="fullname"]')?.value || 'Inquirer';
    const email = form.querySelector('[name="email"]')?.value || '';
    const message = form.querySelector('[name="message"]')?.value || '';

    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`Sender Name: ${name}\nSender Email: ${email}\n\nMessage:\n${message}`);

    // Trigger user's mail client directly
    window.location.href = `mailto:santhoshkumar007r@gmail.com?subject=${subject}&body=${body}`;

    const originalBtnContent = formBtn.innerHTML;
    formBtn.innerHTML = `<ion-icon name="checkmark-done-outline"></ion-icon><span>Opening Mail Client...</span>`;
    formBtn.setAttribute('disabled', '');

    setTimeout(() => {
      form.reset();
      formBtn.innerHTML = originalBtnContent;
    }, 4000);
  });
}

// -------------------------------------------------------------
// DYNAMIC FOOTER YEAR
// -------------------------------------------------------------
const yearEl = document.getElementById('current-year');
if (yearEl) {
  yearEl.innerText = new Date().getFullYear();
}
