import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../../assets/Imagenes/logo.png";
import LogoByte from "../../assets/Imagenes/logo byte.png";


const Privacidad = () => {
  const navigate = useNavigate();

  return (
    <div
      className="container py-5"
      style={{
        maxWidth: "900px",
        fontFamily: "'Poppins', sans-serif",
        color: "#333",
      }}
    >
      {/* Logo principal */}
      <div className="text-center mb-4">
        <img src={Logo} alt="Logo PowerFull Market" style={{ width: 120 }} />
      </div>

      <h1 className="fw-semibold">📋 Políticas de PowerFull Market</h1>
      <section className="mt-4">
        <h4 className="fw-semibold">🔐 Política de Privacidad</h4>
        <p>
            En PowerFull Market, tu privacidad es una prioridad. Esta Política de Privacidad describe cómo recopilamos, 
            usamos, almacenamos y protegemos los datos personales que proporcionas durante tu experiencia en nuestra 
            plataforma de compras simuladas.
          </p>
        <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "2" }}>
          <li>1. 📋 Información que recopilamos</li>
          <p>Durante el proceso de compra, recolección o simulación en nuestro sitio, podemos solicitar 
            y almacenar los siguientes datos:</p>
          <li>- Nombre.</li>
          <li>- Apellido.</li>
          <li>- Número de cédula.</li>
          <li>- Correo electrónico.</li>
          <li>- Contraseña creada por el usuario.</li>
          <li>- Dirección de entrega.</li>
          <li>- Número de teléfono.</li>
          <li>- Método de pago elegido (sin procesar pagos reales).</li>
          <li>- Historial de pedidos realizados.</li>
        </ul>
      </section>
      <section className="mt-4">
        <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "2" }}>
          <li>2. 🎯 Finalidad del uso de datos</li>
          <li>La información recolectada será utilizada exclusivamente para los siguientes fines:</li>
          <li>- Simulación y registro de pedidos en la plataforma.</li>
          <li>- Gestión y trazabilidad de pedidos simulados.</li>
          <li>- Contacto en caso de soporte o validación académica del uso.</li>
          <br>
          </br>
          <li>❌ No se realizarán cobros, ventas reales ni se compartirán los datos con terceros.</li>
        </ul>
      </section>
      <section className="mt-4">
        <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "2" }}>
          <li>3. 🔐 Almacenamiento y seguridad</li>
          <li>- Los datos son almacenados en bases de datos seguras con acceso restringido.</li>
          <li>- Implementamos medidas técnicas y organizativas para proteger tu información 
            frente a accesos no autorizados, pérdidas o alteraciones.</li>
        </ul>
      </section>
      <section className="mt-4">
        <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "2" }}>
          <li>4. 🔁 Tiempo de conservación de los datos</li>
          <p>- Tus datos se conservarán durante el tiempo necesario para los fines educativos o de simulación de la
            plataforma, hasta que el usuario puede eliminar su cuenta en cualquier momento requerido</p>
        </ul>
      </section>
      <section className="mt-4">
        <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "2" }}>
          <li>5. 🧑‍💼 Derechos del usuario</li>
          <li>Como usuario, tienes derecho a:</li>
          <li>- Acceder a tus datos personales almacenados.</li>
          <li>- Rectificar datos incorrectos o desactualizados.</li>
          <li>- Solicitar la eliminación de tus datos de nuestra base.</li>
          <li>- Retirar tu consentimiento para el uso de datos.</li>
          <br></br>
          <li>Puedes ejercer estos derechos escribiéndonos a: powerfullmarket@gmail.com o al WhatsApp +57 3023075008.</li>
        </ul>
      </section>
      <section className="mt-4">
        <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "2" }}>
          <li>6. 📍 Ámbito de aplicación</li>
          <p>- Esta Política de Privacidad aplica a todos los usuarios de nuestra plataforma 
            de supermercado virtual, sin importar el dispositivo o navegador utilizado.</p>
        </ul>
      </section>
      <section className="mt-4">
        <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "2" }}>
          <li>7. ❗Aceptación</li>
          <p>- Al utilizar nuestra plataforma y realizar una compra simulada, aceptas expresamente esta Política de 
            Privacidad y el tratamiento de tus datos conforme a lo aquí establecido.</p>
        </ul>
      </section>
      <br></br>

      <p>Gracias por confiar en PowerFull Market</p>
      {/* Botón volver */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-warning mb-4 fw-bold shadow-sm"
        style={{ borderRadius: "30px" }}
      >
        ⬅️ Volver al inicio
      </button>

      {/* Footer */}
      <footer
        className="mt-5 pt-4 border-top d-flex justify-content-between align-items-center"
        style={{ fontSize: 14, color: "#777" }}
      >
        <span>🌐 Sitio creado con amor por ByteWave</span>
        <img src={LogoByte} alt="Logo PowerFull Market" style={{ width: 120 }} />
      </footer>
    </div>
  );
};

export default Privacidad;