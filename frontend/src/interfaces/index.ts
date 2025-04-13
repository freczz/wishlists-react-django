export interface Wishlist {
	id: string;
	title: string;
	description: string;
	image: any;
	comments: IWishlistComment[];
	items: WishlistItem[];
	access_level: AccessLevel;
}

export type AccessLevel = 'public' | 'private' | 'link';

export interface IWishlistComment {
	author: string;
	text: string;
	date: string;
}

export interface WishlistItem {
	name: string;
	description: string;
	link: string;
	image: any;
}
