const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const loader = document.getElementById('loader');
const cursor = document.getElementById('cursorGlow');
const nav = document.getElementById('mainNav');
const particlesContainer = document.getElementById('particles');
const contactForm = document.getElementById('contactForm');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setMenuState(isOpen) {
  if (!hamburger || !mobileMenu) return;
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  hamburger.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  mobileMenu.classList.toggle('open', isOpen);
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

hamburger?.addEventListener('click', () => {
  setMenuState(!mobileMenu?.classList.contains('open'));
});

document.querySelectorAll('.js-close-menu').forEach((link) => {
  link.addEventListener('click', () => setMenuState(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuState(false);
});

window.addEventListener('load', () => {
  setTimeout(() => {
    loader?.classList.add('hide');
  }, 1300);
});

document.addEventListener('mousemove', (event) => {
  if (!cursor) return;
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
});

window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

function createParticle() {
  if (reduceMotion || !particlesContainer) return;
  const particle = document.createElement('div');
  const size = Math.random() * 4 + 2;
  particle.className = 'particle';
  particle.style.cssText = `
    width:${size}px;height:${size}px;
    left:${Math.random() * 100}%;
    bottom:${Math.random() * 20}%;
    background:rgba(201,168,76,${Math.random() * 0.3 + 0.1});
    animation-duration:${Math.random() * 6 + 4}s;
    animation-delay:${Math.random() * 4}s;
  `;
  particlesContainer.appendChild(particle);
  setTimeout(() => particle.remove(), (Math.random() * 6 + 4) * 1000 + 4000);
}

if (!reduceMotion) {
  setInterval(createParticle, 600);
  for (let i = 0; i < 10; i += 1) createParticle();
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach((element) => {
  revealObserver.observe(element);
});

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting || !entry.target.dataset.count) return;
    const target = Number(entry.target.dataset.count);
    let current = 0;
    const step = target / 30;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      entry.target.textContent = `${Math.round(current)}${target === 20 ? '+' : ''}`;
      if (current >= target) clearInterval(timer);
    }, 40);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach((element) => {
  counterObserver.observe(element);
});

document.querySelectorAll('.faq-q').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.parentElement;
    const isOpen = item?.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach((faqItem) => {
      faqItem.classList.remove('open');
      faqItem.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
    });
    if (!isOpen && item) {
      item.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const data = new FormData(contactForm);
  const name = (data.get('nombre') || '').toString().trim();
  const phone = (data.get('telefono') || '').toString().trim();
  const service = (data.get('servicio') || '').toString().trim();
  const zone = (data.get('zonaCliente') || '').toString().trim();
  const message = (data.get('mensaje') || '').toString().trim();
  const text = `Hola, me llamo ${name}. Mi teléfono es ${phone}. Necesito servicio de: ${service}. Colonia/zona: ${zone}. ${message ? `Mensaje adicional: ${message}` : ''}`;
  window.open(`https://wa.me/525539640412?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
});
