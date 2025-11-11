import { Product, User, Bid } from '../types';

export const getHighestBid = (product: Product): Bid | null => {
    if (!product.bids || product.bids.length === 0) return null;
    return product.bids.reduce((prev, current) => (prev.amount > current.amount) ? prev : current);
};

export const getHighestBidder = (product: Product): User | null => {
    return getHighestBid(product)?.bidder ?? null;
};

export const getCurrentBidAmount = (product: Product): number => {
    return getHighestBid(product)?.amount ?? product.startingPrice;
};
