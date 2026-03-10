/*
import React from 'react';
import { Link } from 'react-router-dom';
import './HomeNavbar.css';

const HomeNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light text-dark"  style={{ width: '100%', height: '100px'}} >
      <div className="">
        <img src="/images/logoAsehellmann.png" alt="Logo" className="mx-4" style={{ width: '90px', height: '70px' }} />
      </div>
      <Link className="ms-4 navbar-brand" to="/"><img src="/images/homeIcon.png" alt="home" width="30" height="30"/>
        Inicio
      </Link>
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav">
          <li className="nav-item">
          <Link className="nav-link" to="/nosotros"><img src="https://cdn-icons-png.flaticon.com/512/15/15659.png" width="25" alt="nosotros "height="25" className="me-1" />
              Nosotros
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/beneficios"><img src="/images/benefitsIcon.png" width="25" height="25" alt="beneficios"  className="me-1" />
              Beneficios
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contactenos"><img src="/images/contactIcon.png" width="20" height="20" alt="contacto" className="me-1" />
              Contáctenos
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <Link to="/login" className="ml-2 me-4 btn loginButton"> <img src="images/logoutIcon.png" alt="Cs" width="15" height="15" className="mx-1" />
          Iniciar sesión
        </Link>
      </div>
    </nav>
  );
}

export default HomeNavbar;
*/

import React from 'react';
import { Link } from 'react-router-dom';
import './HomeNavbar.css';

const HomeNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light text-dark" style={{ width: '100%', height: '100px'}} >
      <div className="">
        <img src="/images/logoAsehellmann.png" alt="Logo" className="mx-4" style={{ width: '90px', height: '70px' }} />
      </div>
      <Link className="ms-auto me-4 navbar-brand" to="/">
        Inicio
      </Link>
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/nosotros">
              Nosotros
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/beneficios">
              Beneficios
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contactenos">
              Contáctenos
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <Link to="/login" className="ml-2 me-4 btn ">
          <img src="/images/userIcon.png" alt="Usuario" width="20" height="20" className="mx-1" />
          Login
        </Link>
      </div>
    </nav>
  );
}

export default HomeNavbar;
