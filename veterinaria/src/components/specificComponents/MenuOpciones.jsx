import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/Opciones.css';
// Iconos
import addUser from '../../assets/images/addUser.webp';
import addCons from '../../assets/images/addCons.png';
import addCli from '../../assets/images/add-client.png';
import addMasc from '../../assets/images/add-pet.png';
import addCit from '../../assets/images/add-cita.png';
import SeCit from '../../assets/images/Secit.webp'; 
import Hist from '../../assets/images/Consult.png';

// Componente para el botón y menú desplegable
const FloatingMenu = ({ opciones }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(true);

  const toggleMenu = () => {
    if (!animationComplete) return; // Previene múltiples clics durante animación
    
    // Si el menú se está cerrando, establece un retraso antes de completar la animación
    if (isOpen) {
      setAnimationComplete(false);
      setTimeout(() => {
        setAnimationComplete(true);
      }, 300); // Coincide con la duración de la animación
    }
    
    setIsOpen(!isOpen);
  };

  return (
    <div className="floating-menu-container">
      <div className={`menu-options ${isOpen ? 'visible' : ''}`}>
        {opciones.map((opcion, index) => (
          <Link 
            key={index} 
            to={opcion.ruta} 
            className={`menu-option ${isOpen ? 'show' : ''}`}
            style={{ 
              '--index': index,
              '--total': opciones.length
            }}
          >
            <div className="option-icon">
              <img src={opcion.imagen} alt={opcion.titulo} />
              <span className="option-tooltip">{opcion.titulo}</span>
            </div>
          </Link>
        ))}
      </div>
      <button 
        className={`floating-button ${isOpen ? 'open' : ''}`} 
        onClick={toggleMenu}
        aria-label="Menú de opciones"
      >
        <span className="menu-icon"></span>
      </button>
    </div>
  );
};

export function OpcionesAdm() {
  const opcionesAdmin = [
    {
      titulo: "Gestionar usuarios",
      descripcion: "Gestionar usuarios",
      imagen: addUser,
      ruta: "/inicio/usergestion"
    },
    {
      titulo: "Gestionar Consultas",
      descripcion: "Gestionar Consultas",
      imagen: addCons,
      ruta: "/inicio/consgestion"
    }
  ];

  return (
    <div className="menu-page">
      <div className='Title'>
        <h5 className="m-0 fw-bold">Panel de Administración</h5>
      </div>
      <FloatingMenu opciones={opcionesAdmin} />
    </div>
  );
}

export function OpcionesRec() {
  const opcionesRecepcionista = [
    {
      titulo: "Gestionar clientes",
      descripcion: "Gestionar clientes",
      imagen: addCli,
      ruta: "/inicio/cligestion"
    },
    {
      titulo: "Gestionar mascotas",
      descripcion: "Gestionar mascotas",
      imagen: addMasc,
      ruta: "/inicio/mascgestion"
    },
    {
      titulo: "Gestionar citas",
      descripcion: "Gestionar citas",
      imagen: addCit,
      ruta: "/inicio/citgestion"
    }
  ];

  return (
    <div className="menu-page">
      <div className='Title'>
        <h5 className="m-0 fw-bold">Panel de Recepción</h5>
      </div>
      <FloatingMenu opciones={opcionesRecepcionista} />
    </div>
  );
}

export function OpcionesVet() {
  const opcionesVeterinario = [
    {
      titulo: "Ver citas",
      descripcion: "Ver citas",
      imagen: SeCit,
      ruta: "/inicio/citas"
    },
    {
      titulo: "Ver Historiales",
      descripcion: "Ver Historiales",
      imagen: Hist,
      ruta: "/inicio/historiales"
    }
  ];

  return (
    <div className="menu-page">
      <div className='Title'>
        <h5 className="m-0 fw-bold">Panel Veterinario</h5>
      </div>
      <FloatingMenu opciones={opcionesVeterinario} />
    </div>
  );
}