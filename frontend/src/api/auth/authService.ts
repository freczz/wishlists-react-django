import api from '../api';
import { AuthTokens } from './types';

export const login = async (
	username: string,
	email: string,
	password: string
) => {
	try {
		localStorage.removeItem('access');
		localStorage.removeItem('refresh');
		const response = await api.post<AuthTokens>('/auth/login/', {
			username,
			email,
			password,
		});
		localStorage.setItem('user', JSON.parse(response.config.data).username);
		localStorage.setItem('access', response.data.access);
		localStorage.setItem('refresh', response.data.refresh);
		return response;
	} catch (error: any) {
		console.log('error', error.response.data);
		if (error.response.data?.detail) {
			alert(error.response.data?.detail);
		}
	}
};

export const register = async (
	username: string,
	email: string,
	password: string
) => {
	try {
		localStorage.removeItem('access');
		localStorage.removeItem('refresh');
		return await api.post('/auth/register/', {
			username,
			email,
			password,
		});
	} catch (error: any) {
		console.log('error', error.response.data);
		if (error.response.data?.username && error.response.data?.username[0]) {
			alert(error.response.data?.username[0]);
		} else if (error.response.data?.email && error.response.data?.email[0]) {
			alert(error.response.data?.email[0]);
		} else if (
			error.response.data?.password &&
			error.response.data?.password[0]
		) {
			alert(error.response.data?.password[0]);
		}
	}
};

export const getProfile = async () => {
	try {
		return await api.get('/auth/me/');
	} catch (error) {
		console.log('error', error);
		alert(error);
	}
};

export const changePassword = async (
	oldPassword: string,
	newPassword: string
) => {
	try {
		return await api.post('/auth/change-password/', {
			body: JSON.stringify({
				old_password: oldPassword,
				new_password: newPassword,
			}),
		});
	} catch (error) {
		console.log('error', error);
		alert(error);
	}
};

export const logout = () => {
	localStorage.removeItem('access');
	localStorage.removeItem('refresh');
	window.location.href = '/login';
};
