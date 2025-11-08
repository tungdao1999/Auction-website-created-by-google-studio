
import React from 'react';
import { Product } from '../../types';
import { useTimer } from './useTimer';
import { HeartIcon, TrophyIcon } from '../../components/icons';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  isFavorited: boolean;
  onToggleFavorite: (productId: number) => void;
  isWinner?: boolean;
}

const getCurrentBid = (product: Product) => {
  if (product.bids.length === 0) {
    return product.startingPrice;
  }
  return Math.max(...product.bids.map(b => b.amount));
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct, isFavorited, onToggleFavorite, isWinner }) => {
  const { days, hours, minutes, isOver } = useTimer(product.endDate);
  const currentBid = getCurrentBid(product);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when favoriting
    onToggleFavorite(product.id);
  };

  const getTimeLeftText = () => {
    if (isOver) return <span className="text-red-500 font-semibold">Ended</span>;
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return <span className="text-orange-500 font-semibold">{`${minutes}m left`}</span>;
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="bg-surface rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden flex flex-col animate-fade-in group"
    >
      <div className="relative">
        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs font-bold py-1 px-2 rounded-full">
          {getTimeLeftText()}
        </div>
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-2 left-2 p-2 bg-black/50 rounded-full text-white hover:text-red-500 transition-colors"
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <HeartIcon className="w-5 h-5" isFilled={isFavorited} />
        </button>
        {isWinner && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-600/80 to-transparent p-4 flex items-center justify-center gap-2">
                <TrophyIcon className="w-6 h-6 text-yellow-300"/>
                <span className="text-white font-bold text-lg">You Won!</span>
            </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-on-surface truncate">{product.name}</h3>
        <p className="text-sm text-subtle mt-1 mb-4 flex-grow">{product.description.substring(0, 60)}...</p>
        <div className="flex justify-between items-center mt-auto">
          <div>
            <p className="text-xs text-subtle">
              {isOver ? (isWinner ? 'Winning Bid' : 'Final Bid') : 'Current Bid'}
            </p>
            <p className="text-xl font-bold text-primary">${currentBid.toFixed(2)}</p>
          </div>
          <button className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-md transition-colors">
            {isOver ? 'View' : 'Bid Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
