import axios from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:8000',
});

api.interceptors.request.use(config => {
	const token = localStorage.getItem('access');
	if (token && config.headers) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	res => res,
	async err => {
		const originalRequest = err.config;

		if (
			err.response?.status === 401 &&
			!originalRequest._retry &&
			localStorage.getItem('refresh')
		) {
			originalRequest._retry = true;
			try {
				const response = await api.post('/auth/token/refresh/', {
					refresh: localStorage.getItem('refresh'),
				});
				localStorage.setItem('access', response.data.access);
				api.defaults.headers.common.Authorization = `Bearer ${response.data.access}`;
				return api(originalRequest);
			} catch (refreshErr) {
				localStorage.removeItem('access');
				localStorage.removeItem('refresh');
				window.location.href = '/login';
			}
		}

		return Promise.reject(err);
	}
);

export default api;
