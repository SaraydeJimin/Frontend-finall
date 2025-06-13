import { Modal, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import Fondo from "../../assets/Imagenes/fondo.avif";
import "./../Inicio/Inicio.css";
import Swal from "sweetalert2";
import BACKEND_URL from "../../routes/backend";

const RegistroForm = ({ show, handleClose, onSesion }) => {
  const [formData, setFormData] = useState({
    documento: '',
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    email: '',
    password: '',
    id_rol: "2",
    mayorEdad: false
  });

  const [errors, setErrors] = useState({
    nombre: false,
    apellido: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "documento" || name === "telefono") {
      if (!/^\d*$/.test(value)) return;
      if (name === "documento" && value.length > 10) return;
      if (name === "telefono" && value.length > 10) return;
    }

    if (name === "nombre" || name === "apellido") {
      setErrors(prev => ({
        ...prev,
        [name]: value.trim().length < 3
      }));
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nombreInvalido = formData.nombre.trim().length < 3;
    const apellidoInvalido = formData.apellido.trim().length < 3;

    setErrors({
      nombre: nombreInvalido,
      apellido: apellidoInvalido
    });

    if (nombreInvalido || apellidoInvalido) return;

    if (!formData.mayorEdad) {
      Swal.fire({
        icon: "warning",
        title: "Confirmación requerida",
        text: "☑️ Debes confirmar que tienes 18 años o más y aceptas la Política de Verificación de Edad.",
      });
      return;
    }

    try {
      const { mayorEdad, ...datosSinMayorEdad } = formData;

      const response = await axios.post(`${BACKEND_URL}/login/register`, datosSinMayorEdad);

      if (response.data.status) {
        const userId = response.data.id_usuario;

        const carritoResponse = await axios.post(`${BACKEND_URL}/carrito`, {
          id_usuario: userId,
          fecha_creacion: new Date().toISOString().slice(0, 19).replace("T", " ")
        });

        Swal.fire({
          title: "¡Registro exitoso!",
          text: carritoResponse.data.message || "Usuario y carrito creados exitosamente",
          icon: "success",
          draggable: true
        }).then((result) => {
          if (result.isConfirmed) {
            handleClose();
            onSesion();
          }
        });
      } else {
        Swal.fire({
          title: "¡Ups!",
          text: response.data.message || "Error al registrar usuario",
          icon: "error",
          draggable: true
        });
      }
    } catch (error) {
      console.error("Error completo:", error);

      let mensaje = "Hubo un error al registrar.";

      const detalles = error.response?.data?.details || [];
      if (detalles.some(msg => msg.includes("email"))) {
        mensaje = "Este correo ya está registrado.";
      } else if (detalles.some(msg => msg.includes("documento"))) {
        mensaje = "Este documento de identidad ya está registrado.";
      } else if (detalles.some(msg => msg.includes("telefono"))) {
        mensaje = "Este número de teléfono ya está registrado.";
      } else if (error.response?.data?.message) {
        mensaje = error.response.data.message;
      }

      Swal.fire({
        title: "¡Ups!",
        text: mensaje,
        icon: "error",
        draggable: true
      });

      console.error("Respuesta con error:", JSON.stringify(error.response?.data, null, 2));
    }
  };

  const limpiarFormulario = () => {
    setFormData({
      documento: '',
      nombre: '',
      apellido: '',
      telefono: '',
      direccion: '',
      email: '',
      password: '',
      id_rol: "2",
      mayorEdad: false
    });

    setErrors({
      nombre: false,
      apellido: false
    });
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Registrarse</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundImage: `url(${Fondo})`, backgroundSize: "cover" }}>
        <Form className='registro' onSubmit={handleSubmit}>

          <Form.Group className="mb-3">
            <Form.Label className='title'>Nombres:</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              isInvalid={errors.nombre}
              required
            />
            <Form.Control.Feedback type="invalid">
              El nombre debe tener al menos 3 letras.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className='title'>Apellidos:</Form.Label>
            <Form.Control
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              isInvalid={errors.apellido}
              required
            />
            <Form.Control.Feedback type="invalid">
              El apellido debe tener al menos 3 letras.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className='title'>Documento:</Form.Label>
            <Form.Control
              type="text"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              pattern="^\d{5,10}$"
              title="Debe contener entre 5 y 10 dígitos numéricos"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className='title'>Número de teléfono</Form.Label>
            <Form.Control
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              pattern="^\d{10}$"
              title="Debe contener exactamente 10 dígitos numéricos"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className='title'>Dirección:</Form.Label>
            <Form.Control
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className='title'>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className='title'>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              pattern="(?=.*\d)(?=.*[a-z]{2,})(?=.*[A-Z]).{5,16}"
              title="Debe incluir una mayúscula, al menos 2 minúsculas, un número y tener entre 5 y 16 caracteres"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="mayorEdad"
              checked={formData.mayorEdad}
              onChange={handleChange}
              label={<span>☑️ Confirmo que tengo 18 años o más y acepto la <a href="/mayores" target="_blank" rel="noopener noreferrer">Política de Verificación de Edad</a>.</span>}
              required
            />
          </Form.Group>

          <div className="text-center">
            <Button type="submit" className="btn btn-primary me-2">Registrarse</Button>
            <Button type="reset" className="btn btn-secondary" onClick={limpiarFormulario}>Limpiar</Button>
          </div>

          <div className="text-center mt-3">
            <Form.Text>¿Ya tienes cuenta?</Form.Text>
            <Button variant="link" onClick={onSesion}>Iniciar sesión</Button>
          </div>

        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RegistroForm;
