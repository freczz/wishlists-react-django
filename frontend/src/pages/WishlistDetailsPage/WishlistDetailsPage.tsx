import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './WishlistDetailsPage.css';
import wishlistService from '../../api/wishlists/WishlistService';
import { Wishlist } from '../../interfaces';
import Header from '../../components/Header/Header';

export default function WishlistDetailsPage() {
	const { id } = useParams();
	const [wishlist, setWishlist] = useState<Wishlist | null>(null);
	const [commentText, setCommentText] = useState('');
	const token = localStorage.getItem('token');

	useEffect(() => {
		const fetchWishlist = async () => {
			if (!id) return;
			try {
				const res = await wishlistService.getWishlist(id);
				console.log('res', res);

				setWishlist(res);
			} catch (error) {
				console.error('Ошибка загрузки вишлиста', error);
			}
		};
		fetchWishlist();
	}, [id, token]);

	const handleAddFavorite = () => {
		// TODO: реализовать добавление в избранное
		alert('Добавлено в избранное!');
	};

	// const handleAddComment = async () => {
	// 	if (!commentText.trim()) return;

	// 	try {
	// 		await axios.post(
	// 			`http://localhost:8000/wishlists/${id}/comments/`,
	// 			{ text: commentText },
	// 			{ headers: { Authorization: `Bearer ${token}` } }
	// 		);
	// 		setCommentText('');
	// 		// Перезагрузим комментарии
	// 		const res = await axios.get<Wishlist>(
	// 			`http://localhost:8000/api/wishlists/${id}/`,
	// 			{
	// 				headers: { Authorization: `Bearer ${token}` },
	// 			}
	// 		);
	// 		setWishlist(res.data);
	// 	} catch (error) {
	// 		console.error('Ошибка при добавлении комментария', error);
	// 	}
	// };

	if (!wishlist) return <p>Загрузка...</p>;

	return (
		<>
			<Header />
			<div className='wishlist-detail'>
				<div className='mainDetailBlock'>
					<div className='left'>
						<h2>{wishlist.title}</h2>
						<img
							src={wishlist.image}
							alt={wishlist.title}
							className='wishlist-main-image'
						/>
					</div>
					<div className='right'>
						<p>{wishlist.description}</p>

						<button onClick={handleAddFavorite} className='favorite-button'>
							Добавить в избранное
						</button>
					</div>
				</div>

				<h3>Товары:</h3>
				<div className='product-list'>
					{wishlist.items &&
						(wishlist.items as any).map((item: any) => (
							<div key={item.link} className='product-card'>
								<img
									src={`http://localhost:8000${item.image}`}
									alt={item.name}
								/>
								<h4>{item.name}</h4>
								<p>{item.description}</p>
								<a href={item.link} target='_blank' rel='noopener noreferrer'>
									Перейти в магазин
								</a>
							</div>
						))}
				</div>

				<h3>Комментарии:</h3>
				<ul className='comment-list'>
					{wishlist.comments.map(comment => (
						<li key={comment.date}>
							<strong>{comment.author}</strong> (
							{new Date(comment.date).toLocaleString()}): {comment.text}
						</li>
					))}
				</ul>

				<div className='add-comment-form'>
					<textarea
						value={commentText}
						onChange={e => setCommentText(e.target.value)}
						placeholder='Напишите комментарий...'
					/>
					<button
					// onClick={handleAddComment}
					>
						Добавить комментарий
					</button>
				</div>
			</div>
		</>
	);
}
