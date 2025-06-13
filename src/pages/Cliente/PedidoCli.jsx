import { useState, useEffect } from "react";
import {
  Table,
  Container,
  Button,
  Card,
  Form,
  Pagination,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { BsEyeFill, BsArrowLeftCircle } from "react-icons/bs";
import BACKEND_URL from "../../routes/backend";


const PedidoCli = () => {
  const [pedidos, setPedidos] = useState([]);
  const [todosPedidos, setTodosPedidos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [paginaActual, setPaginaActual] = useState(1);
  const pedidosPorPagina = 20;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const storedUser = localStorage.getItem("usuario");
        const token = localStorage.getItem("token");

        if (!storedUser || !token) {
          Swal.fire("⚠️ Sesión caducada", "Por favor inicia sesión", "warning");
          navigate("/login");
          return;
        }

        const userParsed = JSON.parse(storedUser);
        const response = await axios.get(
          `${BACKEND_URL}/order/user/${userParsed.id_usuario}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPedidos(response.data.response);
        setTodosPedidos(response.data.response);
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
        Swal.fire("❌ Error", "No se pudieron cargar tus compras", "error");
      }
    };

    fetchPedidos();
  }, [navigate]);

  const handleBuscar = (e) => {
    const valor = e.target.value.toLowerCase();
    setBusqueda(valor);
    setPaginaActual(1); // Reiniciar a la primera página

    const filtrados = todosPedidos.filter((pedido) => {
      return (
        pedido.nombre?.toLowerCase().includes(valor) ||
        pedido.email?.toLowerCase().includes(valor) ||
        pedido.metodo_pago?.toLowerCase().includes(valor) ||
        pedido.total.toString().includes(valor) ||
        pedido.estado?.toLowerCase().includes(valor) ||
        pedido.fecha.toLowerCase().includes(valor) ||
        new Date(pedido.fecha).toLocaleString().toLowerCase().includes(valor)
      );
    });

    setPedidos(filtrados);
  };

  const pedidosFiltrados = pedidos;
  const totalPaginas = Math.ceil(pedidosFiltrados.length / pedidosPorPagina);
  const indiceInicial = (paginaActual - 1) * pedidosPorPagina;
  const indiceFinal = indiceInicial + pedidosPorPagina;
  const pedidosPaginados = pedidosFiltrados.slice(indiceInicial, indiceFinal);

  const cambiarPagina = (numero) => setPaginaActual(numero);

  const renderizarPaginacion = () => {
    let items = [];
    for (let i = 1; i <= totalPaginas; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === paginaActual}
          onClick={() => cambiarPagina(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center mt-3">{items}</Pagination>
    );
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-lg border-0">
        <h2 className="text-center mb-4 fw-bold text-primary">📦 Mis Compras</h2>

        {/* Buscador único */}
        <Form className="mb-4">
          <Form.Control
            type="text"
            placeholder="🔍 Buscar por nombre, fecha, método, total, estado..."
            value={busqueda}
            onChange={handleBuscar}
          />
        </Form>

        {pedidosFiltrados.length === 0 ? (
          <p className="text-center fs-5">No hay pedidos disponibles.</p>
        ) : (
          <>
            <Table striped bordered hover responsive className="text-center align-middle">
              <thead className="table-info">
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Método de Pago</th>
                  <th>Total</th>
                  <th>Detalles</th>
                </tr>
              </thead>
              <tbody>
                {pedidosPaginados.map((pedido) => (
                  <tr key={pedido.id_pedido}>
                    <td>{pedido.nombre}</td>
                    <td>{pedido.email}</td>
                    <td>{new Date(pedido.fecha).toLocaleString()}</td>
                    <td>
                      <span
                        className={
                          pedido.estado === "pendiente"
                            ? "badge bg-warning text-dark"
                            : pedido.estado === "procesado"
                            ? "badge bg-primary"
                            : "badge bg-success"
                        }
                      >
                        {pedido.estado}
                      </span>
                    </td>
                    <td>{pedido.metodo_pago || "No registrado"}</td>
                    <td className="fw-bold text-success">
                      ${pedido.total.toLocaleString()}
                    </td>
                    <td>
                      <Button
                        variant="outline-info"
                        onClick={() => navigate(`/detallecli/${pedido.id_pedido}`)}
                      >
                        <BsEyeFill className="me-2" />
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {/* Paginación */}
            {renderizarPaginacion()}
          </>
        )}

        <div className="d-flex justify-content-center mt-4">
          <Button variant="secondary" onClick={() => navigate("/usuariocli")}>
            <BsArrowLeftCircle className="me-2" />
            Volver al inicio
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default PedidoCli;
