/* ==========================================================
   JS COMPLETO Y MEJORADO PÁGINA "ACERCA"
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  /* ==== 1. TABS PROFUNDIDAD DEL PROBLEMA ==== */
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Quitar clases activas
      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      // Activar el botón y contenido correspondiente
      btn.classList.add("active");
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add("active");
    });
  });

  // Activar primer tab por defecto
  if (tabButtons.length > 0) tabButtons[0].click();


  /* ==== 2. ACORDEÓN PREGUNTAS FRECUENTES ==== */
  const accordions = document.querySelectorAll(".accordion-item");
  accordions.forEach(item => {
    const header = item.querySelector(".accordion-header");
    const body = item.querySelector(".accordion-body");
    const icon = item.querySelector(".accordion-icon");

    header.addEventListener("click", () => {
      const isOpen = body.classList.contains("open");

      if (isOpen) {
        // Si ya está abierto, se cierra
        body.classList.remove("open");
        icon.style.transform = "rotate(0deg)";
      } else {
        // Cierra todos los demás acordeones
        document.querySelectorAll(".accordion-body.open").forEach(openBody => {
          openBody.classList.remove("open");
          const parent = openBody.closest(".accordion-item");
          if (parent) {
            const iconClose = parent.querySelector(".accordion-icon");
            if (iconClose) iconClose.style.transform = "rotate(0deg)";
          }
        });

        // Abre el acordeón actual
        body.classList.add("open");
        icon.style.transform = "rotate(90deg)";
      }
    });
  });


  /* ==== 3. TOOLTIP METALES ==== */
  const tooltips = document.querySelectorAll(".metales-tooltips li");
  tooltips.forEach(item => {
    const tip = item.dataset.tooltip;
    item.addEventListener("mouseenter", () => {
      const tooltipEl = document.createElement("div");
      tooltipEl.className = "tooltip-dinamic";
      tooltipEl.innerText = tip;
      tooltipEl.style.position = "absolute";
      tooltipEl.style.background = "#014F86";
      tooltipEl.style.color = "#fff";
      tooltipEl.style.padding = "6px 10px";
      tooltipEl.style.borderRadius = "6px";
      tooltipEl.style.fontSize = "0.85rem";
      tooltipEl.style.whiteSpace = "nowrap";
      tooltipEl.style.zIndex = 9999;
      document.body.appendChild(tooltipEl);
      const rect = item.getBoundingClientRect();
      tooltipEl.style.top = rect.top - 30 + "px";
      tooltipEl.style.left = rect.left + rect.width/2 - tooltipEl.offsetWidth/2 + "px";
      item._tooltipEl = tooltipEl;
    });
    item.addEventListener("mouseleave", () => {
      if (item._tooltipEl) item._tooltipEl.remove();
    });
  });


  /* ==== 4. GRÁFICA DE METALES (CHART.JS) ==== */
  const graficaCanvas = document.getElementById("graficaMetales");
  if (graficaCanvas) {
    const ctx = graficaCanvas.getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Mercurio (Hg)", "Plomo (Pb)", "Cadmio (Cd)", "Arsénico (As)"],
        datasets: [
          {
            label: "Límite Seguro (mg/L)",
            data: [0.01, 0.03, 0.005, 0.01],
            backgroundColor: "rgba(16,185,129,0.6)",
            borderRadius: 6
          },
          {
            label: "Reporte Río Grijalva (mg/L)",
            data: [0.012, 0.035, 0.005, 0.018],
            backgroundColor: "rgba(220,38,38,0.8)",
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: "#0d2161", font: { size: 14 } }
          },
          tooltip: {
            backgroundColor: "#014F86",
            titleColor: "#fff",
            bodyColor: "#fff",
            cornerRadius: 8
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: "#0d2161" },
            grid: { color: "rgba(0,0,0,0.05)" }
          },
          x: {
            ticks: { color: "#0d2161" },
            grid: { display: false }
          }
        }
      }
    });
  }
});
