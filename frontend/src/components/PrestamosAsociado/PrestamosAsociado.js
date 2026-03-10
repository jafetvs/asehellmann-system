import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import './PrestamosAsociado.css'; // Importa el CSS de estilos
import { useUser } from '../../contexts/UserContext';

const PrestamosAsociado = () => {
    const { user } = useUser();
    const [registrosOriginales, setRegistrosOriginales] = useState([]);
    
    // Función para cargar los registros de préstamos desde el backend
    const loadRegistros = async () => {
      try {
        const cedula = user.id;
        const response = await axios.get(`https://localhost:7190/api/Prestamo/obtenerPrestamoEspecifico/${cedula}`);
        const data = response.data;
        setRegistrosOriginales(data);
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    // Cargar los registros de préstamos al montar el componente
    useEffect(() => {
      loadRegistros();
    }, []); // Se ejecuta solo al montar el componente
  

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

    if (!user) return null;
    return (
      <div className="prestamos-asociados-container">
        <h3 className="mb-4 text-center">Préstamos del asociado</h3>
  
        {/* Tabla con los datos de los registros de préstamos */}
        <table className="table table-striped">
          <thead>
            <tr>
            {/*<th>ID de Préstamo</th>*/}
              <th>Tipo de Préstamo</th>
              <th>Monto del Préstamo</th>
              <th>Intereses</th>
              <th>Fecha de Solicitud</th>
              <th>Plazo del Préstamo</th>
              <th>Saldo del Préstamo</th>
              <th>Cuota a Pagar</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {registrosOriginales.map((prestamo) => (
              <tr key={prestamo.idPrestamo}>
                {/*<td>{prestamo.idPrestamo}</td>*/}
                <td>{prestamo.tipoPrestamo === 'adelantoDeSalario' ? 'Adelanto de salario' : 'Personal'}</td>
                <td>{prestamo.montoPrestamo}</td>
                <td>{prestamo.intereses * 100}%</td>
                <td>{formatFecha(prestamo.fechaSolicitud)}</td>
                <td>{getNombrePlazo(prestamo.plazoPrestamo)}</td>
                <td>{prestamo.saldoPrestamo}</td>
                <td>{prestamo.cuotaAPagar}</td>
                <td>{prestamo.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

export default PrestamosAsociado;


