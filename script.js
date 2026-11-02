/**
 * Li Qing Portfolio - Main Application Logic
 *
 * Architecture:
 * - IIFE namespace pattern for state encapsulation
 * - Single source of truth: app.state
 * - Observable pattern for state changes
 * - Deterministic page rendering
 */

const app = (() => {
  // ========================================================================
  // STATE MANAGEMENT
  // ========================================================================

  const state = {
    currentPage: 0,
    totalPages: 5,
    showSplash: true,
    animateLetters: false,
    isNavigating: false,
  };

  const subscribers = [];

  const projects = [
  {
    "title": "Composite Micromechanics Calculator",
    "url": "https://github.com/liqinglq666/ECC-Micromechanics-Calculator",
    "desc": "A desktop tool for fiber–matrix interface mechanics, fiber bridging, and strain-hardening assessment.",
    "language": "Python",
    "tags": [
      "Mechanics",
      "Micromechanics"
    ]
  },
  {
    "title": "NMR Pore Analyzer",
    "url": "https://github.com/liqinglq666/NMR-Pore-Analyzer",
    "desc": "LF-NMR spectrum processing for pore structure analysis and classification.",
    "language": "Python",
    "tags": [
      "Characterization",
      "LF-NMR"
    ]
  },
  {
    "title": "CrackVision DIC",
    "url": "https://github.com/liqinglq666/CrackVision-DIC",
    "desc": "Cracking behavior analysis and experimental data export for research workflows.",
    "language": "Python",
    "tags": [
      "Characterization",
      "DIC"
    ]
  },
  {
    "title": "TGA Analysis",
    "url": "https://github.com/liqinglq666/TGA-Analysis-Project",
    "desc": "Thermogravimetric data processing and visualization for materials research.",
    "language": "Python",
    "tags": [
      "Characterization",
      "Data Analysis"
    ]
  },
  {
    "title": "ECC Analyzer Pro",
    "url": "https://github.com/liqinglq666/ECC_Analyzer_Pro",
    "desc": "Batch analysis of tensile and compressive test data, with curve metrics, energy indicators, and Excel reports.",
    "language": "Python",
    "tags": [
      "Mechanics",
      "Mechanical Testing"
    ]
  },
  {
    "title": "Hydration Kinetics Pro",
    "url": "https://github.com/liqinglq666/Hydration-Kinetics-Pro",
    "desc": "Isothermal calorimetry processing, apparent kinetic modeling, and traceable data visualization.",
    "language": "Python",
    "tags": [
      "Data Analysis",
      "Calorimetry",
      "Kinetics"
    ]
  },
  {
    "title": "GRA MicroAnalyzer",
    "url": "https://github.com/liqinglq666/GRA_micro_analyzer",
    "desc": "Grey relational analysis of microstructure–property associations, with data checks and auditable outputs.",
    "language": "Python",
    "tags": [
      "Data Analysis",
      "Grey Relational Analysis"
    ]
  },
  {
    "title": "Yuejian Feiyi Agent",
    "url": "https://github.com/liqinglq666/Yuejian-Feiyi-Agent",
    "demo": "https://yuejian-feiyi-agent.streamlit.app/",
    "desc": "An AI-powered Guangdong intangible cultural heritage workspace for cultural travel planning, study experiences, and creative storytelling, grounded in local hybrid retrieval.",
    "language": "Python · Streamlit",
    "tags": [
      "AI",
      "Cultural Tourism",
      "RAG"
    ]
  },  {
    "title": "Zhilink Tianhe AI Workspace",
    "url": "https://github.com/liqinglq666/zhilink-tianhe-enterprise-ai-workspace",
    "demo": "https://zhilink-tianhe-ai-workspace.onrender.com",
    "desc": "An enterprise AI workspace connecting meeting notes, contract review, policy research, and project execution in a reviewable, traceable workflow.",
    "language": "Python · FastAPI",
    "tags": [
      "AI",
      "Enterprise Workflow",
      "AI Agents"
    ]
  }
];

  // ========================================================================
  // STATE MUTATIONS
  // ========================================================================

  const setState = (updates) => {
    Object.assign(state, updates);
    notify();
  };

  const goToPage = (pageIndex) => {
    if (state.isNavigating || pageIndex === state.currentPage) return;
    if (pageIndex < 0 || pageIndex >= state.totalPages) return;

    state.isNavigating = true;
    setState({ currentPage: pageIndex });

    // Start each section at its heading, including when returning to it.
    const page = document.getElementById(`page-${pageIndex}`);
    if (page) page.scrollTop = 0;

    setTimeout(() => {
      state.isNavigating = false;
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 700);
  };

  const nextPage = () => {
    if (state.currentPage < state.totalPages - 1) {
      goToPage(state.currentPage + 1);
    }
  };

  const prevPage = () => {
    if (state.currentPage > 0) {
      goToPage(state.currentPage - 1);
    }
  };

  let splashTimer = null;
  const introSessionKey = 'liqing-intro-seen';
  const hideSplash = () => {
    clearTimeout(splashTimer);
    const video = document.getElementById('splash-video');
    video?.pause();
    try { sessionStorage.setItem(introSessionKey, 'seen'); } catch (_) {}
    setState({ showSplash: false });
    if (document.getElementById('splash')?.contains(document.activeElement)) {
      document.querySelector('.nav-btn[data-page="0"]')?.focus({preventScroll:true});
    }
  };

  const notify = () => {
    subscribers.forEach(callback => callback(state));
  };

  // ========================================================================
  // RENDERING
  // ========================================================================

  const updatePageDisplay = () => {
    // Update page visibility and transforms
    document.querySelectorAll('.page').forEach((page, index) => {
      const isCurrentPage = index === state.currentPage;
      page.style.opacity = isCurrentPage ? '1' : '0';
      page.style.pointerEvents = isCurrentPage ? 'auto' : 'none';
      page.style.zIndex = isCurrentPage ? '100' : '0';
      page.inert = !isCurrentPage;
      page.setAttribute('aria-hidden', String(!isCurrentPage));

      if (isCurrentPage) {
        page.style.transform = 'rotateY(0deg) scale(1)';
      } else if (index < state.currentPage) {
        page.style.transform = 'rotateY(60deg) scale(0.8)';
      } else {
        page.style.transform = 'rotateY(-60deg) scale(0.8)';
      }
    });

    // Update nav menu highlights
    document.querySelectorAll('.nav-btn').forEach((btn, index) => {
      if (index === state.currentPage) {
        btn.setAttribute('data-active', 'true');
        btn.setAttribute('aria-current', 'page');
        btn.style.color = '#faff69';
      } else {
        btn.setAttribute('data-active', 'false');
        btn.removeAttribute('aria-current');
        btn.style.color = '#a0a0a0';
      }
    });

    // Update main content visibility
    const mainContent = document.getElementById('main-content');
    const splash = document.getElementById('splash');

    mainContent.inert = state.showSplash;
    splash.inert = !state.showSplash;
    splash.setAttribute('aria-hidden', String(!state.showSplash));
    if (state.showSplash) {
      mainContent.style.opacity = '0';
      mainContent.style.pointerEvents = 'none';
      splash.style.opacity = '1';
      splash.style.pointerEvents = 'auto';
    } else {
      mainContent.style.opacity = '1';
      mainContent.style.pointerEvents = 'auto';
      splash.style.opacity = '0';
      splash.style.pointerEvents = 'none';
    }
  };

  const renderProjects = (filter = "All") => {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    grid.innerHTML = projects.filter(project => filter === "All" || project.tags[0] === filter).map((project) => `
      <div class="project-card border p-6 sm:p-8 rounded-lg transition-all hover:border-yellow-300" style="border-color: rgba(65, 65, 65, 0.8);">
        <span class="project-number">WORK / ${String(projects.indexOf(project) + 1).padStart(2, "0")}</span>
        <div class="project-card-header">
          <p class="project-meta">${project.language} · ${project.tags[0]}</p>
          <h3 class="text-base sm:text-lg font-bold" style="color: #ffffff; font-weight: 700;">
            <a href="${project.url}" target="_blank" rel="noopener noreferrer" style="color: #faff69; text-decoration: none;" class="hover:opacity-80">
              ${project.title}
            </a>
          </h3>
        </div>
        <p class="project-desc text-xs sm:text-sm leading-relaxed" style="color: #a0a0a0;">${project.desc}</p>
        <div class="project-tags">
          ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
        </div>
        <a class="project-link" href="${project.url}" target="_blank" rel="noopener noreferrer">View on GitHub</a>
        ${project.demo ? `<a class="project-link" href="${project.demo}" target="_blank" rel="noopener noreferrer">Live Demo →</a>` : ''}
      </div>
    `).join('');
  };

  // ========================================================================
  // ANIMATIONS
  // ========================================================================

  const triggerSplashAnimation = (replay = false) => {
    clearTimeout(splashTimer);
    const video = document.getElementById('splash-video');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!video) { hideSplash(); return; }
    video.pause();
    video.currentTime = 0;
    // Replay must also return to the homepage after the video ends.
    video.onended = hideSplash;
    video.onerror = () => {
      // Keep the static poster and immediately available skip button.
      clearTimeout(splashTimer);
      splashTimer = setTimeout(hideSplash, 1800);
    };
    splashTimer = setTimeout(hideSplash, 8000);
    if (reducedMotion) {
      // A quiet title card replaces the moving sequence.
      clearTimeout(splashTimer);
      splashTimer = setTimeout(hideSplash, 1800);
      return;
    }
    video.play().catch(() => {
      // Autoplay restrictions must never trap a visitor on the intro.
      clearTimeout(splashTimer);
      splashTimer = setTimeout(hideSplash, 1800);
    });
  };

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================

  const setupEventListeners = () => {
    document.querySelectorAll(".filter-btn").forEach(btn => btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(item => { const selected = item === btn; item.classList.toggle("selected", selected); item.setAttribute("aria-pressed", String(selected)); });
      renderProjects(btn.dataset.filter);
    }));
    // Navigation buttons (Top menu)
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pageIndex = parseInt(btn.getAttribute('data-page'));
        goToPage(pageIndex);
      });
    });

    // Go-to-page buttons (Call-to-action)
    document.querySelectorAll('.goto-page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pageIndex = parseInt(btn.getAttribute('data-page'));
        goToPage(pageIndex);
        // The clicked CTA becomes inert after navigation; move focus to the new heading.
        if (state.currentPage === pageIndex) {
          const heading = document.querySelector(`#page-${pageIndex} .section-heading h2`);
          if (heading) {
            heading.tabIndex = -1;
            heading.focus({ preventScroll: true });
          }
        }
      });
    });

    document.getElementById('replay-intro')?.addEventListener('click', () => {
      setState({showSplash:true});
      triggerSplashAnimation(true);

    });
    // Splash enter button
    const splashEnterBtn = document.getElementById('splash-enter-btn');
    if (splashEnterBtn) {
      splashEnterBtn.addEventListener('click', () => {
        hideSplash();
      });
    }

    // Resume button - show modal
    const resumeBtn = document.getElementById('resume-btn');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => {
        const modal = document.getElementById('resume-modal');
        if (modal) {
          modal.style.display = 'flex';
          document.getElementById('main-content').inert = true;
          document.body.style.overflow = 'hidden';
          modal.querySelector('#resume-modal-close')?.focus();
        }
      });
    }

    // Resume modal close buttons
    const modal = document.getElementById('resume-modal');
    const resumeModalClose = document.getElementById('resume-modal-close');
    const resumeModalCloseBtn = document.getElementById('resume-modal-close-btn');

    const closeResumeModal = () => {
      if (modal) {
        const wasOpen = modal.style.display !== 'none';
        modal.style.display = 'none';
        document.body.style.overflow = '';
        if (wasOpen) {
          document.getElementById('main-content').inert = state.showSplash;
          resumeBtn?.focus({ preventScroll: true });
        }
      }
    };

    if (resumeModalClose) {
      resumeModalClose.addEventListener('click', closeResumeModal);
    }

    if (resumeModalCloseBtn) {
      resumeModalCloseBtn.addEventListener('click', closeResumeModal);
    }

    // Close modal when clicking outside
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeResumeModal();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display !== 'none') {
          e.preventDefault();
          closeResumeModal();
        }
      });

      // Keep keyboard focus inside the open resume dialog.
      modal.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        const focusables = Array.from(modal.querySelectorAll('a[href], button:not([disabled])'));
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Do not switch sections while a dialog is open or while editing text.
      if ((modal && modal.style.display !== 'none') ||
          e.altKey || e.ctrlKey || e.metaKey ||
          e.target.closest?.('a, button, input, textarea, select, [contenteditable="true"]')) return;
      if (state.showSplash) {
        // Any key to hide splash
        if (e.code !== 'Tab') {
          hideSplash();
        }
      } else {
        // Arrow keys for navigation
        if (e.key === 'ArrowLeft') {
          prevPage();
        } else if (e.key === 'ArrowRight') {
          nextPage();
        }
      }
    });

    // Touch/swipe support
    let swipeStart = null;
    document.addEventListener('touchstart', (e) => {
      swipeStart = null;
      if (state.showSplash || (modal && modal.style.display !== 'none') ||
          e.touches.length !== 1 ||
          e.target.closest('a, button, input, textarea, select, [contenteditable="true"]')) return;
      swipeStart = {x:e.touches[0].clientX, y:e.touches[0].clientY};
    }, {passive:true});

    document.addEventListener('touchend', (e) => {
      if (!swipeStart || !e.changedTouches.length) return;
      const dx = e.changedTouches[0].clientX - swipeStart.x;
      const dy = e.changedTouches[0].clientY - swipeStart.y;
      swipeStart = null;
      if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
      if (dx < 0) nextPage();
      else prevPage();
    }, {passive:true});
    document.addEventListener('touchcancel', () => { swipeStart = null; }, {passive:true});
  };

  // ========================================================================
  // INITIALIZATION
  // ========================================================================

  const init = () => {
    // Render static content
    renderProjects();

    // Setup event listeners
    setupEventListeners();

    // Initial render
    updatePageDisplay();

    let seen = false;
    try { seen = sessionStorage.getItem(introSessionKey) === 'seen'; } catch (_) {}
    if (seen) hideSplash();
    else triggerSplashAnimation();
  };

  // ========================================================================
  // PUBLIC API
  // ========================================================================

  const subscribe = (callback) => {
    subscribers.push(callback);
    return () => {
      subscribers.splice(subscribers.indexOf(callback), 1);
    };
  };

  // Subscribe to state changes for rendering
  subscribe(updatePageDisplay);

  return {
    goToPage,
    nextPage,
    prevPage,
    hideSplash,
    getState: () => ({ ...state }),
    subscribe,
    init
  };
})();

// ============================================================================
// APPLICATION START
// ============================================================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app.init();
  });
} else {
  app.init();
}
