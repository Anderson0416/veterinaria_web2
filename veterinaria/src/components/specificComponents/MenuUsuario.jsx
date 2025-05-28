import { Nav, Image, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAuthToken, setAuthHeader, getServer } from '../../helpers/axios_helper';
import { getProfile } from '../../services/UsuarioService';
import '../../assets/styles/MenuUsuario.css';

const MenuUsuario = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPhotoURL, setUserPhotoURL] = useState("");
  const [defaultProfilePics, setDefaultProfilePics] = useState([]);

  useEffect(() => {
    // Cargar las imágenes predeterminadas desde el archivo JSON
    const loadDefaultProfilePics = async () => {
      try {
        const response = await fetch('/src/assets/images/defaultProfilePics.json');
        const data = await response.json();
        setDefaultProfilePics(data.defaultProfilePics);
      } catch (error) {
        console.error('Error al cargar las imágenes predeterminadas:', error);
      }
    };

    loadDefaultProfilePics();
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true);
      getProfile()
        .then(perfil => {
          //console.log("Perfil obtenido:", perfil);
          if (perfil && perfil.foto) {
            setUserPhotoURL(`http://${getServer()}:8080/${perfil.foto}`);
          } else if (defaultProfilePics.length > 0) {
            const randomIndex = Math.floor(Math.random() * defaultProfilePics.length);
            setUserPhotoURL(defaultProfilePics[randomIndex]);
          }
        })
        .catch(error => {
          console.error('Error al obtener el perfil del usuario:', error);
          if (defaultProfilePics.length > 0) {
            const randomIndex = Math.floor(Math.random() * defaultProfilePics.length);
            setUserPhotoURL(defaultProfilePics[randomIndex]);
          }
        });
    }
  }, [defaultProfilePics]);

  const handleLogout = () => {
    setAuthHeader(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const handleEdit = () => {
    navigate("/inicio/editar-perfil");
  };

  return (
    <Nav>
      <NavDropdown 
        title={
          <div style={{
            width: '50px',
            height: '50px',
            overflow: 'hidden',
            borderRadius: '50%',
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
          }}>
            <Image 
              src={userPhotoURL} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              alt="Foto de perfil"
            />
          </div>
        } 
        id="basic-nav-dropdown"
        className="custom-dropdown"
      >
        <NavDropdown.Item onClick={handleEdit}>Editar perfil</NavDropdown.Item>
        <NavDropdown.Item onClick={handleLogout}>Cerrar sesión</NavDropdown.Item>
      </NavDropdown>
    </Nav>
  );
};

export default MenuUsuario;
