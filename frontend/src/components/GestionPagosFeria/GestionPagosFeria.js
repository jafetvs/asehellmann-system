import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Table, Alert } from 'react-bootstrap';
import axios from 'axios';
import './GestionPagosFeria.css'; // Asegúrate de tener el archivo CSS correspondiente
import { useUser } from '../../contexts/UserContext';

const GestionPagosFeria = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [currentPago, setCurrentPago] = useState(null);
    const [feriaProveedorId, setFeriaProveedorId] = useState('');
    const [montoCompra, setMontoCompra] = useState(0);
    const [pagoRealizado, setPagoRealizado] = useState(0);
    const [plazo, setPlazo] = useState(0);
    const [usuarioCedula, setUsuarioCedula] = useState('');
    const [fechaCompra, setFechaCompra] = useState('');
    const [montoPagarMes, setMontoPagarMes] = useState(0);
    const [plazoRealizado, setPlazoRealizado] = useState(0);
    const [errors, setErrors] = useState({});
    const [pagos, setPagos] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [searchText, setSearchText] = useState('');
    const { user } = useUser();

    useEffect(() => {
        loadPagos();
    }, []);

    const loadPagos = async () => {
        try {
            const response = await axios.get('https://localhost:7190/api/registroPagoFeria');
            setPagos(response.data);
        } catch (error) {
            console.error('Error al cargar los pagos de ferias:', error);
        }
    };

    const handleShowAddForm = () => {
        setShowAddForm(true);
    };

    const handleCloseAddForm = () => {
        setShowAddForm(false);
        clearForm();
    };

    const handleShowEditForm = (pago) => {
        setCurrentPago(pago);
        setFeriaProveedorId(pago.feriaProveedorId);
        setMontoCompra(pago.montoCompra);
        setPagoRealizado(pago.pagoRealizado);
        setMontoPagarMes(pago.montoPagarMes);
        setPlazo(pago.plazo);
        setPlazoRealizado(pago.plazoRealizado);
        setUsuarioCedula(pago.usuario.cedula);
        setFechaCompra(pago.fechaCompra ? pago.fechaCompra.split('T')[0] : ''); // Parsear la fecha para el input
        setShowEditForm(true);
    };

    const handleCloseEditForm = () => {
        setShowEditForm(false);
        clearForm();
    };

    const handleShowDeleteConfirm = (pago) => {
        setCurrentPago(pago);
        setShowDeleteConfirm(true);
    };

    const handleCloseDeleteConfirm = () => {
        setShowDeleteConfirm(false);
        setCurrentPago(null);
    };

    const clearForm = () => {
        setFeriaProveedorId('');
        setMontoCompra(0);
        setPagoRealizado(0);
        setPlazo(0);
        setUsuarioCedula('');
        setFechaCompra('');
        setMontoPagarMes(0);
        setPlazoRealizado(0);
        setErrors({});
        setAlertMessage('');
    };

    const validateForm = () => {
        const errors = {};

        if (!feriaProveedorId) {
            errors.feriaProveedorId = 'El ID del proveedor es obligatorio';
        }

        if (montoCompra <= 0) {
            errors.montoCompra = 'El monto de la compra debe ser mayor que cero';
        }

        if (pagoRealizado < 0) {
            errors.pagoRealizado = 'El pago realizado no puede ser negativo';
        }

        if (plazo <= 0) {
            errors.plazo = 'El plazo debe ser mayor que cero';
        }

        if (!usuarioCedula) {
            errors.usuarioCedula = 'La cédula del usuario es obligatoria';
        }

        if (!fechaCompra) {
            errors.fechaCompra = 'La fecha de la compra es obligatoria';
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleAddPago = async () => {
        if (!validateForm()) {
            return;
        }

        const data = {
            feriaProveedorId: Number(feriaProveedorId),
            montoCompra: Number(montoCompra),
            pagoRealizado: Number(pagoRealizado),
            plazo: Number(plazo),
            usuarioCedula: usuarioCedula,
            fechaCompra: new Date(fechaCompra).toISOString(),
        };

        try {
            await axios.post('https://localhost:7190/api/registroPagoFeria', data);
            loadPagos();
            handleCloseAddForm();
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setAlertMessage('Error: Datos inválidos o el pago ya existe.');
            } else {
                console.error('Error al añadir el pago de feria:', error);
            }
        }
    };

    const handleEditPago = async () => {
        if (!validateForm()) {
            return;
        }

        const data = {
            id: currentPago.id,
            feriaProveedorId: Number(feriaProveedorId),
            montoCompra: Number(montoCompra),
            pagoRealizado: Number(pagoRealizado),
            montoPagarMes: Number(montoPagarMes),
            plazo: Number(plazo),
            plazoRealizado: Number(plazoRealizado),
            usuarioCedula: usuarioCedula,
            fechaCompra: new Date(fechaCompra).toISOString(),
        };

        try {
            await axios.put(`https://localhost:7190/api/registroPagoFeria/${currentPago.id}`, data);
            loadPagos();
            handleCloseEditForm();
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setAlertMessage('Error: Datos inválidos o el pago ya existe.');
            } else {
                console.error('Error al editar el pago de feria:', error);
            }
        }
    };

    const handleDeletePago = async () => {
        try {
            await axios.delete(`https://localhost:7190/api/registroPagoFeria/${currentPago.id}`);
            loadPagos();
            handleCloseDeleteConfirm();
        } catch (error) {
            console.error('Error al borrar el pago de feria:', error);
        }
    };

    const filterPagos = () => {
        return pagos.filter((pago) => {
            const nombreUsuario = `${pago.usuario.nombre} ${pago.usuario.apellidos}`;
            const nombreMatches = nombreUsuario.toLowerCase().includes(searchText.toLowerCase());
            const nombreProveedorMatches = pago.feriaProveedor.nombreProveedor.toLowerCase().includes(searchText.toLowerCase());
            return nombreMatches || nombreProveedorMatches;
        });
    };

    if (!user) return null;

    return (
        <Container className="gestion-pagos-feria-container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <div className="barra-busqueda" style={{ flex: '5' }}>
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nombre del proveedor o usuario..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
                <div className="button-group" style={{ flex: '1', marginLeft: '10px' }}>
                    <Button className="btn-add3 bg-success" onClick={handleShowAddForm}>
                        Añadir Pago
                    </Button>
                </div>
            </div>

            {/* Tabla de pagos de ferias */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID Pago</th>
                        <th>Monto de Compra</th>
                        <th>Pago Realizado</th>
                        <th>Monto a Pagar por Mes</th>
                        <th>Plazo</th>
                        <th>Plazo Realizado</th>
                        <th>Cédula</th>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>Nombre del Proveedor</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filterPagos().map((pago) => (
                        <tr key={pago.id}>
                            <td>{pago.id}</td>
                            <td>{pago.montoCompra}</td>
                            <td>{pago.pagoRealizado}</td>
                            <td>{pago.montoPagarMes}</td>
                            <td>{pago.plazo}</td>
                            <td>{pago.plazoRealizado}</td>
                            <td>{pago.usuario.cedula}</td>
                            <td>{pago.usuario.nombre}</td>
                            <td>{pago.usuario.apellidos}</td>
                            <td>{pago.feriaProveedor.nombreProveedor}</td>
                            <td>
                                <Button
                                    className="btn-edit bg-primary"
                                    onClick={() => handleShowEditForm(pago)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    className="btn-delete bg-danger"
                                    onClick={() => handleShowDeleteConfirm(pago)}
                                >
                                    Borrar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal para añadir un nuevo pago */}
            <Modal show={showAddForm} onHide={handleCloseAddForm}>
                <Modal.Header closeButton>
                    <Modal.Title>Añadir Pago</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formFeriaProveedorId">
                            <Form.Label>ID del Proveedor</Form.Label>
                            <Form.Control
                                type="text"
                                value={feriaProveedorId}
                                onChange={(e) => setFeriaProveedorId(e.target.value)}
                                isInvalid={!!errors.feriaProveedorId}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.feriaProveedorId}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formMontoCompra">
                            <Form.Label>Monto de la Compra</Form.Label>
                            <Form.Control
                                type="number"
                                value={montoCompra}
                                onChange={(e) => setMontoCompra(e.target.value)}
                                isInvalid={!!errors.montoCompra}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.montoCompra}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formPagoRealizado">
                            <Form.Label>Pago Realizado</Form.Label>
                            <Form.Control
                                type="number"
                                value={pagoRealizado}
                                onChange={(e) => setPagoRealizado(e.target.value)}
                                isInvalid={!!errors.pagoRealizado}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.pagoRealizado}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formPlazo">
                            <Form.Label>Plazo</Form.Label>
                            <Form.Control
                                type="number"
                                value={plazo}
                                onChange={(e) => setPlazo(e.target.value)}
                                isInvalid={!!errors.plazo}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.plazo}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formUsuarioCedula">
                            <Form.Label>Cédula del Usuario</Form.Label>
                            <Form.Control
                                type="text"
                                value={usuarioCedula}
                                onChange={(e) => setUsuarioCedula(e.target.value)}
                                isInvalid={!!errors.usuarioCedula}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.usuarioCedula}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formFechaCompra">
                            <Form.Label>Fecha de la Compra</Form.Label>
                            <Form.Control
                                type="date"
                                value={fechaCompra}
                                onChange={(e) => setFechaCompra(e.target.value)}
                                isInvalid={!!errors.fechaCompra}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.fechaCompra}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                    {alertMessage && <Alert variant="danger">{alertMessage}</Alert>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddForm}>
                        Cancelar
                    </Button>
                    <Button variant="success" onClick={handleAddPago}>
                        Añadir
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para editar un pago existente */}
            <Modal show={showEditForm} onHide={handleCloseEditForm}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Pago</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formFeriaProveedorId">
                            <Form.Label>ID del Proveedor</Form.Label>
                            <Form.Control
                                type="text"
                                value={feriaProveedorId}
                                onChange={(e) => setFeriaProveedorId(e.target.value)}
                                isInvalid={!!errors.feriaProveedorId}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.feriaProveedorId}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formMontoCompra">
                            <Form.Label>Monto de la Compra</Form.Label>
                            <Form.Control
                                type="number"
                                value={montoCompra}
                                onChange={(e) => setMontoCompra(e.target.value)}
                                isInvalid={!!errors.montoCompra}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.montoCompra}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formPagoRealizado">
                            <Form.Label>Pago Realizado</Form.Label>
                            <Form.Control
                                type="number"
                                value={pagoRealizado}
                                onChange={(e) => setPagoRealizado(e.target.value)}
                                isInvalid={!!errors.pagoRealizado}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.pagoRealizado}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formMontoPagarMes">
                            <Form.Label>Monto a Pagar por Mes</Form.Label>
                            <Form.Control
                                type="number"
                                value={montoPagarMes}
                                onChange={(e) => setMontoPagarMes(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPlazo">
                            <Form.Label>Plazo</Form.Label>
                            <Form.Control
                                type="number"
                                value={plazo}
                                onChange={(e) => setPlazo(e.target.value)}
                                isInvalid={!!errors.plazo}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.plazo}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formPlazoRealizado">
                            <Form.Label>Plazo Realizado</Form.Label>
                            <Form.Control
                                type="number"
                                value={plazoRealizado}
                                onChange={(e) => setPlazoRealizado(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formUsuarioCedula">
                            <Form.Label>Cédula del Usuario</Form.Label>
                            <Form.Control
                                type="text"
                                value={usuarioCedula}
                                onChange={(e) => setUsuarioCedula(e.target.value)}
                                isInvalid={!!errors.usuarioCedula}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.usuarioCedula}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formFechaCompra">
                            <Form.Label>Fecha de la Compra</Form.Label>
                            <Form.Control
                                type="date"
                                value={fechaCompra}
                                onChange={(e) => setFechaCompra(e.target.value)}
                                isInvalid={!!errors.fechaCompra}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.fechaCompra}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                    {alertMessage && <Alert variant="danger">{alertMessage}</Alert>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditForm}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleEditPago}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para confirmar la eliminación de un pago */}
            <Modal show={showDeleteConfirm} onHide={handleCloseDeleteConfirm}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Estás seguro de que deseas eliminar este pago?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteConfirm}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDeletePago}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default GestionPagosFeria;
