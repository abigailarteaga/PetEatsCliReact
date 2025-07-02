import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const API_FACTURA = "https://backendpeteatsclient.runasp.net/api/facturas";
const API_DETALLE = "https://backendpeteatsclient.runasp.net/api/detallefacturas";

const Carrito = () => {
  const [productos, setProductos] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIva] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    aplicarModoOscuro();
    mostrarSpinner(true);
    cargarCarrito();
  }, []);

  const aplicarModoOscuro = () => {
    const dark = localStorage.getItem('dark-mode') === 'true';
    document.body.classList.toggle('dark-mode', dark);
    const btn = document.getElementById('toggle-dark');
    if (btn) {
      btn.innerHTML = dark ? '<i class="bi bi-brightness-high"></i>' : '<i class="bi bi-moon"></i>';
    }
  };

  const mostrarSpinner = (mostrar) => {
    const spinner = document.getElementById("loadingSpinner");
    if (spinner) spinner.style.display = mostrar ? "flex" : "none";
  };

  const calcularTotales = (carrito) => {
    const st = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
    const ivaCalc = st * 0.15;
    const totalCalc = st + ivaCalc;
    setSubtotal(st);
    setIva(ivaCalc);
    setTotal(totalCalc);
  };

  const cargarCarrito = () => {
    const datos = JSON.parse(sessionStorage.getItem("carrito")) || [];
    setProductos(datos);
    calcularTotales(datos);
    actualizarContadorCarrito(datos);
    mostrarSpinner(false);
  };

  const actualizarContadorCarrito = (carrito) => {
    const total = carrito.reduce((sum, p) => sum + (p.cantidad || 0), 0);
    const contador = document.getElementById("contador-carrito");
    if (contador) {
      contador.textContent = total;
      contador.style.display = total > 0 ? "inline-block" : "none";
    }
  };

  const cambiarCantidad = (id, cambio) => {
    const nuevos = productos.map(p => {
      if (p.id === id) {
        const nueva = p.cantidad + cambio;
        return nueva >= 1 ? { ...p, cantidad: nueva } : p;
      }
      return p;
    });
    sessionStorage.setItem("carrito", JSON.stringify(nuevos));
    setProductos(nuevos);
    calcularTotales(nuevos);
    actualizarContadorCarrito(nuevos);
  };

  const eliminarProducto = (id) => {
    const nuevos = productos.filter(p => p.id !== id);
    sessionStorage.setItem("carrito", JSON.stringify(nuevos));
    setProductos(nuevos);
    calcularTotales(nuevos);
    actualizarContadorCarrito(nuevos);
  };

  const generarPDF = (factura) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(`FACTURA: ${factura.id}`, 105, 20, null, null, 'center');
    doc.setFontSize(12);
    doc.text("PetEats", 20, 40);
    doc.text("Dirección: Quito", 20, 50);
    doc.text("Teléfono: 0983707315", 20, 60);
    doc.text("FACTURAR A:", 120, 40);
    doc.text(`Nombre: ${factura.cliente.nombre} ${factura.cliente.apellido}`, 120, 50);
    doc.text(`Cédula: ${factura.cliente.cedula}`, 120, 60);
    doc.text(`Correo: ${factura.cliente.correo}`, 120, 70);
    doc.text(`Teléfono: ${factura.cliente.telefono}`, 120, 80);
    doc.text("FECHA: " + new Date().toLocaleDateString(), 20, 70);
    doc.setFontSize(10);
    doc.setLineWidth(0.5);
    doc.line(20, 120, 190, 120);
    doc.text("DESCRIPCIÓN", 20, 130);
    doc.text("CANTIDAD", 70, 130);
    doc.text("PRECIO UNITARIO", 110, 130);
    doc.text("TOTAL", 160, 130);
    doc.line(20, 135, 190, 135);

    let y = 140;
    factura.detalles.forEach(p => {
      doc.text(p.nombre, 20, y);
      doc.text(p.DF_CANTIDAD.toString(), 70, y);
      doc.text(p.DF_PRECIO.toFixed(2), 110, y);
      doc.text((p.DF_CANTIDAD * p.DF_PRECIO).toFixed(2), 160, y);
      y += 10;
    });

    doc.line(20, y, 190, y);
    doc.text("SUBTOTAL", 100, y + 30);
    doc.text(`$${factura.subtotal.toFixed(2)}`, 160, y + 30);
    doc.text("IVA 15%", 100, y + 40);
    doc.text(`$${factura.iva.toFixed(2)}`, 160, y + 40);
    doc.line(20, y + 50, 190, y + 50);
    doc.text("TOTAL", 100, y + 60);
    doc.text(`$${factura.total.toFixed(2)}`, 160, y + 60);
    doc.setFontSize(10);
    doc.text("Gracias por su confianza", 20, y + 90);
    doc.save(`factura_${factura.id}_de_${factura.cliente.nombre}_${factura.cliente.apellido}.pdf`);
  };

  const completarPedido = async () => {
    mostrarSpinner(true);
    const carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));

    if (!usuario || !usuario.CLI_CEDULA_RUC) {
      alert("Debes iniciar sesión para completar el pedido");
      mostrarSpinner(false);
      return;
    }

    if (!carrito || carrito.length === 0) {
      alert("El carrito está vacío");
      mostrarSpinner(false);
      return;
    }

    const detalles = carrito.map(p => ({
      PRD_ID: p.id,
      DF_CANTIDAD: p.cantidad,
      DF_PRECIO: p.precio
    }));

    try {
      const facturaRes = await fetch(API_FACTURA, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Cedula: usuario.CLI_CEDULA_RUC,
          SubTotal: subtotal,
          Iva: iva,
          Total: total,
          cuentaDest: 114,
          Detalles: detalles
        })
      });

      if (!facturaRes.ok) throw new Error("Error al crear factura");

      const resData = await facturaRes.json();
      const idFactura = resData.IdFactura || resData;

      const factura = {
        id: idFactura,
        cliente: {
          nombre: usuario.CLI_NOMBRE,
          apellido: usuario.CLI_APELLIDO,
          cedula: usuario.CLI_CEDULA_RUC,
          correo: usuario.USUARIO_CORREO,
          telefono: usuario.CLI_TELEFONO
        },
        subtotal,
        iva,
        total,
        detalles: carrito.map(p => ({
          ...p,
          DF_CANTIDAD: p.cantidad,
          DF_PRECIO: p.precio
        }))
      };

      generarPDF(factura);
      sessionStorage.removeItem("carrito");
      actualizarContadorCarrito([]);
      navigate("/confirmacion");

    } catch (err) {
      console.error(err);
      alert("Error al procesar el pedido.");
      mostrarSpinner(false);
    }
  };

  return (
  <>
    <div id="loadingSpinner" className="spinner-overlay" style={{ display: 'none' }}>
      <div className="spinner"></div>
    </div>

    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mb-4">
          <h4 className="mb-3">Carrito de compras</h4>
          <div className="vstack gap-3">
            {productos.length === 0 && <p>Tu carrito está vacío.</p>}
            {productos.map((p, idx) => (
              <div key={idx} className="card p-3 shadow-sm">
                <div className="d-flex align-items-center justify-content-between">
                  
                  {/* Imagen */}
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    className="me-3 rounded"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />

                  {/* Info y botones */}
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{p.nombre}</h6>
                    <div className="d-flex align-items-center gap-2">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => cambiarCantidad(p.id, -1)}>-</button>
                      <span>{p.cantidad}</span>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => cambiarCantidad(p.id, 1)}>+</button>
                      <span className="ms-3">Precio: ${p.precio.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Total y eliminar */}
                  <div className="text-end" style={{ minWidth: '100px' }}>
                    <strong>${(p.precio * p.cantidad).toFixed(2)}</strong>
                    <br />
                    <button className="btn btn-sm text-danger" onClick={() => eliminarProducto(p.id)}>&times;</button>
                  </div>
                </div>
              </div>
            ))}
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