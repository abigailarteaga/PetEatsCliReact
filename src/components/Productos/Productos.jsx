import React, { useEffect, useState } from 'react';

const API_PRODUCTOS = "https://backendpeteatsclient.runasp.net/api/productos";
const API_CATEGORIAS = "https://backendpeteats.runasp.net/api/productos/categorias";
const API_STOCK = "https://backendpeteats.runasp.net/api/integracion/stock";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");

  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 8;

  useEffect(() => {
    const inputBuscar = document.getElementById("inputBuscar");
    const btnLupa = document.querySelector(".busqueda-toggle");

    if (inputBuscar && btnLupa) {
      inputBuscar.style.display = "none"; // Oculto al inicio
      inputBuscar.placeholder = "Buscar producto...";

      const mostrarBuscar = () => {
        const visible = inputBuscar.style.display === "inline-block";
        inputBuscar.style.display = visible ? "none" : "inline-block";
        if (!visible) inputBuscar.focus();
      };

      const handlerInput = (e) => {
        setFiltroNombre(e.target.value.toLowerCase());
        setPaginaActual(1);
      };

      btnLupa.addEventListener("click", mostrarBuscar);
      inputBuscar.addEventListener("input", handlerInput);

      return () => {
        btnLupa.removeEventListener("click", mostrarBuscar);
        inputBuscar.removeEventListener("input", handlerInput);
      };
    }
  }, []);

  useEffect(() => {
  cargarDatos();
  const dark = localStorage.getItem('dark-mode') === 'true';
  document.body.classList.toggle('dark-mode', dark);
  actualizarContadorCarrito();
}, []);

