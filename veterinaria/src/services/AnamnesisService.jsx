import { request } from '../helpers/axios_helper';

export const createAnamnesisWithHistorial = async (anamnesisData) => {
    console.log('Creando anamnesis con historial:', anamnesisData);
    try {
        const response = await request('POST', '/anamnesis/with-historial', anamnesisData);
        console.log('Anamnesis creada:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al crear anamnesis:', error);
        if (error.response?.status === 404) {
            console.error('Entidad no encontrada');
        } else if (error.response?.status === 400) {
            console.error('Datos inválidos');
        }
        return null;
    }
};

// Puedes agregar más funciones relacionadas con anamnesis aquí
export const getAllAnamnesis = async () => {
    // ...
};

export const getAnamnesisById = async (id) => {
    // ...
};

export const deleteAnamnesis = async (id) => {
    // ...
};