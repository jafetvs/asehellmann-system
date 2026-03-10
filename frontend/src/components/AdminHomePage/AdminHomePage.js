import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useUser } from '../../contexts/UserContext';
import './AdminHomePage.css'; 

const AdminHomePage = () => {
  const { user } = useUser();
  
  if (!user || !user.isAdmin) {
    return null;
  }
  
  return (
    <Container>
      <div className="admin-homepage">
        <div className="custom-welcome">
        <h3 className="text-center">{user.username} ¡Bienvenido al Módulo de Administrador!</h3>
        <p className="text-center text-light">Aquí encuentras información sobre la usabilidad de cada módulo</p>
        </div>
        <div className="modules">
          <Row>
            <Col md={6}>
              <div className="module">
                <h2>Usuarios</h2>
                <p>Realiza acciones de búsqueda, inserción, edición y eliminación de usuarios en la plataforma.</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="module">
                <h2>Aportes</h2>
                <p>Administra y supervisa los aportes patronales y mensuales de los asociados.</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="module">
                <h2>Convenios</h2>
                <p>Controla la inserción, edición y eliminación de convenios con organizaciones externas.</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="module">
                <h2>Ahorros</h2>
                <p>Gestiona los ahorros activos e inactivos de los asociados.</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="module">
                <h2>Préstamos</h2>
                <p>Gestiona los préstamos activos e inactivos de los asociados.</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="module">
                <h2>Registros de Ahorros</h2>
                <p>Genere, filtre por fechas y obtenga los registros de ahorros de los asociados.</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="module">
                <h2>Registros de Préstamos</h2>
                <p>Genere, filtre por fechas y obtenga los registros de préstamos de los asociados.</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="module">
                <h2>Reporte mensual</h2>
                <p>Genere un excel que recopila los datos de préstamos, ahorros, aportes patronales y 
                  personales en general, para todos los usuarios activos.</p>
              </div>
            </Col>
            <Col md={6}>
            <div className="option">
                <h2>Montos disponibles</h2>
                <p>Conozca el monto disponible de un asociado. Este monto es calculado tomando el 
                  monto acumulado de aportes personales y restándole el saldo total de préstamos activos.</p>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Container>
  );
};

export default AdminHomePage;
