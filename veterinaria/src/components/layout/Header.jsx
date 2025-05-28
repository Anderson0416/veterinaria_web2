import { Navbar, Nav, Container, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MenuUsuario from '../specificComponents/MenuUsuario';
import logo from '../../assets/images/logo2.png';
import '../../assets/styles/Header.css';
function Header() {
  return (
    <>
      <StyleTag />
      <Navbar expand="lg" style={NavBarStyle} className="custom-dropdown">
        <Container fluid>
          <Navbar.Brand as={Link} to="/inicio">
            <Image 
              src={logo}
              alt="Logo" 
              width={140}
              height={60}
              className="d-inline-block align-top"
            />
          </Navbar.Brand>

          {/* Elementos que irán a la izquierda */}
          <Nav className="mr-auto">
            {/* Puedes agregar más elementos de navegación aquí si es necesario */}
          </Nav>

          {/* Foto en la esquina superior derecha, centrada verticalmente */}
          <MenuUsuario />
        </Container>
      </Navbar>
    </>
  );
};  

const NavBarStyle = {
  backgroundColor: '#4a6bff',
  position: 'relative',
  
};

const customStyles = `
.custom-dropdown .dropdown-menu {
  position: absolute !important;
  right: 0;
  left: auto !important;
  top: 100% !important;
  transform: none !important;
}
`;

const StyleTag = () => (
  <style>{customStyles}</style>
);

export default Header;