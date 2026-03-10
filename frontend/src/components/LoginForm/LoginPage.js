import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginPageStyle.css';
import { useUser } from '../../contexts/UserContext';
import { Modal, Button } from 'react-bootstrap';


const LoginPage = () => {
    const { login } = useUser();
    const [formData, setFormData] = useState({ id: '', password: '' });
    const [error, setError] = useState(null);
    const [showAlert, setShowAlert] = useState(false);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogin = async () => {
        const { id, password } = formData;
        try {
            await login(id, password);
            setError(null);
        } catch (error) {
            setError(error.message);
            setShowAlert(true);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
    };

    return  (
        <div className="page-container">
            <section className="login-page h-auto text-dark mb-4">
                <div className="container-fluid h-custom">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-md-9 col-lg-6 col-xl-5">
                            <img src="/images/logoAsehellmann.png" style={{ width: '60%', height: '70%', marginLeft: '20%' }} className="img-fluid" alt="Logo Hellmann" />
                        </div>
                        <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                            <div className="card">
                                <div className="card-body">
                                    <div className="divider d-flex align-items-center">
                                        <h6 className="text-center mb-4">¡Bienvenido! al Sistema de autogestión Asehellmann</h6>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="form-outline mb-4">
                                            <input
                                                type="text"
                                                id="form3Example3"
                                                className="form-control form-control-lg input-placeholder"
                                                placeholder="Ingrese su número de cédula completo"
                                                name="id"
                                                value={formData.id}
                                                onChange={handleInputChange}
                                            />
                                            <label className="form-label" htmlFor="form3Example3">Número de cédula</label>
                                        </div>

                                        <div className="form-outline mb-3">
                                            <input
                                                type="password"
                                                id="form3Example4"
                                                className="form-control form-control-lg input-placeholder"
                                                placeholder="Ingrese su contraseña"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                            />
                                            <label className="form-label" htmlFor="form3Example4">Contraseña</label>
                                        </div>

                                        <div className="text-center text-lg-start mt-4 pt-2">
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-lg"
                                                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', backgroundColor: '#004c99' }}
                                            >
                                                Iniciar sesión
                                            </button>
                                        </div>
                                    </form>

                                    <Modal show={showAlert} onHide={() => setShowAlert(false)}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Error de inicio de sesión</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>{error}</Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="primary" onClick={() => setShowAlert(false)}>
                                                Cerrar
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LoginPage;
