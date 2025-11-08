import React from 'react';
import { Product, User } from '../../types';
import { ProductCard } from '../auctions/ProductCard';

interface MyListingsPageProps {
  products: Product[];
  currentUser: User;
  onSelectProduct: (product: Product) => void;
  favoriteProductIds: number[];
  onToggleFavorite: (productId: number) => void;
}

export const MyListingsPage: React.FC<MyListingsPageProps> = ({ products, currentUser, onSelectProduct, favoriteProductIds, onToggleFavorite }) => {
  const myListings = products.filter(p => p.seller.id === currentUser.id);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-on-surface mb-6">My Listed Items</h2>
      {myListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myListings.map(product => (
            <ProductCard 
              key={product.id} 
              product={product}
              onSelectProduct={onSelectProduct}
              isFavorited={favoriteProductIds.includes(product.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-on-surface">You haven't listed any items for auction.</h3>
          <p className="text-subtle mt-2">Click "List Item" in the header to get started.</p>
        </div>
      )}
    </div>
  );
};
