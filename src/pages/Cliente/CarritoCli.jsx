import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import BACKEND_URL from "../../routes/backend";

const CarritoCli = () => {
  const navigate = useNavigate();
  const [id_usuario, setIdUsuario] = useState(null);
  const [id_carrito, setIdCarrito] = useState(null);
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const usuarioJSON = localStorage.getItem("usuario");
    if (!usuarioJSON) return;
    const usuario = JSON.parse(usuarioJSON);
    setIdUsuario(usuario.id_usuario);
  }, []);

  useEffect(() => {
    if (!id_usuario) return;
    const token = localStorage.getItem("token");
    axios
      .get(`${BACKEND_URL}/carrito/user/${id_usuario}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { _cacheBust: Date.now() },
      })
      .then((response) => {
        const carritoArray = response.data.response;
        if (Array.isArray(carritoArray) && carritoArray.length > 0) {
          const carrito = carritoArray[0];
          if (carrito.id_carrito !== id_carrito) {
            setIdCarrito(carrito.id_carrito);
          }
        } else {
          setIdCarrito(null);
          setProductos([]);
          setTotal(0);
          Swal.fire({
            icon: "info",
            title: "Carrito no encontrado",
            text: "No se encontró carrito para este usuario.",
            timer: 4000,
            showConfirmButton: false,
          });
        }
      })
      .catch((err) => {
        console.error("Error obteniendo carrito:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo obtener el carrito.",
          timer: 4000,
          showConfirmButton: false,
        });
      });
  }, [id_usuario, id_carrito]);

  useEffect(() => {
    if (!id_carrito) return;
    const token = localStorage.getItem("token");
    axios
      .get(`${BACKEND_URL}/productCarrito/carrito/${id_carrito}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { _cacheBust: Date.now() },
      })
      .then((response) => {
        const prods = response.data.response || [];
        setProductos(prods);
      })
      .catch((err) => {
        console.error("Error obteniendo productos:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los productos.",
          timer: 4000,
          showConfirmButton: false,
        });
      });
  }, [id_carrito]);

  useEffect(() => {
    const sumaTotal = productos.reduce(
      (acc, prod) => acc + prod.cantidad * prod.precio,
      0
    );
    setTotal(sumaTotal);
  }, [productos]);

  const eliminarProducto = async (id_producto) => {
    const token = localStorage.getItem("token");
    if (!id_carrito) return;
    setProductos((prev) =>
      prev.filter((prod) => prod.id_producto !== id_producto)
    );
    try {
      await axios.delete(
        `${BACKEND_URL}/productCarrito/${id_carrito}/${id_producto}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { _cacheBust: Date.now() },
        }
      );
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    }
  };

  const actualizarCantidad = async (id_producto, nuevaCantidad) => {
    const token = localStorage.getItem("token");
    if (!id_carrito) return;

    if (!Number.isInteger(nuevaCantidad) || nuevaCantidad < 1) {
      return Swal.fire({
        icon: "warning",
        title: "Cantidad inválida",
        text: "La cantidad debe ser un número entero mayor o igual a 1.",
        timer: 3500,
        showConfirmButton: false,
      });
    }

    const productoActual = productos.find(
      (prod) => prod.id_producto === id_producto
    );
    if (!productoActual) return;
    if (nuevaCantidad > productoActual.stock) {
      return Swal.fire({
        icon: "warning",
        title: "Stock insuficiente",
        text: `No hay suficiente stock para ${nuevaCantidad} unidades.`,
        timer: 3500,
        showConfirmButton: false,
      });
    }

    setProductos((prev) =>
      prev.map((prod) =>
        prod.id_producto === id_producto
          ? { ...prod, cantidad: nuevaCantidad }
          : prod
      )
    );

    try {
      await axios.put(
        `${BACKEND_URL}/productCarrito/${id_carrito}/${id_producto}`,
        { cantidad: nuevaCantidad },
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { _cacheBust: Date.now() },
        }
      );
    } catch (err) {
      console.error("Error al actualizar cantidad:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la cantidad.",
        timer: 3500,
        showConfirmButton: false,
      });
    }
  };

  const irAPago = async () => {
    if (!id_carrito || productos.length === 0) {
      return Swal.fire({
        icon: "warning",
        title: "Carrito vacío",
        text: "No puedes continuar sin productos en el carrito.",
        timer: 3500,
        showConfirmButton: false,
      });
    }
    if (!id_usuario || typeof id_usuario !== "number" || id_usuario <= 0) {
      return Swal.fire({
        icon: "error",
        title: "Usuario inválido",
        text: "No se pudo identificar al usuario correctamente.",
        timer: 3500,
        showConfirmButton: false,
      });
    }

    const token = localStorage.getItem("token");
    try {
      const detalles = productos.map((prod) => ({
        id_producto: prod.id_producto,
        cantidad: prod.cantidad,
      }));

      const response = await axios.post(
        `${BACKEND_URL}/orderDetail/verificar-stock`,
        { detalles },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.data.status) {
        return Swal.fire({
          icon: "error",
          title: "Stock insuficiente",
          text: response.data.message,
          timer: 4000,
          showConfirmButton: false,
        });
      }

      localStorage.setItem("totalPago", JSON.stringify(total));
      localStorage.setItem("id_carrito", id_carrito);
      localStorage.setItem("id_usuario", id_usuario);
      navigate("/pagocli");
    } catch (error) {
      console.error("Error verificando stock:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al verificar el stock.",
        timer: 4000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "500px" }}>
      <h4 className="mb-3">🛒 Mi carrito</h4>
      {productos.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        productos.map((prod) => (
          <div key={prod.id_producto} className="card mb-3">
            <div className="row g-0">
              <div className="col-4">
                <img
                  src={prod.imagen}
                  className="img-fluid rounded-start"
                  alt={prod.nombre}
                  style={{ maxHeight: "100px", objectFit: "cover" }}
                />
              </div>
              <div className="col-8">
                <div className="card-body p-2">
                  <h6 className="card-title mb-1">{prod.nombre}</h6>
                  <p className="mb-1">Cantidad: {prod.cantidad}</p>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() =>
                        actualizarCantidad(prod.id_producto, prod.cantidad - 1)
                      }
                    >
                      ➖
                    </button>
                    <span>{prod.cantidad}</span>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() =>
                        actualizarCantidad(prod.id_producto, prod.cantidad + 1)
                      }
                    >
                      ➕
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => eliminarProducto(prod.id_producto)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      <div className="mt-3 d-flex justify-content-between">
        <h5>Total: S/. {total.toFixed(2)}</h5>
        <button className="btn btn-primary" onClick={irAPago}>
          Continuar a pago
        </button>
      </div>
    </div>
  );
};

export default CarritoCli;
