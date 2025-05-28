import { Link } from 'react-router-dom';
import OpcionCard from '../common/OpcionCard';
import NavigationControls from '../common/NavigationControls';
import ConsultarCit from './ConsultarCit';
import ConsultarUser from './ConsultarUser';
import ConsultarCons from './ConsultarCons';
import ConsultarCli from './ConsultarCli';
import ConsultarMasc from './ConsultarMasc';
import '../../assets/styles/MenuOpciones.css';
import addUser from '../../assets/images/addUser.webp';
import addCons from '../../assets/images/addCons.png';
import addCli from '../../assets/images/add-client.png';
import addMasc from '../../assets/images/add-pet.png';

function Gestionar(props) {
  const getImage = () => {
    switch(props.titulo) {
        case 'Usuario':
            return addUser;
        case 'Consulta':
            return addCons;
        case 'Cliente':
            return addCli;
        case 'Mascota':
            return addMasc;
        case 'Cita':
            return addUser;
    }
};

  const renderComponent = () => {
    switch(props.titulo) {
      case 'Usuario':
        return (
          <>
            <div className='Title'>
              <h5 className="fw-bold">Ver recepcionistas y veterinarios</h5>
            </div>
            <ConsultarUser />
          </>
        );
      case 'Consulta':
        return (
          <>
            <div className='Title'>
              <h5 className="fw-bold">Ver consultas</h5>
            </div>
            <ConsultarCons />
          </>
        );
        case 'Cliente':
          return (
            <>
              <div className='Title'>
                <h5 className="fw-bold">Ver clientes</h5>
              </div>
              <ConsultarCli/>
            </>
          );
      case 'Mascota':
        return (
          <>
            <div className='Title'>
              <h5 className="fw-bold">Ver mascotas</h5>
            </div>
            <ConsultarMasc/>
          </>
        );
      case 'Cita':
        return (
          <>
            <div className='Title'>
              <h5 className="fw-bold">Ver citas</h5>
            </div>
            <ConsultarCit />
          </>
        );
      default:
        console.error('Título no reconocido');
        return null;
    }
  };

  return (
    <>
      <NavigationControls/>
      {renderComponent()}
      <div className='Title'>
        <h5 className="fw-bold">Seleccione una opción</h5>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Link 
            to={
                props.titulo === 'Usuario' 
                    ? "/inicio/usergestion/register" 
                    : props.titulo === 'Consulta'
                        ? "/inicio/consgestion/register"
                        : props.titulo === 'Mascota'
                            ? "/inicio/mascgestion/register"
                            : props.titulo === 'Cita'
                                ? "/inicio/citgestion/register"
                                : "/inicio/cligestion/register"
            } 
            className="text-decoration-none"
        >
          <div className='Card' id='register'>
            <OpcionCard
              imagen={getImage()}
              titulo={`Agregar ${props.titulo}`}
            />
          </div>
        </Link>
      </div>
    </>
  );
}

export default Gestionar;