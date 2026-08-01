/* ============================================================
   CRD - Gebäude- & Grundstücksservice | JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Element References ---------- */
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('.header__nav-link');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const revealElements = document.querySelectorAll('.reveal');

  /* ============================================================
     STICKY HEADER
     ============================================================ */
  let lastScrollY = 0;

  function handleHeaderScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // initial check

  /* ============================================================
     MOBILE NAV
     ============================================================ */
  function openMobileNav() {
    mainNav.classList.add('open');
    navOverlay.classList.add('show');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mainNav.classList.remove('open');
    navOverlay.classList.remove('show');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (mainNav.classList.contains('open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  navOverlay.addEventListener('click', closeMobileNav);

  // Close mobile nav on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  /* ============================================================
     ACTIVE NAV LINK ON SCROLL
     ============================================================ */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ============================================================
     SCROLL REVEAL ANIMATIONS
     ============================================================ */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally, stop observing once revealed
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  /* ============================================================
     ANIMATED COUNTERS
     ============================================================ */
  function animateCounter(element, target) {
    const suffix = element.textContent.replace(/[0-9]/g, ''); // Keep non-numeric chars like + or %
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);

      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Observe stat numbers
  const statNumbers = document.querySelectorAll('.hero__stat-number[data-count]');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-count'), 10);
        animateCounter(entry.target, target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statObserver.observe(el));

  /* ============================================================
     SMOOTH SCROLL FOR ANCHOR LINKS (same page only)
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPosition = targetEl.offsetTop - headerHeight - 16;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Handle cross-page anchor links (e.g. index.html#ueber-uns)
  document.querySelectorAll('a[href*=".html#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      // Let the browser handle navigation naturally
      // The target page will scroll to the anchor on load
    });
  });

  /* ============================================================
     CONTACT FORM HANDLING
     ============================================================ */
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Basic validation
    const name = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const message = document.getElementById('formMessage').value.trim();

    const consent = document.getElementById('formConsent');
    const isConsentChecked = consent ? consent.checked : true;

    if (!name || !email || !message || !isConsentChecked) {
      // Highlight empty required fields
      const fields = [
        { el: 'formName', val: name },
        { el: 'formEmail', val: email },
        { el: 'formMessage', val: message }
      ];
      if (consent && !isConsentChecked) {
        consent.style.outline = '2px solid #e74c3c';
        consent.style.outlineOffset = '2px';
      }
      fields.forEach(field => {
        const input = document.getElementById(field.el);
        if (!field.val) {
          input.style.borderColor = '#e74c3c';
          input.addEventListener('input', function handler() {
            input.style.borderColor = '';
            input.removeEventListener('input', handler);
          });
        }
      });
      return;
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const emailInput = document.getElementById('formEmail');
      emailInput.style.borderColor = '#e74c3c';
      emailInput.focus();
      return;
    }

    // Simulate sending (show success)
    contactForm.style.display = 'none';
    formSuccess.classList.add('show');

    // Build mailto as a fallback action
    const phone = document.getElementById('formPhone').value.trim();
    const service = document.getElementById('formService').value;
    const subject = encodeURIComponent('Anfrage über Website – ' + (service || 'Allgemein'));
    const body = encodeURIComponent(
      `Name: ${name}\nE-Mail: ${email}\nTelefon: ${phone || 'Nicht angegeben'}\nGewünschte Leistung: ${service || 'Nicht ausgewählt'}\n\nNachricht:\n${message}`
    );

    // Open mailto
    window.location.href = `mailto:info@crd-reinigung.de?subject=${subject}&body=${body}`;
  });

  /* ============================================================
     FLOATING WIDGET - show only after scroll
     ============================================================ */
  const floatingWidget = document.getElementById('floatingWidget');

  function handleWidgetVisibility() {
    if (window.scrollY > 400) {
      floatingWidget.style.opacity = '1';
      floatingWidget.style.pointerEvents = 'auto';
      floatingWidget.style.transform = 'translateY(0)';
    } else {
      floatingWidget.style.opacity = '0';
      floatingWidget.style.pointerEvents = 'none';
      floatingWidget.style.transform = 'translateY(20px)';
    }
  }

  // Initial state
  floatingWidget.style.opacity = '0';
  floatingWidget.style.pointerEvents = 'none';
  floatingWidget.style.transform = 'translateY(20px)';
  floatingWidget.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

  window.addEventListener('scroll', handleWidgetVisibility, { passive: true });

  /* ============================================================
     PARALLAX-LIKE SUBTLE HERO EFFECT
     ============================================================ */
  const heroBg = document.querySelector('.hero__bg img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrollY * 0.15}px) scale(1.05)`;
      }
    }, { passive: true });
  }

  /* ============================================================
     SERVICE CARDS - TILT EFFECT ON HOVER (Desktop only)
     ============================================================ */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;

        card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ============================================================
     KEYBOARD ACCESSIBILITY - ESC key closes mobile nav
     ============================================================ */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      closeMobileNav();
    }
  });

  console.log('CRD Gebäudeservice – Website loaded successfully.');
});
