
import React from 'react';
import { Product, User } from '../../types';
import { ProductCard } from '../auctions/ProductCard';

interface MyBidsProps {
  products: Product[];
  currentUser: User;
  onSelectProduct: (product: Product) => void;
  favoriteProductIds: number[];
  onToggleFavorite: (productId: number) => void;
}

const getHighestBidder = (product: Product): User | null => {
    if (product.bids.length === 0) return null;
    return product.bids.reduce((prev, current) => (prev.amount > current.amount) ? prev : current).bidder;
};

export const MyBids: React.FC<MyBidsProps> = ({ products, currentUser, onSelectProduct, favoriteProductIds, onToggleFavorite }) => {
  
  const now = new Date();
  const userBids = products.filter(p => p.bids.some(b => b.bidder.id === currentUser.id));

  const activeBids = userBids.filter(p => p.endDate > now);
  const endedBids = userBids.filter(p => p.endDate <= now);

  const wonBids = endedBids.filter(p => getHighestBidder(p)?.id === currentUser.id);
  const lostBids = endedBids.filter(p => getHighestBidder(p)?.id !== currentUser.id);

  const BidSection: React.FC<{title: string, items: Product[]}> = ({title, items}) => (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-on-surface mb-6">{title}</h2>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(product => (
            <ProductCard 
              key={product.id} 
              product={product}
              onSelectProduct={onSelectProduct}
              isFavorited={favoriteProductIds.includes(product.id)}
              onToggleFavorite={onToggleFavorite}
              isWinner={wonBids.some(p => p.id === product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-surface rounded-lg shadow-sm">
          <p className="text-subtle">No items in this category.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <BidSection title="Active Bids" items={activeBids} />
      <BidSection title="Won Auctions" items={wonBids} />
      <BidSection title="Lost Auctions" items={lostBids} />
    </div>
  );
};
