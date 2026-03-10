import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Table, Alert } from 'react-bootstrap';
import axios from 'axios';
import './GestionAhorros.css';
import { useUser } from '../../contexts/UserContext';

const GestionAhorros = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [cedula, setCedula] = useState('');
    const [tipoAhorro, setTipoAhorro] = useState('');
    const [montoDebitar, setMontoDebitar] = useState(0);
    const [fechaInicio, setFechaInicio] = useState('');
    const [errors, setErrors] = useState({});
    const [ahorros, setAhorros] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [searchText, setSearchText] = useState('');
    const [selectedAhorro, setSelectedAhorro] = useState(null);
    const [showChangeStatusForm, setShowChangeStatusForm] = useState(false);
    const [nuevoTipoAhorro, setNuevoTipoAhorro] = useState('');
    const [nuevoStatus, setNuevoStatus] = useState('');
    const [showEditForm, setShowEditForm] = useState(false);
    const { user } = useUser();

    const handleShowAddAhorroForm = () => {
        setShowAddForm(true);
    };

    const handleCloseAddAhorroForm = () => {
        setShowAddForm(false);
        setErrors({});
        setAlertMessage('');
        setSearchText('');
    };

    const validateForm = () => {
        const errors = {};

        if (!cedula) {
            errors.cedula = 'La cédula del usuario es obligatoria';
        }

        if (!tipoAhorro) {
            errors.tipoAhorro = 'El tipo de ahorro es obligatorio';
        }

        if (!montoDebitar) {
            errors.montoDebitar = 'El monto a debitar es obligatorio';
        }

        if (!fechaInicio) {
            errors.fechaInicio = 'La fecha de inicio es obligatoria';
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    // Cargar ahorros 
    useEffect(() => {
        loadAhorros();
    }, []);

    const loadAhorros = async () => {
        try {
            const response = await axios.get('https://localhost:7190/api/Ahorro/obtenerAhorros');
            setAhorros(response.data);
        } catch (error) {
            console.error('Error al cargar los ahorros:', error);
        }
    };

    const handleAddAhorro = async () => {
        if (!validateForm()) {
            return;
        }

        const data = {
            cedula: cedula,
            tipoAhorro: tipoAhorro,
            montoDebitar: montoDebitar,
            fechaInicio: fechaInicio,
        };

        try {
            const response = await axios.post('https://localhost:7190/api/Ahorro/crearAhorroUsuarioEspecifico', data);

            loadAhorros();
            setShowAddForm(false);
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setAlertMessage('El usuario ya tiene un ahorro activo del tipo seleccionado.');
            } else if (error.response && error.response.status === 404) {
                setAlertMessage('El usuario especificado no existe.');
            } else {
                console.error('Error al añadir ahorro:', error);
            }
        }
    };

    const handleShowChangeStatusForm = (ahorro) => {
        setSelectedAhorro(ahorro);
        setShowChangeStatusForm(true);
    };

    const handleCloseChangeStatusForm = () => {
        setShowChangeStatusForm(false);
        setSelectedAhorro(null);
        setNuevoTipoAhorro('');
        setNuevoStatus('');
    };

    const handleChangeStatus = async () => {

        if (!nuevoStatus) {
            setAlertMessage('Debe seleccionar un nuevo Status.');
            return;
        }

        const data = {
            nuevoStatus: nuevoStatus,
        };

        try {
            const response = await axios.patch(`https://localhost:7190/api/Ahorro/actualizarStatus/${selectedAhorro.id}`, data);
            loadAhorros();
            handleCloseChangeStatusForm();
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setAlertMessage('El usuario ya tiene un ahorro VIGENTE del tipo seleccionado.');
            }
            console.error('Error al cambiar el estado del ahorro:', error);
        }
    };

    const handleShowEditForm = (ahorro) => {
        setSelectedAhorro(ahorro);
        setShowEditForm(true);
    };

    const handleCloseEditForm = () => {
        setShowEditForm(false);
        setSelectedAhorro(null);
        setMontoDebitar(0);
    };

    const handleEditMonto = async () => {
        const data = {
            montoDebitar: montoDebitar,
        };

        try {
            const response = await axios.patch(`https://localhost:7190/api/Ahorro/actualizarAhorroMontoDebitar/${selectedAhorro.id}`, data);


            loadAhorros();
            handleCloseEditForm();
        } catch (error) {
            console.error('Error al editar el monto del ahorro:', error);
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

    const filterAhorros = () => {
        return ahorros.filter((ahorro) => {
            const cedulaMatches = ahorro.usuario.cedula.toLowerCase().includes(searchText.toLowerCase());
            const nombreMatches = `${ahorro.usuario.nombre} ${ahorro.usuario.apellidos}`.toLowerCase().includes(searchText.toLowerCase());
            return cedulaMatches || nombreMatches;
        });
    };

    if (!user) return null;
    return (
        <>
            <Container className="mt-4 gestion-ahorros-container">
                <div className="d-flex justify-content-between mb-3">
                    <div className="barra-busqueda" style={{ flex: '5' }}>
                        <Form.Control
                            type="text"
                            placeholder="Buscar por cédula o nombre..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                    <div className="button-group" style={{ flex: '1', marginLeft: '10px' }}>
                        <Button className="btn-add3 bg-success" onClick={handleShowAddAhorroForm}>
                            Añadir Ahorro
                        </Button>
                    </div>
                </div>

                {/* Tabla de ahorros */}
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
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterAhorros().map((ahorro) => (
                            <tr key={ahorro.id.toString()}>
                                <td>{ahorro.id}</td>
                                <td>{ahorro.usuario.cedula}</td>
                                <td>{ahorro.usuario.nombre}</td>
                                <td>{ahorro.usuario.apellidos}</td>
                                <td>{formatTipoAhorro(ahorro.tipoAhorro)}</td>
                                <td>{ahorro.montoDebitar.toLocaleString()}</td>
                                <td>{ahorro.fechaInicioFormateada}</td>
                                <td>{ahorro.fechaFinFormateada}</td>
                                <td>{ahorro.status}</td>
                                <td>
                                    <Button variant="info" onClick={() => handleShowEditForm(ahorro)}>Editar Monto</Button>{' '}
                                    <Button variant="danger" onClick={() => handleShowChangeStatusForm(ahorro)}>Cambiar Status</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Formulario para agregar ahorro */}
                <Modal show={showAddForm} onHide={handleCloseAddAhorroForm} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Añadir Ahorro</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Cédula del Usuario</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Cédula del usuario"
                                    value={cedula}
                                    onChange={(e) => setCedula(e.target.value)}
                                />
                                {errors.cedula && (
                                    <p className="text-danger">{errors.cedula}</p>
                                )}
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Tipo de Ahorro</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={tipoAhorro}
                                    onChange={(e) => setTipoAhorro(e.target.value)}
                                >
                                    <option value="">Seleccione un tipo de ahorro</option>
                                    <option value="navidad">Ahorro Navideño</option>
                                    <option value="cuestaEnero">Ahorro Cuesta de Enero</option>
                                </Form.Control>
                                {errors.tipoAhorro && (
                                    <p className="text-danger">{errors.tipoAhorro}</p>
                                )}
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Monto a Debitar</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Monto a debitar"
                                    value={montoDebitar.toLocaleString()} // Formatear el valor con separadores de millar
                                    onChange={(e) => setMontoDebitar(Number(e.target.value.replace(/\D/g, '')))} // Convertir a número y actualizar el estado
                                />
                                {errors.montoDebitar && (
                                    <p className="text-danger">{errors.montoDebitar}</p>
                                )}
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Fecha de Inicio</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Fecha de inicio"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                />
                                {errors.fechaInicio && (
                                    <p className="text-danger">{errors.fechaInicio}</p>
                                )}
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseAddAhorroForm}>
                            Cerrar
                        </Button>
                        <Button variant="success" onClick={handleAddAhorro}>
                            Añadir Ahorro
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal para cambiar status */}
                <Modal show={showChangeStatusForm} onHide={handleCloseChangeStatusForm} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Cambiar Estado de Ahorro</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Cédula del Usuario</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Cédula del usuario"
                                    value={selectedAhorro ? selectedAhorro.usuario.cedula : ''}
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Tipo de Ahorro</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Tipo de Ahorro"
                                    value={selectedAhorro ? formatTipoAhorro(selectedAhorro.tipoAhorro) : ''}
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Nuevo Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={nuevoStatus}
                                    onChange={(e) => setNuevoStatus(e.target.value)}
                                >
                                    <option value="">Seleccione un nuevo Status</option>
                                    <option value="VIGENTE">VIGENTE</option>
                                    <option value="CERRADO">CERRADO</option>
                                    <option value="TERMINADO">TERMINADO</option>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseChangeStatusForm}>
                            Cerrar
                        </Button>
                        <Button variant="success" onClick={handleChangeStatus}>
                            Guardar Cambios
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal para editar monto */}
                <Modal show={showEditForm} onHide={handleCloseEditForm} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Monto</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Cédula del Usuario</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Cédula del usuario"
                                    value={selectedAhorro ? selectedAhorro.usuario.cedula : ''}
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Tipo de Ahorro</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Tipo de Ahorro"
                                    value={selectedAhorro ? formatTipoAhorro(selectedAhorro.tipoAhorro) : ''}
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Nuevo Monto a Debitar</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nuevo monto a debitar"
                                    value={montoDebitar.toLocaleString()} // Formatear el valor con separadores de millar
                                    onChange={(e) => setMontoDebitar(Number(e.target.value.replace(/\D/g, '')))} // Convertir a número y actualizar el estado
                                />
                            </Form.Group>

                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseEditForm}>
                            Cerrar
                        </Button>
                        <Button variant="success" onClick={handleEditMonto}>
                            Guardar Cambios
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal para mensajes de alerta */}
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

export default GestionAhorros;
