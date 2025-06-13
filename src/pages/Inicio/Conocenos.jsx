import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../../assets/Imagenes/logo.png";
import LogoByte from "../../assets/Imagenes/logo byte.png";


const Conocenos = () => {
  const navigate = useNavigate();

  const Privacidad = () =>{
    navigate ("/privacidad");
  };

  const Devolucion = () =>{
    navigate ("/devolucion");
  };

  const Mayores = () =>{
    navigate ("/mayores");
  };

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

      <h1 className="text-center mb-4 fw-bold" style={{ color: "#2c3e50" }}>
        🛍️ PowerFull Market
      </h1>

      <p className="fs-5 text-muted text-center">
        ¡Bienvenido a tu supermercado virtual de confianza! 🥦🧃🛒
      </p>

      <section className="mt-5">
        <h4 className="fw-semibold">👋 ¿Quiénes somos?</h4>
        <p>
          Desde 2017, en <strong>PowerFull Market</strong> ayudamos a que tus compras lleguen
          con amor y eficiencia hasta la puerta de tu casa. Fundado por Alonso Rodríguez,
          este sueño nació para simplificarte la vida.
        </p>
      </section>

      <section className="mt-4">
        <h4 className="fw-semibold">🎯 Nuestra misión</h4>
        <p>
          Brindar una experiencia de compra virtual confiable, amigable y responsable 🌱.
          Apoyamos a los productores locales y cuidamos cada detalle de tu pedido 🍎📦.
        </p>
      </section>

      <section className="mt-4">
        <h4 className="fw-semibold">🚀 Nuestra visión</h4>
        <p>
          Queremos liderar el mundo de los pedidos virtuales en Latinoamérica, con un
          servicio rápido, cálido y humano ❤️🌍.
        </p>
      </section>

      <section className="mt-4">
        <h4 className="fw-semibold">💡 Nuestros valores</h4>
        <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "2" }}>
          <li>💚 Compromiso contigo</li>
          <li>⚡ Rapidez en entregas</li>
          <li>🏘️ Apoyo a lo local</li>
          <li>🔐 Seguridad total</li>
          <li>🌿 Respeto por el planeta</li>
        </ul>
      </section>

      <section className="mt-4">
        <h4 className="fw-semibold">🍽️ Compromiso social</h4>
        <p>
          Parte de nuestras ganancias se destinan a apoyar programas de alimentación para
          familias en situación vulnerable. ¡Juntos marcamos la diferencia! 🤝💛
        </p>
      </section>

      <section className="mt-5">
        <h4 className="fw-semibold">📋 Políticas de PowerFull Market</h4>
        <div className="d-flex flex-wrap gap-3 mt-3">
          <a onClick={Privacidad} className="btn btn-outline-primary rounded-pill fw-bold">
            🔐 Privacidad
          </a>
          <a onClick={Devolucion} className="btn btn-outline-success rounded-pill fw-bold">
            💸 Devolución
          </a>
          <a onClick={Mayores} className="btn btn-outline-danger rounded-pill fw-bold">
            🔞 +18
          </a>
        </div>

        <div id="privacidad" className="mt-4">
          <h5>🔐 Política de Privacidad</h5>
          <p>
            Tu información está segura con nosotros 🛡️. Solo la usamos para entregarte los pedidos
            y mejorar el servicio. Sin excepciones.
          </p>
        </div>

        <div id="devolucion" className="mt-4">
          <h5>💸 Devoluciones y Reembolsos</h5>
          <p>
            Si algo no llegó como esperabas 😟, puedes solicitar devolución dentro de las 48 horas.
            ¡Te lo solucionamos con gusto!
          </p>
        </div>

        <div id="mayores" className="mt-4">
          <h5>🔞 Política para Mayores de Edad</h5>
          <p>
            Esta plataforma es solo para personas mayores de 18 años 🧑‍🦳. Al comprar, declaras
            que cumples con esta condición.
          </p>
        </div>
      </section>

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

export default Conocenos;
