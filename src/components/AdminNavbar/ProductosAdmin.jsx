import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button, Modal, Form, Table, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import BACKEND_URL from "../../routes/backend";

const ProductosAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [catalogos, setCatalogos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [orden, setOrden] = useState("desc");
  const [filtro, setFiltro] = useState("");
  const [formData, setFormData] = useState({
    id_catalogo: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
    id_producto: null,
  });

  const backendURL = `${BACKEND_URL}/products`;
  const backendCatalogosURL = `${BACKEND_URL}/catalog`;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const obtenerProductos = useCallback(async () => {
    if (!token) return navigate("/productosadmin");
    try {
      const res = await axios.get(`${backendURL}/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { _cacheBust: Date.now() },
      });
      setProductos(res.data.response);
    } catch (err) {
      console.error(err);
      Swal.fire("❌ Error", "No se pudieron obtener los productos", "error");
    }
  }, [token, navigate]);

  const obtenerCatalogos = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${backendCatalogosURL}/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { _cacheBust: Date.now() },
      });
      setCatalogos(res.data.response);
    } catch (err) {
      console.error(err);
      Swal.fire("❌ Error", "No se pudieron obtener los catálogos", "error");
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/productosadmin");
    } else {
      obtenerProductos();
      obtenerCatalogos();
    }
  }, [token, navigate, obtenerProductos, obtenerCatalogos]);

  const [errors, setErrors] = useState({
    id_catalogo: false,
    name: false,
    description: false,
    price: false,
    stock: false,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const newValue = files ? files[0] : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    if (name === "name" || name === "description") {
      setErrors((prev) => ({
        ...prev,
        [name]: newValue.trim().length < 3,
      }));
    }
    if (name === "price" || name === "stock") {
      setErrors((prev) => ({
        ...prev,
        [name]: newValue.trim() === "",
      }));
    }
    if (name === "id_catalogo") {
      setErrors((prev) => ({
        ...prev,
        [name]: newValue.trim() === "",
      }));
    }
  };

  // Función para crear producto (POST)
  const crearProducto = async () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "image" && !value) return;
      if (["price", "stock", "id_catalogo"].includes(key)) {
        data.append(key, value ? String(value) : "0");
      } else if (key === "id_producto") {
        // No enviar id_producto para crear
      } else {
        data.append(key, value ?? "");
      }
    });
    try {
      await axios.post(backendURL, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      await obtenerProductos();
      setShowModal(false);
      resetForm();
      Swal.fire({
        icon: "success",
        title: "Producto creado",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
  console.error("🔥 ERROR DETECTADO:", err.response?.data || err);
  const mensaje = err.response?.data?.message || err.response?.data?.error || "No se pudo crear el producto";
  Swal.fire("❌ Error", mensaje, "error");
}

  };

  const productosOrdenados = [...productos].sort((a, b) => {
  if (orden === "asc") {
    return a.id_producto- b.id_producto;  // Más antiguo primero
  } else {
    return b.id_producto - a.id_producto;  // Más nuevo primero
  }
});

const productosFiltrados = productosOrdenados.filter((p) => {
  const texto = filtro.toLowerCase();
  return (
    p.id_producto?.toString().includes(texto) ||
    p.nombre?.toLowerCase().includes(texto) ||
    p.descripcion?.toLowerCase().includes(texto) ||
    p.precio?.toString().includes(texto) ||
    p.stock?.toString().includes(texto) ||
    p.nombre_catalogo?.toLowerCase().includes(texto)
  );
});

  // Función para actualizar producto (PUT)
  const actualizarProducto = async () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "image" && !value) return;
      if (["price", "stock", "id_catalogo"].includes(key)) {
        data.append(key, value ? String(value) : "0");
      } else if (key === "id_producto") {
        // No enviar id_producto en el body, solo en la URL
      } else {
        data.append(key, value ?? "");
      }
    });
    try {
      await axios.put(`${backendURL}/${formData.id_producto}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      await obtenerProductos();
      setShowModal(false);
      resetForm();
      Swal.fire({
        icon: "success",
        title: "Producto actualizado",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error(err.response?.data || err);
      Swal.fire("❌ Error", "No se pudo actualizar el producto", "error");
    }
  };

  const handleSubmit = async () => {
    const { name, description, price, stock, id_catalogo } = formData;

    // Validar campos
    const nuevosErrores = {
      id_catalogo: id_catalogo === "",
      name: name.trim().length < 3,
      description: description.trim().length < 3,
      price: price === "",
      stock: stock === "",
    };

    setErrors(nuevosErrores);

    const tieneErrores = Object.values(nuevosErrores).some(Boolean);
    if (tieneErrores || !id_catalogo) {
      Swal.fire("❌ Error", "Por favor completa todos los campos correctamente", "error");
      return;
    }
    // Validar nombre repetido
    const nombreFormateado = name.trim().toLowerCase();
    const nombreRepetido = productos.some(
      (p) =>
        p.nombre.trim().toLowerCase() === nombreFormateado &&
        (!editando || p.id_producto !== formData.id_producto)
    );
    if (nombreRepetido) {
      Swal.fire("❌ Error", "Ya existe un producto con ese nombre", "error");
      return;
    }
    if (editando) {
      await actualizarProducto();
    } else {
      await crearProducto();
    }
  };

  const resetForm = () => {
    setFormData({
      id_catalogo: "",
      name: "",
      description: "",
      price: "",
      stock: "",
      image: null,
      id_producto: null,
    });
    setEditando(false);
  };

  const handleEditar = (producto) => {
    setFormData({
      id_catalogo: producto.id_catalogo || "",
      name: producto.nombre || "",
      description: producto.descripcion || "",
      price: producto.precio != null ? producto.precio : "",
      stock: producto.stock != null ? producto.stock : "",
      image: null,
      id_producto: producto.id_producto,
    });
    setEditando(true);
    setShowModal(true);
  };

  const handleEliminar = async (id_producto) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${backendURL}/${id_producto}`, {
          headers: { Authorization: `Bearer ${token}` },
           data: {},
        });
        await obtenerProductos();
        Swal.fire("✅ Eliminado", "El producto ha sido eliminado", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("❌ Error", "No se pudo eliminar el producto", "error");
      }
    }
  };

  return (
  <div className="d-flex justify-content-between align-items-center gap-3 mb-3 flex-wrap">
  <Form.Control
    type="text"
    placeholder="🔍 Buscar por ID, nombre, descripción, precio, stock o catálogo"
    value={filtro}
    onChange={(e) => setFiltro(e.target.value)}
    style={{ maxWidth: "300px" }}
  />

  <Form.Select
    value={orden}
    onChange={(e) => setOrden(e.target.value)}
    style={{ maxWidth: "250px" }}
  >
    <option value="desc">🆕 Más nuevos primero</option>
    <option value="asc">📦 Más antiguos primero</option>
  </Form.Select>

  <Button
    variant="outline-success"
    style={{ maxWidth: "330px" }}
    onClick={() => {
      setEditando(false);
      setFormData({
        id_catalogo: "",
        name: "",
        description: "",
        price: "",
        stock: "",
        image: null,
      });
      setShowModal(true);
    }}
  >
    ➕ Agregar nuevo producto
  </Button>

      <Table bordered hover responsive className="text-center shadow-sm">
        <thead className="table-dark" style={{ width: "90vw" }}>
          <tr>
            <th style={{ width: "10px" }}>🆔 ID Producto</th>
            <th>📦 nombre</th>
            <th style={{ width: "330px" }}>📝 Descripción</th>
            <th style={{ width: "100px" }}>🖼️ imagen</th>
            <th style={{ width: "100px" }}>💰 precio</th>
            <th style={{ width: "10px" }}>📊 stock</th>
            <th>🗂️ Catálogo</th>
            <th style={{ width: "400px" }}>⚙️ Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((p) => (
            <tr key={p.id_producto}>
              <td>{p.id_producto}</td>
              <td>{p.nombre}</td>
              <td>{p.descripcion}</td>
              <td>
                {p.imagen ? (
                  <Image src={p.imagen} width={60} height={60} rounded />
                ) : (
                  "No hay"
                )}
              </td>
              <td>${p.precio}</td>
              <td>{p.stock}</td>
              <td>{p.nombre_catalogo}</td>
              <td>
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => handleEditar(p)}
                >
                  ✏️
                </Button>{" "}
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleEliminar(p.id_producto)}
                >
                  🗑️
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editando ? "✏️ Editar Producto" : "➕ Nuevo Producto"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Catálogo</Form.Label>
              <Form.Select
                name="id_catalogo"
                value={formData.id_catalogo}
                isInvalid={errors.id_catalogo}
                onChange={handleChange}
              >
                <option value="">Selecciona un catálogo</option>
                {catalogos.map((c) => (
                  <option key={c.id_catalogo} value={c.id_catalogo}>
                    {c.nombre_catalogo || c.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                isInvalid={errors.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formData.description}
                isInvalid={errors.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>precio</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                isInvalid={errors.price}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                isInvalid={errors.stock}
                min="0"
                step="1"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>imagen (solo si quieres cambiarla)</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
              />
              {editando && productos.find(p => p.id_producto === formData.id_producto)?.imagen && (
                <div className="mt-2">
                  imagen actual:{" "}
                  <Image
                    src={productos.find(p => p.id_producto === formData.id_producto).imagen}
                    width={80}
                    height={80}
                    rounded
                  />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductosAdmin;
