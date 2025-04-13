import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { login } from '../../api/auth/authService';

const Auth: React.FC = () => {
	const [isLogin, setIsLogin] = useState(true); // Состояние для переключения между входом и регистрацией
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		await login(username, password);
		navigate('/wishlists');
	};

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await axios.post('http://localhost:8000/auth/register/', {
				username,
				password,
			});
			alert('Регистрация успешна');
			setIsLogin(true);
			await handleLogin(e);
		} catch (error: any) {
			console.log(error.response.data.username[0]);
			alert(`Ошибка регистрации: ${error.response.data.username[0]}`);
		}
	};

	const toggleForm = () => {
		setIsLogin(!isLogin);
		setUsername('');
		setPassword('');
	};

	return (
		<div className='auth-container'>
			<div className='auth-block'>
				<h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
				<form onSubmit={isLogin ? handleLogin : handleRegister}>
					<div className='auth-form-group'>
						<label htmlFor='username'>Имя пользователя</label>
						<input
							type='text'
							id='username'
							value={username}
							onChange={e => setUsername(e.target.value)}
							placeholder='Введите имя пользователя'
							required
						/>
					</div>
					<div className='auth-form-group'>
						<label htmlFor='password'>Пароль</label>
						<input
							type='password'
							id='password'
							value={password}
							onChange={e => setPassword(e.target.value)}
							placeholder='Введите пароль'
							required
						/>
					</div>
					<button type='submit'>
						{isLogin ? 'Войти' : 'Зарегистрироваться'}
					</button>
					<p>
						{isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
						<a href='#' onClick={toggleForm}>
							{isLogin ? 'Регистрация' : 'Войти'}
						</a>
					</p>
				</form>
			</div>
		</div>
	);
};

export default Auth;
