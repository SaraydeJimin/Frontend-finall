import { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card, Offcanvas, ListGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import BACKEND_URL from "../../routes/backend";

const UsuarioCli = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const id_usuario = usuario?.id_usuario;
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const [formData, setFormData] = useState({
    documento: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    direccion: '',
    telefono: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/login/${id_usuario}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { _cacheBust: Date.now() },
        });
        const user = res.data.user || {};
        setFormData({
          documento: user.documento || '',
          nombre: user.nombre || '',
          apellido: user.apellido || '',
          email: user.email || '',
          password: '',
          direccion: user.direccion || '',
          telefono: user.telefono ? user.telefono.toString() : '',
        });
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'No se pudo obtener la información del usuario', 'error');
      }
    };
    if (id_usuario && token) fetchUser();
  }, [id_usuario, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.password.trim()) {
      return Swal.fire('Campo obligatorio', 'Debes ingresar tu contraseña para actualizar', 'warning');
    }
    try {
      await axios.put(`${BACKEND_URL}/login/${id_usuario}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      Swal.fire('✅ Éxito', 'Tus datos fueron actualizados correctamente', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('❌ Error', err?.response?.data?.message || 'No se pudo actualizar el usuario', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleNavigation = (ruta) => navigate(ruta);

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: '⚠️ ¿Estás seguro?',
      text: 'Esta acción eliminará tu cuenta permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${BACKEND_URL}/login/${id_usuario}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.clear();
        Swal.fire('🗑️ Cuenta eliminada', 'Tu cuenta ha sido eliminada', 'success').then(() => {
          window.location.href = '/';
        });
      } catch (err) {
        console.error(err);
        Swal.fire('❌ Error', 'No se pudo eliminar tu cuenta', 'error');
      }
    }
  };

  const handleInfo = () => {
    navigate('/privacidad');
  };

  return (
    <Container
      className="mt-4 p-4"
      style={{
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <Button
          variant="outline-secondary"
          onClick={handleShow}
          style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Configuración"
        >
          ⚙️
        </Button>
      </div>

      <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: '10px' }}>
        <Button variant="outline-secondary" onClick={() => navigate("/inicio")} title="Volver" style={{ fontSize: '1.2rem' }}>
          🔙
        </Button>

        <button
          onClick={handleInfo}
          title="Información"
          style={{
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.3rem',
            cursor: 'pointer',
            lineHeight: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          aria-label="Información"
        >
          i
        </button>
      </div>

      <h2 className="text-center">🛒 Mi cuenta</h2>

      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>⚙️ Configuración</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ListGroup variant="flush">
            <ListGroup.Item action onClick={() => handleNavigation('/usuariocli')}>🧍 Mi cuenta</ListGroup.Item>
            <ListGroup.Item action onClick={() => handleNavigation('/pedidocli')}>📦 Mis pedidos</ListGroup.Item>
            <ListGroup.Item action onClick={() => handleNavigation('/devolucion')}>💸 Política de Devoluciones y Reembolsos</ListGroup.Item>
            <ListGroup.Item action onClick={() => handleNavigation('/mayores')}>🔞 Política para Mayores de Edad</ListGroup.Item>
            <ListGroup.Item action onClick={() => handleNavigation('/privacidad')}>🔐 Política de Privacidad</ListGroup.Item>
            <ListGroup.Item action onClick={() => navigate("/inicio")}>🔙 Volver</ListGroup.Item>
            <ListGroup.Item action onClick={handleLogout}>🔓 Cerrar sesión</ListGroup.Item>
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>

      <Row>
        <Col md={5}>
          <Card style={{ borderRadius: '12px', backgroundColor: '#f8f9fa' }}>
            <Card.Header style={{ fontWeight: 'bold', fontSize: '1.2rem', backgroundColor: '#e9ecef', borderRadius: '12px 12px 0 0' }}>
              📋 Datos actuales
            </Card.Header>
            <Card.Body style={{ fontSize: '1rem', lineHeight: '1.6' }}>
              <p>🆔 <strong>Documento:</strong> {formData.documento || '-'}</p>
              <p>👤 <strong>Nombre:</strong> {formData.nombre || '-'}</p>
              <p>🧑‍🤝‍🧑 <strong>Apellido:</strong> {formData.apellido || '-'}</p>
              <p>📧 <strong>Email:</strong> {formData.email || '-'}</p>
              <p>🏠 <strong>Dirección:</strong> {formData.direccion || '-'}</p>
              <p>📞 <strong>Teléfono:</strong> {formData.telefono || '-'}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={7}>
          <Card style={{ borderRadius: '12px' }}>
            <Card.Header style={{ fontWeight: 'bold', fontSize: '1.2rem', backgroundColor: '#e9ecef', borderRadius: '12px 12px 0 0' }}>
              ✍️ Actualizar datos
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleUpdate}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="documento">
                      <Form.Label>🆔 Documento</Form.Label>
                      <Form.Control
                        type="text"
                        name="documento"
                        value={formData.documento}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="nombre">
                      <Form.Label>👤 Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="apellido">
                      <Form.Label>🧑‍🤝‍🧑 Apellido</Form.Label>
                      <Form.Control
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>📧 Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label>🔒 Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Nueva contraseña"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="direccion">
                      <Form.Label>🏠 Dirección</Form.Label>
                      <Form.Control
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="telefono">
                      <Form.Label>📞 Teléfono</Form.Label>
                      <Form.Control
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-between mt-3">
                  <Button variant="success" type="submit" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    💾 Guardar cambios
                  </Button>

                  <Button variant="danger" onClick={handleDelete} style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    🗑️ Eliminar cuenta
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UsuarioCli;
