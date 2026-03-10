import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { Modal, Button } from 'react-bootstrap';

const UserNavbar = () => {
    const { user, logout } = useUser();
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

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

    const [changePasswordData, setChangePasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [changePasswordError, setChangePasswordError] = useState(null);

    const handleInputChangeChangePassword = (e) => {
        const { name, value } = e.target;
        if (name === "newPassword") {
            setPasswordValido(validarPassword(value));
        }
        setChangePasswordData({ ...changePasswordData, [name]: value });
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

    if (!user || user.isAdmin) {
        return null;
    }

    return (
    
        <nav className="navbar navbar-expand-lg navbar-light text-dark" style={{ width: '100%', height: '100px'}} >
            <div className="logo-container">
                <img src="/images/logoAsehellmann.png" alt="Logo" className="mx-4" style={{ width: '90px', height: '70px' }} />
            </div>
            <Link className="ms-2 navbar-brand" to="/user">Inicio</Link>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link " to="/formularios-usuario">
                            Formularios
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/aportes-asociado">
                            Aportes
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/ahorros-asociado">
                            Ahorros
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/prestamos-asociado">
                            Préstamos
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/previsualizar-prestamo">
                            Previsualizar préstamo
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/monto-disponible">
                            Monto disponible
                        </Link>
                    </li>

        {/*  componente "Registros" y submenús */}
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Registros
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><Link className="dropdown-item" to="/registros-ahorrosAsociado">Registros de Ahorros</Link></li>
              <li><Link className="dropdown-item" to="/registros-prestamosAsociado">Registros de Préstamos</Link></li>
            </ul>
          </li>
          {/* Fin de componente de registro */}

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
};

export default UserNavbar;
