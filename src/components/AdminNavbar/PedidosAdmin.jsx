import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Form, Table, Button, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BACKEND_URL from "../../routes/backend";

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("id_usuario");
  const [filtroValor, setFiltroValor] = useState("");
  const [estados, setestados] = useState({});
  const [error, setError] = useState(null);

  // NUEVO estado para la página actual
  const [paginaActual, setPaginaActual] = useState(1);
  const pedidosPorPagina = 20;

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const endpoint = `${BACKEND_URL}/order/all`;

  const obtenerPedidos = useCallback(async () => {
    try {
      const res = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: { _cacheBust: Date.now() },
      });

      const pedidostotales = res.data.response || [];

      let pedidosFiltrados = pedidostotales;

      if (filtroValor.trim() !== "") {
        const valor = filtroValor.trim().toLowerCase();

        pedidosFiltrados = pedidostotales.filter((pedido) => {
          switch (filtroTipo) {
            case "id_usuario":
              return pedido.id_usuario?.toString().includes(valor);
            case "nombre":
              return pedido.nombre?.toLowerCase().includes(valor);
            case "email":
              return pedido.email?.toLowerCase().includes(valor);
            case "estado":
              return pedido.estado?.toLowerCase().includes(valor);
            default:
              return true;
          }
        });
      }

      setPedidos(pedidosFiltrados);
      setPaginaActual(1); // resetear a la primera página al cambiar filtro
      setError(null);
    } catch (err) {
      console.error("Error al obtener pedidos:", err);
      setError("❌ Error al cargar los pedidos");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  }, [endpoint, filtroTipo, filtroValor, token, navigate]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      obtenerPedidos();
    }
  }, [token, navigate, obtenerPedidos]);

  const actualizarestado = async (idPedido) => {
    try {
      const nuevoestado = estados[idPedido];
      await axios.put(
        `${BACKEND_URL}/order/estado/${idPedido}`,
        { estado: nuevoestado },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      obtenerPedidos();
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      alert("❌ Error al actualizar el estado del pedido");
    }
  };

  // Calcular los índices para slice de pedidos a mostrar
  const indexUltimoPedido = paginaActual * pedidosPorPagina;
  const indexPrimerPedido = indexUltimoPedido - pedidosPorPagina;
  const pedidosPaginaActual = pedidos.slice(indexPrimerPedido, indexUltimoPedido);

  // Funciones para cambiar página
  const paginaSiguiente = () => {
    if (paginaActual < Math.ceil(pedidos.length / pedidosPorPagina)) {
      setPaginaActual(paginaActual + 1);
    }
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📦 Panel de Pedidos Administrativos 🛒</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-3">
        <Col md={3}>
          <Form.Group>
            <Form.Label>🧾 Filtrar por</Form.Label>
            <Form.Select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="id_usuario">ID Usuario</option>
              <option value="nombre">nombre</option>
              <option value="email">email</option>
              <option value="estado">estado</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>🔍 Valor del filtro</Form.Label>
            <Form.Control
              type="text"
              placeholder="Escribe un valor para filtrar"
              value={filtroValor}
              onChange={(e) => setFiltroValor(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  obtenerPedidos();
                }
              }}
            />
          </Form.Group>
        </Col>
      </Row>
      <div className="text-end mt-5">
        <Button
          variant="outline-success"
          style={{ width: "250px" }}
          onClick={() => navigate("/detalle_pedidoadmin")}
        >
          📋 Ir a todos los detalles
        </Button>
      </div>
      <Table striped bordered hover responsive style={{ marginTop: "20px" }}>
        <thead className="table-dark">
          <tr>
            <th>🆔 ID Pedido</th>
            <th>👤 ID Usuario</th>
            <th>👥 nombre Usuario</th>
            <th>📧 email Usuario</th>
            <th>📅 fecha</th>
            <th>💰 total</th>
            <th>📦 estado</th>
            <th>✏️ Cambiar estado</th>
            <th>🔍 Detalles</th>
          </tr>
        </thead>
        <tbody>
          {pedidosPaginaActual.length > 0 ? (
            pedidosPaginaActual.map((pedido) => (
              <tr key={pedido.id_pedido}>
                <td>{pedido.id_pedido}</td>
                <td>{pedido.id_usuario}</td>
                <td>{pedido.nombre || "-"}</td>
                <td>{pedido.email || "-"}</td>
                <td>{new Date(pedido.fecha).toLocaleString()}</td>
                <td>${pedido.total?.toLocaleString()}</td>
                <td>{pedido.estado}</td>
                <td>
                  <Form.Select
                    value={estados[pedido.id_pedido] || pedido.estado}
                    onChange={(e) =>
                      setestados((prev) => ({
                        ...prev,
                        [pedido.id_pedido]: e.target.value,
                      }))
                    }
                    className="mb-2"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="procesando">Procesando</option>
                    <option value="enviado">Enviado</option>
                  </Form.Select>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => actualizarestado(pedido.id_pedido)}
                  >
                    ✅ Guardar
                  </Button>
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/detalle_idOrder/pedido/${pedido.id_pedido}`)}
                  >
                    Ver más
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                🚫 No hay pedidos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Controles de paginación */}
      {pedidos.length > pedidosPorPagina && (
        <div className="d-flex justify-content-between align-items-center">
          <Button
            variant="outline-primary"
            onClick={paginaAnterior}
            disabled={paginaActual === 1}
          >
            ← Anterior
          </Button>
          <span>
            Página {paginaActual} de {Math.ceil(pedidos.length / pedidosPorPagina)}
          </span>
          <Button
            variant="outline-primary"
            onClick={paginaSiguiente}
            disabled={paginaActual === Math.ceil(pedidos.length / pedidosPorPagina)}
          >
            Siguiente →
          </Button>
        </div>
      )}
    </div>
  );
};

export default PedidosAdmin;
