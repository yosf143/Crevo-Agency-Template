const CrevoWebsite = (function() {
    'use strict';

    const DOM = {
      body: document.body,
      navbar: document.querySelector('.navbar'),
      menuToggle: document.querySelector('.menu-toggle'),
      navLinks: document.querySelectorAll('.nav-link'),
      sections: document.querySelectorAll('section[id]'),
      backToTopBtn: document.querySelector('.back-to-top'),
      loader: document.querySelector('.loader-wrapper'),
      cursor: document.querySelector('.custom-cursor'),
      scrollDown: document.querySelector('.scroll-down'),
      landingImage: document.querySelector('.landing-image'),
      floatingShapes: document.querySelectorAll('.landing-shape'),
      typedTextElement: document.querySelector('.typed-text'),
      serviceCards: document.querySelectorAll('.service-card'),
      statNumbers: document.querySelectorAll('.stat-number'),
      timelinePoints: document.querySelectorAll('.timeline-point'),
      aboutShapes: document.querySelectorAll('.about-shape'),
      aboutSection: document.getElementById('about'),
      aboutContent: document.querySelector('.about-content')
    };

    const CONFIG = {
      navbarScrollThreshold: 50,
      backToTopThreshold: 300,
      scrollOffset: 80,
      preloaderDelay: 1000,
      typedTextOptions: {
        strings: [
          'strategic thinking',
          'creative design',
          'innovative technology',
          'meaningful connections'
        ],
        typeSpeed: 80,
        backSpeed: 40,
        backDelay: 1500,
        startDelay: 1000,
        loop: true,

        showCursor: true,
        cursorChar: '|',
        autoInsertCss: true
      },
      aosOptions: {
        duration: 1000,
        once: true,
        offset: 100
      },
      counterOptions: {
        threshold: 0.5,
        duration: 2000
      }
    };

    function init() {

      initPreloader();
      initNavbar();
      initSmoothScrolling();
      initBackToTop();
      initCustomCursor();
      initlandingSection();
      initFloatingElements();
      initServiceCardEffects();
      initStatCounters();
      initTimelineEffects();
      initParallaxEffects();
      addInteractiveElements();
      addDynamicStyles();
    }

    function initPreloader() {
      if (!DOM.loader) return;

      window.addEventListener('load', () => {

        requestAnimationFrame(() => {
          setTimeout(() => {
            DOM.loader.classList.add('fade-out');
            DOM.body.classList.remove('no-scroll');

            if (typeof AOS !== 'undefined') {
              AOS.init(CONFIG.aosOptions);
            }
          }, CONFIG.preloaderDelay);
        });
      }, { once: true }); 
    }

    function initNavbar() {
      if (!DOM.navbar) return;

      let ticking = false;

      function updateNavbarOnScroll() {
        const isScrolled = window.scrollY > CONFIG.navbarScrollThreshold;

        if (!DOM.body.classList.contains('menu-open')) {
          DOM.navbar.classList.toggle('scrolled', isScrolled);
        }

        if (DOM.menuToggle) {
          DOM.menuToggle.classList.toggle('in-landing', !isScrolled);
        }

        ticking = false;
      }

      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            updateNavbarOnScroll();
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true }); 

      updateNavbarOnScroll();

      if (DOM.menuToggle) {
        DOM.menuToggle.addEventListener('click', () => {

          DOM.body.classList.toggle('menu-open');

          if (DOM.body.classList.contains('menu-open')) {
            DOM.navbar.classList.add('scrolled');
          } else {
            const isScrolled = window.scrollY > CONFIG.navbarScrollThreshold;
            DOM.navbar.classList.toggle('scrolled', isScrolled);
          }
        });
      }

      document.addEventListener('click', (e) => {
        const navLink = e.target.closest('.nav-link');
        const isMenuOpen = DOM.body.classList.contains('menu-open');

        if (navLink && isMenuOpen) {
          DOM.body.classList.remove('menu-open');

          const isScrolled = window.scrollY > CONFIG.navbarScrollThreshold;
          DOM.navbar.classList.toggle('scrolled', isScrolled);
        }

        else if (isMenuOpen && 
                 !e.target.closest('.navbar-nav') && 
                 !e.target.closest('.menu-toggle')) {

          DOM.body.classList.remove('menu-open');

          const isScrolled = window.scrollY > CONFIG.navbarScrollThreshold;
          DOM.navbar.classList.toggle('scrolled', isScrolled);
        }
      });

      const observerOptions = {
        rootMargin: '-100px 0px -50% 0px',
        threshold: 0
      };

      const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const activeLink = document.querySelector('.nav-link.active');
            if (activeLink) activeLink.classList.remove('active');

            const sectionId = entry.target.getAttribute('id');
            const newActiveLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (newActiveLink) newActiveLink.classList.add('active');
          }
        });
      }, observerOptions);

      DOM.sections.forEach(section => {
        navObserver.observe(section);
      });
    }

    function initSmoothScrolling() {

      document.addEventListener('click', (e) => {

        const anchor = e.target.closest('a[href^="#"]');

        if (anchor && anchor.getAttribute('href') !== '#') {
          e.preventDefault();

          const targetId = anchor.getAttribute('href');
          const target = document.querySelector(targetId);

          if (target) {
            const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - CONFIG.scrollOffset;

            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        }
      });
    }

    function initBackToTop() {
        if (!DOM.backToTopBtn) return;

        window.addEventListener('scroll', () => {

          if (window.scrollY > CONFIG.backToTopThreshold) {
            DOM.backToTopBtn.classList.add('active');
          } else {
            DOM.backToTopBtn.classList.remove('active');
          }
        }, { passive: true });

        DOM.backToTopBtn.addEventListener('click', (e) => {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });
      }

    function initCustomCursor() {
      if (!DOM.cursor || window.innerWidth <= 991) return;

      let cursorVisible = false;

      let ticking = false;

      function updateCursor(e) {
        DOM.cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;

        if (!cursorVisible) {
          DOM.cursor.style.display = 'block';
          cursorVisible = true;
        }

        ticking = false;
      }

      document.addEventListener('mousemove', (e) => {
        if (!ticking) {
          requestAnimationFrame(() => updateCursor(e));
          ticking = true;
        }
      }, { passive: true });

      document.addEventListener('mousedown', () => {
        DOM.cursor.classList.add('active');
      });

      document.addEventListener('mouseup', () => {
        DOM.cursor.classList.remove('active');
      });

      document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, input, textarea, select, .interactive')) {
          DOM.cursor.classList.add('active');
        }
      });

      document.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, input, textarea, select, .interactive')) {
          DOM.cursor.classList.remove('active');
        }
      });
    }

    function initlandingSection() {

      if (DOM.typedTextElement && typeof Typed !== 'undefined') {
        new Typed(DOM.typedTextElement, CONFIG.typedTextOptions);
      }

      if (DOM.landingImage && window.innerWidth > 991) {
        let ticking = false;

        DOM.landingImage.addEventListener('mousemove', (e) => {
          if (!ticking) {
            requestAnimationFrame(() => {
              const rect = DOM.landingImage.getBoundingClientRect();
              const xPos = rect.left + rect.width / 2;
              const yPos = rect.top + rect.height / 2;

              const xAxis = (xPos - e.clientX) / 25;
              const yAxis = (yPos - e.clientY) / 25;

              DOM.landingImage.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
              ticking = false;
            });
            ticking = true;
          }
        }, { passive: true });

        DOM.landingImage.addEventListener('mouseenter', () => {
          DOM.landingImage.style.transition = 'none';
        });

        DOM.landingImage.addEventListener('mouseleave', () => {
          DOM.landingImage.style.transition = 'all 0.5s ease';
          DOM.landingImage.style.transform = 'perspective(1000px) rotateY(-5deg) rotateX(5deg)';
        });
      }

      if (DOM.scrollDown) {
        DOM.scrollDown.addEventListener('click', () => {
          const aboutSection = document.getElementById('about');
          if (aboutSection) {
            const offsetTop = aboutSection.getBoundingClientRect().top + window.pageYOffset - CONFIG.scrollOffset;

            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        });
      }
    }

    function initFloatingElements() {

      if (DOM.floatingShapes && DOM.floatingShapes.length) {
        DOM.floatingShapes.forEach((shape, index) => {
          const delay = index * 0.5;
          shape.style.animationDelay = `${delay}s`;
        });
      }

      const floatingElements = document.querySelectorAll('.floating-shape');
      if (floatingElements.length) {

        const getRandomInt = (min, max) => {
          if (window.crypto && window.crypto.getRandomValues) {
            const range = max - min + 1;
            const bytesNeeded = Math.ceil(Math.log2(range) / 8);
            const randomBytes = new Uint8Array(bytesNeeded);
            const maximumRange = Math.pow(256, bytesNeeded);
            const extractedNumber = getRandomIntHelper(randomBytes, maximumRange, range, min);

            if (extractedNumber !== false) {
              return extractedNumber;
            }
          }

          return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        const getRandomIntHelper = (randomBytes, maximumRange, range, min) => {
          window.crypto.getRandomValues(randomBytes);

          let value = 0;
          for (let i = 0; i < randomBytes.length; i++) {
            value = (value * 256) + randomBytes[i];
          }

          if (value >= maximumRange - (maximumRange % range)) {
            return false;
          }

          return min + (value % range);
        };

        floatingElements.forEach(el => {
          const randomX = getRandomInt(-10, 10);
          const randomY = getRandomInt(-10, 10);
          const randomDuration = getRandomInt(5, 10);

          el.style.animation = `float ${randomDuration}s ease-in-out infinite alternate`;
          el.style.transform = `translate(${randomX}px, ${randomY}px)`;
        });
      }
    }

    function initServiceCardEffects() {
      if (!DOM.serviceCards.length) return;

      const serviceContainer = DOM.serviceCards[0].parentElement;

      serviceContainer.addEventListener('mouseenter', (e) => {
        const card = e.target.closest('.service-card');
        if (card) {
          const icon = card.querySelector('.icon');
          if (icon) icon.style.animation = 'pulse 1s infinite';
        }
      }, true);

      serviceContainer.addEventListener('mouseleave', (e) => {
        const card = e.target.closest('.service-card');
        if (card) {
          const icon = card.querySelector('.icon');
          if (icon) icon.style.animation = '';
        }
      }, true);
    }

    function initStatCounters() {
      if (!DOM.statNumbers || !DOM.statNumbers.length) return;

      const options = {
        threshold: CONFIG.counterOptions.threshold,
        rootMargin: '0px 0px -10% 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            const target = parseInt(element.getAttribute('data-count'), 10);

            if (!isNaN(target)) {
              animateCounter(element, target);
            }

            observer.unobserve(element);
          }
        });
      }, options);

      DOM.statNumbers.forEach(stat => observer.observe(stat));
    }

    function animateCounter(element, target) {
      if (!element || target === undefined) return;

      const duration = CONFIG.counterOptions.duration;
      const start = performance.now();
      const startValue = 0;

      function updateCounter(timestamp) {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);

        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentValue = Math.floor(startValue + (target - startValue) * easeProgress);

        element.textContent = currentValue;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    }

    function initTimelineEffects() {
      if (!DOM.timelinePoints || !DOM.timelinePoints.length) return;

      const timelineContainer = DOM.timelinePoints[0].parentElement;

      timelineContainer.addEventListener('mouseenter', (e) => {
        const point = e.target.closest('.timeline-point');
        if (point) {
          const dot = point.querySelector('.timeline-dot');
          if (dot) dot.style.animation = 'pulse 1s infinite';
        }
      }, true);

      timelineContainer.addEventListener('mouseleave', (e) => {
        const point = e.target.closest('.timeline-point');
        if (point) {
          const dot = point.querySelector('.timeline-dot');
          if (dot) dot.style.animation = '';
        }
      }, true);
    }

    function initParallaxEffects() {
      if (!DOM.aboutSection || !DOM.aboutShapes || !DOM.aboutShapes.length) return;

      const options = {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '0px'
      };

      let ticking = false;

      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          window.addEventListener('scroll', handleParallaxScroll, { passive: true });
        } else {
          window.removeEventListener('scroll', handleParallaxScroll);
        }
      }, options);

      observer.observe(DOM.aboutSection);

      function handleParallaxScroll() {
        if (!ticking) {
          requestAnimationFrame(() => {
            updateParallaxElements();
            ticking = false;
          });
          ticking = true;
        }
      }

      function updateParallaxElements() {
        const rect = DOM.aboutSection.getBoundingClientRect();
        const sectionHeight = rect.height;
        const scrolledPercent = (window.innerHeight - rect.top) / (window.innerHeight + sectionHeight);

        DOM.aboutShapes.forEach((shape, index) => {
          const speed = 0.1 + (index * 0.05);
          const yPos = (scrolledPercent - 0.5) * speed * 100;

          shape.style.transform = `translateY(${yPos}px)`;
        });
      }
    }

    function addInteractiveElements() {
      if (!DOM.aboutContent) return;

      DOM.aboutContent.addEventListener('click', (e) => {

        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';

        const rect = DOM.aboutContent.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;

        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';

        DOM.aboutContent.appendChild(ripple);

        setTimeout(() => ripple.remove(), 800);
      });
    }

    function addDynamicStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .char-animation {
          display: inline-block;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.5s forwards;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .ripple-effect {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.4);
          pointer-events: none;
          transform: scale(0);
          animation: ripple 0.8s ease-out;
          z-index: 0;
        }

        @keyframes ripple {
          to {
            transform: scale(1);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    return {
      init,
      animateCounter, 
      DOM 
    };
  })();

  document.addEventListener('DOMContentLoaded', CrevoWebsite.init);

  