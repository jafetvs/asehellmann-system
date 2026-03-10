import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import LoginPage from './components/LoginForm/LoginPage';
import AdminNavbar from './components/AdminNavbar/AdminNavbar';
import AdminHomePage from './components/AdminHomePage/AdminHomePage';
import GestionUsuarios from './components/GestionUsuarios/GestionUsuarios';
import GestionAportes from './components/GestionAportes/GestionAportes';
import HomeNavbar from './components/HomeNavbar/HomeNavbar';
import Home from './components/Home/Home';
import { useUser } from './contexts/UserContext';
import UserNavbar from './components/UserNavbar/UserNavbar';
import UserHomePage from './components/UserHomePage/UserHomePage';
import Nosotros from './components/Nosotros/Nosotros';
import Contactenos from './components/Contactenos/Contactenos';
import Beneficios from './components/Beneficios/Beneficios';
import Footer from './components/Footer/Footer';
import GestionConvenios from './components/GestionConvenios/GestionConvenios';
import './App.css';
import UserForms from './components/UserForms/UserForms';
import GestionAhorros from './components/GestionAhorros/GestionAhorros';
import RegistrosAhorros from './components/RegistroAhorros/RegistroAhorros';
import RegistrosAhorrosAsociado from './components/RegistroAhorroAsociado/RegistroAhorrosAsociado';
import RegistroPrestamos from './components/RegistroPrestamos/RegistroPrestamos';
import GestionPrestamos from './components/GestionPrestamos/GestionPrestamos';
import AporteAsociado from './components/AporteAsociado/AporteAsociado';
import AhorroAsociado from './components/AhorroAsociado/AhorroAsociado';
import RegistroPrestamosAsociado from './components/RegistroPrestamosAsociado/RegistroPrestamosAsociado';
import PrestamosAsociado from './components/PrestamosAsociado/PrestamosAsociado';
import PrevisualizarPrestamo from './components/PrevisualizarPrestamo/PrevisualizarPrestamo';
import ReporteMensual from './components/ReporteMensual/ReporteMensual';
import GestionFerias from './components/GestionFerias/GestionFerias';
import ReporteDeAsociados from './components/ReporteDeAsociados/ReporteDeAsociados';
import MontoDisponible from './components/MontoDisponible/MontoDisponible';
import GestionPagosFeria from './components/GestionPagosFeria/GestionPagosFeria';

const App = () => {
  return (
    <Router>
      <UserProvider>
      <div className="app-container">
          <Main />
          <Footer />
        </div>
      </UserProvider>
    </Router>
  );
}

const Main = () => {
  const { user } = useUser();
  return (
    <div>
      {!user ? <HomeNavbar /> : user.isAdmin ? <AdminNavbar /> : <UserNavbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user" element={<UserHomePage />} />
        <Route path="/admin" element={<AdminHomePage />} />
        <Route path="/gestion-usuarios" element={<GestionUsuarios />} />
        <Route path="/gestion-aportes" element={<GestionAportes />} />
        <Route path="/gestion-convenios" element={<GestionConvenios />} />
        <Route path="/navbarUsuarios" element={<GestionAportes />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contactenos" element={<Contactenos />} />
        <Route path="/beneficios" element={<Beneficios />} />
        <Route path="/formularios-usuario" element={<UserForms />} />
        <Route path="/gestion-ahorros" element={<GestionAhorros />} />
        <Route path="/gestion-prestamos" element={<GestionPrestamos />} />
        <Route path="/registros-ahorros" element={<RegistrosAhorros />} />
        <Route path="/ahorros-asociado" element={<AhorroAsociado />} />
        <Route path="/registros-prestamos" element={<RegistroPrestamos />} />
        <Route path="/registros-ahorrosAsociado" element={<RegistrosAhorrosAsociado />} />
        <Route path="/registros-prestamosAsociado" element={<RegistroPrestamosAsociado />} />
        <Route path="/aportes-asociado" element={<AporteAsociado />} />
        <Route path="/prestamos-asociado" element={<PrestamosAsociado />} />
        <Route path="/previsualizar-prestamo" element={<PrevisualizarPrestamo />} />
        <Route path="/reporte-mensual" element={<ReporteMensual />} />
        <Route path="/gestion-ferias" element={<GestionFerias />} />
        <Route path="/gestion-pagosferias" element={<GestionPagosFeria />} />
        <Route path="/reporte-de-asociados" element={<ReporteDeAsociados />} />
        <Route path="/monto-disponible" element={<MontoDisponible />} />
      </Routes>
    </div>
  );
} 

export default App;