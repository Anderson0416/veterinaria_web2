import { request } from '../helpers/axios_helper';

export const createFactura = async (facturaData) => {
  console.log('Creando nueva factura:', facturaData);
  try {
    const response = await request(
      'POST',
      '/facturas',
      facturaData
    );
    console.log('Factura creada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear factura:', error);
    if (error.response?.data) {
      console.error('Detalles del error:', error.response.data);
    }
    throw error;
  }
};

export const updateFactura = async (id, facturaData) => {
  console.log('Actualizando factura:', id, facturaData);
  try {
    const response = await request(
      'PUT',
      `/facturas/${id}`,
      facturaData
    );
    console.log('Factura actualizada:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar factura:', error);
    if (error.response?.data) {
      console.error('Detalles del error:', error.response.data);
    }
    throw error;
  }
};

export const deleteFactura = async (id) => {
  console.log('Eliminando factura con ID:', id);
  try {
    await request('DELETE', `/facturas/${id}`);
    console.log('Factura eliminada exitosamente');
    return true;
  } catch (error) {
    console.error('Error al eliminar factura:', error);
    if (error.response?.status === 404) {
      console.error('Factura no encontrada');
    }
    return false;
  }
};

export const getFacturaById = async (id) => {
  console.log('Obteniendo factura con ID:', id);
  try {
    const response = await request('GET', `/facturas/${id}`);
    console.log('Respuesta de factura:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener factura:', error);
    if (error.response?.status === 404) {
      console.error('Factura no encontrada');
    }
    return null;
  }
};

export const getAllFacturas = async () => {
  console.log('Obteniendo lista de facturas...');
  try {
    const response = await request('GET', '/facturas');
    console.log('Respuesta de facturas:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener facturas:', error);
    if (error.response?.status === 404) {
      console.error('No se encontraron facturas');
    } else if (error.response?.status === 401) {
      console.error('No autorizado para ver facturas');
    }
    return null;
  }
};

export const getFacturasByClienteId = async (clienteId) => {
  console.log('Obteniendo facturas del cliente:', clienteId);
  try {
    const response = await request('GET', `/facturas/cliente/${clienteId}`);
    console.log('Respuesta de facturas del cliente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener facturas del cliente:', error);
    if (error.response?.status === 404) {
      console.error('No se encontraron facturas para este cliente');
    }
    return null;
  }
};
{/*
   */}