import { useState, useEffect } from "react";
import { Button, Form, Container, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import BACKEND_URL from "../../routes/backend";

const PagoCli = () => {
  const [usuario, setUsuario] = useState(null);
  const [carrito, setCarrito] = useState(null);
  const [metodoPago, setMetodoPago] = useState("");
  const [nombreTarjeta, setNombreTarjeta] = useState("");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [fechaExpedicion, setFechaExpedicion] = useState("");
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const storedUser = localStorage.getItem("usuario");
        const token = localStorage.getItem("token");
        if (!storedUser || !token) {
          Swal.fire("❌ Error", "Usuario no autenticado", "error");
          navigate("/login");
          return;
        }
        const userParsed = JSON.parse(storedUser);
        setUsuario(userParsed);

        const respCarrito = await axios.get(
          `${BACKEND_URL}/carrito/user/${userParsed.id_usuario}/active`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { _cacheBust: Date.now() },
          }
        );

        const carritoActivo = respCarrito.data.carrito;

        if (carritoActivo && carritoActivo.activo === 1) {
          setCarrito(carritoActivo);

          const respProductos = await axios.get(
            `${BACKEND_URL}/productCarrito/carrito/${carritoActivo.id_carrito}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              params: { _cacheBust: Date.now() },
            }
          );

          setProductos(respProductos.data.response || []);
        } else {
          Swal.fire("⚠️ Atención", "No tienes un carrito activo", "warning");
          navigate("/");
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        Swal.fire("❌ Error", "Hubo un problema al cargar los datos", "error");
      }
    };
    cargarDatos();
  }, [navigate]);

  const refrescarProductos = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${BACKEND_URL}/products/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { _cacheBust: Date.now() },
      });
      setProductos(res.data.response || []);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const handlePago = async () => {
  const token = localStorage.getItem("token");
  try {
    const { data: pagoCreado } = await axios.post(
      `${BACKEND_URL}/pago`,
      {
        id_usuario: usuario.id_usuario,
        fecha_pago: new Date().toISOString().split("T")[0],
        metodo_pago: metodoPago,
        nombre_tarjeta: nombreTarjeta,
        numero_tarjeta: numeroTarjeta,
        fecha_expedicion: fechaExpedicion,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const idPago = pagoCreado.id_pago || pagoCreado.id;
    if (!idPago) throw new Error("No se obtuvo el ID del pago.");

    const { data: pedidoCreado } = await axios.post(
      `${BACKEND_URL}/order`,
      {
        id_usuario: usuario.id_usuario,
        total: 0,
        fecha: new Date().toISOString().split("T")[0],
        id_pago: idPago,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const idPedido = pedidoCreado.id_pedido || pedidoCreado.id;
    if (!idPedido) throw new Error("No se obtuvo el ID del pedido.");

    const detalles = productos.map((p) => ({
      id_producto: p.id_producto,
      cantidad: Number(p.cantidad),
      precio_total: Number(p.cantidad) * Number(p.precio),
    }));

    await axios.post(
      `${BACKEND_URL}/orderDetail`,
      {
        id_pedido: idPedido,
        detalles: detalles,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    for (const p of productos) {
      await axios.delete(
        `${BACKEND_URL}/productCarrito/${carrito.id_carrito}/${p.id_producto}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }

    await refrescarProductos();
    Swal.fire("✅ Éxito", "Pago realizado con tarjeta. Pedido creado", "success");
    return navigate("/pedidocli");
  } catch (error) {
    console.error("Error al procesar el pago con tarjeta:", error);
    Swal.fire("❌ Error", "Hubo un problema con el pago con tarjeta", "error");
  }
};

  const fechaHoy = new Date().toISOString().split("T")[0];

  return (
    <Container className="mt-5 d-flex justify-content-center" style={{ maxWidth: "440px" }}>
      <Card className="p-4 shadow-sm" style={{ width: "100%", borderRadius: "16px" }}>
        <h2 className="mb-4 text-center" style={{ fontWeight: "700", letterSpacing: "1.2px", color: "#198754" }}>
          💰 Método de Pago
        </h2>

        <Form>
          <Form.Group className="mb-4">
            <Form.Label style={{ fontWeight: "600" }}>Selecciona un método de pago:</Form.Label>
            <Form.Select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              style={{ padding: "10px", borderRadius: "8px" }}
            >
              <option value="">Seleccionar</option>
              <option value="tarjeta">💳 Tarjeta</option>
              <option value="nequi">📲 Nequi</option>
              <option value="efectivo">💵 Efectivo</option>
            </Form.Select>
          </Form.Group>

          {metodoPago === "tarjeta" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "600" }}>Nombre del titular</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre como aparece en la tarjeta"
                  value={nombreTarjeta}
                  onChange={(e) => setNombreTarjeta(e.target.value)}
                  autoComplete="cc-name"
                  style={{ borderRadius: "8px", padding: "10px", fontSize: "1rem" }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "600" }}>Número de la tarjeta</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="XXXX XXXX XXXX XXXX"
                  value={numeroTarjeta}
                  onChange={(e) => setNumeroTarjeta(e.target.value.replace(/[^\d]/g, ""))}
                  maxLength={16}
                  autoComplete="cc-number"
                  style={{ borderRadius: "8px", padding: "10px", fontSize: "1rem" }}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label style={{ fontWeight: "600" }}>Fecha de expedición</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaExpedicion}
                  onChange={(e) => setFechaExpedicion(e.target.value)}
                  max={fechaHoy}
                  autoComplete="cc-exp"
                  style={{ borderRadius: "8px", padding: "10px", fontSize: "1rem" }}
                />
              </Form.Group>
            </>
          )}

          <Button
            variant="success"
            type="button"
            onClick={handlePago}
            style={{ width: "100%", borderRadius: "50px", fontWeight: "600", fontSize: "1.1rem" }}
          >
            💵 Pagar
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate("/pedidocli")}
            className="mt-3"
            style={{ width: "100%", borderRadius: "50px", fontWeight: "600", fontSize: "1rem" }}
          >
            ⬅️ Regresar
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default PagoCli;
