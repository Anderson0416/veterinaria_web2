import { useState, useEffect } from 'react';
import {Modal,Button} from 'react-bootstrap';
import { Image} from 'react-bootstrap';
import { getProfileById, updateUserProfile } from '../../services/UsuarioService';
import { getServer } from '../../helpers/axios_helper';
import { getConsultaById, updateConsulta } from '../../services/ConsultaService';
import { getClienteById, updateCliente } from '../../services/ClienteService';
import { getMascotaById, updateMascota } from '../../services/MascotaService';
import SaveIcon from '../../assets/images/SaveICon.png';
import '../../assets/styles/UserCard.css'
import '../../assets/styles/CliCard.css'
export function UserCard(props) {
  const [id, setId] = useState("");
  const [tipoId, setTipoId] = useState("");
  const [login, setLogin] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [sexo, setSexo] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaContrato, setFechaContrato] = useState("");
  const [foto, setFoto] = useState("");
  const [previewFoto, setPreviewFoto] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (props.userData && props.userData.id) {
      getProfileById(props.userData.id)
        .then(data => {
          if (data) {
            setId(data.id);
            setTipoId(data.tipo_id);
            setLogin(data.login);
            setNombre(data.nombre);
            setApellido(data.apellido);
            setSexo(data.sexo);
            setFechaNacimiento(data.fechaNacimiento);
            setTelefono(data.telefono);
            setFechaContrato(data.fechaContrato);
            setFoto(data.foto);
            setPreviewFoto(`http://${getServer()}:8080/${data.foto}`);
          }
        })
        .catch(error => {
          console.error('Error al obtener el perfil del usuario:', error);
        });
    }
  }, [props.userData]);

  const validateInput = (name, value) => {
    let error = "";
    
    if (name === 'id' && !/^\d+$/.test(value)) {
      error = 'El ID debe contener solo números';
    }
    
    if (name === 'nombre' && !/^[A-Za-zÁ-ÿ\s]+$/.test(value)) {
      error = 'El nombre debe contener solo letras';
    }
    
    if (name === 'apellido' && !/^[A-Za-zÁ-ÿ\s]+$/.test(value)) {
      error = 'El apellido debe contener solo letras';
    }
    
    if (name === 'telefono' && !/^\d+$/.test(value)) {
      error = 'El teléfono debe contener solo números';
    }
    
    return error;
  };

  const onChangeHandler = (event) => {
    const { name, value, files } = event.target;
    
    // Validar entrada
    const error = validateInput(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    // Actualizar estado según el campo
    if (name === 'id') setId(value);
    if (name === 'tipoId') setTipoId(value);
    if (name === 'login') setLogin(value);
    if (name === 'nombre') setNombre(value);
    if (name === 'apellido') setApellido(value);
    if (name === 'sexo') setSexo(value);
    if (name === 'fechaNacimiento') setFechaNacimiento(value);
    if (name === 'telefono') setTelefono(value);
    if (name === 'fechaContrato') setFechaContrato(value);
    if (name === 'foto' && files.length > 0) {
      const file = files[0];
      setFoto(file);
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    // Validar todos los campos antes de enviar
    const formErrors = {};
    if (nombre) formErrors.nombre = validateInput('nombre', nombre);
    if (apellido) formErrors.apellido = validateInput('apellido', apellido);
    if (telefono) formErrors.telefono = validateInput('telefono', telefono);
    
    // Filtrar errores vacíos
    const hasErrors = Object.values(formErrors).some(error => error !== "");
    
    if (!hasErrors) {
      updateUserProfile(login, id, nombre, apellido, foto)
        .then(response => {
          console.log('Perfil actualizado:', response.data);
          props.onHide();
          window.location.reload(); // Recargar página
        })
        .catch(error => {
          console.error('Error al actualizar el perfil:', error);
        });
    } else {
      setErrors(formErrors);
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-container">
            <h3 className="step-title">Información Personal</h3>
            
            {previewFoto && (
              <div className="text-center mb-4">
                <div className="profile-photo-container">
                  <Image 
                    src={previewFoto} 
                    alt="Foto de perfil"
                    className="profile-photo" 
                  />
                  <label htmlFor="foto" className="photo-upload-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                  </label>
                  <input
                    type="file"
                    id="foto"
                    name="foto"
                    className="form-control photo-input"
                    accept="image/*"
                    onChange={onChangeHandler}
                  />
                </div>
              </div>
            )}
            
            {!previewFoto && (
              <div className="mb-4">
                <label htmlFor="foto" className="form-label">Foto de Perfil</label>
                <div className="input-wrapper">
                  <input
                    type="file"
                    id="foto"
                    name="foto"
                    className="form-control"
                    accept="image/*"
                    onChange={onChangeHandler}
                  />
                </div>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="id">Número de Identificación</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="N.Identificación"
                  id="id"
                  name="id"
                  className={`form-control ${errors.id ? 'is-invalid' : ''}`}
                  value={id}
                  onChange={onChangeHandler}
                  disabled
                />
                {errors.id && (
                  <div className="invalid-feedback">
                    {errors.id}
                  </div>
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="tipoIdentificacion">Tipo de Identificación</label>
              <div className="select-wrapper">
                <select
                  id="tipoId"
                  name="tipoId"
                  className="form-control"
                  value={tipoId}
                  onChange={onChangeHandler}
                >   
                  <option value="">Seleccione un tipo</option>
                  <option value="Cedula de ciudadania">Cédula de ciudadanía</option>
                  <option value="Cedula de extranjeria">Cédula de extranjería</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
              </div>
            </div>
            
            <div className="form-footer">
              <Button variant="link" className="btn-skip" onClick={props.onHide}>
                Cancelar
              </Button>
              <button type="button" className="btn btn-next" onClick={nextStep}>
                Siguiente
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="step-container">
            <h3 className="step-title">Datos Personales</h3>
            
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Nombre"
                  id="nombre"
                  name="nombre"
                  className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                  value={nombre}
                  onChange={onChangeHandler}
                />
                {errors.nombre && (
                  <div className="invalid-feedback">
                    {errors.nombre}
                  </div>
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Apellido"
                  id="apellido"
                  name="apellido"
                  className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
                  value={apellido}
                  onChange={onChangeHandler}
                />
                {errors.apellido && (
                  <div className="invalid-feedback">
                    {errors.apellido}
                  </div>
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="sexo">Sexo</label>
              <div className="select-wrapper">
                <select
                  id="sexo"
                  name="sexo"
                  className="form-control"
                  value={sexo}
                  onChange={onChangeHandler}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
            
            <div className="button-group">
              <button type="button" className="btn btn-prev" onClick={prevStep}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Anterior
              </button>
              <button type="button" className="btn btn-next" onClick={nextStep}>
                Siguiente
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="step-container">
            <h3 className="step-title">Información de Contacto</h3>
            
            <div className="form-group">
              <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
              <div className="input-wrapper date-input">
                <input
                  type="date"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  className="form-control"
                  value={fechaNacimiento}
                  onChange={onChangeHandler}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Teléfono"
                  id="telefono"
                  name="telefono"
                  className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                  value={telefono}
                  onChange={onChangeHandler}
                />
                {errors.telefono && (
                  <div className="invalid-feedback">
                    {errors.telefono}
                  </div>
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="fechaContrato">Fecha de Contrato</label>
              <div className="input-wrapper date-input">
                <input
                  type="date"
                  id="fechaContrato"
                  name="fechaContrato"
                  className="form-control"
                  value={fechaContrato}
                  onChange={onChangeHandler}
                />
              </div>
            </div>
            
            <div className="button-group">
              <button type="button" className="btn btn-prev" onClick={prevStep}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Anterior
              </button>
              <button type="button" className="btn btn-submit" onClick={onSubmit}>
                Guardar Cambios
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modern-modal"
    >
      <Modal.Header closeButton className="modern-header">
        <Modal.Title id="contained-modal-title-vcenter">
          Editar Usuario
        </Modal.Title>
      </Modal.Header>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`} onClick={() => setCurrentStep(1)}>
            <span className="step-number">1</span>
            <span className="step-label">Personal</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`} onClick={() => setCurrentStep(2)}>
            <span className="step-number">2</span>
            <span className="step-label">Datos</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`} onClick={() => setCurrentStep(3)}>
            <span className="step-number">3</span>
            <span className="step-label">Contacto</span>
          </div>
        </div>
      </div>
      
      <Modal.Body className="modern-body">
        <div className="modal-container">
          <form>
            {renderStep()}
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}
export function ConsCard(props) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");

  useEffect(() => {
    if (props.consultaData && props.consultaData.id) {
      getConsultaById(props.consultaData.id)
        .then(data => {
          if (data) {
            setNombre(data.nombre);
            setDescripcion(data.descripcion);
            setPrecio(data.precio);
          }
        })
        .catch(error => {
          console.error('Error al obtener la consulta:', error);
        });
    }
  }, [props.consultaData]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    if (name === 'nombre') setNombre(value);
    if (name === 'descripcion') setDescripcion(value);
    if (name === 'precio') setPrecio(value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (props.consultaData && props.consultaData.id) {
      updateConsulta(props.consultaData.id, {
        nombre,
        descripcion,
        precio: parseFloat(precio)
      })
        .then(response => {
          console.log('Consulta actualizada:', response);
          props.onHide();
          window.location.reload(); // Recargar página
        })
        .catch(error => {
          console.error('Error al actualizar la consulta:', error);
        });
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Editar Consulta
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <style jsx>{`
            .icon {
                width: 24px;
                height: 24px;
                display: inline-block;
                vertical-align: middle;
            }
            button.btn-sm {
                padding: 0.25rem 0.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `}</style>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="nombre">Nombre de la Consulta</label>
            <input
              type="text"
              placeholder="Nombre de la consulta"
              id="nombre"
              name="nombre"
              className="form-control"
              value={nombre}
              onChange={onChangeHandler}
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="descripcion">Descripción de la Consulta</label>
            <textarea
              placeholder="Descripción detallada de la consulta"
              id="descripcion"
              name="descripcion"
              className="form-control"
              value={descripcion}
              onChange={onChangeHandler}
              rows="3"
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="precio">Precio ($)</label>
            <input
              type="number"
              placeholder="Precio de la consulta"
              id="precio"
              name="precio"
              className="form-control"
              value={precio}
              onChange={onChangeHandler}
              step="0.01"
              min="0"
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button 
        onClick={onSubmit} variant="primary">
          <img src={SaveIcon} alt="Guardar" className="icon" />
        </Button>
        <Button onClick={props.onHide} variant="secondary">Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}

export function CliCard(props) {
  const [formData, setFormData] = useState({
    id: '',
    tipo_id: '',
    nombre: '',
    apellido: '',
    sexo: '',
    fechaNacimiento: '',
    telefono: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [currentSection, setCurrentSection] = useState('personal'); // personal, contacto

  useEffect(() => {
    if (props.userData && props.userData.id) {
      getClienteById(props.userData.id)
        .then(data => {
          if (data) {
            setFormData({
              id: data.id,
              tipo_id: data.tipo_id,
              nombre: data.nombre,
              apellido: data.apellido,
              sexo: data.sexo,
              fechaNacimiento: data.fechaNacimiento,
              telefono: data.telefono,
              email: data.email
            });
          }
        })
        .catch(error => {
          console.error('Error al obtener el cliente:', error);
        });
    }
  }, [props.userData]);

  // Validación de email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Validación de formulario
  const validateForm = () => {
    const newErrors = {};

    // Validaciones básicas
    if (formData.nombre && !/^[A-Za-zÁ-ÿ\s]+$/.test(formData.nombre)) {
      newErrors.nombre = 'El nombre debe contener solo letras';
    }

    if (formData.apellido && !/^[A-Za-zÁ-ÿ\s]+$/.test(formData.apellido)) {
      newErrors.apellido = 'El apellido debe contener solo letras';
    }

    if (formData.telefono && !/^\d+$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe contener solo números';
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Ingrese un correo electrónico válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error específico cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validateForm() && props.userData && props.userData.id) {
      updateCliente(props.userData.id, formData)
        .then(response => {
          console.log('Cliente actualizado:', response);
          props.onHide();
          window.location.reload(); // Recargar página
        })
        .catch(error => {
          console.error('Error al actualizar el cliente:', error);
        });
    }
  };

  const changeSection = (section) => {
    setCurrentSection(section);
  };

  const renderPersonalSection = () => {
    return (
      <div className="step-container">
        <h3 className="step-title">Información Personal</h3>
        
        <div className="form-group">
          <label htmlFor="id">Número de Identificación</label>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="N.Identificación"
              id="id"
              name="id"
              className="form-control"
              value={formData.id}
              onChange={onChangeHandler}
              disabled
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tipo_id">Tipo de Identificación</label>
          <div className="select-wrapper">
            <select
              id="tipo_id"
              name="tipo_id"
              className="form-control"
              value={formData.tipo_id}
              onChange={onChangeHandler}
            >   
              <option value="">Seleccione un tipo</option>
              <option value="Cedula de ciudadania">Cédula de ciudadanía</option>
              <option value="Cedula de extranjeria">Cédula de extranjería</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Nombre"
              id="nombre"
              name="nombre"
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              value={formData.nombre}
              onChange={onChangeHandler}
            />
            {errors.nombre && (
              <div className="invalid-feedback">
                {errors.nombre}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="apellido">Apellido</label>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Apellido"
              id="apellido"
              name="apellido"
              className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
              value={formData.apellido}
              onChange={onChangeHandler}
            />
            {errors.apellido && (
              <div className="invalid-feedback">
                {errors.apellido}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="sexo">Sexo</label>
          <div className="select-wrapper">
            <select
              id="sexo"
              name="sexo"
              className="form-control"
              value={formData.sexo}
              onChange={onChangeHandler}
            >
              <option value="">Seleccione una opción</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  const renderContactSection = () => {
    return (
      <div className="step-container">
        <h3 className="step-title">Información de Contacto</h3>
        
        <div className="form-group">
          <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
          <div className="input-wrapper date-input">
            <input
              type="date"
              id="fechaNacimiento"
              name="fechaNacimiento"
              className="form-control"
              value={formData.fechaNacimiento}
              onChange={onChangeHandler}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Teléfono"
              id="telefono"
              name="telefono"
              className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
              value={formData.telefono}
              onChange={onChangeHandler}
            />
            {errors.telefono && (
              <div className="invalid-feedback">
                {errors.telefono}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <div className="input-wrapper">
            <input
              type="email"
              placeholder="Email"
              id="email"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={formData.email}
              onChange={onChangeHandler}
            />
            {errors.email && (
              <div className="invalid-feedback">
                {errors.email}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName="modern-modal"
    >
      <div className="modal-container">
        <Modal.Header closeButton className="modern-header">
          <Modal.Title id="contained-modal-title-vcenter">
            Editar Cliente
          </Modal.Title>
        </Modal.Header>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className={`progress-step ${currentSection === 'personal' ? 'active' : ''}`}
              onClick={() => changeSection('personal')}
            >
              <span className="step-number">1</span>
              <span className="step-label">Personal</span>
            </div>
            <div className="progress-line"></div>
            <div 
              className={`progress-step ${currentSection === 'contacto' ? 'active' : ''}`}
              onClick={() => changeSection('contacto')}
            >
              <span className="step-number">2</span>
              <span className="step-label">Contacto</span>
            </div>
          </div>
        </div>
        
        <Modal.Body className="modern-body">
          {currentSection === 'personal' ? renderPersonalSection() : renderContactSection()}
          
          <div className="button-group">
            {currentSection === 'contacto' && (
              <button type="button" className="btn btn-prev" onClick={() => changeSection('personal')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Anterior
              </button>
            )}
            
            {currentSection === 'personal' ? (
              <button type="button" className="btn btn-next" onClick={() => changeSection('contacto')}>
                Siguiente
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            ) : (
              <form onSubmit={onSubmit} style={{ display: 'inline' }}>
                <button type="submit" className="btn btn-submit">
                  Guardar Cambios
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                </button>
              </form>
            )}
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
}

export function MascCard(props) {
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    especie: '',
    raza: '',
    sexo: '',
    edad: '',
    clienteId: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (props.mascotaData && props.mascotaData.id) {
      getMascotaById(props.mascotaData.id)
        .then(data => {
          if (data) {
            setFormData({
              id: data.id,
              nombre: data.nombre,
              especie: data.especie,
              raza: data.raza,
              sexo: data.sexo,
              edad: data.edad,
              clienteId: data.clienteId
            });
          }
        })
        .catch(error => {
          console.error('Error al obtener la mascota:', error);
        });
    }
  }, [props.mascotaData]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (props.mascotaData && props.mascotaData.id) {
      updateMascota(props.mascotaData.id, formData)
        .then(response => {
          console.log('Mascota actualizada:', response);
          props.onHide();
          window.location.reload(); // Recargar página
        })
        .catch(error => {
          console.error('Error al actualizar la mascota:', error);
        });
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Editar Mascota
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <style jsx>{`
            .icon {
                width: 24px;
                height: 24px;
                display: inline-block;
                vertical-align: middle;
            }
            button.btn-sm {
                padding: 0.25rem 0.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `}</style>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="id">ID de la Mascota</label>
            <input
              type="text"
              placeholder="ID"
              id="id"
              name="id"
              className="form-control"
              value={formData.id}
              onChange={onChangeHandler}
              disabled
            />
          </div>

          <div className="mb-3">
            <label htmlFor="nombre">Nombre de la Mascota</label>
            <input
              type="text"
              placeholder="Nombre"
              id="nombre"
              name="nombre"
              className="form-control"
              value={formData.nombre}
              onChange={onChangeHandler}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="especie">Especie</label>
            <select
              id="especie"
              name="especie"
              className="form-control"
              value={formData.especie}
              onChange={onChangeHandler}
            >   
              <option value="">Seleccione una especie</option>
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
              <option value="Ave">Ave</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="raza">Raza</label>
            <input
              type="text"
              placeholder="Raza"
              id="raza"
              name="raza"
              className="form-control"
              value={formData.raza}
              onChange={onChangeHandler}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="sexo">Sexo</label>
            <select
              id="sexo"
              name="sexo"
              className="form-control"
              value={formData.sexo}
              onChange={onChangeHandler}
            >
              <option value="">Seleccione un sexo</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="edad">Edad (años)</label>
            <input
              type="number"
              placeholder="Edad"
              id="edad"
              name="edad"
              className="form-control"
              value={formData.edad}
              onChange={onChangeHandler}
              min="0"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="clienteId">ID del Dueño</label>
            <input
              type="text"
              placeholder="ID del Cliente"
              id="clienteId"
              name="clienteId"
              className="form-control"
              value={formData.clienteId}
              onChange={onChangeHandler}
              disabled
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onSubmit}
        style={{ backgroundColor: '4a6bffed' } }
        >
          <img src={SaveIcon} alt="Guardar" className="icon" />
        </Button>
        <Button onClick={props.onHide} variant="secondary">Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}
