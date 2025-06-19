import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css";
    document.head.appendChild(script);

    // Lógica hamburguesa y búsqueda
    import('/Users/USUARIO/peteats-react/src/Busqueda.js');
    import('/Users/USUARIO/peteats-react/src/menu.js');
    import('/Users/USUARIO/peteats-react/src/shared.js');
  }, []);

  return (
    <header className="cabecera">
      <div className="logo logo-con-modelo" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <model-viewer src="/img/dog-bowl.glb" auto-rotate camera-controls disable-zoom style={{ width: "60px", height: "60px" }}></model-viewer>
        <div className="logo-texto">
          <h1>
            <Link to="/" style={{ textDecoration: "none", color: "black" }}>PetEats</Link>
          </h1>
          <p>Consiente a tu mascota</p>
        </div>
      </div>

      <div className="menu-hamburguesa" id="menu-toggle">
        <i className="fas fa-bars"></i>
      </div>

      <nav className="menu" id="menuPrincipal">
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/nosotros">Nosotros</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
        </ul>
      </nav>

      <div className="iconos-header" style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <i className="bi bi-search busqueda-toggle" style={{ fontSize: "1.5rem", cursor: "pointer" }}></i>
        <input type="text" id="inputBuscar" placeholder="Buscar productos..." className="form-busqueda" />
        <div id="carrito-icono" style={{ position: "relative" }}>
          <Link to="/carrito" className="icono-carrito"><i className="bi bi-cart" style={{ fontSize: "1.5rem" }}></i></Link>
          <span id="contador-carrito" className="contador-carrito">0</span>
        </div>
        <Link to="/perfil" className="icono-perfil"><i className="bi bi-person-circle" style={{ fontSize: "1.5rem" }}></i></Link>
        <button id="toggle-dark" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.3rem" }}>
          <i className="bi bi-moon"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
