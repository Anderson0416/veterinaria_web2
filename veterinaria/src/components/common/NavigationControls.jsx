import { useNavigate } from 'react-router-dom';
import backIcon from '../../assets/images/Back.png';

const NavigationControls = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <img 
      src={backIcon} 
      alt="Volver" 
      onClick={handleGoBack}
      style={{ 
        width: '40px',
        height: '40px',
        margin: '20px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
        transform: 'scaleX(-1)' // Agregamos esta línea para voltear horizontalmente
      }}
      onMouseOver={(e) => e.target.style.transform = 'scaleX(-1) scale(1.1)'}
      onMouseOut={(e) => e.target.style.transform = 'scaleX(-1)'}
    />
  );
};

export default NavigationControls;