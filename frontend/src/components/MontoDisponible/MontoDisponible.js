import React, { useState } from 'react';
import axios from 'axios';
import { Button, Card, Container } from 'react-bootstrap';
import { useUser } from "../../contexts/UserContext";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './MontoDisponible.css';

const MontoDisponible = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');
  const { user } = useUser();

  const getUserDetails = async (userCedula) => {
    let totalPrestamos = 0;
    let aportesPersonalesAcumulado = 0;
    let totalFerias = 0;
    let nombre = '';
    let apellidos = '';
    let prestamos = [];
    let ferias = [];
    let aportes = [];

    try {
      const loansResponse = await axios.get(`https://localhost:7190/api/Prestamo/obtenerPrestamoEspecifico/${userCedula}`);
      const approvedLoans = loansResponse.data.filter(prestamo => prestamo.status === 'APROBADO');
      totalPrestamos = approvedLoans.length > 0 ? approvedLoans.reduce((acc, prestamo) => acc + prestamo.saldoPrestamo, 0) : 0;
      if (approvedLoans.length > 0) {
        nombre = approvedLoans[0].usuario.nombre;
        apellidos = approvedLoans[0].usuario.apellidos;
      }
      prestamos = approvedLoans;
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
      aportes = contributionsResponse.data;
    } catch (error) {
      console.error('Error al obtener los aportes del usuario:', error);
    }

    try {
      const feriasResponse = await axios.get(`https://localhost:7190/api/registroPagoFeria/usuario/${userCedula}`);
      totalFerias = feriasResponse.data.length > 0 ? feriasResponse.data.reduce((acc, feria) => acc + (feria.montoCompra - feria.pagoRealizado), 0) : 0;
      if (feriasResponse.data.length > 0 && !nombre && !apellidos) {
        nombre = feriasResponse.data[0].usuario.nombre;
        apellidos = feriasResponse.data[0].usuario.apellidos;
      }
      ferias = feriasResponse.data;
    } catch (error) {
      console.error('Error al obtener los registros de ferias del usuario:', error);
    }

    const montoDisponible = aportesPersonalesAcumulado - (totalPrestamos + totalFerias);

    return {
      nombre,
      apellidos,
      totalPrestamos,
      totalFerias,
      aportesPersonalesAcumulado,
      montoDisponible,
      prestamos,
      ferias,
      aportes
    };
  };

  const handleGetDetails = async () => {
    try {
      if (!user.id) {
        setError('Debe iniciar sesión para ver los detalles.');
        return;
      }
      const details = await getUserDetails(user.id);
      setUserDetails(details);
      setError('');
    } catch (error) {
      setError('Ocurrió un error al obtener los detalles del usuario.');
    }
  };


  const generatePDF = () => {
    if (!userDetails) return;
    const date = new Date().toLocaleDateString();

    const doc = new jsPDF();
    const { nombre, apellidos, montoDisponible, prestamos, aportes, ferias, totalPrestamos, totalFerias, aportesPersonalesAcumulado } = userDetails;

    // Título del PDF
    doc.setFontSize(20);
    doc.setTextColor(40); // Color del texto
    doc.setFont('bold');
    doc.text(`ASEHELLMANN`, 105, 30, null, null, 'center'); // Título centrado

    // Subtítulo
    doc.setFontSize(14);
    doc.setTextColor(0); // Color del texto
    doc.setFont('normal');
    doc.text(`Unidos por el bienestar común de nuestros asociados`, 105, 40, null, null, 'center'); // Subtítulo centrado

    // Línea decorativa
    doc.setLineWidth(0.5);
    doc.line(20, 50, 190, 50);

    // Información del reporte
    doc.setFontSize(12);
    doc.setTextColor(0); // Color del texto
    doc.setFont('normal');
    doc.text(`Reporte de monto disponible para ${nombre} ${apellidos}, cédula ${user.id} al día ${date}`, 20, 60);

    // Agregar imagen en una esquina
    const imgData = '/images/logoAsehellmann.png';
    doc.addImage(imgData, 'PNG', 20, 15, 30, 30); // Posición de la imagen

    // Información del usuario
    doc.setFontSize(12);
    doc.setTextColor(0); // Color del texto
    doc.setFont('normal');


    // Tabla de préstamos
    doc.autoTable({
      startY: 75,
      head: [['Préstamo', 'Tipo', 'Fecha de solicitud', 'Saldo']],
      body: prestamos.map((prestamo, index) => {
        // Formatear la fecha
        const fecha = new Date(prestamo.fechaSolicitud).toLocaleDateString();

        // Formatear el tipo de préstamo
        const tipoPrestamo = prestamo.tipoPrestamo
          .replace(/([A-Z])/g, ' $1') // inserta un espacio antes de los elementos en mayúscula
          .replace(/^./, str => str.toUpperCase()); // convierte el primer carácter en mayúscula

        return [index + 1, tipoPrestamo, fecha, prestamo.saldoPrestamo];
      }),
    });

    // Total de saldos de préstamos
    doc.text(`Total de saldos de préstamos: ${totalPrestamos.toLocaleString()}`, 20, doc.previousAutoTable.finalY + 10);

    // Tabla de ferias
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 20,
      head: [['Nombre del proveedor', 'Fecha de la feria', 'Monto de la compra', 'Pago realizado']],
      body: ferias.map((feria) => [
        feria.feriaProveedor.nombreProveedor,
        new Date(feria.feriaProveedor.fechaFeria).toLocaleDateString(),
        feria.montoCompra,
        feria.pagoRealizado
      ]),
    });


    // Total de ferias
    doc.text(`Total de saldos de ferias: ${totalFerias.toLocaleString()}`, 20, doc.previousAutoTable.finalY + 10);


    // Tabla de aportes
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 20,
      head: [['Aporte', 'Mes', 'Año', 'Aporte personal']],
      body: aportes.map((aporte, index) => [index + 1, aporte.mes, aporte.anio, aporte.aportePersonal]),
    });

    // Total de aportes personales
    doc.text(`Total de aportes personales: ${aportesPersonalesAcumulado.toLocaleString()}`, 20, doc.previousAutoTable.finalY + 10);


    // Monto disponible para préstamos
    doc.setFont("helvetica", "bold");
    doc.text(`Monto disponible para préstamos: ${montoDisponible.toLocaleString()}`, 20, doc.previousAutoTable.finalY + 40);
    doc.setFont("helvetica", "normal");

    // Guardar el PDF
    doc.save(`Reporte_${nombre} ${apellidos}_${date}.pdf`);
  };

  if (!user) {
    return null;
  }
  return (
    <Container className="customContainerMD">
      <Card>
        <Card.Body className='text-center'>

          <Card.Title className="text-center mb-4">Reporte de monto disponible para préstamos</Card.Title>
          <Button variant="primary" className="mb-4 me-2" onClick={handleGetDetails}>
            Ver datos
          </Button>
          <Button variant="success" className='mb-4' onClick={generatePDF}>
            Generar desgloce en PDF
          </Button>
          {error && <p className="text-danger">{error}</p>}
          {userDetails && (
            <div>
              <img src="/images/logoAsehellmann.png" alt="Logo Asehellmann" className='imgLogo' />
              <h5 className="mt-4 mb-3 text-center">Detalles del Usuario</h5>
              <p><strong>Nombre:</strong> {userDetails.nombre + ' ' + userDetails.apellidos}</p>
              <p><strong>Número de cédula:</strong> {user.id}</p>
              <p><strong>Total Préstamos:</strong> {userDetails.totalPrestamos.toLocaleString()}</p>
              <p><strong>Total Ferias:</strong> {userDetails.totalFerias.toLocaleString()}</p>
              <p><strong>Acumulado de aportes personales:</strong> {userDetails.aportesPersonalesAcumulado.toLocaleString()}</p>
              <p><strong>Monto Disponible:</strong> {userDetails.montoDisponible.toLocaleString()} </p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MontoDisponible;