import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Table, Alert } from 'react-bootstrap';
import axios from 'axios';
import './GestionFerias.css';
import { useUser } from '../../contexts/UserContext';

const GestionFerias = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [nombreProveedor, setNombreProveedor] = useState('');
    const [ventaTotales, setVentaTotales] = useState(0);
    const [fechaFeria, setFechaFeria] = useState('');
    const [errors, setErrors] = useState({});
    const [ferias, setFerias] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [searchText, setSearchText] = useState('');
    const { user } = useUser();

    useEffect(() => {
        loadFerias();
    }, []);

    const loadFerias = async () => {
        try {
            const response = await axios.get('https://localhost:7190/api/feriaProveedor');
            setFerias(response.data);
        } catch (error) {
            console.error('Error al cargar las ferias:', error);
        }
    };

    const handleShowAddForm = () => {
        setShowAddForm(true);
    };

    const handleCloseAddForm = () => {
        setShowAddForm(false);
        setNombreProveedor('');
        setVentaTotales(0);
        setFechaFeria('');
        setErrors({});
        setAlertMessage('');
    };

    const validateForm = () => {
        const errors = {};

        if (!nombreProveedor) {
            errors.nombreProveedor = 'El nombre del proveedor es obligatorio';
        }

        if (ventaTotales <= 0) {
            errors.ventaTotales = 'Las ventas totales deben ser mayores que cero';
        }

        if (!fechaFeria) {
            errors.fechaFeria = 'La fecha de la feria es obligatoria';
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleAddFeria = async () => {
        if (!validateForm()) {
            return;
        }

        const data = {
            nombreProveedor: nombreProveedor,
            ventaTotales: ventaTotales,
            fechaFeria: fechaFeria,
        };

        try {
            const response = await axios.post('https://localhost:7190/api/feriaProveedor', data);
            loadFerias();
            setShowAddForm(false);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setAlertMessage('Error: Datos inválidos o Feria ya existe.');
            } else {
                console.error('Error al añadir la feria:', error);
            }
        }
    };

    const filterFerias = () => {
        return ferias.filter((feria) =>
            feria.nombreProveedor.toLowerCase().includes(searchText.toLowerCase())
        );
    };

    if (!user) return null;

    return (
        <Container className="gestion-ferias-container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <div className="barra-busqueda" style={{ flex: '5' }}>
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nombre del proveedor..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
                <div className="button-group" style={{ flex: '1', marginLeft: '10px' }}>
                    <Button className="btn-add3 bg-success" onClick={handleShowAddForm}>
                        Añadir Feria
                    </Button>
                </div>
            </div>

            {/* Tabla de ferias */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID Feria</th>
                        <th>Nombre del Proveedor</th>
                        <th>Ventas Totales</th>
                        <th>Fecha de Feria</th>
                    </tr>
                </thead>
                <tbody>
                    {filterFerias().map((feria) => (
                        <tr key={feria.idFeriaProveedor}>
                            <td>{feria.idFeriaProveedor}</td>
                            <td>{feria.nombreProveedor}</td>
                            <td>{feria.ventaTotales.toLocaleString()}</td>
                            <td>{new Date(feria.fechaFeria).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Formulario para agregar feria */}
            <Modal show={showAddForm} onHide={handleCloseAddForm} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Añadir Feria</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Nombre del Proveedor</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nombre del Proveedor"
                                value={nombreProveedor}
                                onChange={(e) => setNombreProveedor(e.target.value)}
                            />
                            {errors.nombreProveedor && (
                                <p className="text-danger">{errors.nombreProveedor}</p>
                            )}
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Ventas Totales</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ventas Totales"
                                value={ventaTotales.toLocaleString()} // Formatear el valor con separadores de millar
                                onChange={(e) => setVentaTotales(Number(e.target.value.replace(/\D/g, '')))} // Convertir a número y actualizar el estado
                            />
                            {errors.ventaTotales && (
                                <p className="text-danger">{errors.ventaTotales}</p>
                            )}
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Fecha de la Feria</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Fecha de la Feria"
                                value={fechaFeria}
                                onChange={(e) => setFechaFeria(e.target.value)}
                            />
                            {errors.fechaFeria && (
                                <p className="text-danger">{errors.fechaFeria}</p>
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddForm}>
                        Cancelar
                    </Button>
                    <Button variant="success" onClick={handleAddFeria}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para mensajes de alerta */}
            {alertMessage && (
                <Modal
                    show={true}
                    onHide={() => setAlertMessage('')}
                    centered
                    className="custom-alert-modal"
                >
                    <Modal.Header close Button>
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
    );
};

export default GestionFerias;
