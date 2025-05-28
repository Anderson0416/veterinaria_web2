import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Inicio from './pages/Inicio';
import LoginForm from './pages/LoginForm';
import PrivateRoute from './components/specificComponents/PrivateRoute';
import { setNavigator } from './services/navigationService';
import { useEffect } from 'react';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  return (
    <>
      {location.pathname !== "/login" && <Header/>}
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/inicio/*" element={<PrivateRoute element={<Inicio />} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;