// =======================================================
// 🌊 ANIMACIÓN DE CARGA CON FRASES 
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const mainContent = document.querySelector("main");
  const impactText = document.querySelector(".impact-text");

  // Verifica si ya se mostró la animación (guardado permanente)
  const animacionMostrada = localStorage.getItem("animacionMostrada");

  if (animacionMostrada === "true") {
    if (loader) loader.style.display = "none";
    if (mainContent) {
      mainContent.style.display = "block";
      mainContent.classList.add("fade-in");
    }
  } else {
    // Frases motivacionales
    const frases = [
      "💧 Cada gota cuenta, cuida el agua del Grijalva.",
      "🌿 La naturaleza no necesita que la salvemos, necesita que la respetemos.",
      "💚 Si el río muere, también muere nuestra esperanza."
    ];

    let fraseIndex = 0;

    function cambiarFrase() {
      if (!impactText) return;
      impactText.classList.remove("fade-in");
      setTimeout(() => {
        impactText.textContent = frases[fraseIndex];
        impactText.classList.add("fade-in");
        fraseIndex = (fraseIndex + 1) % frases.length;
      }, 300);
    }

    // Cambia frase cada 2 segundos
    const fraseInterval = setInterval(cambiarFrase, 2000);
    cambiarFrase();

    // Desaparecer loader después de 6 segundos
    setTimeout(() => {
      clearInterval(fraseInterval);
      if (loader) loader.classList.add("fade-out");
      setTimeout(() => {
        if (loader) loader.style.display = "none";
        if (mainContent) {
          mainContent.style.display = "block";
          mainContent.classList.add("fade-in");
        }

        //No repetir
        localStorage.setItem("animacionMostrada", "true");
      }, 800);
    }, 6000);
  }

  // =======================================================
  // CARRUSEL DE IMÁGENES MEJORADO
  // =======================================================
  const carousel = document.querySelector(".carousel-slide");
  const images = document.querySelectorAll(".carousel-slide img");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  if (carousel && images.length > 0) {
    let index = 0;
    const total = images.length;

    function updateCarousel() {
      carousel.style.transform = `translateX(-${index * 100}%)`;
    }

    function nextSlide() {
      index = (index + 1) % total;
      updateCarousel();
      resetInterval();
    }

    function prevSlide() {
      index = (index - 1 + total) % total;
      updateCarousel();
      resetInterval();
    }

    if (nextBtn) nextBtn.addEventListener("click", nextSlide);
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);

    let autoSlide = setInterval(nextSlide, 5000);

    function resetInterval() {
      clearInterval(autoSlide);
      autoSlide = setInterval(nextSlide, 5000);
    }

    const carouselContainer = document.querySelector(".carousel-container");
    if (carouselContainer) {
      carouselContainer.addEventListener("mouseenter", () => clearInterval(autoSlide));
      carouselContainer.addEventListener("mouseleave", resetInterval);
    }

    window.addEventListener("resize", () => {
      images.forEach(img => {
        img.style.height = "auto";
        img.style.objectFit = "cover";
      });
      updateCarousel();
    });

    updateCarousel();
  }

  // =======================================================
  // HEADER: Cambia color al hacer scroll
  // =======================================================
  const header = document.querySelector(".header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // =======================================================
  // ANIMACIONES CON AOS (Animate On Scroll)
  // =======================================================
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1200,
      once: true,
      offset: 120
    });
  }
});
