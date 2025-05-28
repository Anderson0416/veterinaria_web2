import { Github, Linkedin, Twitter } from 'lucide-react';
import '../../assets/styles/Footer.css'; 

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer text-white">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0">&copy; {currentYear} Farid Muriel. Todos los derechos reservados.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <a href="https://github.com/Murif777" className="text-white me-3" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github />
            </a>
            {/*<a href="https://linkedin.com/in/tu-usuario" className="text-white me-3" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin />
            </a>
            <a href="https://twitter.com/tu-usuario" className="text-white" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter />
            </a>*/}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
