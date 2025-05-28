import axios from 'axios';
import { getNavigator } from '../services/navigationService';

export const getAuthToken = () => {
  const token = window.localStorage.getItem('auth_token');
  return token !== "null" ? token : null;
};

export const setAuthHeader = (token) => {
  if (token !== null) {
    window.localStorage.setItem("auth_token", token);
  } else {
    window.localStorage.removeItem("auth_token");
  }
};

export const getServer = () => {
  return 'localhost';
};

axios.defaults.baseURL = `http://${getServer()}:8080/`;

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

// Modificar el interceptor de respuesta
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Ignorar errores 401 para endpoints específicos
      const ignoredEndpoints = [
        '/clientes/',
        '/mascotas/',
        '/citas/',
        '/consultas/'
      ];
      
      const isIgnoredEndpoint = ignoredEndpoints.some(endpoint => 
        error.config.url.includes(endpoint)
      );

      // Verificar si es error de token expirado (401) y no es un endpoint ignorado
      if (error.response.status === 401 && !isIgnoredEndpoint) {
        console.log('Token expirado o inválido');
        
        // Limpiar el token
        setAuthHeader(null);
        
        // Redirigir al login
        window.location.href = '/login';
        
        return Promise.reject({ message: 'Sesión expirada. Por favor, inicie sesión nuevamente.' });
      }
    }
    return Promise.reject(error);
  }
);

export const request = (method, url, data) => {
  let headers = {};
  const authToken = getAuthToken();
  //console.log("Auth token:", authToken);

  if (authToken !== null && authToken !== "null" && url !== '/register' && url !== '/login') {
    headers = { 'Authorization': `Bearer ${authToken}` };
    //console.log(" header:", headers.Authorization);
  }

  return axios({
    method: method,
    url: url,
    headers: headers,
    data: data
  })
  .then(response => {
    //console.log("Response received:", response);
    return response;
  })
  .catch(error => {
    if (error.response?.status === 404) {
      console.error('Cliente no encontrado');
    } else if (error.response?.status === 401 && !error.config.url.includes('/login')) {
      console.error('No autorizado - Token posiblemente expirado');
    }
    console.error("Error in request:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
      return Promise.reject(error.response);
    } else if (error.request) {
      console.error("No response received:", error.request);
      return Promise.reject({ message: "No response from server", request: error.request });
    } else {
      console.error("Error setting up the request:", error.message);
      return Promise.reject({ message: error.message });
    }
  });
};