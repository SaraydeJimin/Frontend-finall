import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Logo from "../../assets/Imagenes/logo_sin_letra.png";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';


const Footer = () => {
    return(
    <>
<footer className="footer text-center">
<div className="contact-details">
  <div className="contact-item">
  <a href="https://es-la.facebook.com/login/device-based/regular/login/" className="me-2">
    <LocationOnIcon style={{ width: "50px", height: "40px", color: "white", marginTop: "-20px" }} />
  </a>
    <p className="address">
      <strong>Dirección:</strong> Calle 114 a sur #7-53
    </p>
  </div>
  <div className="contact-item">
  <a href="https://es-la.facebook.com/login/device-based/regular/login/" className="me-2">
    <PhoneIcon style={{ width: "50px", height: "40px", color: "white", marginTop: "-20px" }} />
  </a>
    <p className="phone">
      <strong>Número de Teléfono:</strong> 3023075008
    </p>
  </div>
</div>
<div className="social-container"> 
  <div className="social-icons">
  <a href="https://es-la.facebook.com/login/device-based/regular/login/" className="me-2">
    <FacebookIcon style={{ marginLeft: "200px",width: "50px", height: "40px", color: "white", marginTop: "-20px" }} />
  </a>
  <a href="https://www.instagram.com/" className="me-2">
    <InstagramIcon style={{ width: "50px", height: "40px", color: "white", marginTop: "-20px" }} />
  </a>
  <a href="https://web.whatsapp.com/" className="me-2">
    <WhatsAppIcon style={{  width: "50px", height: "40px", color: "white", marginTop: "-20px" }} />
  </a>
  </div>
</div>
<div className="mb-4">
    <a><img src={Logo} alt="Logo" style={{ width: "200px", height: "180px", color: "white", marginTop: "30px" }} /></a>
</div>
</footer>
</>
);
};

export default Footer;