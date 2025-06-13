import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BACKEND_URL from "../../routes/backend";

const DetallePedidoPorID = () => {
  const { id_pedido } = useParams();
  const navigate = useNavigate();

  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("📦 id_pedido recibido desde la URL:", id_pedido);
    if (id_pedido) {
      fetchOrderById(id_pedido);
    } else {
      console.warn("⚠️ No se recibió un id_pedido válido");
      setLoading(false);
    }
  }, [id_pedido]);

  const fetchOrderById = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const url = `${BACKEND_URL}/orderDetail/pedido/${id}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: { _cacheBust: Date.now() },
      });

      const data = res.data.response;

      if (!data || data.length === 0) {
        setPedido(null);
        setLoading(false);
        return;
      }

      const pedidoInfo = {
        id_pedido: data[0].id_pedido,
        fecha: data[0].fecha,
        productos: data.map((prod) => ({
          id_producto: prod.id_producto,
          nombre_producto: prod.nombre_producto,
          cantidad: prod.cantidad,
          precio_unitario: prod.precio_unitario,
          precio_total: prod.precio_total,
        })),
      };

      setPedido(pedidoInfo);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error al obtener pedido:", error);
      setPedido(null);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "900px" }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline-secondary mb-4">
        🔙 Regresar
      </button>

      <h2 className="mb-4 text-success" style={{ fontWeight: "700" }}>
        📄 Detalles del Pedido #{id_pedido}
      </h2>

      {loading ? (
        <p>⏳ Cargando pedido...</p>
      ) : !pedido ? (
        <p className="text-danger fw-bold">
          ❌ Error<br />ID del pedido no encontrado
        </p>
      ) : (
        <div className="shadow p-3 border rounded">
          <h5>📅 fecha: {new Date(pedido.fecha).toLocaleDateString()}</h5>
          <table className="table table-bordered table-striped mt-3">
            <thead className="table-dark">
              <tr>
                <th>ID Producto</th>
                <th>Nombre Producto</th>
                <th>cantidad</th>
                <th>Precio Unitario</th>
                <th>Precio Total</th>
              </tr>
            </thead>
            <tbody>
              {pedido.productos.map((prod) => (
                <tr key={prod.id_producto}>
                  <td>{prod.id_producto}</td>
                  <td>{prod.nombre_producto}</td>
                  <td>{prod.cantidad}</td>
                  <td>${prod.precio_unitario.toFixed(2)}</td>
                  <td>${prod.precio_total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DetallePedidoPorID;
