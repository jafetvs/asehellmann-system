import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { useUser } from '../../contexts/UserContext';
import './PrevisualizarPrestamo.css';

const PrevisualizarPrestamo = () => {
    const [montoPrestamo, setMontoPrestamo] = useState('');
    const [plazoPrestamo, setPlazoPrestamo] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [respuestaSolicitud, setRespuestaSolicitud] = useState(null); // Estado para almacenar la respuesta de la solicitud

    const { user } = useUser();

    const handleMontoChange = (e) => {
        setMontoPrestamo(e.target.value);
    };

    const handlePlazoChange = (e) => {
        setPlazoPrestamo(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(`https://localhost:7190/api/Prestamo/previsualizar/${montoPrestamo}/${plazoPrestamo}`);
            console.log('Respuesta del API:', response.data);
            setRespuestaSolicitud(response.data); // Almacena la respuesta en el estado
            setModalOpen(true); // Abre el modal después de enviar la solicitud
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
        }
    };

    if (!user) {
        return null;
    }
    return (
        <>
            <Container className="container-Prev">
                <Row>
                    <Col>
                            <h4>Previsualización de Préstamo</h4>
                            <form onSubmit={handleSubmit}>
                                <label className='mt-4'>
                                    Monto del préstamo:
                                    <input type="number" className="form-control" value={montoPrestamo} onChange={handleMontoChange} />
                                </label>
                                <br />
                                <label className='mt-4'>
                                    Plazo del préstamo:
                                    <select className="form-select" value={plazoPrestamo} onChange={handlePlazoChange}>
                                        <option value="" disabled selected>Selecciona un plazo</option>
                                        <option value="12">Un año</option>
                                        <option value="24">Dos años</option>
                                        <option value="36">Tres años</option>
                                    </select>
                                </label>
                                <br />
                                <button type="submit" className="btn btn-primary mt-4">Enviar solicitud</button>
                            </form>
                    </Col>
                    <Col className='text-center'>
                        <img src="/images/logoAsehellmann.png" alt="Imagen del préstamo" style={{ maxWidth: '100%' }} />
                        <h1>“Unidos por el bienestar común de nuestros asociados”</h1>
                    </Col>
                </Row>
                {respuestaSolicitud && (
                    <Table striped bordered hover className="mt-4">
                        <thead>
                            <tr>
                                <th>Mes</th>
                                <th>Saldo del préstamo</th>
                                <th>Cuota a pagar</th>
                                <th>Principal</th>
                                <th>Intereses</th>
                                <th>Saldo final</th>
                            </tr>
                        </thead>
                        <tbody>
                            {respuestaSolicitud.detalles.map((detalle, index) => (
                                <tr key={index}>
                                    <td>{detalle.mes}</td>
                                    <td>{detalle.saldoPrestamo}</td>
                                    <td>{detalle.cuotaPagar}</td>
                                    <td>{detalle.principal}</td>
                                    <td>{detalle.intereses}</td>
                                    <td>{detalle.saldoFinal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Container>
        </>
    );
};

export default PrevisualizarPrestamo;
