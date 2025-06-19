import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Registro = () => {
  const navigate = useNavigate();

  const registrarUsuario = () => {
    const campos = [
      "registroCedula", "registroNombre", "registroApellido", "registroNombreUsuario",
      "registroCorreo", "registroTelefono", "registroPassword", "registroConfirmar"
    ];

    const valores = {};
    for (let id of campos) {
      const valor = document.getElementById(id).value.trim();
      if (!valor) {
        document.getElementById("registroError").textContent = "Todos los campos son obligatorios.";
        return;
      }
      valores[id] = valor;
    }

    if (valores["registroPassword"] !== valores["registroConfirmar"]) {
      document.getElementById("registroError").textContent = "Las contraseñas no coinciden.";
      return;
    }

    const usuario = {
      CLI_CEDULA_RUC: valores["registroCedula"],
      CLI_NOMBRE: valores["registroNombre"],
      CLI_APELLIDO: valores["registroApellido"],
      USUARIO_NOMBRE: valores["registroNombreUsuario"],
      USUARIO_CORREO: valores["registroCorreo"],
      CLI_TELEFONO: valores["registroTelefono"]
    };

    sessionStorage.setItem("usuario", JSON.stringify(usuario));
    navigate("/perfil");
  };

  useEffect(() => {
    aplicarModoOscuro();
  }, []);

  const aplicarModoOscuro = () => {
    const dark = localStorage.getItem('dark-mode') === 'true';
    document.body.classList.toggle('dark-mode', dark);
    const btn = document.getElementById('toggle-dark');
    if (btn) {
      btn.innerHTML = dark ? '<i class="bi bi-brightness-high"></i>' : '<i class="bi bi-moon"></i>';
    }
  };

  return (
    <section className="registro-seccion">
      <h2>Crear cuenta</h2>
      <div className="form-registro">
        <input type="text" id="registroCedula" placeholder="Cédula" />
        <input type="text" id="registroNombre" placeholder="Nombre" />
        <input type="text" id="registroApellido" placeholder="Apellido" />
        <input type="text" id="registroNombreUsuario" placeholder="Nombre de Usuario" />
        <input type="email" id="registroCorreo" placeholder="Correo electrónico" />
        <input type="tel" id="registroTelefono" placeholder="Teléfono" />
        <input type="password" id="registroPassword" placeholder="Contraseña" />
        <input type="password" id="registroConfirmar" placeholder="Confirmar contraseña" />
        <p className="error-msg" id="registroError"></p>
        <button className="btn-completar" onClick={registrarUsuario}>Registrarse</button>
      </div>
      <div className="registro-link">
        ¿Ya tienes cuenta? <a onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>Inicia sesión</a>
      </div>
    </section>
  );
};

export default Registro;
