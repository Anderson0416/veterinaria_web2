import { request, setAuthHeader } from '../helpers/axios_helper';
  export const SubmitLogin = async (login, contraseña, navigate, onError) => {
  try {
    const response = await request(
      "POST",
      "/login",
      { login, contraseña }
    );

    if (response.data && response.data.token) {
      setAuthHeader(response.data.token);
      navigate('/inicio');
    } else {
      onError("Error al iniciar sesión");
    }
  } catch (error) {
    setAuthHeader(null);
    
    if (error.response) {
      if (error.response.status === 401) {
        onError("Correo electrónico o contraseña inválidos");
      } else if (error.response.status === 404) {
        onError("Usuario no encontrado");
      } else {
        onError("Error al conectar con el servidor");
      }
    } else if (error.request) {
      onError("Correo electrónico o contraseña inválidos");
    } else {
      onError("Error inesperado al iniciar sesión");
    }
  }
};
export const SubmitRegister = async (id,tipoId, nombre, apellido, sexo, fNacimiento, telefono, fContrato, login, rolId, navigate) => {
  // Aquí agregamos un parámetro rolId para recibir el ID del rol
  const formData = {
    id,
    tipo_id:tipoId,
    nombre,
    apellido,
    sexo,
    fechaNacimiento:fNacimiento,
    telefono,
    fechaContrato:fContrato,
    login,
    contraseña:id,
    foto: null,
    rol: {
      id: rolId
    }
  };
  console.log("Datos enviados:", formData);
  
  try {
    const response = await request(
      "POST",
      "/register",
      formData
    );
    console.log("Registro exitoso:", response.data);
    navigate('/inicio/usergestion');
  } catch (error) {
    console.error("Error en la solicitud:", error);
    if (error.response && error.response.data) {
      console.error("Detalles del error:", error.response.data);
    }
    setAuthHeader(null);
  }
};
export const getProfile = async () => {
  //console.log('Fetching user profile...');
  try {
    const response = await request('GET', '/profile');
    //console.log('Profile response:', response.data);
    return response.data; 
  } catch (error) {
    console.error('Error fetching profile:', error);
    if (error.response && error.response.status === 404) {
      console.error('Perfil no encontrado.');
    } else if (error.response && error.response.status === 401) {
      console.error('No autorizado. Redirigiendo al login...');
      return null;
    } else {
      console.error('Error desconocido al obtener el perfil del usuario');
    }
    return null;
  }
};
export const getProfileById = async (id) => {
  console.log('Obteniendo perfil de usuario con ID:', id);
  try {
    const response = await request('GET', `/profile/${id}`);
    console.log('Respuesta del perfil:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    if (error.response?.status === 404) {
      console.error('Usuario no encontrado');
    } else {
      console.error('Error desconocido al obtener el perfil del usuario');
    }
    return null;
  }
};
export const getReceptionists = async () => {
  console.log('Obteniendo lista de recepcionistas...');
  try {
    const response = await request('GET', '/receptionists');
    console.log('Respuesta de recepcionistas:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener recepcionistas:', error);
    if (error.response && error.response.status === 404) {
      console.error('No se encontraron recepcionistas.');
    } else if (error.response && error.response.status === 401) {
      console.error('No autorizado para ver recepcionistas. Redirigiendo al login...');
      return null;
    } else {
      console.error('Error desconocido al obtener la lista de recepcionistas');
    }
    return null;
  }
};
export const getveterinarians = async () => {
  console.log('Obteniendo lista de veterinarios...');
  try {
    const response = await request('GET', '/veterinarians');
    console.log('Respuesta de veterinarians:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener veterinarians:', error);
    if (error.response && error.response.status === 404) {
      console.error('No se encontraron veterinarians.');
    } else if (error.response && error.response.status === 401) {
      console.error('No autorizado para ver veterinarians. Redirigiendo al login...');
      return null;
    } else {
      console.error('Error desconocido al obtener la lista de veterinarians');
    }
    return null;
  }
};
export const updateUserProfile = async (login, id, nombre, apellido,foto) => {
  if (!id||id === 'undefined') {
    throw new Error('ID de usuario no válido');
  }
  const formData = new FormData();
  formData.append('id', id);
  formData.append('nombre', nombre);
  formData.append('apellido', apellido);
  if (foto && foto instanceof File) {
    formData.append('foto', foto);
  }

  try {
    const response = await request(
      'PUT',
      `/update/${encodeURIComponent(login)}`,
      formData,
      {
        headers: {
          // No establecemos Content-Type aquí - axios lo establecerá automáticamente con el boundary para FormData
          'Accept': 'application/json'
        }
      }
    );
    
    if (response && response.data) {
      console.log('Perfil actualizado:', response.data);
      return response.data;
    } else {
      throw new Error('No se recibieron datos en la respuesta');
    }
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    throw error; // Re-lanzamos el error para que sea manejado por el componente que llama
  }
};
export const deleteUser = async (id) => {
  console.log('Eliminando usuario con ID:', id);
  try {
    const response = await request('DELETE', `/delete-user/${id}`);
    console.log('Usuario eliminado exitosamente');
    return true;
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    if (error.response?.status === 404) {
      console.error('Usuario no encontrado');
    } else {
      console.error('Error al eliminar usuario:', error.message);
    }
    return false;
  }
};
export const updatePassword = async (login, oldPassword, newPassword, navigate) => { 
  const formData = { 
    login, 
    oldPassword, 
    newPassword 
  }; 
  try { 
    const response = await request( 
      'PUT', 
      '/update-password', 
      formData 
    ); 

    console.log('Contraseña actualizada:', response.data); 
    navigate('/inicio');
    return response.data; 
  } catch (error) { 
    console.error('Error al actualizar la contraseña:', error); 
    throw error; // Re-lanzamos el error para que sea manejado por el componente que llama 
  } 
};