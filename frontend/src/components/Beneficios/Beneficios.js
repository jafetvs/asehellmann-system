import React from "react";
import './Beneficios.css';
import { Link } from 'react-router-dom';

const Beneficios = () => {
    const descargarDocumento = (url, nombreArchivo) => {
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = nombreArchivo;
        enlace.click();
    }

    return (
        <div className="beneficios-container">
            <div className="banner">
                <div className="banner-content">
                    <h1 className="banner-title">BENEFICIOS DE NUESTROS ASOCIADOS</h1>
                    <p className="banner-subtitle">¡Sea parte de ASEHELLMANN!</p>
                    <button className="btn button-color-descarga" onClick={() => descargarDocumento('/documents/AfiliacionArchivo.pdf', 'Formulario de Afiliacion a ASEHELLMANN.pdf')}>
                        Descargar Formulario de Afiliación
                    </button>
                </div>
            </div>

            <div className="beneficios-container">
                <div className="container">
                    <div className="row fila">
                        <div className="col-md-4">
                            <div className="position card">
                                <img src="/images/prestamo.jpg" alt="prestamos" className="card-img-top" />
                                <div className="card-body">
                                    <h5 className="card-title">Préstamos</h5>
                                    <p className="card-text">
                                        A) El monto máximo del préstamo está limitado por el monto disponible de cada asociado, que es el total de su "Aporte Personal" menos las deudas contraídas con la asociación.
                                        B) La tasa de interés es del 20% anual.
                                        C) Los préstamos se otorgan a 12 meses, con la posibilidad de ampliar el plazo a 24 meses si el monto es elevado.
                                        D) Las solicitudes de préstamo se reciben durante la semana y los fondos se depositan en la cuenta del asociado en el banco Davivienda los jueves.
                                        E) Si el asociado prefiere transferir los fondos a otro banco, debe cubrir los costos de la transferencia.
                                        F) Los adelantos de salario que cumplan con las condiciones para ser a tasa 0 también se solicitan por correo y están sujetos a revisión de la Junta Directiva.
                                    </p>
                                    <Link className="btn btn-primary" to="/login">Inicie sesión para descargar solicitud</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="position card">
                                <img src="/images/ahorro.avif" alt="ahorro" className="card-img-top" />
                                <div className="card-body">
                                    <h5 className="card-title">Ahorro</h5>
                                    <p className="card-text">
                                        Si así lo desean los asociados pueden hacer un ahorro extraordinario por el monto que
                                        deseen, para hacerlo en una cuota fija se verá reflejado en el sistema que la empresa
                                        usa para las planillas en Dólares pero la contabilidad de la asociación está en colones
                                        por lo que el reembolso se hará en Colones.
                                    </p>
                                    <Link className="btn btn-primary" to="/login">Inicie sesión para descargar solicitud</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="position card">
                                <img src="/images/eventoExclusivo.jpg" alt="convenios" className="card-img-top" />
                                <div className="card-body">
                                    <h5 className="card-title">Convenios</h5>
                                    <p className="card-text">
                                        Nuestros convenios son acuerdos o contratos establecidos entre la asociación y diversas empresas o entidades con el
                                        propósito de ofrecer beneficios y servicios especiales a los empleados que son miembros de la asociación.
                                        Estos convenios son una parte fundamental de la operación de una asociación solidarista, ya que buscan enriquecer
                                        la vida de sus asociados y sus familias al proporcionar acceso a una variedad de servicios y descuentos exclusivos.
                                    </p>
                                    <Link className="btn btn-primary" to="/">Ver convenios</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Beneficios;
