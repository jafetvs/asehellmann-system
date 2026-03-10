import React, { useState } from 'react';
import axios from 'axios';
import { Button, Card, Form, Container} from 'react-bootstrap';
import './ReporteDeAsociados.css';
import { useUser } from "../../contexts/UserContext";

const ReporteDeAsociados = () => {
  const [userId, setUserId] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');
  const { user } = useUser();

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };
  
  const getUserDetails = async (userCedula) => {
    let totalPrestamos = 0;
    let totalFerias = 0;
    let aportesPersonalesAcumulado = 0;
    let nombre = '';
    let apellidos = '';
  
    try {
      const loansResponse = await axios.get(`https://localhost:7190/api/Prestamo/obtenerPrestamoEspecifico/${userCedula}`);
      const approvedLoans = loansResponse.data.filter(prestamo => prestamo.status === 'APROBADO');
      totalPrestamos = approvedLoans.length > 0 ? approvedLoans.reduce((acc, prestamo) => acc + prestamo.saldoPrestamo, 0) : 0;
      if (approvedLoans.length > 0) {
        nombre = approvedLoans[0].usuario.nombre;
        apellidos = approvedLoans[0].usuario.apellidos;
      }
    } catch (error) {
      console.error('Error al obtener los préstamos del usuario:', error);
    }
  
    try {
      const contributionsResponse = await axios.get(`https://localhost:7190/api/aporteAsociado/${userCedula}`);
      aportesPersonalesAcumulado = contributionsResponse.data.length > 0 ? contributionsResponse.data.reduce((acc, aporte) => acc + aporte.aportePersonal, 0) : 0;
      if (contributionsResponse.data.length > 0 && !nombre && !apellidos) {
        nombre = contributionsResponse.data[0].usuario.nombre;
        apellidos = contributionsResponse.data[0].usuario.apellidos;
      }
    } catch (error) {
      console.error('Error al obtener los aportes del usuario:', error);
    }

    try{
      const feriasResponse = await axios.get(`https://localhost:7190/api/registroPagoFeria/usuario/${userCedula}`);
      totalFerias = feriasResponse.data.length > 0 ? feriasResponse.data.reduce((acc, feria) => acc + (feria.montoCompra - feria.pagoRealizado), 0) : 0;
      if (feriasResponse.data.length > 0 && !nombre && !apellidos) {
        nombre = feriasResponse.data[0].usuario.nombre;
        apellidos = feriasResponse.data[0].usuario.apellidos;
      }
    } catch(error){
      console.error('Error al obtener los registros de ferias del usuario:', error);
    }

  
    const montoDisponible = aportesPersonalesAcumulado - (totalPrestamos + totalFerias);
  
    return {
      nombre,
      apellidos,
      totalPrestamos,
      totalFerias,
      aportesPersonalesAcumulado,
      montoDisponible
    };
  };

  const handleGetDetails = async () => {
    try {
      if (!userId) {
        setError('Debe ingresar un ID de usuario válido.');
        return;
      }
      const details = await getUserDetails(userId);
      setUserDetails(details);
      setError('');
    } catch (error) {
      setError('Ocurrió un error al obtener los detalles del usuario.');
    }
  };

  if (!user) {
    return null;
}
  return (
    <Container className="customContainerRDA">
    <Card >
      <Card.Body>
        <Card.Title>Reporte de monto disponible por usuario</Card.Title>
        <Card.Text>
          <Form.Control
            type="text"
            placeholder="Digite la cédula del usuario"
            value={userId}
            onChange={handleUserIdChange}
          />
        </Card.Text>
        <Button variant="primary" className='mb-4' onClick={handleGetDetails}>
          Ver datos
        </Button>
        {error && <p className="text-danger">{error}</p>}
        {userDetails && (
          <div>
             <img src="/images/logoAsehellmann.png" alt="Logo Asehellmann" className='imgLogo' />
            <h5 className="mt-4">Detalles del usuario:</h5>
            <p>Nombre: {userDetails.nombre + ' ' + userDetails.apellidos}</p>
            <p>Total Préstamos: {userDetails.totalPrestamos.toLocaleString()}</p>
            <p>Total Ferias: {userDetails.totalFerias.toLocaleString()}</p>
            <p>Acumulado de aportes personales: {userDetails.aportesPersonalesAcumulado.toLocaleString()}</p>
            <p><strong>Monto Disponible: {userDetails.montoDisponible.toLocaleString()} </strong></p>
          </div>
        )}
      </Card.Body>
    </Card>
    </Container>
  );
};

export default ReporteDeAsociados;
