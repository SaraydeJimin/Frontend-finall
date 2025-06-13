import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Table, Spinner, Alert, Container, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BACKEND_URL from "../../routes/backend";

const UsuariosAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroGeneral, setFiltroGeneral] = useState("");

  const navigate = useNavigate();
  const loginEndpoint = `${BACKEND_URL}/login`;
  const token = localStorage.getItem("token");

  const obtenerUsuarios = useCallback(async () => {
    try {
      const res = await axios.get(`${loginEndpoint}/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: { _cacheBust: Date.now() },
      });
      setUsers(res.data.response);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError("❌ Error al cargar los usuarios");
      if (err.response?.status === 401) {
        navigate("/useradmin");
      }
    }
  }, [loginEndpoint, token, navigate]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      obtenerUsuarios();
    }
  }, [token, navigate, obtenerUsuarios]);

  const filteredUsers = users.filter((user) => {
    const filtro = filtroGeneral.toLowerCase();
    return (
      user.documento?.toString().toLowerCase().includes(filtro) ||
      user.nombre?.toLowerCase().includes(filtro) ||
      user.apellido?.toLowerCase().includes(filtro) ||
      user.email?.toLowerCase().includes(filtro) ||
      user.direccion?.toLowerCase().includes(filtro) ||
      user.telefono?.toString().toLowerCase().includes(filtro)
    );
  });

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">👥 Lista de Usuarios</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">🔄 Cargando usuarios...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : (
        <>
          {/* Barra de búsqueda general */}
          <InputGroup className="mb-3">
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              placeholder="Buscar por documento, nombre, apellido, email, dirección o teléfono"
              value={filtroGeneral}
              onChange={(e) => setFiltroGeneral(e.target.value)}
            />
          </InputGroup>

          {/* Tabla */}
          <Table striped bordered hover responsive className="shadow-sm rounded">
            <thead className="table-dark">
              <tr>
                <th>🆔 ID</th>
                <th>🪪 documento</th>
                <th>🧑 nombre</th>
                <th>👤 apellido</th>
                <th>📧 email</th>
                <th>🏠 Dirección</th>
                <th>📞 Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id_usuario}>
                  <td>{user.id_usuario}</td>
                  <td>{user.documento}</td>
                  <td>{user.nombre}</td>
                  <td>{user.apellido}</td>
                  <td>{user.email}</td>
                  <td>{user.direccion}</td>
                  <td>{user.telefono}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default UsuariosAdmin;
