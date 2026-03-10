import React from "react";
import './Nosotros.css';

const Nosotros = () => {
    return (
        <div className="nosotros-container">
            <div className="banner">
                <div className="banner-content">
                    <h1 className="banner-title">SOBRE ASEHELLMANN</h1>
                    <p className="banner-subtitle">“Unidos por el bienestar común de nuestros asociados”</p>
                </div>
            </div>
            <div className="container-mt">
                <div className="row">
                    <div className="col-sm">
                        <div className="text-center">
                            <img src="/images/mision.avif" alt="Misión" className="img-fluid" />
                        </div>
                        <div className="benefit-item">
                            <h3 className="sub-title">MISIÓN</h3>
                            <p>Promover el bienestar socioeconómico de nuestros asociados y sus familias a través de una gestión segura,
                                eficiente y rentable</p>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="text-center">
                            <img src="/images/vision.avif" alt="Visión" className="img-fluid" />
                        </div>
                        <div className="benefit-item">
                            <h3 className="sub-title">VISIÓN</h3>
                            <p>Ser la primera opción de nuestros asociados en la búsqueda de soluciones integrales para su bienestar y
                                el de sus familias</p>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="text-center">
                            <img src="/images/jovenes.avif" alt="Valores" className="img-fluid" />
                        </div>
                        <div className="benefit-item">
                            <h3 className="sub-title">VALORES</h3>
                            Solidaridad <br />{/*Promover la colaboración y apoyo mutuo entre los miembros de la asociación.*/}
                            Equidad <br />{/*Buscar la igualdad de oportunidades y trato justo para los asociados sin importar su origen, género o condición social.*/}
                            Transparencia <br />{/*Mantener una comunicación abierta y honesta garantizando la confianza de los asociados.*/}
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-sm">
                <div className="benefit-item-personalizado">
                    <h3 className="sub-title text-center margin-tp">MIEMBROS DE LA JUNTA DIRECTIVA 2024-2025</h3>
                    <div className="text-center">
                        <img src="/images/logoAsehellmann.png" alt="Junta Directiva" className="img-fluid" />
                    </div>
                    <div className="margin-tp text-center">
                        <p>Responsable de la toma de decisiones y la gestión de los asuntos administrativos y financieros de la asociación, con el objetivo de promover el bienestar y los intereses de sus miembros, así como coordinar actividades de responsabilidad social y bienestar en la organización.</p>
                        <p><strong>Presidencia:</strong> Paola Barquero<br />
                            <strong>Vicepresidencia:</strong> Luis Martínez<br />
                            <strong>Secretaría:</strong> Maribel Vega<br />
                            <strong>Tesorería:</strong> Adriana Cordero<br />
                            <strong>Vocal:</strong> Isel Quesada<br />
                            <strong>Fiscal:</strong> Adriana Quesada<br />
                            <strong>Suplente fiscal:</strong> Mónica Mejía<br /></p>
                            
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Nosotros;
