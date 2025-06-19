import Home from './components/Home/Home';
import Productos from './components/Productos/Productos';
import Nosotros from './components/Nosotros/Nosotros';
import Contacto from './components/Contacto/Contacto';

const routes = [
  { path: '/', Component: Home },
  { path: '/productos', Component: Productos },
  { path: '/nosotros', Component: Nosotros },
  { path: '/contacto', Component: Contacto },
];

export default routes;
