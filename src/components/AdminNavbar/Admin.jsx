import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Admin.css";
import Footer from "../../pages/Inicio/Footer";
import logo from "../../assets/Imagenes/logo.png";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Usuariosadmin from "./UsuariosAdmin.jsx";
import Productosadmin from "./ProductosAdmin.jsx";
import Catalogosadmin from "./CatalogosAdmin.jsx";
import Pedidosadmin from "./PedidosAdmin.jsx";

const Navbaradmin = () => {
  const navigate = useNavigate();
  const [vista_seleccionada, set_vista_seleccionada] = useState("catalogos");

  const handle_logout = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  const menu_items = [
    { key: "catalogos", label: "📚 Catálogos" },
    { key: "productos", label: "🛒 Productos" },
    { key: "usuarios", label: "👤 Usuarios" },
    { key: "pedidos", label: "📦 Pedidos" },
  ];

  return (
    <>
      <header className="bg-dark">
        <nav className="nav d-flex justify-content-between align-items-center p-3 w-100">
          <div>
            <img
              src={logo}
              alt="logo"
              style={{ width: "100px", height: "100px", cursor: "pointer" }}
              onClick={() => set_vista_seleccionada("catalogos")}
            />
          </div>

          <div className="d-flex align-items-center justify-content-center gap-4 flex-grow-1">
            {menu_items.map((item) => (
              <span
                key={item.key}
                className={`text-white cursor-pointer px-2 py-1 rounded ${
                  vista_seleccionada === item.key
                    ? "fw-bold text-decoration-underline"
                    : ""
                }`}
                onClick={() => set_vista_seleccionada(item.key)}
                style={{ fontSize: "1.1rem" }}
              >
                {item.label}
              </span>
            ))}
          </div>

          <div>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-cerrar-sesion">Cerrar sesión</Tooltip>}
            >
              <LogoutIcon
                onClick={handle_logout}
                style={{ cursor: "pointer", color: "white", fontSize: "30px" }}
                titleAccess="Cerrar sesión"
              />
            </OverlayTrigger>
          </div>
        </nav>
      </header>

      <main className="container mt-4">
        {vista_seleccionada === "catalogos" && <Catalogosadmin />}
        {vista_seleccionada === "productos" && <Productosadmin />}
        {vista_seleccionada === "usuarios" && <Usuariosadmin />}
        {vista_seleccionada === "pedidos" && <Pedidosadmin />}
      </main>

      <Footer />
    </>
  );
};

export default Navbaradmin;
