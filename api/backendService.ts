import { Product, User, Conversation } from '../types';
import { websocketService } from './websocketService';

/**
 * Simulates network latency for initial data fetch.
 * @param data The data to be returned after the delay.
 * @returns A promise that resolves with the data after a short delay.
 */
const simulateDelay = <T>(data: T): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, 300); 
  });
};

/**
 * Fetches the initial list of products.
 * In a real app, this would be an HTTP request. Now it gets from the websocket service.
 * @returns A promise that resolves to an array of all products.
 */
export const getProducts = (): Promise<Product[]> => {
  const initialProducts = websocketService.getInitialProducts();
  const sortedProducts = [...initialProducts].sort((a, b) => b.id - a.id);
  return simulateDelay(sortedProducts);
};

/**
 * Places a new bid on a product via the WebSocket service.
 * @param productId The ID of the product being bid on.
 * @param amount The amount of the new bid.
 * @param user The user placing the bid.
 * @returns A promise that resolves with the updated product, or rejects with an error.
 */
export const placeBid = (productId: number, amount: number, user: User): Promise<Product> => {
  return websocketService.placeBid(productId, amount, user);
};

/**
 * Adds a new product via the WebSocket service.
 * @param item The new product data (without id or bids).
 * @returns A promise that resolves with the fully created product.
 */
export const addProduct = (item: Omit<Product, 'id' | 'bids'>): Promise<Product> => {
  return websocketService.addProduct(item);
};

// --- Chat Service Functions ---

export const getConversationsForUser = (userId: number): Promise<Conversation[]> => {
    return websocketService.getConversationsForUser(userId);
}

export const getOrCreateConversation = (productId: number, buyer: User): Promise<Conversation> => {
    return websocketService.getOrCreateConversation(productId, buyer);
}

export const sendMessage = (conversationId: string, text: string, sender: User): Promise<void> => {
    return websocketService.sendMessage(conversationId, text, sender);
}

export const toggleChatBot = (conversationId: string, isEnabled: boolean): Promise<Conversation> => {
    return websocketService.toggleChatBot(conversationId, isEnabled);
}