import React, { useState, useEffect } from 'react';
import { Container, Modal, Table, Form } from 'react-bootstrap';
import axios from 'axios'; 
import './AporteAsociado.css'; 
import { useUser } from '../../contexts/UserContext';

const AporteAsociado = () => {
  const { user } = useUser();
  const [aportes, setAportes] = useState([]);
  

  const meses = {
    1: 'Enero',
    2: 'Febrero',
    3: 'Marzo',
    4: 'Abril',
    5: 'Mayo',
    6: 'Junio',
    7: 'Julio',
    8: 'Agosto',
    9: 'Septiembre',
    10: 'Octubre',
    11: 'Noviembre',
    12: 'Diciembre',
  };

  useEffect(() => {
    loadAportes();
  }, []);

  const loadAportes = async () => {
    try {
     const cedula = user.id;
      const response = await axios.get(`https://localhost:7190/api/aporteAsociado/${cedula}`);
      setAportes(response.data);
    } catch (error) {
      console.error('Error al cargar datos de la API:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Container className="mt-4 gestion-aportes-container">
      <h1 className="text-center mb-4">Aportes del Asociado</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Cédula</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Aporte Personal</th>
            <th>Aporte Patronal</th>
            <th>Mes</th>
            <th>Año</th>
          </tr>
        </thead>
        <tbody>
          {aportes.map((aporte) => (
            <tr key={aporte.id}>
              <td>{aporte.usuario.cedula}</td>
              <td>{aporte.usuario.nombre}</td>
              <td>{aporte.usuario.apellidos}</td>
              <td>{aporte.aportePersonal}</td>
              <td>{aporte.aportePatronal}</td>
              <td>{meses[aporte.mes]}</td>
              <td>{aporte.anio}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AporteAsociado;
