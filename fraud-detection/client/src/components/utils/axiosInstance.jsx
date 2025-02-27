import axios from "axios";

// Create separate instances for different services
const createAPIInstance = (port) => {
  return axios.create({
    baseURL: `http://52.91.251.247:${port}/api`,
  });
};

// Create API instances for each service
export const userAPI = createAPIInstance(8000);
export const adminAPI = createAPIInstance(8001);
export const vendorAPI = createAPIInstance(8002);
export const utilsAPI = createAPIInstance(8003);

const instances = [userAPI, adminAPI, vendorAPI, utilsAPI];
// Apply auth token to all instances
export const setAuthToken = (getToken) => {
  
  instances.forEach(instance => {
    instance.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        // Convert the error to an Error object if it isn't already
        if (!(error instanceof Error)) {
          return Promise.reject(new Error(error?.message.error || 'Request failed'));
        }
        return Promise.reject(error);
      }
    );
  });
};



export default {
  user: userAPI,
  admin: adminAPI,
  vendor: vendorAPI,
  utils: utilsAPI
};