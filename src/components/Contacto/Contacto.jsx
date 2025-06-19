import React, { useEffect } from 'react';

const Contacto = () => {
  useEffect(() => {
    const dark = localStorage.getItem('dark-mode') === 'true';
    document.body.classList.toggle('dark-mode', dark);

    const btn = document.getElementById('toggle-dark');
    if (btn) {
      btn.innerHTML = dark
        ? '<i class="bi bi-brightness-high"></i>'
        : '<i class="bi bi-moon"></i>';
    }

    // Delegar evento toggle desde header
    const handler = (e) => {
      if (e.target.closest('#toggle-dark')) {
        const nuevo = !(localStorage.getItem('dark-mode') === 'true');
        localStorage.setItem('dark-mode', nuevo);
        document.body.classList.toggle('dark-mode', nuevo);
        if (btn) {
          btn.innerHTML = nuevo
            ? '<i class="bi bi-brightness-high"></i>'
            : '<i class="bi bi-moon"></i>';
        }
      }
    };

    document.body.addEventListener('click', handler);

    return () => document.body.removeEventListener('click', handler);
  }, []);

  useEffect(() => {
    // Actualizar contador de carrito
    const actualizarContadorCarrito = () => {
      let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
      const total = carrito.reduce((sum, p) => sum + (p.cantidad || 0), 0);
      const contador = document.getElementById("contador-carrito");
      if (contador) {
        contador.textContent = total;
        contador.style.display = total > 0 ? "inline-block" : "none";
      }
    };
    actualizarContadorCarrito();
  }, []);

  return (
    <section className="vista_principal">
      <div className="vista_principal_capa">
        <div className="vista_principal_texto">
          <h2>Contacto</h2>
          <p>Email: info@peteats.com</p>
          <p>Teléfono: +123 456 789</p>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
