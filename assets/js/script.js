'use strict';

// -------------------------------------------------------------
// THEME MANAGEMENT (Dark / Light Mode)
// -------------------------------------------------------------
const initTheme = () => {
  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'dark'); // Default to sleek dark mode
  
  document.documentElement.setAttribute('data-theme', initialTheme);
  updateThemeIcon(initialTheme);
};

const updateThemeIcon = (theme) => {
  const toggleBtn = document.querySelector('[data-theme-btn]');
  if (!toggleBtn) return;
  const icon = toggleBtn.querySelector('ion-icon');
  if (icon) {
    icon.setAttribute('name', theme === 'light' ? 'moon-outline' : 'sunny-outline');
    toggleBtn.setAttribute('title', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    toggleBtn.setAttribute('aria-label', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
  }
};

const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('portfolio-theme', newTheme);
  updateThemeIcon(newTheme);
};

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  const themeBtn = document.querySelector('[data-theme-btn]');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
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
const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

const switchPage = (targetPageName) => {
  // Remove any open project detail before switching
  const projectDetail = document.querySelector('[data-page="project-detail"]');
  if (projectDetail) {
    projectDetail.remove();
  }

  pages.forEach(page => {
    if (page.dataset.page === targetPageName) {
      page.classList.add('active');
    } else {
      page.classList.remove('active');
    }
  });

  navigationLinks.forEach(link => {
    if (link.dataset.navLink === targetPageName || link.innerText.trim().toLowerCase() === targetPageName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

navigationLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetPage = this.dataset.navLink || this.innerText.trim().toLowerCase();
    switchPage(targetPage);
  });
});

// Quick navigation triggers from Hero CTA buttons
window.navigateToSection = function(sectionName) {
  switchPage(sectionName);
};

// -------------------------------------------------------------
// PROJECT FILTERING
// -------------------------------------------------------------
const select = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-select-value]');
const filterBtns = document.querySelectorAll('[data-filter-btn]');
const filterItems = document.querySelectorAll('[data-filter-item]');

const filterFunc = (selectedValue) => {
  const normVal = selectedValue.trim().toLowerCase();
  filterItems.forEach(item => {
    const itemCat = (item.dataset.category || '').toLowerCase();
    if (normVal === 'all' || itemCat.includes(normVal)) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
};

if (select && selectValue) {
  select.addEventListener('click', function () {
    this.classList.toggle('active');
  });

  selectItems.forEach(item => {
    item.addEventListener('click', function () {
      const selectedValue = this.innerText;
      selectValue.innerText = selectedValue;
      select.classList.remove('active');
      filterFunc(selectedValue);
    });
  });
}

if (filterBtns.length > 0) {
  let lastClickedBtn = filterBtns[0];
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const selectedValue = this.innerText;
      if (selectValue) selectValue.innerText = selectedValue;
      filterFunc(selectedValue);

      if (lastClickedBtn) lastClickedBtn.classList.remove('active');
      this.classList.add('active');
      lastClickedBtn = this;
    });
  });
}

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
      
      const projectContent = doc.querySelector('article')?.innerHTML || 
                            doc.querySelector('main')?.innerHTML || 
                            doc.querySelector('body').innerHTML;

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
      pages.forEach(page => page.classList.remove('active'));
      document.querySelector('.main-content').appendChild(projectArticle);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(error => {
      console.error('Error loading project content:', error);
      alert('Unable to load project details. Please check connection.');
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
