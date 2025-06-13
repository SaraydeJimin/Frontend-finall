import { Route, Routes } from 'react-router-dom';
import Admin from '../components/AdminNavbar/Admin.jsx';
import PowerFullMarket from '../pages/Inicio/Inicio'; // Asegúrate de que la ruta esté correcta
import InicioSesion from '../pages/Sesion/Inicio_sesion.jsx'; // Sin .jsx
import Registro from "../pages/Sesion/Registro.jsx";
import Catalogo from '../components/AdminNavbar/CatalogosAdmin.jsx';
import CatalogoCli from '../pages/Inicio/Catalogo.jsx';
import UsuariosAdmin from '../components/AdminNavbar/UsuariosAdmin.jsx'
import PedidosAdmin from '../components/AdminNavbar/PedidosAdmin.jsx'
import ProductosAdmin from '../components/AdminNavbar/ProductosAdmin.jsx'
import DetallesAdmin from '../components/AdminNavbar/Detalle_PedidoAdmin.jsx'
import ProductoCli from '../pages/Cliente/ProductoCli.jsx'
import ProductoCliente from '../pages/Cliente/ProductoCli.jsx'
import CarritoCli from '../pages/Cliente/CarritoCli.jsx';
import PagoCli from '../pages/Cliente/PagoCli.jsx';
import UsuarioCli from '../pages/Cliente/UsuarioCli.jsx';
import PedidoCli from '../pages/Cliente/PedidoCli.jsx';
import DetalleCli from '../pages/Cliente/DetalleCli.jsx';
import Conocenos from '../pages/Inicio/Conocenos.jsx';
import Privacidad from "../pages/Cliente/Privacidad.jsx";
import Devolucion from "../pages/Cliente/Devolucion.jsx";
import Mayores from "../pages/Cliente/Mayores.jsx";
import Detalle_Idpedido from "../components/AdminNavbar/Detalle_Idpedido.jsx"

const NavbarRoutes = () => {
  return (
    <Routes>
      <Route path='/inicio' element={<PowerFullMarket />} />
      <Route path='/sesion' element={<InicioSesion />} />
      <Route path='/registro' element={<Registro />} />
      <Route path='/catalogocli' element={<CatalogoCli />} />
      <Route path='/catalogo' element={<Catalogo />} />
      <Route path='/admin/:id' element={<Admin />} />
      <Route path='/useradmin' element={<UsuariosAdmin />} />
      <Route path='/pedidosadmin' element={<PedidosAdmin />} />
      <Route path='/productosadmin' element={<ProductosAdmin />} />
      <Route path='/detalle_pedidoadmin' element={<DetallesAdmin />} />
      <Route path='/productocli' element={<ProductoCli />} />
      <Route path="/products/catalog/:id_catalog" element={<ProductoCliente />} />
      <Route path='/carritocli' element={<CarritoCli />} />
      <Route path='/pagocli' element={<PagoCli />} />
      <Route path='/usuariocli' element={<UsuarioCli />} />
      <Route path='/pedidocli' element={<PedidoCli />} />
      <Route path="/detallecli/:id_pedido" element={<DetalleCli />} />
      <Route path='/Conocenos' element={<Conocenos />} />
      <Route path='/privacidad' element={<Privacidad />} />
      <Route path='/devolucion' element={<Devolucion />} />
      <Route path='/mayores' element={<Mayores />} />
      <Route path='/detalle_idOrder/pedido/:id_pedido' element={<Detalle_Idpedido />} />
    </Routes>
  );
};

export default NavbarRoutes;
