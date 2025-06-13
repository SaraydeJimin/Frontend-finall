import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../../assets/Imagenes/logo.png";
import LogoByte from "../../assets/Imagenes/logo byte.png";


const Mayores = () => {
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
        <h4 className="fw-semibold">🔞 Política para Mayores de Edad</h4>
        <p>
            Con el fin de garantizar el cumplimiento de la normativa vigente y proteger tanto al cliente como a la empresa, 
            en PowerFull Market aplicamos las siguientes condiciones para compras que incluyan productos 
            restringidos para mayores de edad.
          </p>
        <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "2" }}>
          <li>1. 🆔 Verificación de mayoría de edad</li>
          <li>Para completar una compra en la plataforma, el usuario debe obligatoriamente:</li>
          <li>- Ingresar su número de cédula al momento de registrarse por primera vez en nuestra web.</li>
          <li>- Confirmar que tiene 18 años o más.</li>
          <li>- Aceptar que esta información será almacenada como parte del registro del pedido.</li>
        </ul>
      </section>
      <section className="mt-4">
        <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "2" }}>
          <li>2. ⚠️ Uso exclusivo por mayores de edad</li>
          <li>Este sitio web y su sistema de pedidos están dirigidos únicamente a personas mayores de 18 años.</li>
          <li>- El uso por menores de edad no está permitido, incluso si se trata de simulaciones o pruebas académicas.</li>
          <li>- El producto no corresponde al solicitado (error en el pedido).</li>
          <li>- El usuario es responsable de la veracidad de la información ingresada.</li>
        </ul>
      </section>
      <section className="mt-4">
        <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "2" }}>
          <li>3. 💳 Selección de método de pago(simulación)</li>
          <li>Aunque el sistema simula compras, el usuario deberá seleccionar un método 
            de pago para completar la experiencia, eligiendo entre:</li>
          <li>- Tarjeta de crédito/débito</li>
          <li>- Nequi</li>
          <li>- Efectivo</li>
          <br></br>
          <li>No se realizará ningún cobro real; sin embargo, este paso es obligatorio para el flujo de compra.</li>
        </ul>
      </section>
      <section className="mt-4">
        <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "2" }}>
          <li>4. 🔐 Almacenamiento y protección de datos</li>
          <li>- La cédula y los datos proporcionados durante el proceso de compra serán almacenados con 
            fines educativos y de trazabilidad de la simulación.</li>
          <li>- No se compartirán con terceros.</li>
          <p>- El usuario puede eliminar su cuenta en cualquier momento requerido</p>
        </ul>
      </section>
      <section className="mt-4">
        <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "2" }}>
          <li>5. 🚫 Suplantación y falsedad</li>
          <p>- En caso de detectar información falsa o el uso del sistema por 
            menores de edad, la cuenta será bloqueada y el pedido simulado anulado.</p>
        </ul>
      </section>
      <section className="mt-4">
        <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "2" }}>
          <li>✅ Aceptación de términos</li>
          <li>Al hacer clic en “Finalizar pedido”, el usuario declara bajo gravedad de juramento que:</li>
          <li>- Tiene 18 años o más.</li>
          <li>- La información ingresada es verídica.</li>
          <li>- Acepta esta política en su totalidad.</li>
          <li>- Breve descripción del problema.</li>
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

export default Mayores;