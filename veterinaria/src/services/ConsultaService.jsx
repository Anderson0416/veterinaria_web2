import { request } from '../helpers/axios_helper';

export const createConsulta = async (consultaData) => {
  console.log('Creando nueva consulta:', consultaData);
  try {
    const response = await request(
      'POST',
      '/consultas',
      consultaData
    );
    console.log('Consulta creada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear consulta:', error);
    if (error.response?.data) {
      console.error('Detalles del error:', error.response.data);
    }
    throw error;
  }
};

export const updateConsulta = async (id, consultaData) => {
  console.log('Actualizando consulta:', id, consultaData);
  try {
    const response = await request(
      'PUT',
      `/consultas/${id}`,
      consultaData
    );
    console.log('Consulta actualizada:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar consulta:', error);
    if (error.response?.data) {
      console.error('Detalles del error:', error.response.data);
    }
    throw error;
  }
};

export const deleteConsulta = async (id) => {
  console.log('Eliminando consulta con ID:', id);
  try {
    await request('DELETE', `/consultas/${id}`);
    console.log('Consulta eliminada exitosamente');
    return true;
  } catch (error) {
    console.error('Error al eliminar consulta:', error);
    if (error.response?.status === 404) {
      console.error('Consulta no encontrada');
    }
    return false;
  }
};

export const getConsultaById = async (id) => {
  console.log('Obteniendo consulta con ID:', id);
  try {
    const response = await request('GET', `/consultas/${id}`);
    console.log('Respuesta de consulta:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener consulta:', error);
    if (error.response?.status === 404) {
      console.error('Consulta no encontrada');
    }
    return null;
  }
};

export const getAllConsultas = async () => {
  console.log('Obteniendo lista de consultas...');
  try {
    const response = await request('GET', '/consultas');
    console.log('Respuesta de consultas:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener consultas:', error);
    if (error.response?.status === 404) {
      console.error('No se encontraron consultas');
    } else if (error.response?.status === 401) {
      console.error('No autorizado para ver consultas');
    }
    return null;
  }
};

export const getConsultasByFacturaId = async (facturaId) => {
  console.log('Obteniendo consultas de la factura:', facturaId);
  try {
    const response = await request('GET', `/consultas/factura/${facturaId}`);
    console.log('Respuesta de consultas de la factura:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener consultas de la factura:', error);
    if (error.response?.status === 404) {
      console.error('No se encontraron consultas para esta factura');
    } else if (error.response?.status === 401) {
      console.error('No autorizado para ver las consultas de esta factura');
    }
    return null;
  }
};