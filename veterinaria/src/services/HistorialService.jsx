import { request } from '../helpers/axios_helper';

// Obtener un historial por ID
export const getHistorialById = async (id) => {
    console.log('Obteniendo historial:', id);
    try {
        const response = await request('GET', `/historiales/${id}`);
        console.log('Historial encontrado:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al obtener historial:', error);
        if (error.response?.status === 404) {
            console.error('Historial no encontrado');
        }
        return null;
    }
};

// Obtener todos los historiales
export const getAllHistoriales = async () => {
    console.log('Obteniendo todos los historiales');
    try {
        const response = await request('GET', '/historiales');
        console.log('Historiales encontrados:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al obtener historiales:', error);
        return [];
    }
};

// Obtener historiales por ID de mascota
export const getHistorialesByMascotaId = async (mascotaId) => {
    console.log('Obteniendo historiales de la mascota:', mascotaId);
    try {
        const response = await request('GET', `/historiales/mascota/${mascotaId}`);
        console.log('Historiales de la mascota encontrados:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al obtener historiales de la mascota:', error);
        if (error.response?.status === 404) {
            console.error('No se encontraron historiales para esta mascota');
        }
        return [];
    }
};