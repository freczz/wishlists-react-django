import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WishlistPage from './pages/WishlistsListPage/WishlistPage';
import WishlistCreate from './pages/WishlistCreatePage/WishlistCreate';
import Auth from './pages/AuthPage/Auth';
import WishlistDetailsPage from './pages/WishlistDetailsPage/WishlistDetailsPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path='/login' element={<Auth />} />
				<Route
					path='/wishlists'
					element={
						<ProtectedRoute>
							<WishlistPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/wishlists/:id'
					element={
						<ProtectedRoute>
							<WishlistDetailsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/wishlist-create'
					element={
						<ProtectedRoute>
							<WishlistCreate />
						</ProtectedRoute>
					}
				/>
				<Route path='/' element={<Auth />} />
			</Routes>
		</Router>
	);
};

export default App;
