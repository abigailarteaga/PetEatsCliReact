// Alterna el menú al hacer clic en el ícono de hamburguesa
function toggleMenu() {
  const menu = document.getElementById("menuPrincipal");
  if (menu) {
    menu.classList.toggle("mostrar");
  }
}

// Cerrar el menú si se hace clic fuera de él
function cerrarMenuSiClickAfuera(event) {
  const menu = document.getElementById("menuPrincipal");
  const toggleBtn = document.getElementById("menu-toggle");

  if (
    menu &&
    menu.classList.contains("mostrar") &&
    !menu.contains(event.target) &&
    !toggleBtn.contains(event.target)
  ) {
    menu.classList.remove("mostrar");
  }
}

// Se ejecuta una vez que el DOM y el header estén cargados
document.addEventListener("DOMContentLoaded", function () {
  const boton = document.getElementById("menu-toggle");
  if (boton) {
    boton.addEventListener("click", toggleMenu);
  }

  document.addEventListener("click", cerrarMenuSiClickAfuera);
});