const cargarDatos = () => {
  fetch(API_PRODUCTOS)
    .then(res => res.json())
    .then(setProductos)
    .catch(err => console.error("Error al cargar productos:", err));

  fetch(API_CATEGORIAS)
    .then(res => res.json())
    .then(setCategorias)
    .catch(err => console.error("Error al cargar categorías:", err));
};


  const actualizarContadorCarrito = () => {
    let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    const totalCantidad = carrito.reduce((sum, p) => sum + (p.cantidad || 0), 0);
    const contador = document.getElementById("contador-carrito");
    if (contador) {
      contador.textContent = totalCantidad;
      contador.style.display = totalCantidad > 0 ? "inline-block" : "none";
    }
  };

  const handleCategoriaChange = (e) => {
    setCategoriaSeleccionada(e.target.value);
    setPaginaActual(1);
  };

  const handleFiltroNombre = (e) => {
    setFiltroNombre(e.target.value.toLowerCase());
    setPaginaActual(1);
  };

  const animarProductoAlCarrito = (id) => {
    const origenElemento = document.getElementById(`cantidad-${id}`);
    const carritoIcono = document.getElementById("carrito-icono");
    if (!origenElemento || !carritoIcono) return;

    const origenRect = origenElemento.getBoundingClientRect();
    const destinoRect = carritoIcono.getBoundingClientRect();

    const circulo = document.createElement("div");
    circulo.className = "animacion-circulo";
    document.body.appendChild(circulo);

    circulo.style.top = origenRect.top + "px";
    circulo.style.left = origenRect.left + "px";

    requestAnimationFrame(() => {
      circulo.style.top = destinoRect.top + "px";
      circulo.style.left = destinoRect.left + "px";
      circulo.style.transform = "scale(1.5)";
    });

    setTimeout(() => {
      document.body.removeChild(circulo);
    }, 800);
  };

  const agregarAlCarrito = (id, nombre, precio, imagen) => {
    const inputCantidad = document.getElementById(`cantidad-${id}`);
    const cantidad = parseInt(inputCantidad?.value || "0");
    if (cantidad <= 0) return;

    fetch(`${API_STOCK}?idProducto=${id}&cantidad=${cantidad}`)
      .then(res => res.json())
      .then(stockDisponible => {
        if (!stockDisponible) {
          alert("Stock insuficiente para: " + nombre);
          return;
        }

        let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
        const existente = carrito.find(p => p.id === id);
        if (existente) {
          existente.cantidad += cantidad;
        } else {
          carrito.push({ id, nombre, precio, cantidad, imagen });
        }

        sessionStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarContadorCarrito();
        animarProductoAlCarrito(id);
      })
      .catch(() => alert("Error al validar stock. Intenta más tarde."));
  };

  const productosFiltrados = productos
    .filter(p => categoriaSeleccionada === "todas" || String(p.CAT_ID) === categoriaSeleccionada)
    .filter(p => p.PRD_NOMBRE.toLowerCase().includes(filtroNombre));

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const inicio = (paginaActual - 1) * productosPorPagina;
  const productosPagina = productosFiltrados.slice(inicio, inicio + productosPorPagina);

  const renderPaginacion = () => (
    <div className="d-flex justify-content-center my-3 flex-wrap gap-2">
      <button className="btn btn-outline-secondary"
        disabled={paginaActual === 1}
        onClick={() => setPaginaActual(paginaActual - 1)}
      >
        Anterior
      </button>

      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
        <button
          key={num}
          className={`btn ${num === paginaActual ? "btn-secondary" : "btn-outline-secondary"}`}
          onClick={() => setPaginaActual(num)}
        >
          {num}
        </button>
      ))}

      <button className="btn btn-outline-secondary"
        disabled={paginaActual === totalPaginas}
        onClick={() => setPaginaActual(paginaActual + 1)}
      >
        Siguiente
      </button>
    </div>
  );

  return (
    <div className="content">
      <div className="seccion-productos-3d">
        <div className="modelo-lateral">
          <model-viewer src="/img/toy-mouse.glb" auto-rotate camera-controls style={{ width: 100, height: 100 }} />
        </div>
        <h2 className="titulo">Nuestros Productos</h2>
        <div className="modelo-lateral">
          <model-viewer src="/img/cat.glb" auto-rotate camera-controls style={{ width: 100, height: 100 }} />
        </div>
      </div>

      <div className="filtro-categorias">
        <div className="dropdown-categoria">
          <div id="categoria-activa" className="categoria-activa">
            {categoriaSeleccionada === 'todas'
              ? 'Todas las categorías'
              : categorias.find(c => String(c.CAT_ID) === categoriaSeleccionada)?.CAT_DESCRIPCION}
          </div>
          <select id="selectCategoria" className="select-categoria" value={categoriaSeleccionada} onChange={handleCategoriaChange}>
            <option value="todas">Filtrar por categoría</option>
            {categorias.map(c => (
              <option key={c.CAT_ID} value={c.CAT_ID}>{c.CAT_DESCRIPCION}</option>
            ))}
          </select>
        </div>
        <input
  type="text"
  id="inputBuscar"
  placeholder="Buscar por nombre..."
  className="form-busqueda ms-3"
  autoComplete="off"
/>

            {filtroNombre && (
  <div className="sugerencias-busqueda">
    {productos
      .filter(p => p.PRD_NOMBRE.toLowerCase().includes(filtroNombre))
      .slice(0, 5)
      .map(p => (
        <div
          key={p.PRD_ID}
          className="sugerencia-item"
          onClick={() => {
            const nombre = p.PRD_NOMBRE;
            setFiltroNombre(nombre.toLowerCase());
            document.getElementById("inputBuscar").value = nombre;
          }}
        >
          {p.PRD_NOMBRE}
        </div>
      ))}
  </div>
)}


      </div>

      {/* Paginación arriba */}
      {renderPaginacion()}

      <div id="productos-container" className="contenedor_productos mt-3">
        {productosPagina.map(p => (
          <div key={p.PRD_ID} className="tarjeta_producto" data-nombre={p.PRD_NOMBRE}>
            <img src={p.PRD_IMAGEN} alt={p.PRD_NOMBRE} />
            <h3>{p.PRD_NOMBRE}</h3>
            <p className="precio">${p.PRD_PRECIO.toFixed(2)}</p>
            <div className="acciones_producto">
              <label htmlFor={`cantidad-${p.PRD_ID}`}>Cantidad:</label>
              <input type="number" id={`cantidad-${p.PRD_ID}`} className="cantidad_producto" min="1" defaultValue="1" />
            </div>
            <button className="añadir_carrito" onClick={() => agregarAlCarrito(p.PRD_ID, p.PRD_NOMBRE, p.PRD_PRECIO, p.PRD_IMAGEN)}>
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>

      {/* Paginación abajo */}
      {renderPaginacion()}
    </div>
  );
};

export default Productos;
