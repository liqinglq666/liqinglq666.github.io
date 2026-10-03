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
    expandedCard: null,
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
  }
];

  const growthCards = [];

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

    setTimeout(() => {
      state.isNavigating = false;
    }, 700);
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

  const hideSplash = () => {
    setState({ showSplash: false });
  };

  const toggleGrowthCard = (cardIndex) => {
    const newExpandedCard = state.expandedCard === cardIndex ? null : cardIndex;
    setState({ expandedCard: newExpandedCard });
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
        btn.style.color = '#faff69';
      } else {
        btn.setAttribute('data-active', 'false');
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

  const renderGrowthCards = () => {
    const container = document.getElementById('growth-cards');
    if (!container) return;

    container.innerHTML = growthCards.map((card, i) => `
      <div class="growth-card border p-6 sm:p-8 rounded-lg transition-all" style="border-color: rgba(65, 65, 65, 0.8); cursor: pointer;" data-card="${i}">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 class="text-lg sm:text-xl font-bold" style="color: #ffffff; font-weight: 700;">${card.title}</h3>
          <span style="color: #faff69; font-weight: 700; font-size: 20px; user-select: none;" class="expand-icon">+</span>
        </div>
        <div class="card-content" style="
          max-height: 0;
          overflow: hidden;
          transition: max-height 300ms ease;
          margin-top: 0;
        ">
          <p class="leading-relaxed text-xs sm:text-sm" style="color: #a0a0a0; margin-top: 16px;">${card.content}</p>
        </div>
      </div>
    `).join('');

    // Attach click handlers
    document.querySelectorAll('.growth-card').forEach((card) => {
      card.addEventListener('click', () => {
        const cardIndex = parseInt(card.getAttribute('data-card'));
        toggleGrowthCard(cardIndex);
      });
    });
  };

  const updateGrowthCardStates = () => {
    document.querySelectorAll('.growth-card').forEach((card, index) => {
      const isExpanded = index === state.expandedCard;
      const content = card.querySelector('.card-content');
      const icon = card.querySelector('.expand-icon');

      if (isExpanded) {
        const height = card.querySelector('p')?.scrollHeight || 0;
        content.style.maxHeight = (height + 16) + 'px';
        content.style.marginTop = '16px';
        icon.textContent = '−';
      } else {
        content.style.maxHeight = '0';
        content.style.marginTop = '0';
        icon.textContent = '+';
      }
    });
  };

  // ========================================================================
  // ANIMATIONS
  // ========================================================================

  const initializeStaggeredBounce = () => {
    const container = document.getElementById('hero-text');
    if (!container) return;

    container.innerHTML = '';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';

    const text = 'Liqing.';

    // 创建或获取样式
    let styleEl = document.getElementById('splash-bounce-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'splash-bounce-style';
      styleEl.textContent = `
        @keyframes staggerBounce {
          0% { transform: translateY(-80px) scaleY(0.85); opacity: 0; }
          60% { transform: translateY(10px) scaleY(1.05); opacity: 1; }
          80% { transform: translateY(-5px) scaleY(0.95); }
          100% { transform: translateY(0) scaleY(1); opacity: 1; }
        }
      `;
      document.head.appendChild(styleEl);
    }

    Array.from(text).forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.display = 'inline-block';
      span.style.animation = `staggerBounce 1000ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards`;
      span.style.animationDelay = `${index * 80}ms`;
      span.style.color = '#faff69';
      span.style.textShadow = 'none';
      span.style.letterSpacing = 'inherit';
      container.appendChild(span);
    });
  };

  const showSplashButton = () => {
    const enterBtn = document.getElementById('splash-enter-btn');
    if (enterBtn) {
      // 确保按钮在文字下方，不重叠
      enterBtn.style.position = 'absolute';
      enterBtn.style.bottom = '80px';  // 从底部留空间
      enterBtn.style.left = '50%';
      enterBtn.style.transform = 'translateX(-50%)';
      enterBtn.style.zIndex = '10';  // 确保按钮在视频上，但...在更低位置

      // 渐显
      enterBtn.style.opacity = '0';
      enterBtn.style.pointerEvents = 'auto';

      // 强制重排以应用样式
      void enterBtn.offsetHeight;

      // 立即淡入
      enterBtn.style.transition = 'opacity 600ms ease-out';
      enterBtn.style.opacity = '1';

      console.log('Splash button positioned and shown');
    }
  };

  const triggerSplashAnimation = () => {
    const video = document.getElementById('splash-video');
    const container = document.getElementById('hero-text');
    const enterBtn = document.getElementById('splash-enter-btn');

    // 初始化按钮状态 - 确保在屏幕底部，不可见
    if (enterBtn) {
      enterBtn.style.position = 'absolute';
      enterBtn.style.bottom = '80px';
      enterBtn.style.left = '50%';
      enterBtn.style.transform = 'translateX(-50%)';
      enterBtn.style.zIndex = '10';
      enterBtn.style.opacity = '0';
      enterBtn.style.pointerEvents = 'none';
      enterBtn.style.transition = 'opacity 600ms ease-out';
    }

    // 立即显示文字动画（不管视频是否存在）
    state.animateLetters = true;
    container.style.display = 'flex';
    container.style.zIndex = '20';  // 确保文字在最上面
    initializeStaggeredBounce();

    console.log('Starting splash animation - text visible');

    // 1.2秒后显示进入按钮
    setTimeout(() => {
      showSplashButton();
      console.log('Splash button shown');
    }, 1200);

    // 尝试播放视频作为背景（不隐藏文字）
    if (video) {
      console.log('Attempting to load video...');
      video.style.display = 'block';
      video.style.opacity = '1';
      video.style.zIndex = '1';  // 视频最后
      container.style.zIndex = '20'; // 文字在最前面

      const videoTimeout = setTimeout(() => {
        console.log('Video load timeout - keeping text animation');
      }, 3000);

      // 视频加载完成后播放
      video.onloadedmetadata = () => {
        clearTimeout(videoTimeout);
        console.log('Video loaded - attempting to play');
        video.play().catch((err) => {
          console.log('Autoplay blocked or video play failed:', err);
        });
      };

      video.onerror = () => {
        clearTimeout(videoTimeout);
        console.log('Video load error - text animation continues');
        video.style.display = 'none';
      };

      // 设置视频源并加载
      video.src = './assets/splash-intro.mp4';
      video.load();
    } else {
      console.log('No video element - text animation only');
    }
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
      });
    });

    document.getElementById('replay-intro')?.addEventListener('click', () => {
      setState({showSplash:true});
      triggerSplashAnimation();
      setTimeout(() => { if(state.showSplash) hideSplash(); },8000);
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
          document.body.style.overflow = 'hidden';
        }
      });
    }

    // Resume modal close buttons
    const modal = document.getElementById('resume-modal');
    const resumeModalClose = document.getElementById('resume-modal-close');
    const resumeModalCloseBtn = document.getElementById('resume-modal-close-btn');

    const closeResumeModal = () => {
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
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
          closeResumeModal();
        }
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
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
      if (state.showSplash || e.touches.length !== 1 ||
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
    renderGrowthCards();

    // Setup event listeners
    setupEventListeners();

    // Initial render
    updatePageDisplay();
    updateGrowthCardStates();

    // Splash screen logic - 立即触发动画
    triggerSplashAnimation();

    // 8秒后自动隐藏 splash（如果用户没有手动关闭）
    setTimeout(() => {
      if (state.showSplash) {
        hideSplash();
      }
    }, 8000);
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
  subscribe(() => {
    updatePageDisplay();
    updateGrowthCardStates();
  });

  return {
    goToPage,
    nextPage,
    prevPage,
    toggleGrowthCard,
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
