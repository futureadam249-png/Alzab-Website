/* ═══════════════════════════════════════════════════
   ALZAB ALGHARBIYAH – JAVASCRIPT
════════════════════════════════════════════════════ */

// ── Language State ──
let currentLang = localStorage.getItem('selectedLang') || 'en';

// ── On DOM Ready ──
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initScrollEffects();
  initNavHighlight();
  initLogoStampAnimation();
  applyLang(); // Apply saved language on load
  updatePlaceholders();
  initContactForm();
  initFileInput();
});

/* ══════════════════════════════
   LANGUAGE SETTINGS
   Handles Persistent Language
══════════════════════════════ */
function toggleLang() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  localStorage.setItem('selectedLang', currentLang);
  applyLang();
}

function applyLang() {
  const html = document.documentElement;
  const label = document.getElementById('langLabel');

  if (currentLang === 'ar') {
    html.setAttribute('lang', 'ar');
    html.setAttribute('dir', 'rtl');
    document.body.setAttribute('dir', 'rtl');
    if (label) label.textContent = 'English';
  } else {
    html.setAttribute('lang', 'en');
    html.setAttribute('dir', 'ltr');
    document.body.setAttribute('dir', 'ltr');
    if (label) label.textContent = 'العربية';
  }

  // Update all text nodes
  const elements = document.querySelectorAll('[data-en][data-ar]');
  elements.forEach(el => {
    const text = el.getAttribute(`data-${currentLang}`);
    if (text) {
      // Check if element has child elements (like images/icons)
      const spanText = el.querySelector('.lang-text');
      if (spanText) {
        spanText.textContent = text;
      } else if (el.children.length === 0) {
        el.textContent = text;
      }
      // No 'else' block here to prevent unsafe text node appending
    }
  });

  // Update page title
  document.title = currentLang === 'ar'
    ? 'الزاب الغربية – التجارة العامة والمقاولات'
    : 'Alzab Algharbiyah – General Trading & Contracting';

  updatePlaceholders();
}

function updatePlaceholders() {
  const inputs = document.querySelectorAll('[data-en-placeholder]');
  inputs.forEach(el => {
    el.placeholder = el.getAttribute(`data-${currentLang}-placeholder`) || '';
  });
}

/* ══════════════════════════════
   NAVBAR SCROLL
══════════════════════════════ */
function initScrollEffects() {
  const navbar = document.getElementById('navbar');
  const backTop = document.getElementById('backTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top
    if (scrollY > 400) {
      backTop.classList.add('visible');
    } else {
      backTop.classList.remove('visible');
    }
  }, { passive: true });
}

/* ══════════════════════════════
   ACTIVE NAV HIGHLIGHT
══════════════════════════════ */
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === '#' + entry.target.id) {
            item.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
}

/* ══════════════════════════════
   HAMBURGER MENU
══════════════════════════════ */
function toggleMenu() {
  const links = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  links.classList.toggle('open');
  hamburger.classList.toggle('active');
}

// Close menu on nav click
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('hamburger').classList.remove('active');
  });
});

/* ══════════════════════════════
   PARTICLES
══════════════════════════════ */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 30;
  for (let i = 0; i < count; i++) {
    createParticle(container);
  }
}

function createParticle(container) {
  const p = document.createElement('div');
  p.className = 'particle';

  const size = Math.random() * 3 + 1.5;
  const left = Math.random() * 100;
  const delay = Math.random() * 12;
  const duration = Math.random() * 10 + 12;
  const opacity = (Math.random() * 0.4 + 0.2).toFixed(2);

  p.style.cssText = `
    left: ${left}%;
    bottom: -10px;
    width: ${size}px;
    height: ${size}px;
    animation-duration: ${duration}s;
    animation-delay: -${delay}s;
    opacity: ${opacity};
  `;

  container.appendChild(p);
}

/* ══════════════════════════════
   SCROLL BACK TO TOP
══════════════════════════════ */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ══════════════════════════════
   CONTACT FORM
══════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
}

function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById('submitBtn');
  const feedback = document.getElementById('formFeedback');
  
  btn.disabled = true;
  const originalText = btn.querySelector('span').textContent;
  btn.querySelector('span').textContent = currentLang === 'ar' ? 'جارٍ الإرسال...' : 'Sending...';

  const formData = new FormData(form);

  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    btn.disabled = false;
    btn.querySelector('span').textContent = originalText;
    
    if (response.ok) {
      feedback.style.display = 'block';
      feedback.style.color = '#25D366';
      feedback.innerHTML = currentLang === 'ar' 
        ? 'تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا.' 
        : 'Your message has been sent successfully! Thank you for contacting us.';
      form.reset();
      const fileNameLabel = document.getElementById('fileNameLabel');
      if (fileNameLabel) {
        fileNameLabel.textContent = currentLang === 'ar' ? 'لم يتم اختيار ملف' : 'No file chosen';
      }
      
      setTimeout(() => {
        feedback.style.display = 'none';
      }, 5000);
    } else {
      throw new Error('Form submission failed');
    }
  })
  .catch(error => {
    btn.disabled = false;
    btn.querySelector('span').textContent = originalText;
    feedback.style.display = 'block';
    feedback.style.color = '#ff4d4d';
    feedback.innerHTML = currentLang === 'ar' 
      ? 'عذراً، حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.' 
      : 'Sorry, an error occurred during submission. Please try again.';
  });
}

/* ══════════════════════════════
   SCROLL ANIMATIONS
══════════════════════════════ */
const animated = document.querySelectorAll('.product-card, .service-card, .value-card, .contact-card');

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animationDelay = `${(i % 4) * 80}ms`;
      entry.target.classList.add('anim-in');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

animated.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  fadeObserver.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.anim-in').forEach(el => {
    el.style.opacity = '';
    el.style.transform = '';
  });
});

// Inject style for anim-in class
const style = document.createElement('style');
style.textContent = `.anim-in { opacity: 1 !important; transform: none !important; }`;
document.head.appendChild(style);

/* ══════════════════════════════
   STATS COUNTER ANIMATION
══════════════════════════════ */
function animateCounter(el, target, suffix) {
  let current = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + suffix;
    if (current >= target) clearInterval(timer);
  }, 40);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = entry.target.querySelectorAll('.stat-num');
      statNums.forEach(el => {
        const targetValue = parseInt(el.getAttribute('data-target')) || 0;
        animateCounter(el, targetValue, '+');
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

// Observe all triggers (Hero and About sections)
document.querySelectorAll('.hero-stats, .stats-trigger').forEach(trigger => {
  statsObserver.observe(trigger);
});

/* ══════════════════════════════
   LOGO STAMP ANIMATION
   Triggers a high-impact 'hit'
══════════════════════════════ */
function initLogoStampAnimation() {
  const stamp = document.querySelector('.anim-stamp-trigger');
  if (!stamp) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          stamp.classList.add('stamp-hit');
        }, 300); // Slight delay for better visual anticipation
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(stamp);
}

/* ══════════════════════════════
   FILE INPUT LABEL
══════════════════════════════ */
function initFileInput() {
  const fileInput = document.getElementById('userFile');
  const fileNameLabel = document.getElementById('fileNameLabel');
  
  if (fileInput && fileNameLabel) {
    fileInput.addEventListener('change', (e) => {
      const name = e.target.files.length > 0 ? e.target.files[0].name : (currentLang === 'ar' ? 'لم يتم اختيار ملف' : 'No file chosen');
      fileNameLabel.textContent = name;
    });
  }
}
