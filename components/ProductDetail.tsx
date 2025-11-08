import React, { useState } from 'react';
import { Product, User } from '../types';
import { Timer } from './Timer';
import { ArrowLeftIcon, HeartIcon, MessageSquareIcon } from './icons';
import { Modal } from './Modal';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onPlaceBid: (productId: number, amount: number) => void;
  currentUser: User;
  isFavorited: boolean;
  onToggleFavorite: (productId: number) => void;
}

const getCurrentBid = (product: Product) => {
    if (product.bids.length === 0) {
      return { amount: product.startingPrice, bidder: null };
    }
    const highestBid = product.bids.reduce((prev, current) => (prev.amount > current.amount) ? prev : current);
    return { amount: highestBid.amount, bidder: highestBid.bidder };
};

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onPlaceBid, currentUser, isFavorited, onToggleFavorite }) => {
  const { amount: currentBid, bidder: highestBidder } = getCurrentBid(product);
  const [bidAmount, setBidAmount] = useState(currentBid + 1);
  const [error, setError] = useState('');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBidAmount(Number(value));
    if (Number(value) <= currentBid) {
      setError(`Bid must be higher than $${currentBid.toFixed(2)}`);
    } else {
      setError('');
    }
  };

  const handlePlaceBid = () => {
    if (bidAmount > currentBid) {
      onPlaceBid(product.id, bidAmount);
      setBidAmount(bidAmount + 1);
      setError('');
    } else {
        setError(`Bid must be higher than $${currentBid.toFixed(2)}`);
    }
  };
  
  const isAuctionOver = new Date() > product.endDate;

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        <button onClick={onBack} className="flex items-center gap-2 text-primary font-semibold mb-6 hover:underline">
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Listings
        </button>
        <div className="bg-surface rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <img src={product.imageUrl} alt={product.name} className="w-full h-64 md:h-full object-cover"/>
            <div className="p-6 md:p-8 flex flex-col">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-on-surface">{product.name}</h1>
                <button
                    onClick={() => onToggleFavorite(product.id)}
                    className={`p-2 rounded-full transition-colors ${isFavorited ? 'text-red-500 bg-red-100' : 'text-subtle bg-gray-100 hover:bg-red-100 hover:text-red-500'}`}
                    aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <HeartIcon className="w-6 h-6" isFilled={isFavorited} />
                </button>
              </div>

              <p className="text-sm text-subtle mt-1">
                Listed by {product.seller.name}
              </p>
              <p className="text-base text-on-surface my-4 flex-grow">{product.description}</p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-subtle">Current Bid</p>
                    <p className="text-4xl font-bold text-primary">${currentBid.toFixed(2)}</p>
                  </div>
                  {highestBidder && <p className="text-sm text-right">by <span className="font-semibold">{highestBidder.name}</span></p>}
                </div>
                <Timer endDate={product.endDate} />
              </div>

              {!isAuctionOver ? (
                <div className="mt-auto">
                  <div className="flex items-stretch">
                    <span className="flex items-center bg-gray-200 px-4 text-xl font-semibold rounded-l-md">$</span>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={handleBidChange}
                      min={currentBid + 1}
                      className="w-full p-3 border-2 border-gray-200 focus:ring-primary focus:border-primary text-xl font-bold"
                      disabled={isAuctionOver}
                    />
                    <button 
                      onClick={handlePlaceBid}
                      disabled={!!error || isAuctionOver}
                      className="px-6 py-3 bg-primary text-white font-bold text-lg rounded-r-md hover:bg-primary-hover disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                      Place Bid
                    </button>
                  </div>
                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                  <p className="text-xs text-subtle text-center mt-2">You are bidding as {currentUser.name}</p>
                </div>
              ) : (
                <div className="text-center font-bold text-xl text-red-600 bg-red-100 py-3 px-4 rounded-lg">
                  Auction Has Ended
                </div>
              )}
              
              <button 
                onClick={() => setIsContactModalOpen(true)}
                className="w-full mt-4 flex justify-center items-center gap-2 py-2 px-4 border border-subtle text-subtle rounded-md hover:bg-gray-100 hover:text-on-surface transition-colors"
              >
                <MessageSquareIcon className="w-5 h-5"/>
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title={`Contact ${product.seller.name}`}
      >
        <p className="text-subtle mb-4">You are about to send a message regarding the item: <strong className="text-on-surface">{product.name}</strong></p>
        <textarea 
            rows={5}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="Type your message here..."
        />
        <button className="w-full mt-4 bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-hover">
            Send Message
        </button>
        <p className="text-xs text-subtle text-center mt-2">Note: This is a demo. Messages are not actually sent.</p>
      </Modal>
    </>
  );
};
