import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Table, Alert } from 'react-bootstrap';
import axios from 'axios';
import './AhorroAsociado.css';
import { useUser } from '../../contexts/UserContext';

const AhorroAsociado = () => {
    const { user } = useUser();
    const [ahorros, setAhorros] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        loadAhorros();
    }, []);

    const loadAhorros = async () => {
        try {
            const cedula = user.id;
            const response = await axios.get(`https://localhost:7190/api/Ahorro/obtenerAhorroEspecifico/${cedula}`);
            setAhorros(response.data);
        } catch (error) {
            console.error('Error al cargar los ahorros:', error);
        }
    };

    const formatTipoAhorro = (tipoAhorro) => {
        switch (tipoAhorro) {
            case 'navidad':
                return 'Ahorro Navideño';
            case 'cuestaEnero':
                return 'Cuesta Enero';
            default:
                return tipoAhorro;
        }
    };

    if(!user) return null;
    return (
        <>
            <Container className="mt-4 gestion-convenios-container">
                <h2 className="text-center mb-3">Ahorros del Asociado</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Id Ahorro</th>
                            <th>Cédula</th>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Tipo de Ahorro</th>
                            <th>Monto a Debitar</th>
                            <th>Fecha Inicio</th>
                            <th>Fecha Fin</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ahorros.map((ahorro) => (
                                <tr key={ahorro.id.toString()}>
                                    <td>{ahorro.id}</td>
                                    <td>{ahorro.usuario.cedula}</td>
                                    <td>{ahorro.usuario.nombre}</td>
                                    <td>{ahorro.usuario.apellidos}</td>
                                    <td>{formatTipoAhorro(ahorro.tipoAhorro)}</td>
                                    <td>{ahorro.montoDebitar}</td>
                                    <td>{ahorro.fechaInicioFormateada}</td>
                                    <td>{ahorro.fechaFinFormateada}</td>
                                    <td>{ahorro.status}</td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
                {alertMessage && (
                    <Modal show={true} onHide={() => setAlertMessage('')} centered className="custom-alert-modal">
                        <Modal.Header closeButton>
                            <Modal.Title>Mensaje de Alerta</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Alert variant="danger">{alertMessage}</Alert>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setAlertMessage('')}>
                                Cerrar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </Container>
        </>
    );
};

export default AhorroAsociado;
