// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

  // Año automático en footer
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Menú hamburguesa accesible
  const hamburger = document.getElementById('hamburger');
  const navList = document.getElementById('menu'); // Apuntamos al <ul> con id "menu"
  
  if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
      // Alterna la clase 'active' en la lista <ul>
      const open = navList.classList.toggle('active');
      
      // Actualiza el atributo ARIA para accesibilidad
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Opcional: Cierra el menú si se hace clic en un enlace (útil en 'one-page')
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navList.classList.contains('active')) {
          navList.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

 // Reveal on scroll (Efecto de aparición)
const reveals = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in'); // ← cambio clave ('show' → 'in')
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach((el) => io.observe(el));
} else {
  // Si IntersectionObserver no es compatible (navegadores muy antiguos)
  reveals.forEach((el) => el.classList.add('in'));
}
}); // Fin del 'DOMContentLoaded'
// ===== CATEGORÍAS — Interacciones & Accesibilidad =====
(function(){
  const grid = document.querySelector('.categorias-grid');
  if (!grid) return;

  // a) Scroll suave a la sección destino
  grid.addEventListener('click', function(e){
    const a = e.target.closest('a.cat-card[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, "", '#' + id);
      // Opcional: resaltar destino
      target.classList.add('highlight');
      setTimeout(()=> target.classList.remove('highlight'), 800);
    }
  });

  // b) Aparición suave (IntersectionObserver)
  const cards = Array.from(document.querySelectorAll('.cat-card'));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced && 'IntersectionObserver' in window) {
    cards.forEach(c=> c.classList.add('is-hidden'));
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          entry.target.classList.remove('is-hidden');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    cards.forEach(c=> io.observe(c));
  }

  // c) Accesibilidad: si se navega con teclado, muestra focus
  document.addEventListener('keydown', (ev)=>{
    if (ev.key === 'Tab') document.body.classList.add('using-keyboard');
  });
})();
// --- Scroll suave solo para anclas internas ---
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || id.length <= 1) return; // href="#" vacío: no es un ancla real
    const el = document.querySelector(id);
    if (!el) return; // Si no hay destino, no hacemos nada
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
// === Sticky header: añade/quita .is-sticky según el scroll ===============
(() => {
  const hdr = document.querySelector('header');
  if (!hdr) return;
  const THRESHOLD = 8; // px de scroll para activar

  const onScroll = () => {
    if (window.scrollY > THRESHOLD) hdr.classList.add('is-sticky');
    else hdr.classList.remove('is-sticky');
  };

  // primer cálculo y listeners
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
// Ordenar y filtrar
(() => {
  const grid = document.getElementById('grid');
  const ord = document.getElementById('ord');
  const fil = document.getElementById('fil');
  if (!grid) return;

  const apply = () => {
    const cards = Array.from(grid.querySelectorAll('.producto'));
    // filtro
    const f = fil ? fil.value : 'all';
    cards.forEach(c=>{
      const mat = (c.getAttribute('data-badge')||'').toLowerCase();
      c.style.display = (f==='all' || f===mat) ? '' : 'none';
    });
    // orden
    const by = ord ? ord.value : 'def';
    const vis = cards.filter(c=>c.style.display!=='none');
    vis.sort((a,b)=>{
      const pa = +a.getAttribute('data-price')||0;
      const pb = +b.getAttribute('data-price')||0;
      if (by==='asc') return pa-pb;
      if (by==='desc') return pb-pa;
      return 0;
    }).forEach(el=>grid.appendChild(el));
  };
  ord && ord.addEventListener('change', apply);
  fil && fil.addEventListener('change', apply);
  apply();
})();

// Skeleton: marca .media como loaded cuando la imagen carga
document.querySelectorAll('.producto .media').forEach(box=>{
  const img = box.querySelector('img');
  const done = () => box.classList.add('loaded');
  if (img.complete) done(); else img.addEventListener('load', done, {once:true});
});
// Acordeón Historia
const btnHistoria = document.getElementById('btnHistoria');
const textoHistoria = document.getElementById('textoHistoria');

if (btnHistoria && textoHistoria) {
  btnHistoria.addEventListener('click', () => {
    textoHistoria.classList.toggle('abierto');
    const estaAbierto = textoHistoria.classList.contains('abierto');
    btnHistoria.setAttribute('aria-expanded', estaAbierto);
    btnHistoria.innerHTML = estaAbierto ? 'Ocultar historia ↑' : 'Conoce nuestra historia ↓';
  });
}

// Nav toggle (header .nav-toggle/.nav-menu) — común a todas las páginas
(function() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
    toggle.classList.toggle('active');
    toggle.setAttribute('aria-expanded', menu.classList.contains('active'));
  });
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (link.classList.contains('nav-dropdown-trigger') && window.innerWidth <= 768) return;
      menu.classList.remove('active');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
  document.querySelectorAll('.nav-dropdown-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        trigger.closest('.nav-item-dropdown').classList.toggle('active');
      }
    });
  });
})();

