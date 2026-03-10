import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import { useUser } from '../../contexts/UserContext';
import axios from 'axios';
import './GestionPrestamos.css';

const GestionPrestamos = () => {
    const [prestamos, setPrestamos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [nuevoPrestamo, setNuevoPrestamo] = useState({ cedula: '', tipoPrestamo: '', montoPrestamo: 0 });
    const [plazoPrestamo, setPlazoPrestamo] = useState('');
    const [showAddPrestamoModal, setShowAddPrestamoModal] = useState(false);
    const [errorModal, setErrorModal] = useState(false);
    const [selectedPrestamo, setSelectedPrestamo] = useState(null);
    const [statusOptions] = useState(['TERMINADO', 'APROBADO', 'RECHAZADO']);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showCuotaAPagarModal, setShowCuotaAPagarModal] = useState(false);
    const [nuevaCuotaAPagar, setNuevaCuotaAPagar] = useState('');

    const { user } = useUser();


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://localhost:7190/api/Prestamo/obtenerPrestamos');
            setPrestamos(response.data);
        } catch (error) {
            console.error('Error al cargar datos de préstamos:', error);
        }
    };

    const agregarPrestamo = async () => {
        try {
            const nuevoPrestamoConPlazo = { ...nuevoPrestamo, plazoPrestamo: parseInt(plazoPrestamo) };
            const response = await axios.post('https://localhost:7190/api/Prestamo/crearPrestamo', nuevoPrestamoConPlazo);
            setPrestamos([...prestamos, response.data]);
            fetchData();
            handleCloseAddPrestamoModal();
        } catch (error) {
            console.error('Error al agregar préstamo:', error);
            // Mostrar modal de error si se recibe un error 400
            if (error.response && error.response.status === 400) {
                setErrorModal(true);
            }
        }
    };

    const handleCloseAddPrestamoModal = () => {
        setShowAddPrestamoModal(false);
        setNuevoPrestamo({ cedula: '', tipoPrestamo: '', montoPrestamo: 0 });
    };

    const handleEditStatus = (prestamo) => {
        setSelectedPrestamo(prestamo);
        setShowStatusModal(true);
    };

    const handleCloseStatusModal = () => {
        setSelectedPrestamo(null);
        setShowStatusModal(false);
    };

    const handleStatusChange = async (status) => {
        try {
            await axios.patch(`https://localhost:7190/api/Prestamo/actualizarStatus/${selectedPrestamo.idPrestamo}`, { status });
            fetchData();
            handleCloseStatusModal();
        } catch (error) {
            console.error('Error al cambiar status del préstamo:', error);
        }
    };

    const handleEditCuotaAPagar = (prestamo) => {
        setSelectedPrestamo(prestamo);
        setShowCuotaAPagarModal(true);
    };

    const handleCloseCuotaAPagarModal = () => {
        setSelectedPrestamo(null);
        setShowCuotaAPagarModal(false);
    };

    const handleCuotaAPagarChange = async () => {
        const nuevaCuotaNumerica = parseFloat(nuevaCuotaAPagar); // Convertir a número
        try {
            await axios.patch(
                `https://localhost:7190/api/Prestamo/actualizarCuotaAPagar/${selectedPrestamo.idPrestamo}`,
                { cuotaPagar: nuevaCuotaNumerica },
                { headers: { 'Content-Type': 'application/json' } } // Especificar el tipo de contenido como JSON
            );
            fetchData();
            handleCloseCuotaAPagarModal();
        } catch (error) {
            console.error('Error al cambiar la cuota a pagar del préstamo:', error);
        }
    };


    const prestamosFiltrados = prestamos.filter((prestamo) =>
        prestamo.usuario &&
        (prestamo.usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            prestamo.usuario.cedula.toLowerCase().includes(busqueda.toLowerCase()))
    );


    const getNombrePlazo = (plazo) => {
        switch (plazo) {
            case 12:
                return 'Un año';
            case 24:
                return 'Dos años';
            case 36:
                return 'Tres años';
            default:
                return '';
        }
    };

    const formatFecha = (fecha) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(fecha).toLocaleDateString('es-ES', options);
    };


    if (!user) {
        return null;
    }
    return (
        <Container className="gestion-prestamos-container">
            <InputGroup className="mb-3 mt-3">
                <FormControl
                    type="text"
                    placeholder="Buscar por nombre o por cédula..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <div style={{ marginLeft: "5px" }}>
                    <Button variant="success" onClick={() => setShowAddPrestamoModal(true)}>
                        Agregar Préstamo
                    </Button>
                </div>

            </InputGroup>
            {/* Tabla de préstamos */}
            <Table striped bordered hover style={{ marginTop: '10px' }}>
                <thead>
                    <tr>
                        <th style={{ width: "10px", fontSize: "15px" }}>Id Préstamo</th>
                        <th>Cédula</th>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>Tipo</th>
                        <th style={{ width: "10px", fontSize: "15px" }}>Monto Solicitado</th>
                        <th>Plazo</th>
                        <th>Saldo</th>
                        <th style={{ width: "10px", fontSize: "15px" }}>Cuota a pagar</th>
                        <th>Fecha de registro</th>
                        <th>Status</th>
                        <th style={{ width: "15%", fontSize: "15px" }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {prestamosFiltrados.map((prestamo) => (
                        <tr key={prestamo.idPrestamo}>
                            <td>{prestamo.idPrestamo}</td>
                            <td>{prestamo.usuario ? prestamo.usuario.cedula : ''}</td>
                            <td>{prestamo.usuario ? prestamo.usuario.nombre : ''}</td>
                            <td>{prestamo.usuario ? prestamo.usuario.apellidos : ''}</td>
                            <td>{prestamo.tipoPrestamo === 'adelantoDeSalario' ? 'Adelanto de salario' : 'Personal'}</td>
                            <td>{prestamo.montoPrestamo.toLocaleString()}</td>
                            <td>{getNombrePlazo(prestamo.plazoPrestamo)}</td>
                            <td>{prestamo.saldoPrestamo.toLocaleString()}</td>
                            <td>{prestamo.cuotaAPagar.toLocaleString()}</td>
                            <td>{formatFecha(prestamo.fechaSolicitud)}</td>
                            <td>{prestamo.status}</td>
                            <td>
                                <Button variant="info" className="btn-peq" onClick={() => handleEditCuotaAPagar(prestamo)}>Editar Cuota</Button>
                                <Button variant="danger" className="btn-peq" onClick={() => handleEditStatus(prestamo)}>Editar Status</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal para agregar préstamo */}
            <Modal show={showAddPrestamoModal} onHide={handleCloseAddPrestamoModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Préstamo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="cedula">
                            <Form.Label>Cédula del Usuario</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese la cédula del usuario"
                                value={nuevoPrestamo.cedula}
                                onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, cedula: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="tipoPrestamo">
                            <Form.Label>Tipo de Préstamo</Form.Label>
                            <Form.Control
                                as="select"
                                value={nuevoPrestamo.tipoPrestamo}
                                onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, tipoPrestamo: e.target.value })}
                            >
                                <option value="">Seleccionar...</option>
                                <option value="adelantoDeSalario">Adelanto de Salario</option>
                                <option value="personal">Personal</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="montoPrestamo">
                            <Form.Label>Monto del Préstamo</Form.Label>
                            <FormControl
                                type="text"
                                placeholder="Ingrese el monto del préstamo"
                                value={nuevoPrestamo.montoPrestamo.toLocaleString()} // Formatear el valor con separadores de millar
                                onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, montoPrestamo: Number(e.target.value.replace(/\D/g, '')) })} // Convertir a número y actualizar el estado
                            />
                        </Form.Group>
                    </Form>
                    <Form.Group controlId="plazoPrestamo">
                        <Form.Label>Plazo del Préstamo</Form.Label>
                        <Form.Control
                            as="select"
                            value={plazoPrestamo}
                            onChange={(e) => setPlazoPrestamo(e.target.value)}
                        >
                            <option value="">Seleccionar...</option>
                            <option value="12">Un año</option>
                            <option value="24">Dos años</option>
                            <option value="36">Tres años</option>
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddPrestamoModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={agregarPrestamo}>
                        Agregar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de error */}
            <Modal show={errorModal} onHide={() => setErrorModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Error al agregar préstamo</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ color: 'red' }}>
                    El usuario no existe o no tiene aportes suficientes para optar por este préstamo
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setErrorModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para cambiar status */}
            <Modal show={showStatusModal} onHide={handleCloseStatusModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedPrestamo && (
                        <Form>
                            <Form.Group>
                                <Form.Label>Id Préstamo:</Form.Label>
                                <Form.Control type="text" value={selectedPrestamo.idPrestamo} readOnly />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Nombre:</Form.Label>
                                <Form.Control type="text" value={selectedPrestamo.usuario.nombre} readOnly />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Apellidos:</Form.Label>
                                <Form.Control type="text" value={selectedPrestamo.usuario.apellidos} readOnly />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Monto Ahorro:</Form.Label>
                                <Form.Control type="text" value={selectedPrestamo.saldoPrestamo} readOnly />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Seleccionar Status:</Form.Label>
                                <Form.Control as="select" onChange={(e) => handleStatusChange(e.target.value)}>
                                    <option value="">Seleccionar...</option>
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseStatusModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={() => handleStatusChange(selectedPrestamo.status)}>
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para cambiar cuota a pagar */}
            <Modal show={showCuotaAPagarModal} onHide={handleCloseCuotaAPagarModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar cuota a Pagar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedPrestamo && (
                        <Form>
                            <Form.Group>
                                <Form.Label>Id Préstamo:</Form.Label>
                                <Form.Control type="text" value={selectedPrestamo.idPrestamo} readOnly />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Nombre:</Form.Label>
                                <Form.Control type="text" value={selectedPrestamo.usuario.nombre} readOnly />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Apellidos:</Form.Label>
                                <Form.Control type="text" value={selectedPrestamo.usuario.apellidos} readOnly />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Cuota Actual:</Form.Label>
                                <FormControl
                                    type="text"
                                    value={selectedPrestamo.cuotaAPagar.toLocaleString()} // Formatear el valor con separadores de millar
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Nueva Cuota:</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={nuevaCuotaAPagar}
                                    onChange={(e) => setNuevaCuotaAPagar(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCuotaAPagarModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleCuotaAPagarChange}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );
};

export default GestionPrestamos;
