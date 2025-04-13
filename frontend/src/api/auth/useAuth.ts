import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthUser } from './types';

export const useAuth = () => {
	const [user, setUser] = useState<AuthUser | null>(null);

	useEffect(() => {
		const token = localStorage.getItem('access');
		if (token) {
			const decoded: any = jwtDecode(token);
			setUser({
				id: decoded.user_id,
				username: decoded.username,
			});
		}
	}, []);

	return { user, isAuthenticated: !!user };
};
