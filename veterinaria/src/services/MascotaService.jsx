import { request } from '../helpers/axios_helper';

export const createMascota = async (mascotaData) => {
  console.log('Creando nueva mascota:', mascotaData);
  try {
    const response = await request(
      'POST',
      '/mascotas',
      mascotaData
    );
    console.log('Mascota creada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear mascota:', error);
    if (error.response?.data) {
      console.error('Detalles del error:', error.response.data);
    }
    throw error;
  }
};

export const updateMascota = async (id, mascotaData) => {
  console.log('Actualizando mascota:', id, mascotaData);
  try {
    const response = await request(
      'PUT',
      `/mascotas/${id}`,
      mascotaData
    );
    console.log('Mascota actualizada:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar mascota:', error);
    if (error.response?.data) {
      console.error('Detalles del error:', error.response.data);
    }
    throw error;
  }
};

export const deleteMascota = async (id) => {
  console.log('Eliminando mascota con ID:', id);
  try {
    await request('DELETE', `/mascotas/${id}`);
    console.log('Mascota eliminada exitosamente');
    return true;
  } catch (error) {
    console.error('Error al eliminar mascota:', error);
    if (error.response?.status === 404) {
      console.error('Mascota no encontrada');
    }
    return false;
  }
};

export const getMascotaById = async (id) => {
  console.log('Obteniendo mascota con ID:', id);
  try {
    const response = await request('GET', `/mascotas/${id}`);
    console.log('Respuesta de mascota:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener mascota:', error);
    if (error.response?.status === 404) {
      console.error('Mascota no encontrada');
    }
    return null;
  }
};

export const getAllMascotas = async () => {
  console.log('Obteniendo lista de mascotas...');
  try {
    const response = await request('GET', '/mascotas');
    console.log('Respuesta de mascotas:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener mascotas:', error);
    if (error.response?.status === 404) {
      console.error('No se encontraron mascotas');
    } else if (error.response?.status === 401) {
      console.error('No autorizado para ver mascotas');
    }
    return null;
  }
};

export const getMascotasByClienteId = async (clienteId) => {
  console.log('Obteniendo mascotas del cliente:', clienteId);
  try {
    const response = await request('GET', `/mascotas/cliente/${clienteId}`);
    console.log('Respuesta de mascotas del cliente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener mascotas del cliente:', error);
    if (error.response?.status === 404) {
      console.error('No se encontraron mascotas para este cliente');
    }
    return null;
  }
};