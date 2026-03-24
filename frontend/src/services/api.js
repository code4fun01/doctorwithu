const BASE = import.meta.env.VITE_API_BASE_URL || '/api';

function getToken() {
  return localStorage.getItem('doctorwithu_token');
}

async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const authAPI = {
  signup: (body) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  verifyOTP: (body) => request('/auth/verify-otp', { method: 'POST', body: JSON.stringify(body) }),
  resendOTP: (body) => request('/auth/resend-otp', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),
};

export const doctorAPI = {
  getAll: (category, search) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    const query = params.toString();
    return request(query ? `/doctors?${query}` : '/doctors');
  },
  getCategories: () => request('/doctors/categories/list'),
  getById: (id) => request(`/doctors/${id}`),
  getMyProfile: () => request('/doctors/me/profile'),
  updateAvailability: (body) => request('/doctors/me/availability', { method: 'PATCH', body: JSON.stringify(body) }),
  updateConsultationFee: (body) => request('/doctors/me/consultation-fee', { method: 'PATCH', body: JSON.stringify(body) }),
};

export const appointmentAPI = {
  book: (body) => request('/appointments', { method: 'POST', body: JSON.stringify(body) }),
  getMy: () => request('/appointments/my'),
  cancel: (id) => request(`/appointments/${id}/cancel`, { method: 'PATCH' }),
  getDoctorUpcoming: () => request('/appointments/doctor/upcoming'),
};

export const adminAPI = {
  getUsers: () => request('/admin/users'),
  getAppointments: () => request('/admin/appointments'),
  addDoctor: (body) => request('/admin/doctors', { method: 'POST', body: JSON.stringify(body) }),
  deleteDoctor: (id) => request(`/admin/doctors/${id}`, { method: 'DELETE' }),
};
