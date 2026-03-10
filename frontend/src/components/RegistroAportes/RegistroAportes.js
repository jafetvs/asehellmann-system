import React, { useState } from 'react';
import { Container, Form, Button, Modal } from 'react-bootstrap';
import './RegistroAportes.css'; // Importa los estilos CSS
import { useUser } from '../../contexts/UserContext';

const RegistroAportes = () => {
  const [nombreAsociado, setNombreAsociado] = useState('');
  const [idAsociado, setIdAsociado] = useState('');
  const [idAporte, setIdAporte] = useState('');
  const [fechaAporte, setFechaAporte] = useState('');
  const [montoAporte, setMontoAporte] = useState('');
  const [tipoAporte, setTipoAporte] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { user } = useUser();

  const handleSubmit = () => {
    // Aquí debes implementar la lógica para registrar el aporte en tu base de datos o sistema de almacenamiento.
    // Puedes utilizar los estados (nombreAsociado, idAsociado, idAporte, fechaAporte, montoAporte, tipoAporte)
    // para obtener los valores ingresados por el administrador y realizar el registro.

    // Después de realizar el registro, puedes mostrar una modal de confirmación.
    setShowModal(true);
  };

  if (!user) {
    return null;
  }
  return (
    <Container className="mt-4 registro-aportes-container">
      <h1 className="text-center mb-4">Registro de Aportes de Asociado</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="nombreAsociado">
          <Form.Label>Nombre del Asociado</Form.Label>
          <Form.Control
            type="text"
            value={nombreAsociado}
            onChange={(e) => setNombreAsociado(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="idAsociado">
          <Form.Label>ID del Asociado</Form.Label>
          <Form.Control
            type="text"
            value={idAsociado}
            onChange={(e) => setIdAsociado(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="idAporte">
          <Form.Label>ID del Aporte</Form.Label>
          <Form.Control
            type="text"
            value={idAporte}
            onChange={(e) => setIdAporte(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="fechaAporte">
          <Form.Label>Fecha del Aporte</Form.Label>
          <Form.Control
            type="date"
            value={fechaAporte}
            onChange={(e) => setFechaAporte(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="montoAporte">
          <Form.Label>Monto del Aporte</Form.Label>
          <Form.Control
            type="number"
            value={montoAporte}
            onChange={(e) => setMontoAporte(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="tipoAporte">
          <Form.Label>Tipo de Aporte</Form.Label>
          <Form.Control
            type="text"
            value={tipoAporte}
            onChange={(e) => setTipoAporte(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Registrar Aporte
        </Button>
      </Form>

      {/* Modal de Confirmación */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Aporte Registrado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          El aporte ha sido registrado correctamente.
          {/* Puedes mostrar más detalles aquí si es necesario */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RegistroAportes;
