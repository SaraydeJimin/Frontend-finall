import "./Inicio.css";
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Footer";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from "axios";
import { useEffect, useState } from "react";
import CarritoCli from "../Cliente/CarritoCli";
import BACKEND_URL from "../../routes/backend";

// Importar imágenes
import img1 from '../../assets/Imagenes/card1.jpg';
import img2 from '../../assets/Imagenes/card2.jpg';
import img3 from '../../assets/Imagenes/card3.jpg';
import img4 from '../../assets/Imagenes/card4.jpg';
import img5 from '../../assets/Imagenes/card5.jpg';
import img6 from '../../assets/Imagenes/card6.jpg';
import img7 from '../../assets/Imagenes/card7.jpg';
import img8 from '../../assets/Imagenes/card8.jpg';
import img9 from '../../assets/Imagenes/card9.jpg';
import img10 from '../../assets/Imagenes/card10.jpg';
import img11 from '../../assets/Imagenes/card11.jpg';

const imagenes = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11];

const Catalogo = () => {
  const navigate = useNavigate();
  const [catalogos, setCatalogos] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("");
  const [pagina, setPagina] = useState(1);
  const porPagina = 20;

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${BACKEND_URL}/catalog/all`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { _cacheBust: Date.now() },
    })
    .then((res) => {
      setCatalogos(res.data.response);
      setError(null);
    })
    .catch((err) => {
      console.log("Error fetching catalogs:", err);
      setError("❌ Error al cargar los catálogos. Intenta de nuevo más tarde.");
    });
  }, []);

  const verProductos = (id_catalogo) => {
    navigate(`/products/catalog/${id_catalogo}`);
  };

  const filtrados = catalogos.filter(catalogo => {
    const texto = busqueda.toLowerCase();
    return (
      catalogo.nombre.toLowerCase().includes(texto) ||
      catalogo.descripcion.toLowerCase().includes(texto)
    );
  });

  const ordenados = [...filtrados].sort((a, b) => {
    if(orden === "nombre-asc") {
      return a.nombre.localeCompare(b.nombre);
    } else if(orden === "nombre-desc") {
      return b.nombre.localeCompare(a.nombre);
    } else if(orden === "fecha-asc") {
      return new Date(a.fecha_creacion) - new Date(b.fecha_creacion);
    } else if(orden === "fecha-desc") {
      return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);
    }
    return 0;
  });

  const totalPaginas = Math.ceil(ordenados.length / porPagina);
  const catalogosPaginados = ordenados.slice((pagina - 1) * porPagina, pagina * porPagina);

  return (
    <div style={{ position: "relative" }}>
      <header className="text-center" style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <button
          onClick={() => navigate("/inicio")}
          style={{
            position: "absolute",
            left: "10px",
            background: "none",
            border: "none",
            color: "white",
            fontSize: "1.2rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          aria-label="Volver"
        >
          🔙 Volver
        </button>
        <h1>📚 Catálogo 🛒</h1>
        <label className="carrito" style={{ position: "absolute", right: "10px" }}>
          <button
            onClick={() => setMostrarCarrito(!mostrarCarrito)}
            className="border-0 bg-transparent text-white me-2"
            style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "1rem", cursor: "pointer" }}
          >
            <ShoppingCartIcon style={{ width: "40px", height: "40px", color: "white" }} />
            Carrito
          </button>
        </label>
      </header>

      <div className="container my-3 d-flex justify-content-between align-items-center gap-3 flex-wrap">
        <input 
          type="text" 
          placeholder="Buscar por nombre o descripción..." 
          value={busqueda} 
          onChange={e => {
            setBusqueda(e.target.value);
            setPagina(1);
          }} 
          className="form-control"
          style={{ maxWidth: "400px" }}
        />

        <select 
          className="form-select" 
          style={{ maxWidth: "200px" }}
          value={orden} 
          onChange={e => {
            setOrden(e.target.value);
            setPagina(1);
          }}
        >
          <option value="">Ordenar por</option>
          <option value="nombre-asc">Nombre A-Z</option>
          <option value="nombre-desc">Nombre Z-A</option>
          <option value="fecha-asc">Más antiguo</option>
          <option value="fecha-desc">Más reciente</option>
        </select>
      </div>

      {error && (
        <div className="alert alert-danger text-center mt-3" role="alert">
          {error}
        </div>
      )}

      <main>
        <div id="catalogo" className="container d-flex justify-content-between flex-wrap">
          {catalogosPaginados.length > 0 ? (
            catalogosPaginados.map((catalogo, index) => (
              <Card key={catalogo.id_catalogo} style={{ width: '18rem' }} className="card-color mb-4">
                <Card.Img variant="top" src={imagenes[index % imagenes.length]} />
                <Card.Body>
                  <Card.Title>📦 {catalogo.nombre}</Card.Title>
                  <Card.Text>📝 {catalogo.descripcion}</Card.Text>
                  <Button variant="primary" onClick={() => verProductos(catalogo.id_catalogo)}>
                    👀 Ver más
                  </Button>
                </Card.Body>
              </Card>
            ))
          ) : (
            !error && <p>⏳ No se encontraron catálogos que coincidan.</p> 
          )}
        </div>
      </main>

      {totalPaginas > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <nav>
            <ul className="pagination">
              {Array.from({ length: totalPaginas }, (_, i) => (
                <li key={i} className={`page-item ${pagina === i + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setPagina(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {mostrarCarrito && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "400px",
            height: "100vh",
            backgroundColor: "#fff",
            zIndex: 1050,
            overflowY: "auto",
            boxShadow: "-3px 0 5px rgba(0,0,0,0.3)",
            padding: "1rem"
          }}
        >
          <button
            onClick={() => setMostrarCarrito(false)}
            className="btn btn-danger mb-3"
          >
            ❌ Cerrar
          </button>
          <CarritoCli />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Catalogo;
