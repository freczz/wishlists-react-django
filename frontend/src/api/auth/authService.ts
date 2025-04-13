import api from '../api';
import { AuthTokens } from './types';

export const login = async (username: string, password: string) => {
	try {
		const response = await api.post<AuthTokens>('/auth/login/', {
			username,
			password,
		});
		localStorage.setItem('access', response.data.access);
		localStorage.setItem('refresh', response.data.refresh);
	} catch (error) {
		alert('Неверные учетные данные');
	}
};

export const register = async (username: string, password: string) => {
	return api.post('/auth/register/', {
		username,
		password,
	});
};

export const logout = () => {
	localStorage.removeItem('access');
	localStorage.removeItem('refresh');
	window.location.href = '/login';
};
