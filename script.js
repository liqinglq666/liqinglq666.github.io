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
      title: 'TGA_Analysis_Project',
      url: 'https://github.com/liqinglq666/TGA_Analysis_Project',
      desc: 'Python-based thermal gravimetric analysis (TGA) data automated processing tool.'
    },
    {
      title: 'CrackVision-DIC',
      url: 'https://github.com/liqinglq666/CrackVision-DIC',
      desc: 'High-performance ECC/UHPC micro-cracking kinetics engine with DIC analysis.'
    },
    {
      title: 'ECC_Analyzer_Pro',
      url: 'https://github.com/liqinglq666/ECC_Analyzer_Pro',
      desc: 'Automated physics-informed tool for characterizing material properties.'
    },
    {
      title: 'Hydration-Kinetics-Pro',
      url: 'https://github.com/liqinglq666/Hydration-Kinetics-Pro',
      desc: 'Physics-informed framework for cementitious hydration kinetics.'
    },
    {
      title: 'MatPropNet',
      url: 'https://github.com/liqinglq666/MatPropNet',
      desc: 'ML pipeline for materials science with Bayesian optimization.'
    },
    {
      title: 'NMR-Pore-Analyzer',
      url: 'https://github.com/liqinglq666/NMR-Pore-Analyzer',
      desc: 'LF-NMR analysis for pore structure characterization.'
    }
  ];

  const growthCards = [
    {
      title: 'Personal Identity & Self-Discovery',
      content: '很多人以为成长是给自己的系统打 Hotfix，哪里漏了补哪里。但我越来越觉得，我的奥德赛时期更像是一次推倒重来的内核重构。在这个阶段，我发现自己以前赖以生存的很多"默认配置"——那些从学校和家庭里继承来的价值观——在处理现实社会的复杂并发时，频繁出现 Deadlock。我必须亲手杀掉那些冗余的进程，去写属于我自己的底层协议。这过程并不优雅，甚至充满了报错和崩溃。但在每一次"我是谁"和"我该去哪"的反复博弈中，我开始理解：所谓的自我，不是被寻找出来的，而是通过一次次放弃舒适的旧代码，在那片名为"未知"的荒原上硬生生编译出来的。'
    },
    {
      title: 'Technical Depth & Breadth',
      content: 'From foundational materials science to cutting-edge AI methodologies. Developing both deep expertise in specific domains and broad understanding across disciplines to create innovative solutions.'
    },
    {
      title: 'Research Innovation',
      content: 'Pioneering approaches that combine traditional experimental characterization with modern machine learning. Building automated systems and physics-informed models that accelerate discovery and optimization.'
    },
    {
      title: 'Communication & Collaboration',
      content: 'Translating complex technical concepts into clear narratives. Working across interdisciplinary teams to bridge the gap between materials science and AI communities.'
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

  const renderProjects = () => {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    grid.innerHTML = projects.map((project, i) => `
      <div class="border p-6 sm:p-8 rounded-lg transition-all hover:border-yellow-300" style="border-color: rgba(65, 65, 65, 0.8); cursor: pointer;">
        <h3 class="text-base sm:text-lg font-bold mb-4" style="color: #ffffff; font-weight: 700;">
          <a href="${project.url}" target="_blank" rel="noopener noreferrer" style="color: #faff69; text-decoration: none;" class="hover:opacity-80">
            ${project.title}
          </a>
        </h3>
        <p class="text-xs sm:text-sm leading-relaxed" style="color: #a0a0a0;">${project.desc}</p>
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

    const text = 'Li Qing';

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
      span.style.textShadow = '0 0 30px rgba(250, 255, 105, 0.6), 0 0 60px rgba(250, 255, 105, 0.3)';
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

    // Scroll wheel for page navigation
    let wheelTimeout;
    document.addEventListener('wheel', (e) => {
      if (state.showSplash) return;

      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
          nextPage();
        } else if (e.deltaY < 0) {
          prevPage();
        }
      }, 50);
    }, { passive: true });

    // Touch/swipe support
    let touchStartX = 0;
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    });

    document.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      if (touchStartX - touchEndX > 50) {
        nextPage();
      } else if (touchEndX - touchStartX > 50) {
        prevPage();
      }
    });
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
