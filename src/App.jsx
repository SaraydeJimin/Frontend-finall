// App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PowerFullMarket from './pages/Inicio/Inicio';
import NavbarRoutes from './routes/NavbarRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PowerFullMarket />} />
        <Route path="/*" element={<NavbarRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
