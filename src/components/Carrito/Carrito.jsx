import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Carrito = () => {
  const [productos, setProductos] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIva] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    aplicarModoOscuro();
    cargarCarrito();
  }, []);

  const aplicarModoOscuro = () => {
    const dark = localStorage.getItem('dark-mode') === 'true';
    document.body.classList.toggle('dark-mode', dark);
    const btn = document.getElementById('toggle-dark');
    if (btn) {
      btn.innerHTML = dark
        ? '<i class="bi bi-brightness-high"></i>'
        : '<i class="bi bi-moon"></i>';
    }
  };

  const cargarCarrito = () => {
    const datos = JSON.parse(sessionStorage.getItem("carrito")) || [];
    setProductos(datos);

    const st = datos.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
    const ivaCalc = st * 0.15;
    const totalCalc = st + ivaCalc;

    setSubtotal(st);
    setIva(ivaCalc);
    setTotal(totalCalc);
  };

  const completarPedido = () => {
    document.getElementById("loadingSpinner").style.display = "flex";
    setTimeout(() => {
      sessionStorage.removeItem("carrito");
      navigate('/confirmacion');
    }, 1500);
  };

  return (
    <>
      <div id="loadingSpinner" className="spinner-overlay">
        <div className="spinner"></div>
      </div>

      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8 mb-4">
            <h4 className="mb-3">Carrito de compras</h4>
            <div className="vstack gap-3">
              {productos.map((p, idx) => (
                <div key={idx} className="card p-3 shadow-sm">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>{p.nombre}</strong>
                      <p className="mb-1">Cantidad: {p.cantidad}</p>
                      <p className="mb-1">Precio: ${p.precio.toFixed(2)}</p>
                    </div>
                    <img src={p.imagen} alt={p.nombre} style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                  </div>
                </div>
              ))}
              {productos.length === 0 && <p>Tu carrito está vacío.</p>}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title mb-3">Detalles de pago</h5>
                <div className="d-flex justify-content-between">
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>IVA (15%)</span><span>${iva.toFixed(2)}</span>
                </div>
                <div className="border-top my-2"></div>
                <div className="d-flex justify-content-between fw-bold mb-3">
                  <span>Total</span><span>${total.toFixed(2)}</span>
                </div>
                <button onClick={completarPedido} className="btn w-100 text-white" style={{ backgroundColor: "#B98046" }}>
                  Pagar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Carrito;
