import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Button, Form, Pagination } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import BACKEND_URL from "../../routes/backend";

const ProductosCliente = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("nuevo");
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 6;

  const [idCarrito, setIdCarrito] = useState(null);
  const navigate = useNavigate();
  const { id_catalog } = useParams();

  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const backendURL = `${BACKEND_URL}`;

  useEffect(() => {
    if (!token || !usuario) {
      navigate("/login");
      return;
    }

    const obtenerCarrito = async () => {
  try {
    const res = await axios.get(`${backendURL}/carrito/user/${usuario.id_usuario}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { _cacheBust: Date.now() },
    });

    if (res.data.response?.length > 0) {
      setIdCarrito(res.data.response[0].id_carrito);
    } 
  } catch (err) {
    console.error("Error al obtener carrito:", err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo obtener o crear el carrito.",
    });
  }
};

    const obtenerProductos = async () => {
      try {
        const url = id_catalog
          ? `${backendURL}/products/catalog/${id_catalog}`
          : `${backendURL}/products/all`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
          params: { _cacheBust: Date.now() },
        });
        const productosObtenidos = res.data.response || [];
        console.log("🧪 Productos desde backend:", productosObtenidos);
        setProductos(productosObtenidos);
        setProductosFiltrados(productosObtenidos);
      } catch (err) {
        console.error("Error al obtener productos:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los productos.",
        });
      }
    };

    obtenerCarrito();
    obtenerProductos();
  }, [token, navigate, id_catalog]);

  useEffect(() => {
    let filtrados = [...productos];

    if (busqueda.trim() !== "") {
      const filtro = busqueda.toLowerCase();
      filtrados = filtrados.filter((p) =>
        p.nombre.toLowerCase().includes(filtro) ||
        p.precio.toString().includes(filtro) ||
        p.stock.toString().includes(filtro)
      );
    }

    switch (orden) {
      case "az":
        filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "za":
        filtrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case "nuevo":
        filtrados.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case "antiguo":
        filtrados.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      default:
        break;
    }

    setPaginaActual(1);
    setProductosFiltrados(filtrados);
  }, [busqueda, orden, productos]);

  const agregarAlCarrito = async (id_producto) => {
    if (!idCarrito) {
      Swal.fire({
        icon: "warning",
        title: "Carrito no encontrado",
        text: "No se encontró carrito activo. Intenta recargar la página.",
      });
      return;
    }

    try {
      await axios.post(
        `${backendURL}/productCarrito`,
        {
          id_carrito: idCarrito,
          productos: [{ id_producto, cantidad: 1 }],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "¡Listo!",
        text: "Producto agregado al carrito ✅",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error al agregar producto al carrito:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "No se pudo agregar el producto al carrito.",
      });
    }
  };

  // Paginación
  const indexInicio = (paginaActual - 1) * productosPorPagina;
  const indexFin = indexInicio + productosPorPagina;
  const productosPaginados = productosFiltrados.slice(indexInicio, indexFin);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  const renderPaginacion = () => (
    <Pagination className="justify-content-center mt-4">
      <Pagination.Prev
        disabled={paginaActual === 1}
        onClick={() => setPaginaActual(paginaActual - 1)}
      />
      {[...Array(totalPaginas)].map((_, i) => (
        <Pagination.Item
          key={i}
          active={i + 1 === paginaActual}
          onClick={() => setPaginaActual(i + 1)}
        >
          {i + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next
        disabled={paginaActual === totalPaginas}
        onClick={() => setPaginaActual(paginaActual + 1)}
      />
    </Pagination>
  );

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3 gap-2 flex-wrap">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          🔙 Volver
        </Button>
        <Form.Control
          type="text"
          placeholder="Buscar producto, precio o stock..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ width: "300px" }}
        />
        <Form.Select value={orden} onChange={(e) => setOrden(e.target.value)} style={{ width: "200px" }}>
          <option value="nuevo">🆕 Más nuevo</option>
          <option value="antiguo">📜 Más antiguo</option>
          <option value="az">🔤 A-Z</option>
          <option value="za">🔠 Z-A</option>
        </Form.Select>
      </div>

      <h2>Productos del catálogo {id_catalog || "Todos"} 🛒🛍️</h2>

      {id_catalog && (
        <Button
          variant="outline-primary"
          className="mb-3"
          onClick={() => navigate("/productocli")}
        >
          🔙 Ver todos los productos
        </Button>
      )}

      <Row className="justify-content-center">
        {productosPaginados.length === 0 ? (
          <p>No hay productos disponibles. 😞</p>
        ) : (
          productosPaginados.map((producto) => (
            <Col md={4} key={producto.id_producto} className="mb-4 d-flex align-items-stretch">
              <Card className="w-100 shadow-sm">
                {producto.imagen && (
                  <Card.Img
                    variant="top"
                    src={producto.imagen}
                    style={{ height: "200px", objectFit: "cover" }}
                    alt={`Imagen de ${producto.nombre}`}
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{producto.nombre} 🛒</Card.Title>
                  <Card.Text>{producto.descripcion}</Card.Text>
                  <Card.Text><strong>Precio:</strong> ${producto.precio} 💰</Card.Text>
                  <Card.Text><strong>Stock:</strong> {producto.stock} 📦</Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => agregarAlCarrito(producto.id_producto)}
                    className="mt-auto"
                  >
                    Añadir al carrito 🛍️
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {productosFiltrados.length > productosPorPagina && renderPaginacion()}
    </Container>
  );
};

export default ProductosCliente;
