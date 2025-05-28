import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image } from 'react-bootstrap';

import { getProfile, updateUserProfile } from '../../services/UsuarioService';
import { getServer } from '../../helpers/axios_helper';
import NavigationControls from '../common/NavigationControls';

export default function EditarPerfil() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [tipoId, setTipoId] = useState("");
  const [login, setlogin] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [sexo, setSexo] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaContrato, setFechaContrato] = useState("");
  const [foto, setFoto] = useState("");
  const [previewFoto, setPreviewFoto] = useState("");

  useEffect(() => {
    getProfile()
      .then(data => {
        setId(data.id);
        setTipoId(data.tipo_id);
        setlogin(data.login);
        setNombre(data.nombre);
        setApellido(data.apellido);
        setSexo(data.sexo);
        setFechaNacimiento(data.fechaNacimiento);
        setTelefono(data.telefono);
        setFechaContrato(data.fechaContrato);
        setFoto(data.foto);
        setPreviewFoto(`http://${getServer()}:8080/${data.foto}`);
      })
      .catch(error => {
        console.error('Error al obtener el perfil del usuario:', error);
      });
  }, []);
  
  const onChangeHandler = (event) => {
    const { name, value, files } = event.target;
    if (name === 'id') setId(value);
    if (name === 'tipoId') setTipoId(value);
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
    updateUserProfile(login, id, nombre, apellido, foto)
      .then(response => {
        console.log('Perfil actualizado:', response.data);
        navigate('/inicio');
        window.location.reload();
      })
      .catch(error => {
        console.error('Error al actualizar el perfil:', error);
      });
  };

  const handleEdit = () => {
    navigate("/inicio/cambiar-contra");
  };

  return (
    <>
    <NavigationControls />
    <div className="register-page">
      <div className="register-container">
        {previewFoto && (
          <div className="text-center mb-3">
            <Image 
              src={previewFoto} 
              alt="Foto de perfil"
              width={150}
              height={150}
              className='rounded-circle'
            />
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="foto">Seleccionar Foto</label>
              <input
                type="file"
                id="foto"
                name="foto"
                className="form-control"
                accept="image/*"
                onChange={onChangeHandler}
              />
            </div>

            <div className="form-group">
              <label htmlFor="id">N. Identificación</label>
              <input
                type="text"
                id="id"
                name="id"
                className="form-control"
                value={id}
                onChange={onChangeHandler}
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="tipoIdentificacion">Tipo de Identificación</label>
              <select
                id="tipoIdentificacion"
                name="tipoId"
                className="form-control"
                value={tipoId}
                onChange={onChangeHandler}
              >   
                <option value="">Seleccione una opción</option>
                <option value="Cedula de ciudadania">Cédula de ciudadanía</option>
                <option value="Cedula de extranjeria">Cédula de extranjería</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className="form-control"
                value={nombre}
                onChange={onChangeHandler}
              />
            </div>

            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                className="form-control"
                value={apellido}
                onChange={onChangeHandler}
              />
            </div>

            <div className="form-group">
              <label htmlFor="sexo">Sexo</label>
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

            <div className="form-group">
              <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                className="form-control"
                value={fechaNacimiento}
                onChange={onChangeHandler}
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="text"
                id="telefono"
                name="telefono"
                className="form-control"
                value={telefono}
                onChange={onChangeHandler}
              />
            </div>

            <div className="form-group">
              <label htmlFor="fechaContrato">Fecha de Contrato</label>
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

          <div className="form-footer">
            <button type="submit" className="btn btn-primary">
              Guardar Cambios
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleEdit}
              style={{ marginLeft: '10px' }}
            >
              Cambiar contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}