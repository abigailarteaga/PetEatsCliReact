import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style.css'; // Asegúrate de que esta ruta sea correcta

const Registro = () => {
  const navigate = useNavigate();

  const [campos, setCampos] = useState({
    cedula: "", nombre: "", apellido: "", usuario: "",
    correo: "", telefono: "", password: "", confirmar: ""
  });

  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  const validar = (name, value) => {
    let error = "";
    if (!value) return "Este campo es obligatorio.";

    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚÑñ\s]+$/;
    const esCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const esCedula = /^[0-9]{10}$/;
    const esTelefono = /^[0]{1}[0-9]{9}$/;

    switch (name) {
      case "cedula":
        if (!esCedula.test(value) || parseInt(value.substring(0, 2)) < 1 || parseInt(value.substring(0, 2)) > 24)
          error = "Cédula no válida.";
        break;
      case "nombre":
      case "apellido":
        if (!soloLetras.test(value)) error = "No debe contener números.";
        break;
      case "correo":
        if (!esCorreo.test(value)) error = "Correo no válido.";
        break;
      case "telefono":
        if (!esTelefono.test(value)) error = "Debe comenzar con 0 y tener 10 dígitos.";
        break;
      case "password":
        if (value.length < 4) error = "Mínimo 4 caracteres.";
        break;
      case "confirmar":
        if (value !== campos.password) error = "Las contraseñas no coinciden.";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampos(prev => ({ ...prev, [name]: value }));

    const nuevoError = validar(name, value);
    setErrores(prev => ({ ...prev, [name]: nuevoError }));
  };

  const registrarUsuario = async () => {
    const nuevosErrores = {};
    Object.entries(campos).forEach(([key, value]) => {
      const error = validar(key, value);
      if (error) nuevosErrores[key] = error;
    });

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setCargando(true);

    try {
      const response = await fetch("https://backendpeteatsclient.runasp.net/api/usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Cedula: campos.cedula,
          Nombre: campos.nombre,
          Apellido: campos.apellido,
          Telefono: campos.telefono,
          Correo: campos.correo,
          Password: campos.password,
          Usuario: campos.usuario,
        })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      navigate("/login");
    } catch (err) {
      alert("Error al registrar: " + err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const dark = localStorage.getItem('dark-mode') === 'true';
    document.body.classList.toggle('dark-mode', dark);
    const btn = document.getElementById('toggle-dark');
    if (btn) {
      btn.innerHTML = dark ? '<i class="bi bi-brightness-high"></i>' : '<i class="bi bi-moon"></i>';
    }
  }, []);

  return (
    <section className="registro-seccion">
      {cargando && <div className="progress-bar"></div>}
      <h2>Crear cuenta</h2>
      <div className="form-registro">
        {[
          { name: "cedula", placeholder: "Cédula" },
          { name: "nombre", placeholder: "Nombre" },
          { name: "apellido", placeholder: "Apellido" },
          { name: "usuario", placeholder: "Nombre de Usuario" },
          { name: "correo", placeholder: "Correo electrónico", type: "email" },
          { name: "telefono", placeholder: "Teléfono", type: "tel" },
          { name: "password", placeholder: "Contraseña", type: "password" },
          { name: "confirmar", placeholder: "Confirmar contraseña", type: "password" },
        ].map(({ name, placeholder, type = "text" }) => (
          <div key={name} className="campo">
            <input
              type={type}
              name={name}
              placeholder={placeholder}
              value={campos[name]}
              onChange={handleChange}
              className={errores[name] ? "input-error" : ""}
            />
            {errores[name] && <small className="error-msg">{errores[name]}</small>}
          </div>
        ))}

        <button className="btn-completar mt-2" onClick={registrarUsuario}>Registrarse</button>
      </div>

      <div className="registro-link">
        ¿Ya tienes cuenta? <span onClick={() => navigate("/login")} style={{ cursor: "pointer", color: "#007bff" }}>Inicia sesión</span>
      </div>
    </section>
  );
};

export default Registro;
