import React, { useEffect } from 'react';

const Nosotros = () => {
  useEffect(() => {
    // Aplicar modo oscuro desde localStorage
    const dark = localStorage.getItem('dark-mode') === 'true';
    document.body.classList.toggle('dark-mode', dark);

    const btn = document.getElementById('toggle-dark');
    if (btn) {
      btn.innerHTML = dark
        ? '<i class="bi bi-brightness-high"></i>'
        : '<i class="bi bi-moon"></i>';
    }

    // Delegación de evento para alternar modo oscuro
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

    return () => {
      document.body.removeEventListener('click', handler);
    };
  }, []);

  useEffect(() => {
    // Contador de carrito
    let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    const total = carrito.reduce((acc, p) => acc + (p.cantidad || 0), 0);
    const contador = document.getElementById("contador-carrito");
    if (contador) {
      contador.textContent = total;
      contador.style.display = total > 0 ? "inline-block" : "none";
    }
  }, []);

  return (
    <section className="vista_principal">
      <div className="vista_principal_capa">
        <div className="vista_principal_texto">
          <h2>Sobre Nosotros</h2>
          <p>Somos PetEats, tu tienda de confianza para productos de mascotas. Nos apasiona brindar lo mejor para tus compañeros peludos.</p>
        </div>
      </div>
    </section>
  );
};

export default Nosotros;
