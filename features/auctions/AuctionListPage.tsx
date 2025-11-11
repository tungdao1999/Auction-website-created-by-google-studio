
import React, { useState, useMemo, useEffect } from 'react';
import { Product, User } from '../../types';
import { ListingControls } from './ListingControls';
import { ProductCard } from './ProductCard';
import { Pagination } from './Pagination';
import { getCurrentBidAmount, getHighestBidder } from '../../utils/auctionUtils';

type SortOption = 'newly-listed' | 'ending-soon' | 'price-low-high' | 'price-high-low';
const ITEMS_PER_PAGE = 8;

interface AuctionListPageProps {
    products: Product[];
    onSelectProduct: (product: Product) => void;
    favoriteProductIds: number[];
    onToggleFavorite: (productId: number) => void;
    currentUser: User;
}

export const AuctionListPage: React.FC<AuctionListPageProps> = ({ products, onSelectProduct, favoriteProductIds, onToggleFavorite, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newly-listed');
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOption]);

  const processedProducts = useMemo(() => {
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
        switch (sortOption) {
            case 'ending-soon':
                return a.endDate.getTime() - b.endDate.getTime();
            case 'price-low-high':
                return getCurrentBidAmount(a) - getCurrentBidAmount(b);
            case 'price-high-low':
                return getCurrentBidAmount(b) - getCurrentBidAmount(a);
            case 'newly-listed':
            default:
                return b.id - a.id;
        }
    });
  }, [products, searchTerm, sortOption]);

  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-on-surface mb-6">Active Listings</h2>
      <ListingControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortOption={sortOption}
          onSortChange={(option) => setSortOption(option as SortOption)}
      />
      {paginatedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map(product => {
              const winner = getHighestBidder(product);
              const isWinner = new Date() > product.endDate && winner?.id === currentUser.id;
              return (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onSelectProduct={onSelectProduct}
                  isFavorited={favoriteProductIds.includes(product.id)}
                  onToggleFavorite={onToggleFavorite}
                  isWinner={isWinner}
                />
              );
            })}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className="text-center py-16 bg-surface rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-on-surface">No items match your search.</h3>
          <p className="text-subtle mt-2">Try adjusting your filters or check back later!</p>
        </div>
      )}
    </div>
  );
};
