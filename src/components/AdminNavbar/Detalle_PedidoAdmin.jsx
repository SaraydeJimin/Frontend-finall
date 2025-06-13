import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BACKEND_URL from "../../routes/backend";

const Detalle_PedidoAdmin = () => {
  const navigate = useNavigate();

  const [orderDetails, setOrderDetails] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [orderBy, setOrderBy] = useState("recent"); // recent | oldest
  const [loading, setLoading] = useState(true);

  // Paginación
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  useEffect(() => {
    applyFilterAndOrder();
    setCurrentPage(1); // Resetea la página al filtrar/ordenar
  }, [orderDetails, filterValue, orderBy]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `${BACKEND_URL}/orderDetail/all`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: { _cacheBust: Date.now() },
      });

      const data = res.data.response || [];

      const groupedOrders = data.reduce((acc, item) => {
        if (!acc[item.id_pedido]) {
          acc[item.id_pedido] = {
            id_pedido: item.id_pedido,
            fecha: item.fecha,
            productos: [],
          };
        }
        acc[item.id_pedido].productos.push({
          id_producto: item.id_producto,
          nombre_product: item.nombre_product,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          precio_total: item.precio_total,
        });
        return acc;
      }, {});

      setOrderDetails(Object.values(groupedOrders));
      setLoading(false);
    } catch (error) {
      console.error("❌ Error al obtener detalles:", error);
      setLoading(false);
    }
  };

  const applyFilterAndOrder = () => {
    let filtered = orderDetails.filter((order) =>
      order.id_pedido.toString().toLowerCase().includes(filterValue.trim().toLowerCase())
    );

    filtered.sort((a, b) => {
      const dateA = new Date(a.fecha);
      const dateB = new Date(b.fecha);
      return orderBy === "recent" ? dateB - dateA : dateA - dateB;
    });

    setFilteredOrders(filtered);
  };

  // Calcular índices para paginar
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  // Manejar paginación
  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredOrders.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll arriba
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "900px" }}>
      <h2 className="mb-4 text-primary fw-bold" style={{ fontWeight: "700" }}>
        📦✨ Detalles de Pedidos
      </h2>
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate(-1)}
        style={{ fontWeight: "600" }}
      >
        🔙 Volver
      </button>

      <form
        className="mb-4 d-flex flex-wrap gap-3 align-items-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          placeholder="🆔 Buscar por ID de Pedido"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="form-control w-auto"
          aria-label="Filtro por ID de Pedido"
          style={{ maxWidth: "250px" }}
        />

        <select
          className="form-select w-auto"
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value)}
          aria-label="Ordenar pedidos"
        >
          <option value="recent">🕒 Más recientes primero</option>
          <option value="oldest">📅 Más antiguos primero</option>
        </select>
      </form>

      {loading ? (
        <p className="text-center fs-5">⌛ Cargando datos...</p>
      ) : currentOrders.length === 0 ? (
        <p className="text-center fst-italic text-muted fs-5">
          🤷‍♂️ No hay datos disponibles
        </p>
      ) : (
        <>
          {currentOrders.map((pedido) => (
            <div
              key={pedido.id_pedido}
              className="mb-5 shadow-sm p-4 border rounded bg-light"
              style={{ boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
            >
              <h4 className="mb-3">
                📋 Pedido <span className="text-info">#{pedido.id_pedido}</span> - 📅 fecha:{" "}
                {new Date(pedido.fecha).toLocaleDateString()}
              </h4>

              <table className="table table-striped table-hover mt-3 align-middle">
                <thead className="table-primary">
                  <tr>
                    <th>🆔 ID Producto</th>
                    <th>🍱 Nombre Producto</th>
                    <th>🔢 cantidad</th>
                    <th>💲 Precio Unitario</th>
                    <th>💰 Precio Total</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.productos.map((prod) => (
                    <tr key={prod.id_producto}>
                      <td>{prod.id_producto}</td>
                      <td>{prod.nombre_product}</td>
                      <td>{prod.cantidad}</td>
                      <td>${prod.precio_unitario.toFixed(2)}</td>
                      <td>${prod.precio_total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          {/* Botones de paginación */}
          <div className="d-flex justify-content-between mb-5">
            <button
              className="btn btn-outline-primary"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              ◀️ Anterior
            </button>
            <span className="align-self-center">
              Página {currentPage} de {Math.ceil(filteredOrders.length / itemsPerPage)}
            </span>
            <button
              className="btn btn-outline-primary"
              onClick={handleNextPage}
              disabled={currentPage === Math.ceil(filteredOrders.length / itemsPerPage)}
            >
              Siguiente ▶️
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Detalle_PedidoAdmin;