// Filtros de catálogo por botones (.ani-filtro)
// Acepta llamada directa vía onclick (anillos.html) o via data-filter (pulseras.html, etc.)
function filterProducts(category, button) {
  document.querySelectorAll('.ani-filtro').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  document.querySelectorAll('.producto-card').forEach(product => {
    product.style.display = (category === 'all' || product.classList.contains(category)) ? '' : 'none';
  });
}

// Inicializar filtros data-filter (sin onclick inline)
document.querySelectorAll('.ani-filtro[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => filterProducts(btn.dataset.filter, btn));
});

// Acordeón SEO categorías
function toggleSeo(id, btnId) {
  const content = document.getElementById(id);
  const btn = document.getElementById(btnId);
  if (!content || !btn) return;

  const estaAbierto = content.classList.contains('abierto');
  content.classList.toggle('abierto');
  btn.setAttribute('aria-expanded', !estaAbierto);
  btn.innerHTML = estaAbierto ? 'Leer más ↓' : 'Leer menos ↑';
}

// Inicializar acordeón SEO en cada página
const btnSeoPendientes = document.getElementById('btnSeoPendientes');
if (btnSeoPendientes) {
  btnSeoPendientes.addEventListener('click', () => {
    toggleSeo('seoCatPendientes', 'btnSeoPendientes');
  });
}

// Acordeón SEO Collares
const btnSeoCollares = document.getElementById('btnSeoCollares');
if (btnSeoCollares) {
  btnSeoCollares.addEventListener('click', () => {
    toggleSeo('seoCatCollares', 'btnSeoCollares');
  });
}

// ===== LOOKBOOK FLECHAS =====
(function () {
  const slider  = document.querySelector(
    '.lookbook-slider');
  const btnPrev = document.querySelector(
    '.lookbook-arrow--prev');
  const btnNext = document.querySelector(
    '.lookbook-arrow--next');

  if (!slider || !btnPrev || !btnNext) return;

  let cachedSlideWidth = null;

  function getSlideWidth() {
    if (cachedSlideWidth) return cachedSlideWidth;
    const slide = slider.querySelector(
      '.lookbook-slide');
    if (!slide) return slider.offsetWidth;
    const gap = parseFloat(
      window.getComputedStyle(slider).gap
    ) || 4;
    cachedSlideWidth = slide.offsetWidth + gap;
    return cachedSlideWidth;
  }

  // Invalidar caché al redimensionar ventana
  window.addEventListener('resize', function () {
    cachedSlideWidth = null;
  }, { passive: true });

  btnNext.addEventListener('click', function () {
    slider.scrollBy({
      left: getSlideWidth(),
      behavior: 'smooth'
    });
  });

  btnPrev.addEventListener('click', function () {
    slider.scrollBy({
      left: -getSlideWidth(),
      behavior: 'smooth'
    });
  });
})();

// ===== EDITORIAL VER MÁS =====
(function () {
  const btn = document.querySelector('.editorial-toggle');
  const parrafo = document.getElementById(
    'editorial-segundo-parrafo'
  );
  const label = document.querySelector(
    '.editorial-toggle-label'
  );

  if (!btn || !parrafo || !label) return;

  btn.addEventListener('click', function () {
    const abierto = parrafo.classList.toggle(
      'editorial-abierto'
    );
    btn.setAttribute('aria-expanded', abierto);
    label.textContent = abierto ? '- Ver menos' : '+ Ver más';
  });
})();

