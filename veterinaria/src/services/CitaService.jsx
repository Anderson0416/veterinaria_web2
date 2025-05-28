import { request } from '../helpers/axios_helper';

export const createCitaWithFactura = async (citaData) => {
  console.log('Creando nueva cita con factura:', citaData);
  try {
    const response = await request(
      'POST',
      '/citas/with-factura',
      citaData
    );
    console.log('Cita con factura creada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear cita con factura:', error);
    if (error.response?.data) {
      console.error('Detalles del error:', error.response.data);
    }
    throw error;
  }
};

export const createCita = async (citaData) => {
  console.log('Creando nueva cita:', citaData);
  try {
    const response = await request(
      'POST',
      '/citas',
      citaData
    );
    console.log('Cita creada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear cita:', error);
    if (error.response?.data) {
      console.error('Detalles del error:', error.response.data);
    }
    throw error;
  }
};

export const updateCita = async (id, citaData) => {
  console.log('Actualizando cita:', id, citaData);
  try {
    const response = await request(
      'PUT',
      `/citas/${id}`,
      citaData
    );
    console.log('Cita actualizada:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar cita:', error);
    if (error.response?.data) {
      console.error('Detalles del error:', error.response.data);
    }
    throw error;
  }
};

export const deleteCita = async (id) => {
  console.log('Eliminando cita con ID:', id);
  try {
    await request('DELETE', `/citas/${id}`);
    console.log('Cita eliminada exitosamente');
    return true;
  } catch (error) {
    console.error('Error al eliminar cita:', error);
    if (error.response?.status === 404) {
      console.error('Cita no encontrada');
    }
    return false;
  }
};

export const getCitaById = async (id) => {
  console.log('Obteniendo cita con ID:', id);
  try {
    const response = await request('GET', `/citas/${id}`);
    console.log('Respuesta de cita:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener cita:', error);
    if (error.response?.status === 404) {
      console.error('Cita no encontrada');
    }
    return null;
  }
};

export const getAllCitas = async () => {
  console.log('Obteniendo lista de citas...');
  try {
    const response = await request('GET', '/citas');
    console.log('Respuesta de citas:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener citas:', error);
    if (error.response?.status === 404) {
      console.error('No se encontraron citas');
    } else if (error.response?.status === 401) {
      console.error('No autorizado para ver citas');
    }
    return null;
  }
};

export const getCitasByClienteId = async (clienteId) => {
  console.log('Obteniendo citas del cliente:', clienteId);
  try {
    const response = await request('GET', `/citas/cliente/${clienteId}`);
    console.log('Respuesta de citas del cliente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener citas del cliente:', error);
    if (error.response?.status === 404) {
      console.error('No se encontraron citas para este cliente');
    }
    return null;
  }
};

export const getCitasByVeterinarioId = async (veterinarioId) => {
  console.log('Obteniendo citas del veterinario:', veterinarioId);
  try {
    const response = await request('GET', `/citas/veterinario/${veterinarioId}`);
    console.log('Respuesta de citas del veterinario:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener citas del veterinario:', error);
    if (error.response?.status === 404) {
      console.error('No se encontraron citas para este veterinario');
    }
    return null;
  }
};

export const getCitasByMascotaId = async (mascotaId) => {
  console.log('Obteniendo citas de la mascota:', mascotaId);
  try {
    const response = await request('GET', `/citas/mascota/${mascotaId}`);
    console.log('Respuesta de citas de la mascota:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener citas de la mascota:', error);
    if (error.response?.status === 404) {
      console.error('No se encontraron citas para esta mascota');
    }
    return null;
  }
};

export const pagarCita = async (id) => {
    console.log('Pagando cita:', id);
    try {
        const response = await request('PUT', `/citas/${id}/pagar`);
        console.log('Cita pagada:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al pagar cita:', error);
        if (error.response?.status === 404) {
            console.error('Cita no encontrada');
        }
        return null;
    }
};


export const atenderCita = async (id) => {
    console.log('Marcando cita como atendida:', id);
    try {
        const response = await request('PUT', `/citas/${id}/atender`);
        console.log('Cita marcada como atendida:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al marcar cita como atendida:', error);
        if (error.response?.status === 404) {
            console.error('Cita no encontrada');
        }
        return null;
    }
};