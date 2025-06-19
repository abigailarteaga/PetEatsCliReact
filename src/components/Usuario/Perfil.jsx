import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    aplicarModoOscuro();
    const datos = JSON.parse(sessionStorage.getItem("usuario"));
    setUsuario(datos);
  }, []);

  const cerrarSesion = () => {
    sessionStorage.removeItem("usuario");
    navigate("/login");
  };

  const aplicarModoOscuro = () => {
    const dark = localStorage.getItem('dark-mode') === 'true';
    document.body.classList.toggle('dark-mode', dark);
    const btn = document.getElementById('toggle-dark');
    if (btn) {
      btn.innerHTML = dark ? '<i class="bi bi-brightness-high"></i>' : '<i class="bi bi-moon"></i>';
    }
  };

  if (!usuario) {
    return (
      <section className="registro-seccion text-center">
        <h2>No has iniciado sesión</h2>
        <button className="btn-completar" onClick={() => navigate("/login")}>Iniciar sesión</button>
      </section>
    );
  }

  return (
    <section className="perfil-usuario">
      <h2>Mi Perfil</h2>
      <div className="perfil-contenedor">
        <div className="perfil-imagen">
          <img src="/img/avatar.png" alt="avatar" />
        </div>
        <div className="perfil-detalles">
          <h3>Detalles de la cuenta</h3>
          <p><strong>Cédula:</strong> {usuario.CLI_CEDULA_RUC}</p>
          <p><strong>Nombre:</strong> {usuario.CLI_NOMBRE}</p>
          <p><strong>Apellido:</strong> {usuario.CLI_APELLIDO}</p>
          <p><strong>Nombre de usuario:</strong> {usuario.USUARIO_NOMBRE}</p>
          <p><strong>Correo:</strong> {usuario.USUARIO_CORREO}</p>
          <p><strong>Teléfono:</strong> {usuario.CLI_TELEFONO}</p>
          <button className="btn-cerrar-sesion" onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </div>
    </section>
  );
};

export default Perfil;