// ===== MODAL CONTACTO =====
(function () {
  const trigger  = document.getElementById(
    'contact-float-trigger');
  const modal    = document.getElementById(
    'contact-modal');
  const closeBtn = document.getElementById(
    'contact-modal-close');
  const form     = document.getElementById(
    'contact-modal-form');
  const feedback = document.getElementById(
    'contact-feedback');
  const submitBtn = document.getElementById(
    'contact-submit-btn');
  const subjectHeader = document.getElementById(
    'form-subject-header');
  const asuntoInput = document.getElementById(
    'contact-asunto');

  if (!trigger || !modal) return;

  function abrirModal() {
    modal.classList.add('modal-abierto');
    modal.style.pointerEvents = 'auto';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function cerrarModal() {
    modal.classList.remove('modal-abierto');
    modal.style.pointerEvents = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  trigger.addEventListener('click', abrirModal);

  if (closeBtn) {
    closeBtn.addEventListener('click', cerrarModal);
  }

  modal.addEventListener('click', function (e) {
    if (e.target === modal) cerrarModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') cerrarModal();
  });

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const nombre = document.getElementById(
        'contact-nombre').value.trim();
      const asunto = asuntoInput
        ? asuntoInput.value.trim() : '';
      if (subjectHeader) {
        subjectHeader.value =
          '[WEB CONSULTA] - ' + asunto +
          ' (De: ' + nombre + ')';
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
      feedback.textContent = '';
      feedback.className = 'contact-modal-feedback';

      try {
        const data = new FormData(form);
        const response = await fetch(
          'https://api.web3forms.com/submit',
          {
            method: 'POST',
            body: data
          }
        );
        const result = await response.json();

        if (result.success) {
          feedback.textContent =
            'Mensaje enviado. Te contactamos pronto.';
          feedback.classList.add('exito');
          form.reset();
          setTimeout(cerrarModal, 2500);
        } else {
          throw new Error('Error en el envío');
        }
      } catch {
        feedback.textContent =
          'Ha ocurrido un error. Inténtalo de nuevo.';
        feedback.classList.add('error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'ENVIAR MENSAJE';
      }
    });
  }
})();

// ===== TRIGGERS DISEÑO Y JOYERÍA =====
(function () {
  const modal      = document.getElementById(
    'contact-modal');
  const asuntoInput = document.getElementById(
    'contact-asunto');

  if (!modal) return;

  document.querySelectorAll(
    '[data-modal-trigger="true"]'
  ).forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();

      // Autorrellenar asunto si existe el campo
      const asunto = el.getAttribute('data-asunto');
      if (asuntoInput && asunto) {
        asuntoInput.value = asunto;
      }

      // Abrir modal
      modal.classList.add('modal-abierto');
      modal.style.pointerEvents = 'auto';
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Foco en el primer campo
      const primerCampo = modal.querySelector(
        'input:not([type="hidden"])');
      if (primerCampo) {
        setTimeout(function () {
          primerCampo.focus();
        }, 300);
      }
    });
  });
})();

// ===== BANNER COOKIES =====
(function () {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept-btn');
  if (!banner) return;

  window.addEventListener('load', function () {
    if (!localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => {
        banner.style.transform = 'translateY(0)';
      }, 2000);
    }
  });

  if (acceptBtn) {
    acceptBtn.addEventListener('click', function () {
      localStorage.setItem('cookiesAccepted', 'true');
      banner.style.transform = 'translateY(100%)';
    });
  }
})();

// ===== SORTEO FERIAS 2026 =====
(function () {
  const btn = document.getElementById('ferias-btn');
  if (!btn) return;

  btn.addEventListener('click', function () {
    const email = document.getElementById('ferias-email').value.trim();
    const checkLegal = document.getElementById('ferias-check-legal').checked;
    const checkMkt = document.getElementById('ferias-check-marketing').checked;
    const msg = document.getElementById('ferias-msg');

    if (!email || !checkLegal) {
      msg.className = 'ferias-msg error';
      msg.textContent = 'Por favor, completa todos los campos obligatorios.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      msg.className = 'ferias-msg error';
      msg.textContent = 'Por favor, introduce un email válido.';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Enviando...';
    msg.className = 'ferias-msg';
    msg.style.display = 'none';

    fetch('/api/ferias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        aceptaMarketing: checkMkt
      })
    })
      .then(function (res) {
        return res.json().then(function (data) {
          if (res.ok) return data;
          throw new Error(data.error || 'Error al registrar');
        });
      })
      .then(function () {
        window.location.href = 'ferias-gracias.html';
      })
      .catch(function (err) {
        btn.disabled = false;
        btn.textContent = 'PARTICIPAR';
        msg.className = 'ferias-msg error';
        msg.textContent = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
        console.error('Ferias error:', err);
      });
  });
})();

// ===== VÍDEO FERIAS — BOTÓN PLAY =====
document.addEventListener('DOMContentLoaded', function () {
  var video = document.getElementById('ferias-video');
  var playBtn = document.getElementById('ferias-play-btn');
  if (!video || !playBtn) return;

  playBtn.addEventListener('click', function () {
    var source = video.querySelector('source');
    if (source) {
      video.src = source.src;
    }
    video.muted = false;
    video.controls = true;
    video.load();
    video.play();
    playBtn.classList.add('oculto');
  });

  video.addEventListener('pause', function () {
    playBtn.classList.remove('oculto');
  });

  video.addEventListener('ended', function () {
    playBtn.classList.remove('oculto');
  });
});

// ===== FAQ ACORDEÓN FERIAS =====
(function () {
  var items = document.querySelectorAll('.ferias-faq-item');
  if (!items.length) return;

  items.forEach(function (item) {
    var btn = item.querySelector('.ferias-faq-pregunta');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var abierto = item.classList.contains('abierto');

      items.forEach(function (i) {
        i.classList.remove('abierto');
        i.querySelector('.ferias-faq-pregunta')
          .setAttribute('aria-expanded', 'false');
      });

      if (!abierto) {
        item.classList.add('abierto');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
