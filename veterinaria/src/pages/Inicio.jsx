import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import {OpcionesAdm, OpcionesRec, OpcionesVet} from '../components/specificComponents/MenuOpciones';
import { ProgramarCons } from './ProgramarCons';
import { getProfile } from '../services/UsuarioService';
import EditarPerfil from '../components/specificComponents/EditarPerfil';
import RecuperarContra from '../components/specificComponents/RecuperarContraForm';
import Gestionar from '../components/specificComponents/Gestionar';

import  RegisterMascForm  from '../components/specificComponents/RegisterMascForm';
import RegisterUserForm from '../components/specificComponents/RegisterUserForm';
import RegisterConsForm from '../components/specificComponents/RegisterConsForm';
import RegisterCliForm from '../components/specificComponents/RegisterCliForm';
import ConsultarCitVet from '../components/specificComponents/ConsultarCitVet';
import ConsultarHist  from '../components/specificComponents/ConsultarHist';
function Inicio() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener el perfil de usuario al cargar el componente
    const fetchUserData = async () => {
      try {
        const profile = await getProfile();
        setUserData(profile);
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const renderComponentByRole = () => {
    if (!userData || !userData.rol || !userData.rol.id) {
      return <Navigate to="/" />;
    }

    switch (userData.rol.id) {
      case 1:
        return <OpcionesAdm />; 
      case 2:
        return <OpcionesRec />;
      case 3:
        return <OpcionesVet />;
      default:
        console.error('Rol no reconocido');
        return <Navigate to="/" />;
    }
  };

  if (loading) {
    return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>);
  }

  const userRole = userData?.rol?.id;

  return (
    <>
      <Routes>
        <Route path="/" element={renderComponentByRole()} />
        
        {/* Rutas comunes para todos los usuarios */}
        <Route path="cambiar-contra" element={
          <ProtectedRoute 
            element={<RecuperarContra/>} 
            allowedRoles={[1, 2, 3]} 
            userRole={userRole}
          />
        } />
        <Route path="editar-perfil" element={
          <ProtectedRoute 
            element={<EditarPerfil/>} 
            allowedRoles={[1, 2, 3]} 
            userRole={userRole}
          />
        } />

        {/* Rutas para Administrador */}
        <Route path="usergestion" element={
          <ProtectedRoute 
            element={<Gestionar titulo="Usuario" />} 
            allowedRoles={[1]} 
            userRole={userRole}
          />
        } />
        <Route path="usergestion/register" element={
          <ProtectedRoute 
            element={<RegisterUserForm/>} 
            allowedRoles={[1]} 
            userRole={userRole}
          />
        } />
        <Route path="consgestion" element={
          <ProtectedRoute 
            element={<Gestionar titulo="Consulta" />} 
            allowedRoles={[1]} 
            userRole={userRole}
          />
        } />
        <Route path="consgestion/register" element={
          <ProtectedRoute 
            element={<RegisterConsForm/>} 
            allowedRoles={[1]} 
            userRole={userRole}
          />
        } />

        {/* Rutas para Recepcionista */}
        <Route path="cligestion" element={
          <ProtectedRoute 
            element={<Gestionar titulo="Cliente" />} 
            allowedRoles={[2]} 
            userRole={userRole}
          />
        } />
        <Route path="cligestion/register" element={
          <ProtectedRoute 
            element={<RegisterCliForm/>} 
            allowedRoles={[2]} 
            userRole={userRole}
          />
        } />
        <Route path="mascgestion" element={
          <ProtectedRoute 
            element={<Gestionar titulo="Mascota"/>} 
            allowedRoles={[2]} 
            userRole={userRole}
          />
        } />
        <Route path="mascgestion/register" element={
          <ProtectedRoute 
            element={<RegisterMascForm/>} 
            allowedRoles={[2]} 
            userRole={userRole}
          />
        } />
        <Route path="citgestion" element={
          <ProtectedRoute 
            element={<Gestionar titulo="Cita"/>} 
            allowedRoles={[2]} 
            userRole={userRole}
          />
        } />
        <Route path="citgestion/register" element={
          <ProtectedRoute 
            element={<ProgramarCons/>} 
            allowedRoles={[2]} 
            userRole={userRole}
          />
        } />

        {/* Rutas veterinario */}
        <Route path="citas" element={
          <ProtectedRoute 
            element={<ConsultarCitVet veterinarioId={userData.id} />} 
            allowedRoles={[3]} 
            userRole={userRole}
          />
        } />
        <Route path="historiales" element={
          <ProtectedRoute 
            element={<ConsultarHist />} 
            allowedRoles={[3]} 
            userRole={userRole}
          />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default Inicio;