import { MOCK_PRODUCTS } from '../constants';
import { Product, Bid, User } from '../types';

// Simulate a 'server' that holds the true state.
let products: Product[] = MOCK_PRODUCTS;
let listeners: ((product: Product) => void)[] = [];

/**
 * Gets the current highest bid for a product.
 */
const getCurrentBidAmount = (product: Product): number => {
  if (product.bids.length === 0) {
    return product.startingPrice;
  }
  return Math.max(...product.bids.map(b => b.amount));
};

/**
 * Notifies all subscribed listeners about a product update.
 */
const broadcastUpdate = (updatedProduct: Product) => {
  listeners.forEach(listener => listener(updatedProduct));
};

/**
 * Public API for the WebSocket service simulation.
 */
export const websocketService = {
  /**
   * Allows a component to subscribe to product updates.
   * @param callback The function to call when a product is updated.
   */
  subscribe: (callback: (product: Product) => void) => {
    listeners.push(callback);
    console.log('A new client subscribed. Total listeners:', listeners.length);
  },

  /**
   * Allows a component to unsubscribe from updates.
   * @param callback The function to remove from the listeners.
   */
  unsubscribe: (callback: (product: Product) => void) => {
    listeners = listeners.filter(l => l !== callback);
    console.log('A client unsubscribed. Total listeners:', listeners.length);
  },
  
  /**
   * Simulates a client placing a bid.
   * This updates the product and broadcasts the change.
   */
  placeBid: (productId: number, amount: number, user: User): Promise<Product> => {
    return new Promise((resolve, reject) => {
      const productIndex = products.findIndex(p => p.id === productId);
      if (productIndex === -1) {
        return reject(new Error("Product not found."));
      }

      const product = products[productIndex];
      const currentBid = getCurrentBidAmount(product);

      if (amount <= currentBid) {
        return reject(new Error("Your bid must be higher than the current bid."));
      }
      
      const newBid: Bid = {
        id: Date.now(),
        amount,
        timestamp: new Date(),
        bidder: user,
      };

      const updatedProduct: Product = {
        ...product,
        bids: [...product.bids, newBid],
      };

      products[productIndex] = updatedProduct;
      
      // Broadcast the update to all listeners
      broadcastUpdate(updatedProduct);

      resolve(JSON.parse(JSON.stringify(updatedProduct)));
    });
  },

  /**
   * Simulates a client adding a new product.
   * This adds the product and broadcasts it as an "update".
   */
  addProduct: (item: Omit<Product, 'id' | 'bids'>): Promise<Product> => {
    return new Promise(resolve => {
        const newProduct: Product = {
            ...item,
            id: Date.now(),
            bids: [],
        };
        products = [newProduct, ...products];

        // Broadcast the new product to all listeners
        broadcastUpdate(newProduct);

        resolve(JSON.parse(JSON.stringify(newProduct)));
    });
  },

  /**
   * Fetches the initial list of products.
   */
  getInitialProducts: (): Product[] => {
    return JSON.parse(JSON.stringify(products));
  }
};
