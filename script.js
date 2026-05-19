/* =========================================================
   MiraiHardware — script.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- Année dans le footer ----- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ----- Nav : ombre au scroll ----- */
  const nav = document.getElementById('nav');
  const toTop = document.getElementById('toTop');
  const onScroll = () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
    if (toTop) toTop.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ----- Menu burger (mobile) ----- */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ----- Apparition au scroll (reveal) ----- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      // décalage en cascade limité aux éléments visibles dans ce lot
      let i = 0;
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const delay = Math.min(i, 6) * 80;
          setTimeout(() => e.target.classList.add('in'), delay);
          io.unobserve(e.target);
          i++;
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(r => io.observe(r));

    // filet de sécurité : si quelque chose reste caché, on l'affiche
    setTimeout(() => {
      reveals.forEach(r => {
        const rect = r.getBoundingClientRect();
        if (rect.top < window.innerHeight && !r.classList.contains('in')) {
          r.classList.add('in');
        }
      });
    }, 2500);
  } else {
    reveals.forEach(r => r.classList.add('in'));
  }

  /* ----- Compteurs animés (stats du hero) ----- */
  const nums = document.querySelectorAll('.stat-num');
  const animateCount = (el) => {
    const target = +el.dataset.target;
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && nums.length) {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCount(e.target);
          io2.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });
    nums.forEach(n => io2.observe(n));
  }

  /* ----- Formulaire de contact ----- */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const subject = form.subject.value;
      const message = form.message.value.trim();
      let ok = true;

      const check = (field, valid) => {
        field.classList.toggle('invalid', !valid);
        if (!valid) ok = false;
      };
      check(form.name, name.length > 1);
      check(form.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
      check(form.message, message.length > 4);

      if (!ok) return;

      // Pas de backend : on prépare un email pré-rempli
      const body = encodeURIComponent(
        `Nom : ${name}\nEmail : ${email}\nDemande : ${subject}\n\n${message}`
      );
      const sub = encodeURIComponent(`Demande de devis — ${subject}`);
      window.location.href =
        `mailto:contact@miraihardware.fr?subject=${sub}&body=${body}`;

      if (note) note.hidden = false;
      form.reset();
    });

    // retire le style "invalide" dès qu'on corrige
    form.querySelectorAll('input,textarea').forEach(f => {
      f.addEventListener('input', () => f.classList.remove('invalid'));
    });
  }

});
