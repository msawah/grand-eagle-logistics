import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token a las peticiones
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Shipments
export const shipmentsAPI = {
  getAll: () => api.get('/shipments'),
  getById: (id: string) => api.get(`/shipments/${id}`),
  getAvailable: () => api.get('/shipments/available'),
  create: (data: any) => api.post('/shipments', data),
  assignDriver: (id: string, driverId: string) =>
    api.post(`/shipments/${id}/assign`, { driverId }),
  updateStatus: (id: string, status: string) =>
    api.patch(`/shipments/${id}/status`, { status }),
  uploadPOD: (id: string, data: any) => api.post(`/shipments/${id}/pod`, data),
  getPODEvents: (id: string) => api.get(`/shipments/${id}/pod-events`),
  approvePOD: (shipmentId: string, podId: string) =>
    api.post(`/shipments/${shipmentId}/pod/${podId}/approve`),
  rejectPOD: (shipmentId: string, podId: string, reason: string) =>
    api.post(`/shipments/${shipmentId}/pod/${podId}/reject`, { reason }),
};

// Drivers
export const driversAPI = {
  getProfile: () => api.get('/drivers/profile'),
  updateProfile: (data: any) => api.patch('/drivers/profile', data),
  getAll: () => api.get('/drivers'),
  updateLocation: (gpsLat: number, gpsLng: number) =>
    api.post('/drivers/location', { gpsLat, gpsLng }),
  getLocations: () => api.get('/drivers/locations'),
  getLocationHistory: (id: string, limit?: number) =>
    api.get(`/drivers/${id}/location-history`, { params: { limit } }),
  verifyCarrier: (id: string, data: { mcNumber?: string; dotNumber?: string }) =>
    api.post(`/drivers/${id}/verify-carrier`, data),
  getVerifications: (id: string) => api.get(`/drivers/${id}/verifications`),
  getLatestVerification: (id: string) =>
    api.get(`/drivers/${id}/verification/latest`),
};

export default api;
