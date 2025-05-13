import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton/BackButton';
import { changePassword, getProfile } from '../../api/auth/authService';
import { IMyUserData } from '../../interfaces';
import Header from '../../components/Header/Header';
import './MyProfilePage.css';

export default function MyProfilePage() {
	const navigate = useNavigate();
	const [user, setUser] = useState<IMyUserData | null>(null);
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [message, setMessage] = useState('');

	useEffect(() => {
		const fetchUser = async () => {
			const res = await getProfile();
			if (res) {
				setUser(res.data);
			}
		};
		fetchUser();
	}, []);

	const handleChangePassword = async () => {
		console.log('oldPassword:', oldPassword, 'newPassword:', newPassword);

		try {
			const res = await changePassword(oldPassword, newPassword);
			if (res.status === 200) {
				setMessage('Пароль успешно изменён');
				setOldPassword('');
				setNewPassword('');
			}
		} catch (error: any) {
			const errorMessage =
				error.response?.data?.error ||
				Object.values(error.response?.data || {})[0] ||
				'Ошибка при смене пароля';
			setMessage(errorMessage);
		}
	};

	if (!user) return <div className='profile-page'>Загрузка...</div>;

	return (
		<div className='profile-page'>
			<Header />
			<BackButton />
			<div className='profile-container'>
				<h2>Мой профиль</h2>
				<div className='profile-info'>
					<p>
						<strong>Имя пользователя:</strong> {user.username}
					</p>
					<p>
						<strong>Email:</strong> {user.email}
					</p>
				</div>

				<button className='profile-button' onClick={() => navigate('/friends')}>
					Перейти к друзьям
				</button>

				<h3>Сменить пароль</h3>
				<div className='password-form'>
					<input
						type='password'
						placeholder='Старый пароль'
						value={oldPassword}
						onChange={e => setOldPassword(e.target.value)}
					/>
					<input
						type='password'
						placeholder='Новый пароль'
						value={newPassword}
						onChange={e => setNewPassword(e.target.value)}
					/>
					<button className='profile-button' onClick={handleChangePassword}>
						Сменить
					</button>
					{message && <p className='message'>{message}</p>}
				</div>
			</div>
		</div>
	);
}
