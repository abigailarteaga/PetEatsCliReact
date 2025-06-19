import React from 'react';

const Footer = () => (
  <footer className="footer-personalizado">
    <div className="container">
      <div className="row text-center text-md-start">
        <div className="col-md-4 mb-4">
          <h5 className="fw-bold">🐾 PetEats</h5>
          <p className="text-muted footer-copy">Amamos a tus mascotas tanto como tú.</p>
          <p className="text-muted footer-copy">Calidad y cariño en cada producto.</p>
        </div>
        <div className="col-md-4 mb-4">
          <h5 className="fw-bold">Enlaces</h5>
          <ul className="list-unstyled">
            <li><a href="/" className="text-decoration-none footer-link">Inicio</a></li>
            <li><a href="/productos" className="text-decoration-none footer-link">Productos</a></li>
            <li><a href="/contacto" className="text-decoration-none footer-link">Contacto</a></li>
          </ul>
        </div>
        <div className="col-md-4 mb-4">
          <h5 className="fw-bold">Síguenos</h5>
          <a href="#" className="me-2 footer-icon"><i className="bi bi-facebook fs-4"></i></a>
          <a href="#" className="me-2 footer-icon"><i className="bi bi-instagram fs-4"></i></a>
          <a href="#" className="footer-icon"><i className="bi bi-twitter fs-4"></i></a>
        </div>
      </div>
      <div className="text-center pt-3 mt-4 border-top">
        <small className="footer-copy">&copy; 2025 PetEats. Todos los derechos reservados.</small>
      </div>
    </div>
  </footer>
);

export default Footer;
