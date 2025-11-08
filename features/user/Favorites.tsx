
import React from 'react';
import { Product } from '../../types';
import { ProductCard } from '../auctions/ProductCard';

interface FavoritesProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  favoriteProductIds: number[];
  onToggleFavorite: (productId: number) => void;
}

export const Favorites: React.FC<FavoritesProps> = ({ products, onSelectProduct, favoriteProductIds, onToggleFavorite }) => {
  const favoriteProducts = products.filter(p => favoriteProductIds.includes(p.id));

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-on-surface mb-6">Your Favorites</h2>
      {favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product}
              onSelectProduct={onSelectProduct}
              isFavorited={true}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-on-surface">You haven't favorited any items yet.</h3>
          <p className="text-subtle mt-2">Click the heart icon on any item to add it to your list.</p>
        </div>
      )}
    </div>
  );
};
