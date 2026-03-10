import React from "react";
import "./Contactenos.css"; 

const Contactenos = () => {
  return (
    <div className="contactenos-container">
      <div className="container">
        <div className="row fila container">
          <div className="col-md-4">
            <img
              src="/images/reloj.avif"
              alt="ahorro"
              className="img-fluid-reloj img-thumbnail"
            />
          </div>
          <div className="col-md-8">
            <h1 className="display-6 margen-abajo">HORARIO DE ATENCIÓN </h1> <h3 className="margen-abajo-plus">Lunes a viernes, de 7:00am a 4:30pm</h3> 
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-sm">
          <div className="contacto-item">
              <h6 className="text-center">PRESIDENCIA</h6>
              <p>
                <strong>Paola Barquero Rodríguez</strong>
                <br />
                <strong>Correo electrónico: </strong>
                <a href="mailto:paola.barquero@hellmann.com">
                  paola.barquero@hellmann.com
                </a>
              </p>
            </div>
          </div>
          <div className="col-sm">
            <div className="contacto-item">
              <h6 className="text-center">VICEPRESIDENCIA</h6>
              <p>
                <strong>Luis Martinez</strong>
                <br />
                <strong>Correo electrónico: </strong>
                <a href="mailto:luis.martinez@hellmann.com">
                  luis.martinez@hellmann.com
                </a>
              </p>
            </div>
          </div>
          <div className="col-sm">
            <div className="contacto-item">
              <h6 className="text-center">TESORERÍA</h6>
              <p>
                <strong>Adriana Cordero León</strong>
                <br />
                <strong>Correo electrónico: </strong>
                <a href="mailto:acordero@hellmann.com">acordero@hellmann.com</a>
              </p>
            </div>
          </div>
          <div className="col-sm">
            <div className="contacto-item">
              <h6 className="text-center">CONTACTO GENERAL DE LA ASOCIACIÓN</h6>
              <p>
                <strong>Nombre: </strong>ASEHELLMANN
                <br />
                <strong>Correo electrónico: </strong>
                <a href="mailto:asehellmann@hellmann.com">
                  asehellmann@hellmann.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contactenos;
