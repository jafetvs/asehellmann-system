import React from 'react';
import './UserForms.css';
import { Card, Button } from 'react-bootstrap';
import { useUser } from '../../contexts/UserContext';


const UserForms = () => {
    const { user } = useUser();

    const descargarDocumento = (url, nombreArchivo) => {
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = nombreArchivo;
        enlace.click();
    }
   
    if (!user) {
        return null;
      }

    return (
        <div className='contenedor'>
            <div className='cardPersonalizado'>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="/images/prestamo.jpg" />
                    <Card.Body>
                        <Card.Title className='text-center'>Formulario solicitud de préstamo</Card.Title>
                        <Card.Text>
                        Presione el botón de descarga para obtener el formulario de solicitud de préstamo en formato xlsx.
                        </Card.Text>
                        <Button variant="primary" className="button-color" onClick={() => descargarDocumento('/documents/PrestamoArchivo.xlsx', 'Solicitud - PRESTAMO-ADELANTO DE SALARIO.xlsx')}>
                            Descargar solicitud de préstamo
                     </Button>
                    </Card.Body>
                </Card>
            </div>
            <div className='cardPersonalizado'>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="/images/ahorro.avif" />
                    <Card.Body>
                        <Card.Title className='text-center'>Formulario solicitud de ahorro</Card.Title>
                        <Card.Text>
                        Presione el botón de descarga para obtener el formulario de solicitud de ahorro en formato pdf.
                        </Card.Text>
                        <Button variant="primary" className="button-color" onClick={() => descargarDocumento('/documents/AhorroArchivo.pdf', 'Solicitud - AHORRO.pdf')}>
                            Descargar solicitud de ahorro
                     </Button>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default UserForms;