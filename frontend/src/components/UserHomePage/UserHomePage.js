import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useUser } from '../../contexts/UserContext';
import './UserHomePage.css'; // Importa el archivo CSS personalizado

const UserHomePage = () => {
  const { user } = useUser();

  if (!user || user.isAdmin) {
    return null;
  }

  return (
    <Container>
      <div className="user-homepage">
        <div className="custom-welcome">
          <h3 className="text-center">{user.username} ¡Bienvenido al Módulo de Autogestión! </h3>
          <p className="text-center text-light">Aquí puedes acceder a diferentes opciones para gestionar tu cuenta</p>
        </div>
        <div className="options">
          <Row>
            <Col md={6}>
              <div className="option">
                <h2>Formularios</h2>
                <p>Descargue los formularios de solicitud de préstamo y solicitud de ahorro.</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="option">
                <h2>Aportes</h2>
                <p>Lleve un control actualizado de sus ahorros activos e inactivos en la asociación.</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="option">
                <h2>Préstamos</h2>
                <p>Lleve un control actualizado de sus préstamos en la asociación.</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="option">
                <h2>Previsualizar préstamo</h2>
                <p>En esta sección usted podrá obtener un plan de pago a seguir si desea un préstamo, sin la necesidad de solicitarlo oficialmente.</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="option">
                <h2>Registro de ahorros</h2>
                <p>Filtre por fechas y obtenga información de los registros de sus ahorros.</p>
              </div>
            </Col>
            <Col md={6}>
            <div className="option">
                <h2>Registro de préstamos</h2>
                <p>Filtre por fechas y obtenga información de los registros de sus préstamos.</p>
              </div>
            </Col>
            <Col md={6}>
            <div className="option">
                <h2>Monto disponible</h2>
                <p>Conozca su monto disponible de forma general o en desgloce en formato PDF. Este monto es calculado tomando el 
                  monto acumulado de aportes personales y restándole el saldo total de préstamos activos.</p>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Container>
  );
};

export default UserHomePage;
