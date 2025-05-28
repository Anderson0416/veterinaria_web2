export default {
  testEnvironment: 'jsdom', // Necesario para React (DOM en navegador simulado)
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // para manejar imports de estilos
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js' // <-- agrega esta línea
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'] // configuración adicional (opcional)
};
