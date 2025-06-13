import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BACKEND_URL from "../../routes/backend";


const DetalleCli = () => {
  console.log("👀 Renderizando DetalleCli"); // 👈 prueba
  const { id_pedido } = useParams();
  const navigate = useNavigate();

  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orden, setOrden] = useState("nombre_asc");

  useEffect(() => {
    console.log("id_pedido recibido:", id_pedido);
    if (id_pedido) {
      fetchOrderById(id_pedido);
    } else {
      setLoading(false);
      setPedido(null);
    }
  }, [id_pedido]);

  const fetchOrderById = async (id) => {
    try {
      setLoading(true);
      console.log("📡 Fetching pedido ID:", id);

      const token = localStorage.getItem("token");
      const url = `${BACKEND_URL}/orderDetail/pedido/${id}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: { _cacheBust: Date.now() },
      });

      console.log("📥 Respuesta API:", res.data);

      const data = res.data.response;

      if (!Array.isArray(data) || data.length === 0) {
        console.warn("⚠️ Pedido no encontrado o vacío");
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
          precio_unitario: Number(prod.precio_unitario) || 0,
          precio_total: Number(prod.precio_total) || 0,
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

  const ordenarProductos = (productos, criterio) => {
    const productosOrdenados = [...productos];
    switch (criterio) {
      case "nombre_asc":
        productosOrdenados.sort((a, b) =>
          a.nombre_producto.localeCompare(b.nombre_producto)
        );
        break;
      case "nombre_desc":
        productosOrdenados.sort((a, b) =>
          b.nombre_producto.localeCompare(a.nombre_producto)
        );
        break;
      case "precio_asc":
        productosOrdenados.sort((a, b) => a.precio_unitario - b.precio_unitario);
        break;
      case "precio_desc":
        productosOrdenados.sort((a, b) => b.precio_unitario - a.precio_unitario);
        break;
      default:
        break;
    }
    return productosOrdenados;
  };

  const productosOrdenados = pedido ? ordenarProductos(pedido.productos, orden) : [];

  return (
    <div className="container mt-5" style={{ maxWidth: "900px" }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline-secondary mb-4">
        🔙 Regresar
      </button>

      <h2 className="mb-4 text-success" style={{ fontWeight: "700" }}>
        📄 Detalles del Pedido #{id_pedido ?? "N/A"}
      </h2>

      {loading ? (
        <p>⏳ Cargando pedido...</p>
      ) : !pedido ? (
        <p className="text-danger fw-bold">
          ❌ Error<br />
          ID del pedido no encontrado o no tiene productos
        </p>
      ) : (
        <>
          <h5>
            📅 fecha:{" "}
            {pedido.fecha
              ? new Date(pedido.fecha).toLocaleDateString()
              : "fecha no disponible"}
          </h5>

          <div className="mb-3" style={{ maxWidth: "250px" }}>
            <label htmlFor="ordenProductos" className="form-label">
              Ordenar productos:
            </label>
            <select
              id="ordenProductos"
              className="form-select"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            >
              <option value="nombre_asc">Nombre (A-Z)</option>
              <option value="nombre_desc">Nombre (Z-A)</option>
              <option value="precio_asc">Precio unitario (menor a mayor)</option>
              <option value="precio_desc">Precio unitario (mayor a menor)</option>
            </select>
          </div>

          {productosOrdenados.length === 0 ? (
            <p>No hay productos en este pedido.</p>
          ) : (
            <table className="table table-bordered table-striped">
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
                {productosOrdenados.map((prod) => (
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
          )}
        </>
      )}
    </div>
  );
};

export default DetalleCli;
