import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Table, Form } from 'react-bootstrap';
import './GestionConvenios.css';
import axios from 'axios';
import { useUser } from '../../contexts/UserContext';

const GestionConvenios = () => {
  const [convenios, setConvenios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contacto, setContacto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [enlace, setEnlace] = useState('');
  const [status, setStatus] = useState('Activo');
  const [errors, setErrors] = useState({});
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [convenioToDelete, setConvenioToDelete] = useState(null);
  const [selectedConvenio, setSelectedConvenio] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleShowAddConvenioForm = () => {
    setShowAddForm(true);
  };

  const handleCloseAddConvenioForm = () => {
    setShowAddForm(false);
    setErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!nombre) {
      errors.nombre = 'El nombre es obligatorio';
    }

    if (!contacto) {
      errors.contacto = 'El contacto es obligatorio';
    }

    if (!descripcion) {
      errors.descripcion = 'La descripción es obligatoria';
    }



    if (!correo) {
      errors.correo = 'El correo es obligatorio';
    } else if (!correo.includes('@') || !correo.endsWith('.com')) {
      errors.correo = 'El correo debe contener el símbolo "@" y terminar en ".com"';
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleAddConvenio = async () => {
    if (!validateForm()) {
      return;
    }

    // Validación para no permitir números en el campo de "nombre"
   /* if (/\d/.test(nombre)) {
      setErrors({ ...errors, nombre: 'El nombre no debe contener números' });
      return;
    }
    */

    // Validación para no permitir letras en el campo de "contacto"
    if (/[a-zA-Z]/.test(contacto)) {
      setErrors({ ...errors, contacto: 'El contacto no debe contener letras' });
      return;
    }

    try {
      const nuevoConvenio = {
        nombre,
        correo,
        contacto,
        description: descripcion,
        enlacePaginaWeb: enlace,
        status,
      };

      const response = await axios.post('https://localhost:7190/api/convenios', nuevoConvenio);

      if (response.status === 201) {
        loadConvenios();
        setShowModal(true);
        setShowAddForm(false);
        setErrors({});
      }
    } catch (error) {
      console.error('Error al registrar el convenio:', error);
      alert('Error al agregar el convenio: ' + error.message);
    }
  };

  useEffect(() => {
    loadConvenios();
  }, []);

  const loadConvenios = async () => {
    try {
      const response = await axios.get('https://localhost:7190/api/convenios');
      setConvenios(response.data);
    } catch (error) {
      console.error('Error al cargar datos de la API:', error);
    }
  };

  const formatearStatus = status => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const handleEditConvenio = (convenio) => {
    setSelectedConvenio(convenio);
    console.log(selectedConvenio);
    console.log(convenio);
    setShowEditModal(true);

  };

  const handleCloseEditModal = () => {
    setSelectedConvenio(null);
    setShowEditModal(false);
  };

  const handleEditFormChange = (e, fieldName) => {
    const updatedConvenio = { ...selectedConvenio };
    console.log(selectedConvenio);
    updatedConvenio[fieldName] = e.target.value;
    setSelectedConvenio(updatedConvenio);
  };



  const [editErrors, setEditErrors] = useState({});

  // Función para validar el formulario de edición
  const validateEditForm = () => {
    const errors = {};

    // Valida que el nombre no contenga números
    /*if (/\d/.test(selectedConvenio.nombre)) {
      errors.nombre = 'El nombre no debe contener números';
    }*/

    // Valida que el contacto no contenga letras
    if (/[a-zA-Z]/.test(selectedConvenio.contacto)) {
      errors.contacto = 'El contacto no debe contener letras';
    }

    // Valida el formato del correo
    if (!selectedConvenio.correo || !selectedConvenio.correo.includes('@') || !selectedConvenio.correo.endsWith('.com')) {
      errors.correo = 'El correo debe contener el símbolo "@" y terminar en ".com"';
    }

    // Valida que no haya campos vacíos
    if (selectedConvenio.nombre === "") {
      errors.nombre = 'El nombre es obligatorio';
    }

    if (selectedConvenio.contacto === "") {
      errors.contacto = 'El contacto es obligatorio';
    }

    if (selectedConvenio.descripcion === "") {
      errors.descripcion = 'La descripción es obligatoria';
    }

    if (selectedConvenio.enlacePaginaWeb === "") {
      errors.enlacePaginaWeb = 'El enlace es obligatorio';
    }


    // Actualiza los errores en el estado
    setEditErrors(errors);

    return Object.keys(errors).length === 0;
  };


  const handleSaveConvenio = async () => {

    if (!validateEditForm()) {
      return;
    }
    const data = {
      nombre: selectedConvenio.nombre,
      correo: selectedConvenio.correo,
      contacto: selectedConvenio.contacto,
      description: selectedConvenio.description,
      enlacePaginaWeb: selectedConvenio.enlacePaginaWeb,
      status: selectedConvenio.status,
    };

    // Perform the PATCH request and handle the response
    axios
      .patch(`https://localhost:7190/api/convenios/${selectedConvenio.id}`, data)
      .then((response) => {
        // Handle the successful response
        loadConvenios();
        console.log('Solicitud exitosa:', response);
        setShowEditModal(false); // Close the modal
      })
      .catch((error) => {
        // Handle errors in the request
        console.error('Error al actualizar el convenio', error);
      });
  };

  const handleDeleteConvenio = (convenio) => {
    // Al hacer clic en "Borrar", mostramos el modal de confirmación
    setConvenioToDelete(convenio); // Establecemos el convenio que se va a eliminar
    setShowConfirmationModal(true);

  };

  const handleCloseConfirmModal = () => {
    setShowConfirmationModal(false);
    setConvenioToDelete(null);
  };

  const confirmDeleteConvenio = async () => {
    console.log(convenioToDelete);
    if (convenioToDelete) {

      try {
        const convenioId = convenioToDelete.id;
        await axios.patch(`https://localhost:7190/api/convenios/cambiarStatus/${convenioId}`);
        loadConvenios();
        const conveniosActualizados = convenios.filter((convenio) => convenio.id !== convenioId);
        setConvenios(conveniosActualizados);
        loadConvenios();
        handleCloseConfirmModal();

      } catch (error) {
        console.error('Error al cambiar el estado del convenio:', error);
        alert('Error al cambiar el estado del convenio: ' + error.message);
      }
    }
  };

  if (!user) {
    return null;
  }
  return (
    <Container className="mt-4 gestion-convenios-container">
      <div className="d-flex justify-content-between mb-3">
        <div className="barra-busqueda" style={{ flex: '5' }}>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="button-group" style={{ flex: '1' }}>
          <Button className="btn-add bg-success" onClick={handleShowAddConvenioForm}>
            Añadir Convenio
          </Button>
        </div>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Contacto</th>
            <th>Descripción</th>
            <th>Enlace</th>
            <th>Status</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {convenios
            .filter((convenio) =>
              searchTerm
                ? (convenio.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
                : true
            )
            .map((convenio) => (
              <tr key={convenio.id.toString()}>
                <td>{convenio.nombre}</td>
                <td>{convenio.correo}</td>
                <td>{convenio.contacto}</td>
                <td>{convenio.description}</td>
                <td>{convenio.enlacePaginaWeb}</td>
                <td>{formatearStatus(convenio.status)}</td>
                <td>
                  <div className="action-buttons">

                    <Button variant="info" onClick={() => handleEditConvenio(convenio)}>
                      Editar
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteConvenio(convenio)}>
                      Borrar
                    </Button>

                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Convenio Registrado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          El convenio ha sido registrado correctamente.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddForm} onHide={handleCloseAddConvenioForm}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Convenio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre del convenio"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              
              {/*errors.nombre && (
                <p className="text-danger">{errors.nombre}</p>
              )    */}
          
            </Form.Group>
            <Form.Group>
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="Correo de contacto"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
              {errors.correo && (
                <p className="text-danger">{errors.correo}</p>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Número</Form.Label>
              <Form.Control
                type="text"
                placeholder="Número Telefónico"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
              />
              {errors.contacto && (
                <p className="text-danger">{errors.contacto}</p>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Descripción del convenio"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
              {errors.descripcion && (
                <p className="text-danger">{errors.descripcion}</p>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Enlace</Form.Label>
              <Form.Control
                type="text"
                placeholder="Pagina Web"
                value={enlace}
                onChange={(e) => setEnlace(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddConvenioForm}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleAddConvenio}>
            Agregar Convenio
          </Button>
        </Modal.Footer>
      </Modal>

      {/*Modal para confirmar eliminación*/}
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirmar Cambio a Inactivo</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <p>¿Estás seguro de que deseas cambiar el estado a <b>"Inactivo"</b> para el convenio con ID <b>{convenioToDelete?.id}</b></p>

        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDeleteConvenio}>
            Cambiar a Inactivo
          </Button>
        </Modal.Footer>
      </Modal>



      {/*Modal para Editar*/}

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Convenio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="ID del convenio"
                value={selectedConvenio?.id}
                readOnly // Esto hace que el campo sea no editable
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre del convenio"
                value={selectedConvenio?.nombre}
                onChange={(e) => handleEditFormChange(e, 'nombre')}
              />
              {editErrors.nombre && (
                <p className="text-danger">{editErrors.nombre}</p>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="Correo de contacto"
                value={selectedConvenio?.correo}
                onChange={(e) => handleEditFormChange(e, 'correo')}
              />
              {editErrors.correo && (
                <p className="text-danger">{editErrors.correo}</p>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Número</Form.Label>
              <Form.Control
                type="text"
                placeholder="Número Telefónico"
                value={selectedConvenio?.contacto}
                onChange={(e) => handleEditFormChange(e, 'contacto')}
              />
              {editErrors.contacto && (
                <p className="text-danger">{editErrors.contacto}</p>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Descripción del convenio"
                value={selectedConvenio?.description}
                onChange={(e) => handleEditFormChange(e, 'description')}
              />
              {editErrors.descripcion && (
                <p className="text-danger">{editErrors.descripcion}</p>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Enlace</Form.Label>
              <Form.Control
                type="text"
                placeholder="Pagina Web"
                value={selectedConvenio?.enlacePaginaWeb}
                onChange={(e) => handleEditFormChange(e, 'enlacePaginaWeb')}
              />
              {editErrors.enlacePaginaWeb && (
                <p className="text-danger">{editErrors.enlacePaginaWeb}</p>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={selectedConvenio?.status}
                onChange={(e) => handleEditFormChange(e, 'status')}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSaveConvenio}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>



    </Container>
  );
};

export default GestionConvenios;
