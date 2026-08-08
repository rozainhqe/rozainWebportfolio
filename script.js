/* =========================================================
   ROZAIN — PORTFOLIO SCRIPT
   Vanilla JS. Organized by feature. No dependencies.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. THEME TOGGLE (persisted via localStorage) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('rozain-theme');

  if (savedTheme === 'light') {
    root.setAttribute('data-theme', 'light');
  }

  themeToggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
      root.removeAttribute('data-theme');
      localStorage.setItem('rozain-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('rozain-theme', 'light');
    }
  });

  /* ---------- 2. NAVBAR SCROLL STATE + ACTIVE LINK ---------- */
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    let current = sections[0]?.id;
    const scrollPos = window.scrollY + window.innerHeight * 0.3;
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. MOBILE MENU ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  const closeMobileMenu = () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ---------- 4. SCROLL PROGRESS BAR ---------- */
  const scrollProgress = document.getElementById('scrollProgress');
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${pct}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- 5. BACK TO TOP ---------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 6. CUSTOM CURSOR (desktop only) ---------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (supportsHover) {
    let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;

    window.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
    });

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateRing);
    };
    animateRing();

    document.querySelectorAll('a, button, .project-card, .skill-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.style.transform += ' scale(1.6)');
      el.addEventListener('mouseleave', () => onScroll());
    });
  }

  /* ---------- 7. SCROLL REVEAL (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- 8. SKILL BAR FILL (animate on view) ---------- */
  const bars = document.querySelectorAll('.bar__fill');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const level = entry.target.getAttribute('data-level');
        entry.target.style.width = `${level}%`;
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(bar => barObserver.observe(bar));

  /* ---------- 9. ANIMATED STAT COUNTERS ---------- */
  const counters = document.querySelectorAll('.hero__stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      let current = 0;
      const duration = 1200;
      const stepTime = 30;
      const steps = duration / stepTime;
      const increment = target / steps;

      const tick = () => {
        current += increment;
        if (current >= target) {
          el.textContent = target;
        } else {
          el.textContent = Math.floor(current);
          requestAnimationFrame(() => setTimeout(tick, stepTime));
        }
      };
      tick();
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- 10. TYPING ANIMATION (hero role) ---------- */
  const typingEl = document.getElementById('typingText');
  const roles = ['Aspiring Freelancer', 'Python Learner', 'Problem Solver'];
  let roleIndex = 0, charIndex = 0, deleting = false;

  const typeLoop = () => {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      typingEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
    } else {
      charIndex--;
      typingEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 70);
  };
  typeLoop();

  /* ---------- 11. TRAJECTORY DOT ANIMATION ---------- */
  const trajPath = document.getElementById('trajPath');
  const trajDot = document.getElementById('trajDot');
  if (trajPath && trajDot) {
    const pathLength = trajPath.getTotalLength();
    let dotProgress = 0;
    const animateDot = () => {
      dotProgress += 0.0035;
      if (dotProgress > 1) dotProgress = 0;
      const point = trajPath.getPointAtLength(pathLength * dotProgress);
      trajDot.setAttribute('cx', point.x);
      trajDot.setAttribute('cy', point.y);
      requestAnimationFrame(animateDot);
    };
    setTimeout(animateDot, 2400);
  }

  /* ---------- 12. PROJECT FILTERING ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const tags = card.getAttribute('data-tags');
        const match = filter === 'all' || tags.includes(filter);
        if (match) {
          card.classList.remove('hide');
          card.style.animation = 'none';
          void card.offsetWidth;
          card.style.animation = null;
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  /* ---------- 13. CONTACT FORM (placeholder — no backend) ---------- */
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = 'Message ready — connect a backend to send ✓';
    btn.style.opacity = '0.85';
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.opacity = '1';
    }, 2600);
  });

  /* ---------- 14. PLACEHOLDER LINK NOTICE ---------- */
  document.querySelectorAll('.placeholder-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') {
        e.preventDefault();
      }
    });
  });

  /* ---------- 15. FOOTER YEAR ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- 16. EASTER EGG ---------- */
  console.log('%cHey, curious developer 👋', 'font-size:14px;font-weight:bold;color:#8B5CF6;');
  console.log('%cThanks for checking the console. — Rozain', 'font-size:12px;color:#22D3EE;');

});
