import { useState, useEffect } from 'react';
import { Navbar } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Swal from 'sweetalert2';
import Logo_sin_fondo from "../../assets/Imagenes/logo_sin_letra.png";
import RegistroForm from '../../pages/Sesion/Registro';
import Sesion from '../../pages/Sesion/Inicio_sesion';
import Avatar from '@mui/material/Avatar';
import Configuracion from '../../assets/Imagenes/configuracion.jpg';
import CarritoCli from '../../pages/Cliente/CarritoCli';

const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

export const NavBar = () => {
  const navigate = useNavigate();

  const [showSesionModal, setShowSesionModal] = useState(false);
  const [showRegistroModal, setShowRegistroModal] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("usuario");
    if (data) setUsuario(JSON.parse(data));
  }, []);

  const handlePerfilClick = () => {
    Swal.fire({
      title: `👤 ¡Hola, ${usuario?.nombre || 'Usuario'}!`,
      text: `📧 Email: ${usuario?.email || 'No disponible'}`,
      imageUrl: usuario?.foto || '/src/assets/Imagenes/foto-perfil.png',
      imageWidth: 100,
      imageHeight: 100,
      imageAlt: "Foto de perfil",
      showCancelButton: true,
      cancelButtonText: "❌ Cerrar",
      confirmButtonText: "Cerrar sesión",
      html: `
        <img 
          src="${Configuracion}" 
          style="position: absolute; top: 10px; right: 10px; width: 45px; height: 45px; cursor: pointer;" 
          title="Ir a configuración"
          id="configuracion-img"
        />
      `,
      didOpen: () => {
        const configImg = Swal.getPopup().querySelector('#configuracion-img');
        if (configImg) {
          configImg.addEventListener('click', () => {
            Swal.close();
            navigate('/usuariocli');
          });
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("usuario");
        window.location.reload();
      }
    });
  };

  return (
    <>
      <Navbar style={{ backgroundColor: "#343a40", fontFamily: "'Quicksand', sans-serif", position: "relative" }}>
        <nav className="nav d-flex justify-content-between py-1 px-3 w-100">
          <div className="nav-left d-flex align-items-center gap-3">
            <a href="#catalogo" className="text-white fw-bold">📚 Catálogo</a>
            <a onClick={() => navigate("/productocli")} className="text-white fw-bold" style={{ cursor: "pointer" }}>🛒 Productos</a>
          </div>

          <div style={{ position: "relative", width: "220px", height: "100px" }}>
            <a href="/"><img src={Logo_sin_fondo} alt="Logo" style={{
              position: "absolute", top: "-5px", left: "50%", transform: "translateX(-50%)",
              width: "150px", height: "150px"
            }} /></a>
          </div>

          <div className="nav-left d-flex align-items-center gap-3">
            <a onClick={() => navigate("/Conocenos")} className="text-white fw-bold" style={{ cursor: "pointer" }}>📢 Conócenos</a>
          </div>

          <div className="nav-right d-flex align-items-center gap-3">
            {!usuario ? (
              <>
                <button
                  onClick={() => setShowSesionModal(true)}
                  className="btn btn-light fw-bold"
                  style={{ borderRadius: "20px", fontFamily: "'Quicksand', sans-serif" }}
                >
                  🔐 Iniciar Sesión
                </button>

                <button
                  onClick={() => setShowRegistroModal(true)}
                  className="btn btn-success fw-bold"
                  style={{ borderRadius: "20px", fontFamily: "'Quicksand', sans-serif" }}
                >
                  📝 Registrarse
                </button>
              </>
            ) : (
              <>
                {/* Botón del carrito */}
                <button
                  onClick={() => setMostrarCarrito(true)}
                  className="btn btn-outline-light"
                  title="Ver carrito"
                  style={{ borderRadius: "50%", padding: "0.5rem 0.6rem" }}
                  aria-label="Carrito"
                >
                  <ShoppingCartIcon />
                </button>

                {/* Perfil */}
                <div
                  onClick={handlePerfilClick}
                  style={{ cursor: "pointer", fontFamily: "'Quicksand', sans-serif" }}
                  className="text-white d-flex align-items-center gap-2"
                >
                  <Avatar
                    src={usuario.foto || undefined}
                    alt={usuario.nombre}
                  >
                    {!usuario.foto && <PersonOutlineIcon />}
                  </Avatar>
                  <span>{usuario.nombre}</span>
                </div>
              </>
            )}
          </div>
        </nav>
      </Navbar>

      {/* Modal Inicio Sesión */}
      <Sesion
        show={showSesionModal}
        handleClose={() => setShowSesionModal(false)}
        onRegistro={() => {
          setShowSesionModal(false);
          setShowRegistroModal(true);
        }}
      />

      {/* Modal Registro */}
      <RegistroForm
        show={showRegistroModal}
        handleClose={() => setShowRegistroModal(false)}
        onSesion={() => {
          setShowRegistroModal(false);
          setShowSesionModal(true);
        }}
      />

      {/* Panel lateral carrito */}
      {mostrarCarrito && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "360px",
            height: "100vh",
            backgroundColor: "#fff",
            zIndex: 1050,
            overflowY: "auto",
            boxShadow: "-3px 0 10px rgba(0,0,0,0.3)",
            padding: "1rem",
          }}
        >
          <button
            onClick={() => setMostrarCarrito(false)}
            className="btn btn-danger mb-3"
            aria-label="Cerrar carrito"
          >
            ❌ Cerrar
          </button>

          {/* Panel Carrito Cliente */}
          <CarritoCli />
        </div>
      )}
    </>
  );
};
