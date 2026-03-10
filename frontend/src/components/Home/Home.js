import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [convenios, setConvenios] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://localhost:7190/api/convenios/ConveniosStatusActivo');
                setConvenios(response.data);
            } catch (error) {
                console.error('Error al cargar datos de convenios de la API:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="home-container">
            <div className="banner">
                <div className="banner-content">
                    <h1 className="banner-title">¿Estás asociado?</h1>
                    <p className="banner-subtitle">Inicia sesión en el módulo de autogestión para conocer tu estado dentro de la asociación</p>
                </div>
            </div>
            <div className="benefits-container">
                <div className="benefits-grid">
                    <div className="benefit-item">
                        <h3>Cesantía Laboral</h3>
                        <p>La cesantía tiene un límite, pero por ser parte de la asociación, Hellmann Service Center está comprometido en entregar a la asociación un aporte patronal (5% del salario bruto) a nombre del asociado durante todo el tiempo que dure la relación laboral, este aporte estará en custodia de la asociación.</p>
                    </div>
                    <div className="benefit-item">
                        <h3>Ahorro</h3>
                        <p>Por ser miembro de la asociación, cada empleado aportará un porcentaje como “Aporte personal” (5% de su salario bruto), esto en sí es un ahorro pues la asociación lo custodiará. Además, ASEHELLMANN pone a disposición de sus asociados diferentes líneas de ahorro diseñadas para ayudarle a cumplir sus metas.</p>
                    </div>
                    <div className="benefit-item">
                        <h3>Préstamos</h3>
                        <p>ASEHELLMANN pone a disposición de sus asociados diferentes líneas de crédito, con condiciones favorables para ellos, como préstamos personales con una tasa de interés anual del 20%, adelantos de salario con una tasa del 10%, entre otros.</p>
                    </div>
                </div>
                <div className="btn-more-info">
                    <Link to="/beneficios" style={{ textDecoration: 'none' }}>
                        <button className="btn-primary">Pulse aquí para obtener más información sobre estos y más beneficios</button>
                    </Link>
                </div>
            </div>
            <div className="current-convenios">
                <h2 className="question-header">NUESTROS ACTUALES CONVENIOS</h2>
                <div className="convenios-grid">
                    {convenios.map(convenio => (
                        <div key={convenio.id} className="convenio-card">
                            <h3>{convenio.nombre}</h3>
                            <p><strong>Correo:</strong> {convenio.correo}</p>
                            <p><strong>Contacto:</strong> {convenio.contacto}</p>
                            <p><strong>Descripción:</strong> {convenio.description}</p>
                            <p><strong>Enlace a la página web:</strong> <a href={convenio.enlacePaginaWeb} target='_blank'>{convenio.enlacePaginaWeb}</a></p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="partner-benefits">
                <h2 className="question-header">¿Cuáles son los beneficios que los convenios le otorgan como asociado?</h2>
                <div className="partner-benefits-grid">
                    <div className="benefit-item">
                        <img src="/images/eventoExclusivo.jpg" alt="eventoExclusivo" className="benefit-image" />
                        <h3>EVENTOS Y ACTIVIDADES EXCLUSIVAS</h3>
                        <p>Disfrutas de eventos especiales, charlas, seminarios, ferias y actividades culturales que no están disponibles para el público en general. Estas experiencias enriquecen tu vida y te brindan oportunidades de aprendizaje.</p>
                    </div>
                    <div className="benefit-item">
                        <img src="/images/comunidadSolidaridad.jpg" alt="comunidadSolidaridad" className="benefit-image" />
                        <h3>COMUNIDAD Y SOLIDARIDAD</h3>
                        <p>Al unirte a la asociación con estos convenios, te conviertes en parte de una comunidad unida que comparte los mismos beneficios. Esto fomenta un ambiente de apoyo y solidaridad entre los miembros.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
