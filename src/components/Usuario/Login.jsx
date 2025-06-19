import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const iniciarSesion = () => {
    const correo = document.getElementById("loginCorreo").value;
    const password = document.getElementById("loginPassword").value;

    if (!correo || !password) {
      document.getElementById("loginError").textContent = "Debes ingresar todos los campos.";
      return;
    }

    // Aquí puedes reemplazar con verificación real
    const usuario = {
      CLI_CEDULA_RUC: "0000000000",
      CLI_NOMBRE: "Invitado",
      CLI_APELLIDO: "Ejemplo",
      USUARIO_NOMBRE: "usuario_demo",
      USUARIO_CORREO: correo,
      CLI_TELEFONO: "000000000"
    };

    sessionStorage.setItem("usuario", JSON.stringify(usuario));
    navigate("/perfil");
  };

  useEffect(() => {
    aplicarModoOscuro();
    actualizarContadorCarrito();
  }, []);

  const aplicarModoOscuro = () => {
    const dark = localStorage.getItem('dark-mode') === 'true';
    document.body.classList.toggle('dark-mode', dark);
    const btn = document.getElementById('toggle-dark');
    if (btn) {
      btn.innerHTML = dark ? '<i class="bi bi-brightness-high"></i>' : '<i class="bi bi-moon"></i>';
    }
  };

  const actualizarContadorCarrito = () => {
    const carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    const total = carrito.reduce((sum, p) => sum + (p.cantidad || 0), 0);
    const contador = document.getElementById("contador-carrito");
    if (contador) {
      contador.textContent = total;
      contador.style.display = total > 0 ? "inline-block" : "none";
    }
  };

  return (
    <section className="login-seccion">
      <div className="contenedor-flip">
        <div className="login-card">
          <img src="/img/avatar.png" className="login-avatar" alt="avatar" />
          <h2>Iniciar sesión</h2>
          <div className="form-login">
            <input type="email" id="loginCorreo" placeholder="Usuario" />
            <input type="password" id="loginPassword" placeholder="Contraseña" />
            <p className="error-msg" id="loginError"></p>
            <button className="btn-completar" onClick={iniciarSesion}>Ingresar</button>
          </div>
          <div className="registro-link">
            ¿No tienes cuenta?
            <a onClick={() => navigate("/registro")} style={{ cursor: "pointer" }}>Regístrate aquí</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
