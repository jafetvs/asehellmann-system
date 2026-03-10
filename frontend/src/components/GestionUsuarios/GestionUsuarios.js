import React, { useState, useEffect } from 'react';
import { Table, InputGroup, FormControl, Button, Container, Modal, Form } from 'react-bootstrap';
import { useUser } from '../../contexts/UserContext';
import axios from 'axios';
import './GestionUsuarios.css'

const GestionUsuarios = () => {

  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [usuarioEnEdicion, setUsuarioEnEdicion] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ cedula: '', nombre: '', apellidos: '', idEmpleado: '', email: '', password: '', role: '', status: '' });
  const [showEditUserModal, setShowEditUserModal] = useState(false);


  //para validaciones:
  const [correoValido, setCorreoValido] = useState(true);
  const [correoValidoEditar, setCorreoValidoEditar] = useState(true);
  const [nombreValido, setNombreValido] = useState(true);
  const [nombreValidoEditar, setNombreValidoEditar] = useState(true);
  const [apellidosValidos, setApellidosValidos] = useState(true);
  const [apellidosValidosEditar, setApellidosValidosEditar] = useState(true);
  const [cedulaValida, setCedulaValida] = useState(true);
  const [idEmpleadoValido, setIdEmpleadoValido] = useState(true);
  const [idEmpleadoValidoEditar, setIdEmpleadoValidoEditar] = useState(true);
  const [passwordValido, setPasswordValido] = useState(true);
  const [passwordValidoEditar, setPasswordValidoEditar] = useState(true);


  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:7190/api/usuarios/GetUsuarios');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Error al cargar datos de la API:', error);
      }
    };
    fetchData();
  }, []);

  const validarCorreo = (email) => {
    const regex = /@/;
    return regex.test(email);
  };

  const validarPalabra = (palabra) => {  //para nombre y apellidos
    const regex = /^[A-Za-záéíóúÁÉÍÓÚüÜñ\s]+$/;
    return regex.test(palabra);
  };

  const validarNumeros = (numero) => {
    const regex = /^[0-9]+$/;
    return regex.test(numero);
  };

  const validarTextoSinCaracteresEspeciales = (texto) => {
    const regex = /^[A-Za-z0-9\s\-]+$/;
    return regex.test(texto);
  };

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

  const formatearStatus = status => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const eliminarUsuario = async () => {
    if (usuarioAEliminar) {
      try {
        const cedulaAEliminar = usuarioAEliminar.cedula;
        const response = await axios.patch(`https://localhost:7190/api/usuarios/CambiarStatus/${cedulaAEliminar}/inactivo`);

        if (response.status === 204 || response.status === 200) {
          const usuariosActualizados = usuarios.map(usuario =>
            usuario.cedula === usuarioAEliminar.cedula
              ? { ...usuario, status: 'INACTIVO' }
              : usuario
          );

          setUsuarios(usuariosActualizados); // Actualiza la tabla con los usuarios actualizados
          handleCloseConfirmModal();
        } else {
          console.error('Error al cambiar el estado del usuario:', response.data);
        }
      } catch (error) {
        console.error('Error al cambiar el estado del usuario:', error);
      }
    }
  };


  const agregarUsuario = async () => {
    if (!validarCorreo(newUser.email)) { setCorreoValido(false); return; }
    if (!validarPalabra(newUser.nombre)) { setNombreValido(false); return; }
    if (!validarPalabra(newUser.apellidos)) { setApellidosValidos(false); return; }
    if (!validarTextoSinCaracteresEspeciales(newUser.cedula)) { setCedulaValida(false); return; }
    if (!validarNumeros(newUser.idEmpleado)) { setIdEmpleadoValido(false); return; }
    if (!validarPassword(newUser.password)) { setPasswordValido(false); return; }

    try {
      const response = await axios.post('https://localhost:7190/api/usuarios/registro', newUser);
      setUsuarios([...usuarios, newUser]);
      handleCloseAddUserModal();
    } catch (error) {
      console.error('Error al agregar usuario:', error);
    }
  };

  const editarUsuario = async () => {
    if (usuarioEnEdicion && !validarCorreo(usuarioEnEdicion.email)) { setCorreoValidoEditar(false); return; }
    if (usuarioEnEdicion && !validarPalabra(usuarioEnEdicion.nombre)) { setNombreValidoEditar(false); return; }
    if (usuarioEnEdicion && !validarPalabra(usuarioEnEdicion.apellidos)) { setApellidosValidosEditar(false); return; }
    if (usuarioEnEdicion && !validarNumeros(usuarioEnEdicion.idEmpleado)) { setIdEmpleadoValidoEditar(false); return; }

    if (usuarioEnEdicion) {
      try {
        const response = await axios.patch(
          `https://localhost:7190/api/usuarios/ActualizarUsuario/${usuarioEnEdicion.cedula}`,
          usuarioEnEdicion
        );

        if (response.status === 204 || response.status === 200) {
          const usuariosActualizados = usuarios.map((usuario) =>
            usuario.cedula === usuarioEnEdicion.cedula ? usuarioEnEdicion : usuario
          );
          setUsuarios(usuariosActualizados);
          handleCloseEditUserModal();
        } else {
          console.error('Error al editar usuario:', response.data);
        }
      } catch (error) {
        console.error('Error al editar usuario:', error);
      }
    }
  };

  const handleShowEditUserModal = (usuario) => {
    setUsuarioEnEdicion(usuario);
    setCorreoValidoEditar(true);
    setShowEditUserModal(true);
  };

  const handleCloseEditUserModal = () => {
    setShowEditUserModal(false);
  };

  const handleShowConfirmModal = (usuario) => {
    setUsuarioAEliminar(usuario);
    setShowConfirmModal(true);
    console.log(usuario);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setUsuarioAEliminar(null);
  };

  const handleShowAddUserModal = () => {
    setShowAddUserModal(true);
  };

  const handleCloseAddUserModal = () => {
    setShowAddUserModal(false);
    setNewUser({ cedula: '', nombre: '', apellidos: '', idEmpleado: '', email: '', password: '', role: '', status: '' });
  };

  const handleEditUserChange = (campo, valor) => {
    setUsuarioEnEdicion((prevUsuario) => {
      if (campo === 'password' && (valor === undefined || valor === '')) {
        // Si el campo es la contraseña y está vacío, mantener la contraseña original
        return {
          ...prevUsuario,
          [campo]: prevUsuario[campo], // Mantener la contraseña original
        };
      } else {
        // En cualquier otro caso, actualizar el valor del campo
        return {
          ...prevUsuario,
          [campo]: valor,
        };
      }
    });
  };

  if (!user) {
    return null;
  }
  return (
    <Container className="gestion-usuarios-container">
      {/* Barra de búsqueda */}
      <InputGroup className="mb-3 mt-3">
        <FormControl
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <Button className="ms-4" variant="success" onClick={handleShowAddUserModal}>
          Añadir Usuario
        </Button>
      </InputGroup>

      {/* Tabla de usuarios */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Cédula</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Id de Empleado</th>
            <th>Email</th>
            <th>Status</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((usuario) => (
            <tr key={usuario.cedula}>
              <td>{usuario.cedula}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellidos}</td>
              <td>{usuario.idEmpleado}</td>
              <td>{usuario.email}</td>
              <td>{formatearStatus(usuario.status)}</td>
              <td>
              <Button variant="info" onClick={() => handleShowEditUserModal(usuario)}>
                  Editar
                </Button>
                <Button variant="danger ms-1" onClick={() => handleShowConfirmModal(usuario)}>
                  Borrar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/*Modal para confirmar eliminación*/}
      <Modal show={showConfirmModal} onHide={handleCloseConfirmModal}>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Eliminar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Deseas eliminar a <b>{usuarioAEliminar ? usuarioAEliminar.nombre : ''} {usuarioAEliminar ? usuarioAEliminar.apellidos : ''} </b>asignando su status como<b> inactivo</b>?</p>
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={handleCloseConfirmModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminarUsuario}>
            <i className="fas fa-trash"></i> Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal para agregar usuario */}
      <Modal show={showAddUserModal} onHide={handleCloseAddUserModal} dialogClassName="modal-lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Añadir Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="cedula">
              <Form.Label>Número de cédula</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el número de cédula"
                value={newUser.cedula}
                onChange={(e) => {
                  setCedulaValida(true);
                  setNewUser({ ...newUser, cedula: e.target.value });
                }}
              />
              {!cedulaValida && (
                <small className="text-danger">La cédula no puede estar duplicada, estar vacía ni contener carácteres especiales</small>
              )}
            </Form.Group>
            <Form.Group controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                value={newUser.nombre}
                onChange={(e) => {
                  setNombreValido(true);
                  setNewUser({ ...newUser, nombre: e.target.value });
                }}
              />
              {!nombreValido && (
                <small className="text-danger">El nombre no puede estar vacío, contener números ni carácteres especiales</small>
              )}
            </Form.Group>
            <Form.Group controlId="apellidos">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese los apellidos"
                value={newUser.apellidos}
                onChange={(e) => {
                  setApellidosValidos(true);
                  setNewUser({ ...newUser, apellidos: e.target.value });
                }}
              />
              {!apellidosValidos && (
                <small className="text-danger">Los apellidos no pueden estar vacíos, contener números ni carácteres especiales</small>
              )}
            </Form.Group>
            <Form.Group controlId="idEmpleado">
              <Form.Label>Id de Empleado</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el id de empleado"
                value={newUser.idEmpleado}
                onChange={(e) => {
                  setIdEmpleadoValido(true);
                  setNewUser({ ...newUser, idEmpleado: e.target.value });
                }}
              />
              {!idEmpleadoValido && (
                <small className="text-danger">El id de empleado no puede estar vacío, contener letras ni carácteres especiales</small>
              )}
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el email del usuario"
                value={newUser.email}
                onChange={(e) => {
                  setCorreoValido(true); // Restablecer la validez cuando el usuario comienza a editar
                  setNewUser({ ...newUser, email: e.target.value });
                }}
              />
              {!correoValido && (
                <small className="text-danger">El dominio del email no es válido</small>
              )}
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese una contraseña temporal para el usuario"
                value={newUser.password}
                onChange={(e) => {
                  setPasswordValido(true);
                  setNewUser({ ...newUser, password: e.target.value });
                }}
              />
              {!passwordValido && (
                <small className="text-danger">
                     La contraseña debe tener al menos 8 caracteres, una vocal, una mayúscula, una minúscula, un número y un carácter especial
                </small>
              )}
            </Form.Group>
            <Form.Group controlId="role">
              <Form.Label>Rol</Form.Label>
              <Form.Control
                as="select"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="">Seleccionar...</option>
                <option value="asociado">Asociado</option>
                <option value="admin">Admin</option>
              </Form.Control>
              {newUser.role === "" && (
                <small className="text-danger">Seleccione un rol</small>
              )}
            </Form.Group>

            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={newUser.status}
                onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
              >
                <option value="">Seleccionar...</option>
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </Form.Control>
              {newUser.status === "" && (
                <small className="text-danger">Seleccione un status</small>
              )}
            </Form.Group>
            {/* Agrega más campos para los otros atributos del usuario */}
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={handleCloseAddUserModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={agregarUsuario} disabled={!correoValido || !nombreValido || !apellidosValidos || !cedulaValida || !idEmpleadoValido || newUser.role === "" || newUser.status === "" || newUser.password === ""}>
            <i className="fas fa-save"></i> Guardar
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal para editar usuario */}
      <Modal show={showEditUserModal} onHide={handleCloseEditUserModal} dialogClassName="modal-lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="cedula">
              <Form.Label>Número de cédula</Form.Label>
              <Form.Control
                type="text"
                placeholder="Cédula"
                value={usuarioEnEdicion ? usuarioEnEdicion.cedula : ''}
                readOnly={true}
                onChange={(e) => handleEditUserChange('cedula', e.target.value)}
              />
              {usuarioEnEdicion && (
                <small className="text-muted">La cédula no se puede editar.</small>
              )}
            </Form.Group>
            <Form.Group controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                value={usuarioEnEdicion ? usuarioEnEdicion.nombre : ''}
                onChange={(e) => {
                  setNombreValidoEditar(true); // Restablecer la validez cuando el usuario comienza a editar
                  handleEditUserChange('nombre', e.target.value);
                }}
              />
              {!nombreValidoEditar && (
                <small className="text-danger">El nombre no puede estar vacío, contener números ni carácteres especiales</small>
              )}

            </Form.Group>
            <Form.Group controlId="apellidos">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese los apellidos"
                value={usuarioEnEdicion ? usuarioEnEdicion.apellidos : ''}
                onChange={(e) => {
                  setApellidosValidosEditar(true); // Restablecer la validez cuando el usuario comienza a editar
                  handleEditUserChange('apellidos', e.target.value);
                }}
              />
              {!apellidosValidosEditar && (
                <small className="text-danger">Los apellidos no pueden estar vacíos, contener números ni carácteres especiales</small>
              )}
            </Form.Group>
            <Form.Group controlId="idEmpleado">
              <Form.Label>Id de Empleado</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el id de empleado"
                value={usuarioEnEdicion ? usuarioEnEdicion.idEmpleado : ''}
                onChange={(e) => {
                  setIdEmpleadoValidoEditar(true); // Restablecer la validez cuando el usuario comienza a editar
                  handleEditUserChange('idEmpleado', e.target.value);
                }}
              />
              {!idEmpleadoValidoEditar && (
                <small className="text-danger">El id de empleado no puede estar vacío, contener letras ni carácteres especiales</small>
              )}
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el email del usuario"
                value={usuarioEnEdicion ? usuarioEnEdicion.email : ''}
                onChange={(e) => {
                  setCorreoValidoEditar(true); // Restablecer la validez cuando el usuario comienza a editar
                  handleEditUserChange('email', e.target.value);
                }}
              />
              {!correoValidoEditar && (
                <small className="text-danger">El dominio del email no es válido</small>
              )}
            </Form.Group>
            {/*   <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                  type="text"
                  placeholder="Dejar en blanco para mantener la misma contraseña"
                  value={usuarioEnEdicion ? usuarioEnEdicion.password : ''}
                  onChange={(e) => handleEditUserChange('password', e.target.value)}
                  style={{ fontStyle: 'italic', fontWeight: 'bold', color: 'grey' }}
              />
      
               !passwordValidoEditar && (
                <small className="text-danger">
                  Mínimo: 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
                </small>
              )
            </Form.Group>*/}
            <Form.Group controlId="role">
              <Form.Label>Rol</Form.Label>
              <Form.Control
                as="select"
                value={usuarioEnEdicion ? usuarioEnEdicion.role : ''}
                onChange={(e) => handleEditUserChange('role', e.target.value)}
              >
                <option value="asociado">Asociado</option>
                <option value="admin">Administrador</option>
              </Form.Control>

            </Form.Group>
            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={usuarioEnEdicion ? usuarioEnEdicion.status : ''}
                onChange={(e) => handleEditUserChange('status', e.target.value)}
              >
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </Form.Control>
            </Form.Group>
            {/* Repetir esto si llegan a existir más atributos*/}
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={handleCloseEditUserModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={editarUsuario} disabled={!correoValidoEditar || !nombreValidoEditar || !apellidosValidosEditar || !idEmpleadoValidoEditar}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GestionUsuarios;
