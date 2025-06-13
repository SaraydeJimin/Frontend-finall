import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Fondo from "../../assets/Imagenes/fondo.avif";
import "./../Inicio/Inicio.css";
import axios from 'axios';
import Swal from 'sweetalert2';
import BACKEND_URL from "../../routes/backend";

const Sesion = ({ show, handleClose, onRegistro }) => {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BACKEND_URL}/login`, {
        email,
        password: contraseña,
      });

      if (response.data.status) {
        const token = response.data.access_token;
        const usuario = response.data.user;

        localStorage.setItem("usuario", JSON.stringify(usuario));
        localStorage.setItem("token", token);

        Swal.fire({
          icon: 'success',
          title: '¡Inicio de sesión exitoso!',
          showConfirmButton: false,
          timer: 1000
        });

        handleClose();

        setTimeout(() => {
          if (usuario.id_rol === 1 || usuario.admin) {
            window.location.href = `/admin/${usuario.id_usuario}`;
          } else {
            window.location.href = "/";
          }
        }, 2000);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: response.data.message || 'Error de autenticación'
        });
      }
    } catch (error) {
      console.error("Error en el login:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al iniciar sesión'
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Iniciar Sesión</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundImage: `url(${Fondo})`, backgroundSize: "cover" }}>
        <Form className='conteiner' onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label className='title'>Correo Electrónico:</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ej. usuario@ejemplo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label className='title'>Contraseña:</Form.Label>
            <Form.Control
              type="password"
              required
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
            />
          </Form.Group>

          <div className="text-center">
            <Button type="submit" className="btn btn-primary me-2">Ingresar</Button>
            <Button type="reset" className="btn btn-secondary">Limpiar</Button>
          </div>

          <div className="text-center mt-3">
            <Form.Text className="ayuda">¿No tienes cuenta?</Form.Text>
            <Button variant="link" onClick={onRegistro}>Crear cuenta</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Sesion;
