import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { Modal, Button } from 'react-bootstrap';

const AdminNavbar = () => {
  const { user, logout } = useUser();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const [changePasswordData, setChangePasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [changePasswordError, setChangePasswordError] = useState(null);

  const [passwordValido, setPasswordValido] = useState(true);

  const validarPassword = (password) => {
    const regexLength = /.{8,}/;
    const regexUpperCase = /[A-Z]/;
    const regexVowels = /[aeiou]/i;
    const regexSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    return (
      regexLength.test(password) &&
      regexUpperCase.test(password) &&
      regexVowels.test(password) &&
      regexSpecialChar.test(password)
    );
  };

  const handleInputChangeChangePassword = (e) => {
    const { name, value } = e.target;
    setChangePasswordData({ ...changePasswordData, [name]: value });
    if (name === 'newPassword') {
      setPasswordValido(validarPassword(value));
    }
  };

  const handleCloseChangePasswordModal = () => {
    setShowChangePasswordModal(false);
    setChangePasswordData({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setChangePasswordError(null);
  };

  const handleOpenChangePasswordModal = () => {
    setShowChangePasswordModal(true);
  };

  const handleChangePassword = async () => {
    const { oldPassword, newPassword, confirmNewPassword } = changePasswordData;
    if (newPassword !== confirmNewPassword) {
      setChangePasswordError("Las nuevas contraseñas no coinciden");
      return;
    }
    try {
      const response = await fetch('https://localhost:7190/api/usuarios/CambiarContrasenia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: user.id,
          oldPassword: oldPassword,
          newPassword: newPassword
        })
      });
      if (!response.ok) {
        throw new Error('No se pudo cambiar la contraseña');
      }
      setChangePasswordError(null);
      setShowChangePasswordModal(false);
    } catch (error) {
      setChangePasswordError(error.message);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light text-dark" style={{ width: '100%', height: '100px', position: '' }}>
      <div className="logo-container">
        <img src="/images/logoAsehellmann.png" alt="Logo" className="mx-4" style={{ width: '90px', height: '70px' }} />
      </div>
      <Link className="ms-2 navbar-brand" to="/admin">Inicio</Link>
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/gestion-usuarios">Usuarios</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/gestion-aportes">Aportes</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/gestion-convenios">Convenios</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/gestion-ahorros">Ahorros</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/gestion-prestamos">Préstamos</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/gestion-ferias">Ferias</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/gestion-pagosferias">Pagos-Ferias</Link></li>
            <li className="nav-item">
            <Link className="nav-link" to="/registros-ahorros">Registros de Ahorros</Link></li>
            

          <li className="nav-item dropdown">
            
            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Ver más
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><Link className="dropdown-item" to="/registros-prestamos">Registros de Préstamos</Link></li>

              <li><Link className="dropdown-item" to="/reporte-mensual">Reporte mensual</Link></li>
              <li><Link className="dropdown-item" to="/reporte-de-asociados">Montos disponibles</Link></li>
            </ul>
          </li>
        </ul>
      </div>
      <div className="ml-auto dropdown">
        <button className="ml-2 me-4 btn text-dark dropdown-toggle" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="images/userIcon.png" alt="Cs" width="20" height="20" className="mx-2" />
          {user.username}
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li><button className="dropdown-item" onClick={handleOpenChangePasswordModal}>Cambiar contraseña</button></li>
          <li><button className="dropdown-item" onClick={() => { logout(); }}>Cerrar sesión</button></li>
        </ul>
        <Modal show={showChangePasswordModal} onHide={handleCloseChangePasswordModal}>
          <Modal.Header closeButton>
            <Modal.Title>Cambiar contraseña</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label htmlFor="oldPassword">Contraseña Anterior</label>
              <input
                type="password"
                className="form-control"
                id="oldPassword"
                name="oldPassword"
                value={changePasswordData.oldPassword}
                onChange={handleInputChangeChangePassword}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">Nueva Contraseña</label>
              <input
                type="password"
                className={`form-control ${!passwordValido ? "is-invalid" : ""}`}
                id="newPassword"
                name="newPassword"
                value={changePasswordData.newPassword}
                onChange={handleInputChangeChangePassword}
              />
              {!passwordValido && (
                <div className="invalid-feedback">
                  La contraseña debe tener al menos 8 caracteres, una vocal, una mayúscula, una minúscula, un número y un carácter especial
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={changePasswordData.confirmNewPassword}
                onChange={handleInputChangeChangePassword}
              />
            </div>
            {changePasswordError && <p className="text-danger">{changePasswordError}</p>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseChangePasswordModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleChangePassword}>
              Guardar cambios
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </nav>
  );

}

export default AdminNavbar;
