import { request } from '../helpers/axios_helper';

export const createCliente = async (clienteData) => {
  console.log('Creando nuevo cliente:', clienteData);
  try {
    const response = await request(
      'POST',
      '/clientes',
      clienteData
    );
    console.log('Cliente creado exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear cliente:', error);
    if (error.response?.data) {
      console.error('Detalles del error:', error.response.data);
    }
    throw error;
  }
};

export const updateCliente = async (id, clienteData) => {
  console.log('Actualizando cliente:', id, clienteData);
  try {
    const response = await request(
      'PUT',
      `/clientes/${id}`,
      clienteData
    );
    console.log('Cliente actualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    if (error.response?.data) {
      console.error('Detalles del error:', error.response.data);
    }
    throw error;
  }
};

export const deleteCliente = async (id) => {
  console.log('Eliminando cliente con ID:', id);
  try {
    await request('DELETE', `/clientes/${id}`);
    console.log('Cliente eliminado exitosamente');
    return true;
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    if (error.response?.status === 404) {
      console.error('Cliente no encontrado');
    }
    return false;
  }
};

export const getClienteById = async (id) => {
  console.log('Obteniendo cliente con ID:', id);
  try {
    const response = await request('GET', `/clientes/${id}`);
    console.log('Respuesta de cliente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    if (error.response?.status === 404) {
      console.error('Cliente no encontrado');
    } else if (error.response?.status === 401) {
      console.error('Cliente no encontrado');
    }
    return null;
  }
};

export const getAllClientes = async () => {
  console.log('Obteniendo lista de clientes...');
  try {
    const response = await request('GET', '/clientes');
    console.log('Respuesta de clientes:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    if (error.response?.status === 404) {
      console.error('No se encontraron clientes');
    } else if (error.response?.status === 401) {
      console.error('No autorizado para ver clientes');
    }
    return null;
  }
};