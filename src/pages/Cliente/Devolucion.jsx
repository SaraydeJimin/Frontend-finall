import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../../assets/Imagenes/logo.png";
import LogoByte from "../../assets/Imagenes/logo byte.png";


const Devolucion = () => {
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
        <h4 className="fw-semibold">💸 Devoluciones y Reembolsos</h4>
        <p>
            En PowerFull Market, nos comprometemos a ofrecer productos frescos, de calidad y un servicio confiable. 
            Sabemos que pueden surgir imprevistos, por eso te explicamos nuestras políticas de devoluciones y reembolsos.
          </p>
        <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "2" }}>
          <li>1. 🥕 Productos no elegibles para devolución</li>
          <li>Por tratarse de productos perecederos y de consumo inmediato, NO aceptamos devoluciones de:</li>
          <li>- Alimentos frescos (lácteos).</li>
          <li>- Productos refrigerados o congelados.</li>
          <li>- Productos que hayan sido abiertos o manipulados.</li>
          <li>- Artículos que no se encuentren en su empaque original o presenten signos de uso.</li>
        </ul>
      </section>
      <section className="mt-4">
        <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "2" }}>
          <li>2. 📦 Productos elegibles para reembolso o reposición</li>
          <li>Solo se harán devoluciones o reembolsos en los siguientes casos:</li>
          <li>- El producto recibido está vencido o en mal estado.</li>
          <li>- El producto no corresponde al solicitado (error en el pedido).</li>
          <li>- El empaque llegó dañado de forma significativa.</li>
          <li>- Faltan productos en la entrega.</li>
        </ul>
      </section>
      <section className="mt-4">
        <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "2" }}>
          <li>3. 🕒 Plazo para solicitar devolución o reembolso</li>
          <p>- Tienes un máximo de 48 horas desde la recepción del pedido para reportar cualquier novedad. 
            Después de este plazo, no se aceptan solicitudes por temas de conservación y trazabilidad de los productos.</p>
        </ul>
      </section>
      <section className="mt-4">
        <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "2" }}>
          <li>4. 📝 ¿Cómo solicitar un reembolso?</li>
          <li>Envía un correo a powerfullmarket@gmail.com o al WhatsApp +57 3023075008.</li>
          <li>Adjunta:</li>
          <li>- Número del pedido.</li>
          <li>- Foto(s) del producto afectado.</li>
          <li>- Breve descripción del problema.</li>
          <li>- Nuestro equipo te responderá en un plazo máximo de 48 horas hábiles con la solución.</li>
        </ul>
      </section>
      <section className="mt-4">
        <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "2" }}>
          <li>5. 💳 Método de reembolso</li>
          <li>Los reembolsos se realizan por el mismo medio de pago utilizado en la compra:</li>
          <li>- Tarjeta de crédito/débito: entre 5 y 10 días hábiles, dependiendo del banco.</li>
          <li>- Transferencia bancaria o PSE: hasta 5 días hábiles.</li>
          <li>- Pago en efectivo (contraentrega): se ofrece un bono o transferencia con autorización del cliente.</li>
        </ul>
      </section>
      <section className="mt-4">
        <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "2" }}>
          <li>6. 🛡️ Garantía de satisfacción</li>
          <p>- Tu confianza es lo más importante. Si tu experiencia no fue la esperada, queremos saberlo. 
            Nuestro equipo de atención al cliente está para ayudarte y buscar la mejor solución posible.</p>
        </ul>
      </section>
      <section className="mt-4">
        <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "2" }}>
          <li>7. 📌 Consideraciones finales</li>
          <li>- Nos reservamos el derecho de rechazar solicitudes que no cumplan con esta política</li>
          <li>Esta política puede cambiar sin previo aviso. Siempre estará publicada la versión más actual 
            en nuestro sitio web.</li>
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

export default Devolucion;