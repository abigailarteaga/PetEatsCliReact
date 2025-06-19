import './App.css';
import './style.css';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import { Routes, Route } from 'react-router-dom';

import Home from './components/Home/Home';
import Productos from './components/Productos/Productos';
import Nosotros from './components/Nosotros/Nosotros';
import Contacto from './components/Contacto/Contacto';
import Carrito from './components/Carrito/Carrito';
import Perfil from './components/Usuario/Perfil';
import Login from './components/Usuario/Login';
import Registro from './components/Usuario/Registro';
import Confirmacion from './components/Carrito/Confirmacion';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/confirmacion" element={<Confirmacion />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
