import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from 'react-router-dom';
import "./Inicio.css";
import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Banner1 from '../../assets/Imagenes/banner1.avif';
import Banner2 from '../../assets/Imagenes/banner2.avif';
import Banner3 from '../../assets/Imagenes/banner3.avif';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Card1 from '../../assets/Imagenes/card1.jpg';
import Card2 from '../../assets/Imagenes/card2.jpg';
import Card3 from '../../assets/Imagenes/card3.jpg';
import Logo from "../../assets/Imagenes/logo.png";
import PixelTransition from './Logo';
import Footer from "./Footer";
import RollingGallery from './Cartas';
import { NavBar } from '../../components/Navbar/Navbar';

const PowerFullMarket = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => setIndex(selectedIndex);
  const Catalogo = () => navigate("/catalogocli");

  return (
    <>
      <NavBar />

      {/* Carrusel principal */}
      <main className="content mt-3 mb-5">
        <div className="container">
          <Carousel activeIndex={index} onSelect={handleSelect} className="rounded overflow-hidden">
            <Carousel.Item>
              <img src={Banner1} alt="Verduras" className="d-block w-100 carousel-img" />
              <Carousel.Caption>
                <h3>Verduras</h3>
                <p>En nuestro supermercado cuidamos tu salud.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img src={Banner2} alt="Precios accesibles" className="d-block w-100 carousel-img" />
              <Carousel.Caption>
                <h3>Precios accesibles</h3>
                <p>También cuidamos tu bolsillo.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img src={Banner3} alt="Economía" className="d-block w-100 carousel-img" />
              <Carousel.Caption>
                <h3>Para mayor economía</h3>
                <p>Todo en nuestro maravilloso supermercado.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
      </main>

      {/* Carrusel de cartas animadas */}
      <section className="mb-5">
        <RollingGallery autoplay={true} pauseOnHover={true} />
      </section>

      {/* Tarjetas de categorías */}
      <section id="catalogo" className="container mb-5">
        <div className="d-flex justify-content-center gap-4 flex-wrap">
          {[Card1, Card2, Card3].map((img, idx) => (
            <Card key={idx} style={{ width: '18rem' }} className="card-color shadow-sm">
              <Card.Img variant="top" src={img} />
              <Card.Body>
                <Card.Title>Cereales</Card.Title>
                <Card.Text>Todo tipo de alimento a tu alcance</Card.Text>
                <Button variant="primary" onClick={Catalogo}>Ver más</Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </section>

      {/* PixelTransition Logo e Información */}
      <section className="content mb-5">
        <div className="container logo-container">
          <PixelTransition
            firstContent={
              <img
                src={Logo}
                alt="Logo"
                className="logo img-fluid"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            }
            secondContent={
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "grid",
                  placeItems: "center",
                  backgroundColor: "white"
                }}
              >
                <p style={{
                  fontWeight: 900,
                  fontSize: "1rem",
                  color: "#607D8B",
                  textAlign: "center"
                }}>
                  Facilitar la transformación digital y mejorar la eficiencia mediante soluciones
                  de software innovadoras. Impulsando su éxito a través de la tecnología...
                </p>
              </div>
            }
            gridSize={15}
            pixelColor='#009688'
            animationStepDuration={0.4}
            className="custom-pixel-card"
          />
        </div>
      </section>

      <Footer />
    </>
  );
};

export default PowerFullMarket;
