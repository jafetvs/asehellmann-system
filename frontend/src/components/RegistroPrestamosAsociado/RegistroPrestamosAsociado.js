import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './RegistroPrestamosAsociado.css'; // Importa el CSS de estilos
import { useUser } from '../../contexts/UserContext';

const RegistrosPrestamosAsociado = () => {
    
  const { user} = useUser();
  // Estados para almacenar las fechas de inicio y fin del filtro
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // Estado para almacenar los registros de prestamos originales y filtrados
  const [registrosOriginales, setRegistrosOriginales] = useState([]);
  const [registrosFiltrados, setRegistrosFiltrados] = useState([]);

  // Función para manejar el cambio de fecha "Desde" seleccionada
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  // Función para manejar el cambio de fecha "Hasta" seleccionada
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  // Función para filtrar los registros por el rango de fechas seleccionado
  const filtrarRegistros = () => {
    const registrosFiltrados = registrosOriginales.filter((registro) => {
      const fechaRegistro = new Date(registro.fechaRegistro);
      return isFechaValida(startDate, endDate, fechaRegistro);
    });
    setRegistrosFiltrados(registrosFiltrados);
  };

  // Función para verificar si una fecha está dentro del rango especificado
  const isFechaValida = (start, end, fecha) => {
    if (!start || !end || !fecha) return false;
    const startFecha = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
    const endFecha = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()));
    const fechaComparar = new Date(Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate()));
    return fechaComparar >= startFecha && fechaComparar <= endFecha;
  };

  // Función para cargar los registros de prestamos desde el backend
  const loadRegistros = async () => {
    try {
      const cedula = user.id;
      console.log(cedula);
      const response = await axios.get(`https://localhost:7190/api/RegistroPagoPrestamoController/mostrarRegistroPagoPrestamosPorUsuario/${cedula}`);
      const data = response.data;
      const registrosFormateados = data.map(registro => ({
        ...registro,
        fechaRegistro: registro.fechaRegistro.split('T')[0] // Formatear la fecha de registro
      }));
      console.log(registrosFormateados);
      setRegistrosOriginales(registrosFormateados);
      setRegistrosFiltrados(registrosFormateados);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Cargar los registros de prestamos al montar el componente
  useEffect(() => {
    loadRegistros();
  }, []); // Se ejecuta solo al montar el componente

  if(!user) return null;

  return (
    <div className="gestion-convenios-container d-flex flex-column align-items-center">
      <h3 className="mb-4">Registros de Préstamos</h3>

      {/* Selector de filtro por rango de fechas */}
      <div className="mb-4">
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Desde"
          className="form-control me-2"
        />
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="Hasta"
          className="form-control me-2"
        />
        <button className="btn btn-primary" onClick={filtrarRegistros}>
          Filtrar
        </button>
      </div>

      {/* Tabla con los datos de los registros de prestamos */}
      <table className="table table-striped mt-4new">
        <thead>
          <tr>
          <th>Cédula</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Tipo de Prestamos</th>
            <th>Plazo</th>
            <th>Plazo Realizado</th>
            <th>Cuota a Pagar</th>
            <th>Saldo del Prestamo</th>
            <th>Saldo Final</th>
            <th>Monto Total a Pagar</th>
            <th>Fecha de Registro</th>
            <th>Monto Registrado</th>
          </tr>
        </thead>
        <tbody>
          {registrosFiltrados.map((registro, index) => (
            <tr key={`${registro.mostrarPrestamo.id}_${index}`}>
              <td>{registro.mostrarPrestamo.usuario.cedula}</td>
              <td>{registro.mostrarPrestamo.usuario.nombre}</td>
              <td>{registro.mostrarPrestamo.usuario.apellidos}</td>
              <td>{registro.mostrarPrestamo.tipoPrestamo}</td>
              <td>{registro.mostrarPrestamo.plazoPrestamo}</td>
              <td>{registro.mostrarPrestamo.plazoRealizado}</td>
              <td>{registro.mostrarPrestamo.cuotaAPagar}</td>
              <td>{registro.mostrarPrestamo.saldoPrestamo}</td>
              <td>{registro.mostrarPrestamo.saldoFinal}</td>
              <td>{registro.mostrarPrestamo.totalMontoPagar}</td>
              <td>{registro.fechaRegistro}</td>
              <td>{registro.montoPrestamoRegistrado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegistrosPrestamosAsociado;
