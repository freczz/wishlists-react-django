import { useAtom } from 'jotai';
import { searchQueryAtom } from '../../state/searchFilter';
import Header from '../../components/Header/Header';
import WishlistCard from '../../components/WishlistCard/WishlistCard';
import { Wishlist } from '../../interfaces';
import './WishlistPage.css';
import { useEffect, useState } from 'react';
import WishlistService from '../../api/wishlists/WishlistService';

const wishlistsMock: Wishlist[] = [
	{
		id: '1',
		title: 'Бровь соответствие.',
		description: 'Означать наступать порт головной лиловый.',
		image:
			'https://i.pinimg.com/736x/be/45/4c/be454ccfb161a45a312376465ac1be3a.jpg',
		access_level: 'private',
		comments: [
			{
				author: 'Маша',
				text: 'Крутые штуки!',
				date: '2025-04-13T12:00:00Z',
			},
			{
				author: 'Клим',
				text: 'Добавь арбуз!',
				date: '2025-04-13T12:30:00Z',
			},
		],
		items: [
			{
				name: 'Наступать',
				description: 'Означать наступать порт головной лиловый.',
				link: 'https://zao.biz/',
				image:
					'https://i.pinimg.com/736x/93/6f/ce/936fce20b53d243097dcbbcde51596d1.jpg',
			},
		],
	},
	{
		id: '2',
		title: 'Бровь соответствие.',
		description: 'Означать наступать порт головной лиловый.',
		image:
			'https://i.pinimg.com/736x/be/45/4c/be454ccfb161a45a312376465ac1be3a.jpg',
		access_level: 'private',
		comments: [],
		items: [
			{
				name: 'Наступать',
				description: 'Означать наступать порт головной лиловый.',
				link: 'https://zao.biz/',
				image:
					'https://i.pinimg.com/736x/93/6f/ce/936fce20b53d243097dcbbcde51596d1.jpg',
			},
		],
	},
	{
		id: '3',
		title: 'Бровь соответствие.',
		description: 'Означать наступать порт головной лиловый.',
		image:
			'https://i.pinimg.com/736x/be/45/4c/be454ccfb161a45a312376465ac1be3a.jpg',
		access_level: 'private',
		comments: [],
		items: [
			{
				name: 'Наступать',
				description: 'Означать наступать порт головной лиловый.',
				link: 'https://zao.biz/',
				image:
					'https://i.pinimg.com/736x/93/6f/ce/936fce20b53d243097dcbbcde51596d1.jpg',
			},
		],
	},
	{
		id: '4',
		title: 'Бровь соответствие.',
		description: 'Означать наступать порт головной лиловый.',
		image:
			'https://i.pinimg.com/736x/be/45/4c/be454ccfb161a45a312376465ac1be3a.jpg',
		access_level: 'private',
		comments: [],
		items: [
			{
				name: 'Наступать',
				description: 'Означать наступать порт головной лиловый.',
				link: 'https://zao.biz/',
				image:
					'https://i.pinimg.com/736x/93/6f/ce/936fce20b53d243097dcbbcde51596d1.jpg',
			},
		],
	},
	{
		id: '5',
		title: 'Бровь соответствие.',
		description: 'Означать наступать порт головной лиловый.',
		image:
			'https://i.pinimg.com/736x/be/45/4c/be454ccfb161a45a312376465ac1be3a.jpg',
		access_level: 'private',
		comments: [],
		items: [
			{
				name: 'Наступать',
				description: 'Означать наступать порт головной лиловый.',
				link: 'https://zao.biz/',
				image:
					'https://i.pinimg.com/736x/93/6f/ce/936fce20b53d243097dcbbcde51596d1.jpg',
			},
		],
	},
];

export default function WishlistPage() {
	const [wishlists, setWishlists] = useState<Wishlist[]>([]);
	const [searchQuery] = useAtom(searchQueryAtom);

	useEffect(() => {
		const a = async () => {
			const originWishlists = await WishlistService.getAllWishlists();
			setWishlists(originWishlists);
		};
		a();
	}, []);

	const filteredWishlists = wishlists.filter(w =>
		w.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<>
			<Header />
			<div className='wishlist-page'>
				<h1 className='wishlist-title'>Мои вишлисты</h1>
				<div className='wishlist-grid'>
					{filteredWishlists.map(wishlist => (
						<WishlistCard key={wishlist.id} wishlist={wishlist} />
					))}
				</div>
			</div>
		</>
	);
}
