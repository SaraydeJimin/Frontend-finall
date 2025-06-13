import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button, Modal, Form, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import BACKEND_URL from "../../routes/backend";

const CatalogosAdmin = () => {
  const [catalogos, setCatalogos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre: "", descripcion: "" });
  const [errors, setErrors] = useState({});
  const [busqueda, setBusqueda] = useState("");
  const [ordenAscendente, setOrdenAscendente] = useState(true);

  const navigate = useNavigate();
  const catalog = `${BACKEND_URL}/catalog`;
  const token = localStorage.getItem("token");

  const obtenerCatalogos = useCallback(async () => {
    try {
      const res = await axios.get(`${catalog}/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { _cacheBust: Date.now() },
      });
      setCatalogos(res.data.response);
    } catch (err) {
      console.error("Error al obtener catálogos:", err);
      Swal.fire("Oops...", "Error al cargar los catálogos", "error");
      if (err.response?.status === 401) navigate("/catalogo");
    }
  }, [catalog, token, navigate]);

  useEffect(() => {
    if (!token) {
      navigate("/catalogo");
    } else {
      obtenerCatalogos();
    }
  }, [token, navigate, obtenerCatalogos]);

  const abrirModal = (cat = null) => {
    setEditando(cat);
    setForm(cat ? {
      nombre: cat.nombre,
      descripcion: cat.descripcion,
    } : { nombre: "", descripcion: "" });
    setErrors({});
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditando(null);
    setForm({ nombre: "", descripcion: "" });
    setErrors({});
  };

  const manejarCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const validarFormulario = async () => {
    const errs = {};
    if (!form.nombre.trim()) {
      errs.nombre = "El nombre es obligatorio";
    } else if (form.nombre.trim().length < 3) {
      errs.nombre = "El nombre debe tener al menos 3 caracteres";
    } else {
      try {
        const res = await axios.get(`${catalog}/search/${form.nombre.trim()}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { nombre: form.nombre.trim() },
        });

        const existe = res.data.response && res.data.response.length > 0;

        if (
          existe &&
          (!editando || (editando.nombre.toLowerCase() !== form.nombre.trim().toLowerCase()))
        ) {
          errs.nombre = "Ya existe un catálogo con ese nombre";
        }
      } catch (err) {
        console.error("Error validando nombre:", err);
        Swal.fire("Error", "No se pudo validar el nombre, intenta de nuevo", "error");
      }
    }

    if (form.descripcion && form.descripcion.length > 250) {
      errs.descripcion = "La descripción no puede superar los 250 caracteres";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const guardarCatalogo = async () => {
    const esValido = await validarFormulario();
    if (!esValido) return;

    try {
      const data = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
      };

      if (editando) {
        const res = await axios.put(`${catalog}/catalog/${editando.id_catalogo}`, data, {
          headers: { Authorization: `Bearer ${token}` },
          params: { _cacheBust: Date.now() },
        });

        if (res.data.error) throw new Error(res.data.error);

        Swal.fire("✅ Actualizado", "El catálogo ha sido actualizado", "success");
      } else {
        const res = await axios.post(catalog, data, {
          headers: { Authorization: `Bearer ${token}` },
          params: { _cacheBust: Date.now() },
        });

        if (res.data.error) throw new Error(res.data.error);

        Swal.fire("📦 Creado", "El catálogo ha sido agregado", "success");
      }

      cerrarModal();
      obtenerCatalogos();
    } catch (err) {
      console.error("Error al guardar catálogo:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || err.message,
      });
    }
  };

  const eliminarCatalogo = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro? 😱",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminarlo",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${catalog}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: { _cacheBust: Date.now() },
        });
        Swal.fire("🗑️ Eliminado", "El catálogo ha sido eliminado.", "success");
        obtenerCatalogos();
      } catch (err) {
        console.error("Error al eliminar catálogo:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.error || err.message,
        });
      }
    }
  };

  const catalogosFiltradosYOrdenados = catalogos
    .filter((cat) => {
      const busq = busqueda.toLowerCase().trim();
      const idStr = String(cat.id_catalogo || "").toLowerCase();
      const nombreStr = (cat.nombre || "").toLowerCase();
      const descStr = (cat.descripcion || "").toLowerCase();
      return (
        idStr.includes(busq) ||
        nombreStr.includes(busq) ||
        descStr.includes(busq)
      );
    })
    .sort((a, b) => {
      const nombreA = (a.nombre || "").toLowerCase();
      const nombreB = (b.nombre || "").toLowerCase();
      if (nombreA < nombreB) return ordenAscendente ? -1 : 1;
      if (nombreA > nombreB) return ordenAscendente ? 1 : -1;
      return 0;
    });

  return (
    <div className="container mt-4">
      <h2>📚 Gestión de Catálogos</h2>
      {/* Buscador */}
      <div className="d-flex mb-3 gap-2 ms-4 flex-wrap align-items-center">
        <Form.Control
          type="text"
          placeholder="Buscar por ID, Nombre o Descripción..."
          style={{ maxWidth: "400px" }}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <Form.Select
          value={ordenAscendente ? "asc" : "desc"}
          onChange={(e) => setOrdenAscendente(e.target.value === "asc")}
          style={{ maxWidth: "150px" }}
        >
          <option value="asc">Orden A → Z</option>
          <option value="desc">Orden Z → A</option>
        </Form.Select>
        <Button className="ms-auto" style={{ width: "200px" }} onClick={() => abrirModal()}>
          ➕ Agregar Catálogo
        </Button>
      </div>

      <Table striped bordered hover>
        <thead className="table-dark">
          <tr>
            <th style={{ width: "10%" }}>🆔 ID</th>
            <th style={{ width: "25%" }}>📘 Nombre</th>
            <th>📝 Descripción</th>
            <th style={{ width: "350px" }}>⚙️ Acciones</th>
          </tr>
        </thead>
        <tbody>
          {catalogosFiltradosYOrdenados.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center">
                No se encontraron catálogos que coincidan con la búsqueda.
              </td>
            </tr>
          ) : (
            catalogosFiltradosYOrdenados.map((cat) => (
              <tr key={cat.id_catalogo}>
                <td style={{ textAlign: "center" }}>{cat.id_catalogo}</td>
                <td>{cat.nombre}</td>
                <td>{cat.descripcion}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => abrirModal(cat)}
                    className="me-2"
                  >
                    ✏️ Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => eliminarCatalogo(cat.id_catalogo)}
                  >
                    🗑️ Eliminar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editando ? "✏️ Editar" : "➕ Nuevo"} Catálogo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="nombre" className="mb-3">
              <Form.Label>📘 Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={manejarCambio}
                isInvalid={!!errors.nombre}
                required
              />
              <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="descripcion">
              <Form.Label>📝 Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="descripcion"
                rows={3}
                value={form.descripcion}
                onChange={manejarCambio}
                isInvalid={!!errors.descripcion}
                maxLength={250}
              />
              <Form.Text muted>Máximo 250 caracteres</Form.Text>
              <Form.Control.Feedback type="invalid">{errors.descripcion}</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>Cancelar</Button>
          <Button variant="primary" onClick={guardarCatalogo}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CatalogosAdmin;