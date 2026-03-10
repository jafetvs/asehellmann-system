import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Button, Spinner, Container, Card, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useUser } from '../../contexts/UserContext';
import './ReporteMensual.css'; 

const ReporteMensual = () => {
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const { user } = useUser();

  const handleExchangeRateChange = (e) => {
    const rate = e.target.value;
    setExchangeRate(rate);
    setIsButtonDisabled(rate === '' || isNaN(parseFloat(rate)));
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get('https://localhost:7190/api/usuarios/GetUsuarios');
        const activeUsers = usersResponse.data.filter(user => user.status === 'ACTIVO');
        const usersWithDetails = await Promise.all(activeUsers.map(user => getUserDetails(user)));
        setUserData(usersWithDetails);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const divideAndRoundToThreeDecimals = (number) =>{
    let result = number / exchangeRate;
    // Redondea el resultado a tres decimales
    result = Math.round(result * 1000) / 1000;
    return result;
  }

  const getUserDetails = async (user) => {

    let userDetails = {
      ...user,
      totalPrestamos: null,
      totalAhorros: null,
      totalFerias: null,
    };

    // Obtener préstamos
    try {
      const loansResponse = await axios.get(`https://localhost:7190/api/Prestamo/obtenerPrestamoEspecifico/${user.cedula}`);
      const approvedLoans = loansResponse.data.filter(prestamo => prestamo.status === 'APROBADO');
      if (approvedLoans.length > 0) {
        userDetails.totalPrestamos = divideAndRoundToThreeDecimals(approvedLoans.reduce((acc, prestamo) => acc + prestamo.cuotaAPagar, 0));
      } else {
        userDetails.totalPrestamos = 0;
      }
    } catch (error) {
      userDetails.totalPrestamos = 0;
    }

    // Obtener ahorros
    try {
      const savingsResponse = await axios.get(`https://localhost:7190/api/Ahorro/obtenerAhorroEspecifico/${user.cedula}`);
      const activeSavings = savingsResponse.data.filter(ahorro => ahorro.status === 'VIGENTE');
      if (activeSavings.length > 0) {
        userDetails.totalAhorros = divideAndRoundToThreeDecimals(activeSavings.reduce((acc, ahorro) => acc + ahorro.montoDebitar, 0));
      } else {
        userDetails.totalAhorros = 0;
      }
    } catch (error) {
      userDetails.totalAhorros = 0;
    }

    //Obtener pagos en ferias
    try {
      const feriasResponse = await axios.get(`https://localhost:7190/api/registroPagoFeria/usuario/${user.cedula}`);
    if(feriasResponse.data.length > 0){
      //aquí lo ideal es montoPagarMes en lugar de acc + (feria.montoCompra - feria.pagoRealizado / 6)
      userDetails.totalFerias = divideAndRoundToThreeDecimals(feriasResponse.data.reduce((acc, feria) => acc + ((feria.montoCompra - feria.pagoRealizado) / 6), 0));
    } else{
      userDetails.totalFerias = 0;
    }
  } catch (error) {
    userDetails.totalFerias = 0;
  }



    return userDetails;

  };

  const generateExcel = async () => {
    const formattedDate = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`; // Formatear la fecha en "día/mes/año"
    try {
      const userDetails = await Promise.all(userData.map(async (user) => {
        return await getUserDetails(user);
      }));

      // Calcular totales
      const totals = userDetails.reduce((acc, user) => {
        acc.totalPrestamos += user.totalPrestamos;
        acc.totalAhorros += user.totalAhorros;
        acc.totalFerias += user.totalFerias;
        return acc;
      }, {
        totalPrestamos: 0,
        totalAhorros: 0,
        totalFerias: 0,
      });


      const wb = XLSX.utils.book_new();
      const wsData = [
        ['PayDate', formattedDate],
        ['File#', 'Name', 'SSN#', 'Préstamos', 'Ferias', 'Ahorros'],
        ...userDetails.map(user => [
          user.idEmpleado,
          `${user.nombre} ${user.apellidos}`,
          user.cedula,
          user.totalPrestamos,
          user.totalFerias,
          user.totalAhorros,
        ]),
        [], // Fila en blanco
        [], // Fila en blanco
        ['', '', 'TOTALES:', totals.totalPrestamos, totals.totalFerias, totals.totalAhorros], ,
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Ancho de las columnas
      ws['!cols'] = [
        { wpx: 100 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Monthly Report');

      XLSX.writeFile(wb, `monthly_payroll_${formattedDate}.xlsx`);
    } catch (error) {
      console.error('Error generating Excel:', error);
    }
  };

  if (!user) {
    return null;
  }
  
  return (
    <Container className="customContainer">
      <Card>
        <Card.Header>
          <h5 className="text-center">Reporte mensual de deducciones de planilla</h5>
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3" controlId="startDate">
              <Form.Label>Seleccionar fecha de pago ligada al reporte:</Form.Label>
              <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                className="form-control"
                dateFormat="yyyy-MM-dd"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exchangeRate">
              <Form.Label>Tipo de cambio, un dólar equivale a # colones:</Form.Label>
              <Form.Control
                className="exchangeRateInput"
                type="number"
                placeholder="Ingrese el tipo de cambio"
                min={0}
                value={exchangeRate}
                onChange={handleExchangeRateChange}
                required // Campo requerido
              />
            </Form.Group>
            {isLoading ? (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
            ) : (
              <Button variant="primary" onClick={generateExcel} disabled={isButtonDisabled}>
                Generar Excel
              </Button>
            )}
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
};
export default ReporteMensual;
