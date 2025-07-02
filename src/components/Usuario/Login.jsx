import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const iniciarSesion = async () => {
    const correo = document.getElementById("loginCorreo").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const error = document.getElementById("loginError");

    if (!correo || !password) {
      error.textContent = "Debes ingresar todos los campos.";
      return;
    }

    const spinner = document.getElementById("loadingSpinner");
    if (spinner) spinner.style.display = "flex";

    try {
      // Paso 1: Validar usuario con POST
      const responseValidacion = await fetch("https://backendpeteatsclient.runasp.net/api/usuario/validar-usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Correo: correo, Password: password }),
      });

      if (!responseValidacion.ok) {
        if (spinner) spinner.style.display = "none";
        error.textContent = responseValidacion.status === 401
          ? "Correo o contraseña incorrectos."
          : "Error inesperado, intente más tarde.";
        return;
      }

      // Paso 2: Obtener datos del usuario con GET
      const responseUsuario = await fetch(`https://backendpeteatsclient.runasp.net/api/usuario/${encodeURIComponent(correo)}`);
      if (!responseUsuario.ok) {
        if (spinner) spinner.style.display = "none";
        error.textContent = "Error al obtener datos del usuario.";
        return;
      }

      const usuario = await responseUsuario.json();

      // Validación de campos mínimos para evitar errores posteriores
      if (!usuario || !usuario.CLI_CEDULA_RUC || !usuario.USUARIO_CORREO) {
        error.textContent = "Datos de usuario incompletos. Intenta nuevamente.";
        if (spinner) spinner.style.display = "none";
        return;
      }

      sessionStorage.setItem("usuario", JSON.stringify(usuario));
      navigate("/perfil");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      error.textContent = "Error de red. Intenta más tarde.";
    } finally {
      if (spinner) spinner.style.display = "none";
    }
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
      btn.innerHTML = dark
        ? '<i class="bi bi-brightness-high"></i>'
        : '<i class="bi bi-moon"></i>';
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
    <div>
      {/* Spinner de carga */}
      <div id="loadingSpinner" className="spinner-overlay" style={{ display: 'none' }}>
        <div className="spinner"></div>
      </div>

      {/* Formulario de login */}
      <section className="login-seccion">
        <div className="contenedor-flip">
          <div className="login-card">
            <img src="/img/avatar.png" className="login-avatar" alt="avatar" />
            <h2>Iniciar sesión</h2>
            <div className="form-login">
              <input type="email" id="loginCorreo" placeholder="Correo electrónico" />
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
    </div>
  );
};

export default Login;
