// JS de metales

document.addEventListener('DOMContentLoaded', () => {
    console.log("Página de Metales cargada. La interactividad de las tarjetas (flip card) se maneja puramente con CSS.");
});

// Obtener todos los elementos de la lista de navegación
const navItems = document.querySelectorAll('nav ul li');

navItems.forEach(item => {
    // Agregar un "escuchador de eventos" (event listener) para el click
    item.addEventListener('click', function() {
        // 1. Quitar la clase 'active' de TODOS los elementos
        navItems.forEach(i => {
            i.classList.remove('active');
        });

        // 2. Añadir la clase 'active' SÓLO al elemento que se hizo click
        this.classList.add('active');
    });
});