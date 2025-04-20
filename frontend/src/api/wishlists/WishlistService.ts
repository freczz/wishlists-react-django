import { Wishlist } from '../../interfaces';
import api from '../api';

class WishlistService {
	async getAllWishlists() {
		const response = await api.get('/wishlists/');
		return response.data;
	}

	async getWishlist(id: string) {
		const response = await api.get(`/wishlists/${id}/`);
		return response.data;
	}

	async createWishlist(data: any) {
		const formData = new FormData();

		formData.append('title', data.title);
		formData.append('description', data.description);
		formData.append('access_level', data.access_level);
		formData.append('image', data.image);

		const itemsClean = data.items.map((item: any, index: any) => {
			if (item.image) {
				formData.append(`item_images_${index}`, item.image);
			}
			return {
				name: item.name,
				description: item.description,
				link: item.link,
			};
		});

		formData.append('items', JSON.stringify(itemsClean));

		const response = await api.post('/wishlists/create/', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		return response.data;
	}

	async updateWishlist(id: number, data: Partial<Wishlist>) {
		const formData = new FormData();

		if (data.title) formData.append('title', data.title);
		if (data.description) formData.append('description', data.description);
		if (data.access_level) formData.append('access_level', data.access_level);
		if (data.image) formData.append('image', data.image);
		if (data.items) formData.append('items', JSON.stringify(data.items));

		const response = await api.put(`/wishlists/${id}/`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
		return response.data;
	}
}

const wishlistService = new WishlistService();

export default wishlistService;
