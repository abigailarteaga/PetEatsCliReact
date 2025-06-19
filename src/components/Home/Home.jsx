import React, { useEffect, useState } from 'react';

const API_DESTACADOS = "https://backendpeteatsclient.runasp.net/api/Productos/productos-destacados";

const Home = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch(API_DESTACADOS)
      .then(res => res.json())
      .then(setProductos)
      .catch(err => console.error("Error al cargar productos destacados", err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const boneL = document.getElementById("bone-left");
      const boneR = document.getElementById("bone-right");

      let angle = Date.now() / 100;
      const rad = angle * (Math.PI / 180);
      const x = (Math.sin(rad * 1.2) * 90).toFixed(2);
      const y = (Math.cos(rad * 0.8) * 120).toFixed(2);
      const z = (Math.sin(rad * 1.5) * 70).toFixed(2);
      const rotacion = `${x}deg ${y}deg ${z}deg`;

      if (boneL) boneL.setAttribute("camera-orbit", rotacion);
      if (boneR) boneR.setAttribute("camera-orbit", `-${x}deg ${y}deg -${z}deg`);
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const agregarAlCarrito = (id, nombre, precio, imagen, cantidad = 1) => {
    const producto = { id, nombre, precio, imagen, cantidad };
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const index = carrito.findIndex(p => p.id === id);

    if (index !== -1) {
      carrito[index].cantidad += cantidad;
    } else {
      carrito.push(producto);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`🛒 ${nombre} agregado al carrito (${cantidad})`);
  };

  return (
    <>
      <section className="vista_principal">
        <div className="vista_principal_capa">
          <div className="vista_principal_texto">
            <h2>Bienvenido a PetEats</h2>
            <p>Tu tienda de confianza para consentir a tus mascotas</p>
          </div>
        </div>
      </section>

      <section className="seccion-categorias-3d">
        <div className="bone-3d left">
          <model-viewer id="bone-left" src="/img/dog-biscuit.glb" auto-rotate camera-controls disable-zoom style={{ width: '100px', height: '100px' }} />
        </div>

        <div className="categorias-centro">
          <h2>Categorías</h2>
          <div className="contenedor-categorias">
            <a className="categoria-tarjeta" href="/productos?categoria=Alimentos Mascotas">
              <img src="https://st2.depositphotos.com/5372232/7899/i/450/depositphotos_78997064-stock-photo-multicolored-dry-cat-or-dog.jpg" alt="Alimentos" />
              <p>Alimento</p>
            </a>
            <a className="categoria-tarjeta" href="/productos?categoria=Juguetes Mascotas">
              <img src="https://i.pinimg.com/originals/39/36/04/3936046832eff2a639b460f1057c3249.jpg" alt="Juguetes" />
              <p>Juguete</p>
            </a>
            <a className="categoria-tarjeta" href="/productos?categoria=Accesorios Mascotas">
              <img src="https://feroz.com.co/cdn/shop/files/129_2048x.jpg?v=1738527586" alt="Accesorios" />
              <p>Accesorio</p>
            </a>
            <a className="categoria-tarjeta" href="/productos?categoria=Higiene Mascotas">
              <img src="https://static.miscota.com/media/1/photos/features/010/052999/sumsu-gamas-65645d891252a.png" alt="Higiene" />
              <p>Higiene</p>
            </a>
            <a className="categoria-tarjeta" href="/productos?categoria=Salud Mascotas">
              <img src="https://static.vecteezy.com/system/resources/previews/002/746/118/non_2x/animal-protection-and-care-flat-color-icon-pet-healthcare-service-veterinary-clinic-wildlife-and-environmental-protection-cartoon-style-clip-art-for-mobile-app-isolated-rgb-illustration-vector.jpg" alt="Salud" />
              <p>Salud</p>
            </a>
          </div>
        </div>

        <div className="bone-3d right">
          <model-viewer id="bone-right" src="/img/dog-biscuit.glb" auto-rotate camera-controls disable-zoom style={{ width: '100px', height: '100px' }} />
        </div>
      </section>

      <section className="productos_destacados">
        <h2>Productos destacados</h2>
        <div className="contenedor_productos">
          {productos.map(p => (
            <div key={p.PRD_ID} className="tarjeta_producto">
              <span className="etiqueta_nuevo">★</span>
              <img src={p.PRD_IMAGEN} alt={p.PRD_NOMBRE} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
              <h3>{p.PRD_NOMBRE}</h3>
              <p className="precio">${p.PRD_PRECIO.toFixed(2)}</p>
              <div className="acciones_producto">
                <label htmlFor={`cantidad-${p.PRD_ID}`}>Cantidad:</label>
                <input
                  type="number"
                  id={`cantidad-${p.PRD_ID}`}
                  min="1"
                  max="200"
                  placeholder="Seleccione"
                  defaultValue="1"
                  onChange={(e) => p.cantidadTemp = parseInt(e.target.value)}
                />
              </div>
              <button
                className="añadir_carrito"
                onClick={() => agregarAlCarrito(p.PRD_ID, p.PRD_NOMBRE, p.PRD_PRECIO, p.PRD_IMAGEN, p.cantidadTemp || 1)}
              >
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="productos_destacados">
        <h2>Explora nuestras secciones</h2>
        <div className="contenedor_productos">
          {[
            { title: 'Productos', img: '/img/principal6.jpg', text: 'Alimentos, juguetes, accesorios y más', href: '/productos' },
            { title: 'Sobre Nosotros', img: '/img/principal4.jpg', text: 'Conoce nuestra historia y compromiso', href: '/nosotros' },
            { title: 'Contáctanos', img: '/img/principal8.jpg', text: '¿Tienes dudas? ¡Estamos para ayudarte!', href: '/contacto' }
          ].map(sec => (
            <div key={sec.title} className="tarjeta_producto">
              <img src={sec.img} alt={sec.title} />
              <h3>{sec.title}</h3>
              <p className="precio">{sec.text}</p>
              <a href={sec.href} className="boton_carrito">Ir</a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
