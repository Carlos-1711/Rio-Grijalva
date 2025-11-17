// =======================================================
// FONDO ANIMADO DE OLAS (Canvas SOLO EN .compromiso)
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("waves-bg");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const parent = canvas.parentElement;

  function ajustarCanvas() {
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
  }

  ajustarCanvas();
  window.addEventListener("resize", ajustarCanvas);

  let step = 0;

  function drawWaves() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    step += 0.02;

    const waves = [
      { color: "rgba(0,153,204,0.5)", amp: 15, freq: 0.02, offset: 0 },
      { color: "rgba(0,100,200,0.4)", amp: 20, freq: 0.015, offset: 100 },
      { color: "rgba(0,80,160,0.3)", amp: 25, freq: 0.01, offset: 200 }
    ];

    waves.forEach(w => {
      ctx.fillStyle = w.color;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x++) {
        const y = Math.sin(x * w.freq + step + w.offset) * w.amp + canvas.height * 0.9;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fill();
    });

    requestAnimationFrame(drawWaves);
  }

  drawWaves();
});

// =======================================================
// INFOGRAFÍA INTERACTIVA: Cambiar descripción
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".step-item");
  const description = document.querySelector(".flow-description");

  const textos = {
    1: "El primer paso consiste en remover objetos grandes como basura y escombros, protegiendo la maquinaria.",
    2: "El agua pasa por sedimentación primaria para separar sólidos pesados y lodos.",
    3: "Tratamiento biológico con microorganismos elimina contaminantes orgánicos.",
    4: "Desinfección final y vertido seguro al medio ambiente."
  };

  steps.forEach(step => {
    step.addEventListener("click", () => {
      steps.forEach(s => s.classList.remove("active"));
      step.classList.add("active");
      const id = step.getAttribute("data-step");
      description.textContent = textos[id] || "Selecciona un paso para más información.";
    });
  });
});

// =======================================================
// CARRUSEL DE IMÁGENES MEJORADO (auto-slide y botones)
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  const slidesWrapper = document.querySelector(".carousel-slide");
  const slides = document.querySelectorAll(".carousel-slide img");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const sliderContainer = document.querySelector(".carousel-container");

  if (!slidesWrapper || slides.length === 0) return;

  let index = 0;
  const total = slides.length;
  const visibleSlides = 3; // 👈 cantidad visible
  const intervalTime = 5000;
  let slideInterval;

  function updateSlide() {
    const movePercent = (100 / visibleSlides) * index;
    slidesWrapper.style.transform = `translateX(-${movePercent}%)`;
    slidesWrapper.style.transition = "transform 0.8s ease";
  }

  function nextSlide() {
    index = (index < total - visibleSlides) ? index + 1 : 0;
    updateSlide();
  }

  function prevSlide() {
    index = (index > 0) ? index - 1 : total - visibleSlides;
    updateSlide();
  }

  nextBtn?.addEventListener("click", () => { nextSlide(); resetInterval(); });
  prevBtn?.addEventListener("click", () => { prevSlide(); resetInterval(); });

  function startInterval() {
    slideInterval = setInterval(nextSlide, intervalTime);
  }

  function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
  }

  startInterval();

  if (sliderContainer) {
    sliderContainer.addEventListener("mouseenter", () => clearInterval(slideInterval));
    sliderContainer.addEventListener("mouseleave", startInterval);
  }

  window.addEventListener("resize", updateSlide);
  updateSlide();
});

// =======================================================
// COMPROMISO DEL USUARIO (localStorage) - CON BORRADO
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("compromisoForm");
  const lista = document.getElementById("listaCompromisos");
  const nombreInput = document.getElementById("nombreCompromiso");
  const accionInput = document.getElementById("accionCompromiso");

  if (!form || !lista) return;

  let compromisos = JSON.parse(localStorage.getItem("compromisos")) || [];

  function mostrarCompromisos() {
    lista.innerHTML = "";
    compromisos.forEach((c, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <p class="nombre">${c.nombre}</p>
        <p class="accion">Se compromete a: <em>${c.accion}</em></p>
        <button class="btn-borrar" data-index="${index}">✖</button>
      `;
      lista.appendChild(li);
    });

    document.querySelectorAll(".btn-borrar").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const i = e.target.getAttribute("data-index");
        compromisos.splice(i, 1);
        localStorage.setItem("compromisos", JSON.stringify(compromisos));
        mostrarCompromisos();
      });
    });
  }

  mostrarCompromisos();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = nombreInput.value.trim();
    const accion = accionInput.value.trim();

    if (!nombre || !accion) {
      alert("Por favor, completa ambos campos.");
      return;
    }

    compromisos.unshift({ nombre, accion });
    localStorage.setItem("compromisos", JSON.stringify(compromisos));

    mostrarCompromisos();
    form.reset();
  });
});

// =======================================================
// HEADER: Resaltar página activa automáticamente
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".nav-links a");
  const path = window.location.pathname.split("/").pop();

  links.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === path) link.classList.add("active");
  });
});

// =======================================================
// ANIMACIÓN SUAVE AL HACER SCROLL
// =======================================================
window.addEventListener("scroll", () => {
  const elementos = document.querySelectorAll(".fade-in");
  const trigger = window.innerHeight * 0.85;

  elementos.forEach(el => {
    if (el.getBoundingClientRect().top < trigger) el.classList.add("visible");
  });
});

// =======================================================
// ⬇SCROLL SUAVE PARA BOTONES INTERNOS
// =======================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
