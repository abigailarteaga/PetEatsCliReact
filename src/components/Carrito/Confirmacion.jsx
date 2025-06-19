import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Confirmacion = () => {
  useEffect(() => {
    const dark = localStorage.getItem('dark-mode') === 'true';
    document.body.classList.toggle('dark-mode', dark);
    const btn = document.getElementById('toggle-dark');
    if (btn) {
      btn.innerHTML = dark
        ? '<i class="bi bi-brightness-high"></i>'
        : '<i class="bi bi-moon"></i>';
    }

    let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    const total = carrito.reduce((acc, p) => acc + (p.cantidad || 0), 0);
    const contador = document.getElementById("contador-carrito");
    if (contador) {
      contador.textContent = total;
      contador.style.display = total > 0 ? "inline-block" : "none";
    }
  }, []);

  return (
    <section className="content text-center">
      <div className="texto-contacto">
        <h3>¡Gracias por tu compra!</h3>
        <p>Tu pedido ha sido confirmado exitosamente.</p>
        <p>En breve recibirás un correo con los detalles.</p>
        <Link to="/" className="btn-completar">Volver al inicio</Link>
      </div>
    </section>
  );
};

export default Confirmacion;
