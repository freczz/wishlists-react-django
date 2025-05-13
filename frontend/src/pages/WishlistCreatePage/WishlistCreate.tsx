import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './WishlistCreate.css';
import WishlistService from '../../api/wishlists/WishlistService';
import { AccessLevel, Wishlist } from '../../interfaces';
import Header from '../../components/Header/Header';
import BackButton from '../../components/BackButton/BackButton';

const WishlistCreate: React.FC = () => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [image, setImage] = useState<File | null>(null);
	const [access, setAccess] = useState<AccessLevel>('public');
	const [items, setItems] = useState<
		{ name: string; description: string; link: string; image: File | null }[]
	>([]);
	const [useColorInsteadOfImage, setUseColorInsteadOfImage] = useState(false);
	const [color, setColor] = useState('#ffffff');
	const token = localStorage.getItem('access');
	const navigate = useNavigate();

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};

	const handleItemChange = (
		index: number,
		field: string,
		value: string | File | null
	) => {
		const updatedItems = [...items] as any;
		if (field === 'image') {
			updatedItems[index].image = value as File;
		} else {
			updatedItems[index][field as keyof (typeof updatedItems)[number]] =
				value as null;
		}
		setItems(updatedItems);
	};

	const handleAddItem = () => {
		setItems([...items, { name: '', description: '', link: '', image: null }]);
	};

	const handleRemoveItem = (index: number) => {
		const updatedItems = items.filter((_, i) => i !== index);
		setItems(updatedItems);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log('file', image);

		try {
			await WishlistService.createWishlist({
				title,
				description,
				access_level: access,
				image: useColorInsteadOfImage ? null : image,
				color: useColorInsteadOfImage ? color : null,
				items,
			});
			alert('Вишлист создан!');
			navigate('/wishlists');
		} catch (error: any) {
			console.log('ERRROR', error);

			console.error('Ошибка:', error.response?.data || error.message);
			if (error.response?.data) {
				if (error.response.data?.image) {
					alert(
						`Ошибка при создании вишлиста: ${error.response.data.image[0]}`
					);
				}
			} else {
				alert('Ошибка при создании вишлиста.');
			}
		}
	};

	return (
		<>
			<Header />
			<BackButton />
			<div className='wishlist-create-container'>
				<div className='wishlist-create-block'>
					<h2>Создать вишлист</h2>
					<form className='create-form' onSubmit={handleSubmit}>
						<div className='form-row'>
							<div className='form-column'>
								<div className='form-group'>
									<label htmlFor='title'>Название</label>
									<input
										type='text'
										id='title'
										value={title}
										onChange={e => setTitle(e.target.value)}
										required
									/>
								</div>
								<div className='form-group'>
									<label htmlFor='description'>Описание</label>
									<textarea
										id='description'
										value={description}
										onChange={e => setDescription(e.target.value)}
										required
									/>
								</div>
								<div className='form-group'>
									<label htmlFor='access'>Доступ</label>
									<select
										id='access'
										value={access}
										onChange={e => setAccess(e.target.value as AccessLevel)}
									>
										<option value='public'>Публичный</option>
										<option value='private'>Приватный</option>
										<option value='link'>По ссылке</option>
									</select>
								</div>
							</div>
							<div className='form-column'>
								<div className='form-group'>
									<label>
										<input
											type='checkbox'
											checked={useColorInsteadOfImage}
											onChange={e =>
												setUseColorInsteadOfImage(e.target.checked)
											}
										/>
										Использовать цвет вместо изображения
									</label>
								</div>

								{useColorInsteadOfImage ? (
									<div className='form-group'>
										<label htmlFor='color'>Выбери цвет</label>
										<select
											id='color'
											value={color}
											onChange={e => setColor(e.target.value)}
										>
											<option value='#ffffff'>Белый</option>
											<option value='#FF8282'>Красный</option>
											<option value='#82FF8F'>Зелёный</option>
											<option value='#8299FF'>Синий</option>
											<option value='#FFD182'>Оранжевый</option>
											<option value='#B482FF'>Фиолетовый</option>
										</select>
									</div>
								) : (
									<div className='form-group'>
										<label htmlFor='image'>Изображение</label>
										<input
											type='file'
											id='image'
											accept='image/*'
											onChange={handleImageChange}
											className='image-input'
										/>
										{image && (
											<div className='image-create-preview'>
												<img
													src={URL.createObjectURL(image)}
													alt='Превью'
													className='image-preview'
												/>
											</div>
										)}
									</div>
								)}
							</div>
						</div>

						{/* Список товаров */}
						<h3>Товары</h3>
						{items.map((item, index) => (
							<div key={index} className='create-item-block'>
								<div className='form-row'>
									<div className='form-column'>
										<div className='form-group'>
											<label htmlFor='title'>Название товара</label>
											<input
												type='text'
												placeholder='Название товара'
												value={item.name}
												onChange={e =>
													handleItemChange(index, 'name', e.target.value)
												}
												required
											/>
										</div>

										<div className='form-group'>
											<label htmlFor='title'>Ссылка на магазин</label>
											<input
												type='url'
												placeholder='Ссылка на магазин'
												value={item.link}
												onChange={e =>
													handleItemChange(index, 'link', e.target.value)
												}
												required
											/>
										</div>
										<div className='form-group'></div>
									</div>
									<div className='form-column'>
										<div className='form-group'>
											<label htmlFor='title'>Описание товара</label>
											<textarea
												id='description'
												placeholder='Описание товара'
												value={item.description}
												onChange={e =>
													handleItemChange(index, 'description', e.target.value)
												}
												required
											/>
										</div>
									</div>
								</div>
								<div className='item-image-wrapper'>
									{item.image ? (
										<img
											src={URL.createObjectURL(item.image)}
											alt={`Товар ${index + 1}`}
											className='item-image-preview'
										/>
									) : (
										<div className='item-image-placeholder'>Изображение</div>
									)}
									<input
										type='file'
										accept='image/*'
										className='file-input'
										onChange={e =>
											handleItemChange(
												index,
												'image',
												e.target.files?.[0] || null
											)
										}
									/>
								</div>
								<button
									type='button'
									onClick={() => handleRemoveItem(index)}
									className='remove-btn'
								>
									Удалить
								</button>
							</div>
						))}

						<button type='button' onClick={handleAddItem} className='add-btn'>
							+ Добавить товар
						</button>

						<button type='submit' className='primary-btn'>
							Создать
						</button>
					</form>
					<button
						type='button'
						onClick={() => navigate('/wishlists')}
						className='secondary-btn'
					>
						Назад
					</button>
				</div>
			</div>
		</>
	);
};

export default WishlistCreate;
