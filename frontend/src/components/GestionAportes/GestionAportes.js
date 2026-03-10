import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Table, Form } from 'react-bootstrap';
import axios from 'axios'; // Importa axios para realizar solicitudes HTTP
import './GestionAportes.css'; // Importa los estilos CSS
import { useUser } from '../../contexts/UserContext';

const GestionAportes = () => {
  const { user } = useUser();
  const [showAddAporteModal, setShowAddAporteModal] = useState(false);
  const [showCargarArchivoModal, setShowCargarArchivoModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Enero');
  const [selectedYear, setSelectedYear] = useState(2000);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [aportes, setAportes] = useState([]); // Nuevo estado para aportes
  const [showEditAporteModal, setShowEditAporteModal] = useState(false);
  const [aporteToEdit, setAporteToEdit] = useState(null);


  const meses = {
    1: 'Enero',
    2: 'Febrero',
    3: 'Marzo',
    4: 'Abril',
    5: 'Mayo',
    6: 'Junio',
    7: 'Julio',
    8: 'Agosto',
    9: 'Septiembre',
    10: 'Octubre',
    11: 'Noviembre',
    12: 'Diciembre',
  };


  const [cedula, setCedula] = useState('');
  const [aportePatronal, setAportePatronal] = useState(0);
  const [aportePersonal, setAportePersonal] = useState(0);
  const [mes, setMes] = useState(1);
  const [anio, setAnio] = useState(2015);
  const [cedulaValida, setCedulaValida] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [aporteToDelete, setAporteToDelete] = useState(null);

  // Función para mostrar el modal de agregar aporte
  const handleShowAddAporteModal = () => {
    setShowDeleteModal(false);
    setShowAddAporteModal(true);
  };

  // Función para mostrar el modal de cargar archivo
  const handleShowCargarArchivoModal = () => {
    setShowCargarArchivoModal(true);
  };

  // Función para manejar el cambio de mes en el formulario de carga de archivo
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // Función para manejar el cambio de año en el formulario de carga de archivo
  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  // Función para manejar la selección de archivo
  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  useEffect(() => {
    loadAportes();
  }, []);

  // Función para cargar los datos de aportes
  const loadAportes = async () => {
    try {
      const response = await axios.get('https://localhost:7190/api/aporteAsociado');
      setAportes(response.data);
      console.log(aportes);
    } catch (error) {
      console.error('Error al cargar datos de la API:', error);
    }
  };

  const showDeleteConfirmation = (aporte) => {
    setAporteToDelete(aporte);
    setShowDeleteModal(true);
  };

  // Función para manejar el registro de aportes
  const handleAddAporte = async () => {
    try {
      // Construir el objeto de datos a enviar al backend
      const data = {
        cedula: cedula,
        aportePatronal: aportePatronal,
        aportePersonal: aportePersonal,
        mes: mes,
        anio: anio,

      };
      console.log(data);
      // Realiza la solicitud POST al backend. 
      if (!validarTextoSinCaracteresEspeciales(data.cedula)) { setCedulaValida(false); return; }
      const response = await axios.post('https://localhost:7190/crearAporteUsuarioEspecifico', data);

      // Si la solicitud es exitosa, puedes realizar acciones adicionales aquí, como actualizar la lista de aportes
      console.log('Aporte registrado exitosamente', response.data);
      loadAportes();
      // Cierra el modal después de un registro exitoso
      setShowAddAporteModal(false);
    } catch (error) {
      console.error('Error al registrar el aporte:', error);
    }
  };

  const handleDeleteAporte = async () => {
    if (aporteToDelete) {
      const { mes, anio } = aporteToDelete;
      const cedula = aporteToDelete.usuario.cedula;

      console.log(aporteToDelete);
      try {
        // Realiza una solicitud DELETE al backend
        const response = await axios.delete(`https://localhost:7190/api/aporteAsociado/${cedula},${mes},${anio}`);

        // Si la solicitud es exitosa, puedes realizar acciones adicionales aquí, como actualizar la lista de aportes
        console.log('Aporte eliminado exitosamente', response.data);
        loadAportes();

        // Cierra el modal después de una eliminación exitosa
        setShowDeleteModal(false);
      } catch (error) {
        console.error('Error al eliminar el aporte:', error);
      }
    }
  };

  // Función para validar la cédula    ***considerar dejar pasar el - como carácter válido
  const validarTextoSinCaracteresEspeciales = (texto) => {
    const regex = /^[A-Za-z0-9\s]+$/;
    return regex.test(texto);
  };

  const showEditForm = (aporte) => {
    setAporteToEdit(aporte);
    setShowEditAporteModal(true);
  };

  const handleEditAporte = () => {
    // Crear un objeto que contenga los datos que deseas enviar en la solicitud PATCH
    const data = {
      aportePatronal: aporteToEdit.aportePatronal,
      aportePersonal: aporteToEdit.aportePersonal,
      prestamos: aporteToEdit.prestamos,
      ahorroExtraordinario: aporteToEdit.ahorroExtraordinario,
      // También puedes incluir otros datos como la cédula, mes y anio si es necesario
    };

    // Parámetros de la URL (consulta)
    const params = {
      cedula: aporteToEdit.usuario.cedula,
      mes: aporteToEdit.mes,
      anio: aporteToEdit.anio
    };

    console.log(data);
    console.log(params);
    // Realizar la solicitud PATCH a la URL correspondiente con los parámetros
    axios.patch('https://localhost:7190/api/aporteAsociado/actualizarAporte', data, { params })
      .then((response) => {
        // Manejar la respuesta del servidor
        loadAportes();
        console.log('Solicitud exitosa:', response);
        setShowEditAporteModal(false); // Cerrar el modal
      })
      .catch((error) => {
        // Manejar errores en la solicitud
        console.error('Error al actualizar el aporte', error);
      });
  };
  if (!user) {
    return null;
  }
  return (
    <Container className="mt-4 gestion-aportes-container">
      <div className="d-flex justify-content-between mb-3">
        <div className="barra-busqueda" style={{ flex: '1' }}>
          <input
            type="text"
            placeholder="Buscar por cédula..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>
        <div className="button-group" style={{ flex: '1' }}>
          <Button className="btn-add3 bg-success" onClick={handleShowAddAporteModal}>
            Añadir Aporte
          </Button>
          <Button className="btn-cargar" variant="warning" onClick={handleShowCargarArchivoModal}>
            Cargar Archivo
          </Button>
        </div>
      </div>

      {/* Tabla de Aportes */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Cédula</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Aporte Personal</th>
            <th>Aporte Patronal</th>
            <th>Personales Acumulado</th>
            <th>Patronales Acumulado</th>
            <th>Mes</th>
            <th>Año</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {aportes
            .filter((aporte) => aporte.usuario.cedula.includes(searchTerm)) // Filtra por cédula

            .map((aporte) => {

              return (
                <tr key={aporte.id}>
                  <td>{aporte.usuario.cedula}</td>
                  <td>{aporte.usuario.nombre}</td>
                  <td>{aporte.usuario.apellidos}</td>
                  <td>{aporte.aportePersonal.toLocaleString()}</td>
                  <td>{aporte.aportePatronal.toLocaleString()}</td>
                  <td>{aporte.aportePersonalesAcumulado.toLocaleString()}</td>
                  <td>{aporte.aportePatronalesAcumulado.toLocaleString()}</td>
                  <td>{meses[aporte.mes]}</td> {/* Utiliza el objeto meses para obtener el nombre del mes */}
                  <td>{aporte.anio}</td>
                  <td>
                    <div className="action-buttons">
                      <Button variant="info" onClick={() => showEditForm(aporte)}>
                        Editar
                      </Button>

                      <Button variant="danger" onClick={() => showDeleteConfirmation(aporte)}>
                        Borrar
                      </Button>

                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>

      </Table>

      {/* Modal de Agregar Aporte */}
      <Modal show={showAddAporteModal} onHide={() => setShowAddAporteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Registro de Aportes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="idAsociado">
              <Form.Label>Cedula del Empleado</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la Cedula del Empleado"
                value={cedula}
                onChange={(e) => {
                  setCedulaValida(true)
                  setCedula(e.target.value)
                }}
              />
              {!cedulaValida && (
                <small className="text-danger">La cédula debe pertenecer a un usuario registrado. No puede contener carácteres especiales</small>
              )}
            </Form.Group>
            <small className="text-muted">Advertencia: Solo se pueden agregar aportes a usuarios con cédula Existente</small>

            <Form.Group controlId="montoAportePersonal">
              <Form.Label>Monto del Aporte Personal</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el monto del aporte personal"
                value={aportePersonal.toLocaleString()} // Formatear el valor con separadores de millar
                onChange={(e) => setAportePersonal(parseFloat(Number(e.target.value.replace(/\D/g, ''))))} // Convertir a número y actualizar el estado
              />
            </Form.Group>


            <Form.Group controlId="montoAportePatronal">
              <Form.Label>Monto del Aporte Patronal</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el monto del aporte patronal"
                value={aportePatronal.toLocaleString()} // Formatear el valor con separadores de millar
                onChange={(e) => setAportePatronal(Number(e.target.value.replace(/\D/g, '')))} // Convertir a número y actualizar el estado
              />
            </Form.Group>


            <Form.Group controlId="selectMes">
              <Form.Label>Seleccionar Mes</Form.Label>
              <Form.Control as="select" value={mes} onChange={(e) => setMes(parseInt(e.target.value))}>
                <option value={1}>Enero</option>
                <option value={2}>Febrero</option>
                <option value={3}>Marzo</option>
                <option value={4}>Abril</option>
                <option value={5}>Mayo</option>
                <option value={6}>Junio</option>
                <option value={7}>Julio</option>
                <option value={8}>Agosto</option>
                <option value={9}>Septiembre</option>
                <option value={10}>Octubre</option>
                <option value={11}>Noviembre</option>
                <option value={12}>Diciembre</option>
              </Form.Control>
            </Form.Group>
            <small className="text-muted">Advertencia: un usuario no puede tener dos aportes registrados de un mismo mes en un mismo año</small>

            <Form.Group controlId="selectAnio">
              <Form.Label>Seleccionar Año</Form.Label>
              <Form.Control as="select" value={anio} onChange={(e) => setAnio(parseInt(e.target.value))}>
                {Array.from({ length: 26 }, (_, i) => (
                  <option key={i}>{2015 + i}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <small className="text-muted">Advertencia: un usuario no puede tener dos aportes registrados de un mismo mes en un mismo año</small>



          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddAporteModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddAporte}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>




      {/* Modal de Cargar Archivo */}
      <Modal show={showCargarArchivoModal} onHide={() => setShowCargarArchivoModal(false)}>
        {/* Contenido del modal de cargar archivo */}
        <Modal.Header closeButton>
          <Modal.Title>Cargar Archivo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="selectArchivo">
              <Form.Label>Seleccionar Archivo (Excel)</Form.Label>
              <Form.Control
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileSelect}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCargarArchivoModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" disabled={!selectedMonth || !selectedYear || !selectedFile}>
            Cargar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Confirmación de Eliminación (Agrega esto) */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {aporteToDelete && (
            <div>
              <p>¿Estás seguro de que deseas eliminar el aporte del cliente con Cedula <b>{aporteToDelete.usuario.cedula}?</b></p>
              <p>Mes del aporte: <b>{meses[aporteToDelete.mes]}</b></p>
              <p>El año del aporte: <b>{aporteToDelete.anio}</b></p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteAporte}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>



      {/*Modal de editar reporte*/}
      <Modal show={showEditAporteModal} onHide={() => setShowEditAporteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Aporte</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="idAsociado">
              <Form.Label>Cedula del Empleado</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la Cedula del Empleado"
                value={aporteToEdit ? aporteToEdit.usuario.cedula : ''}
                disabled // Para que la cédula no sea editable
              />
            </Form.Group>
            <small className="text-muted">La cédula no se puede editar</small>
            <Form.Group controlId="montoAportePersonal">
              <Form.Label>Monto del Aporte Personal</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el monto del aporte personal"
                value={aporteToEdit ? aporteToEdit.aportePersonal.toLocaleString() : ''}
                onChange={(e) => setAporteToEdit({ ...aporteToEdit, aportePersonal: Number(e.target.value.replace(/\D/g, '')) })}
              />
            </Form.Group>

            <Form.Group controlId="montoAportePatronal">
              <Form.Label>Monto del Aporte Patronal</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el monto del aporte patronal"
                value={aporteToEdit ? aporteToEdit.aportePatronal.toLocaleString() : ''}
                onChange={(e) => setAporteToEdit({ ...aporteToEdit, aportePatronal: Number(e.target.value.replace(/\D/g, '')) })}
              />
            </Form.Group>
            
            <Form.Group controlId="mesAporte" className="mb-3">
              <Form.Label className="mb-0">Mes</Form.Label>
              <Form.Control
                as="select"
                value={aporteToEdit ? aporteToEdit.mes : ''}
                disabled // Para que el mes no sea editable
                className="form-select"
              >
                {Object.keys(meses).map((key) => (
                  <option key={key} value={key}>
                    {meses[key]}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="anioAporte" className="mb-3">
              <Form.Label className="mb-0">Año</Form.Label>
              <Form.Control
                as="select"
                value={aporteToEdit ? aporteToEdit.anio : ''}
                disabled // Para que el año no sea editable
                className="form-select"
              >
                {Array.from({ length: 26 }, (_, i) => (
                  <option key={i}>{2015 + i}</option>
                ))}
              </Form.Control>
            </Form.Group>

          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditAporteModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEditAporte}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GestionAportes;
