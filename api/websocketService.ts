import { MOCK_PRODUCTS } from '../constants';
import { Product, Bid, User, Conversation, Message } from '../types';
import { generateBotResponse } from './geminiService';
import { getCurrentBidAmount } from '../utils/auctionUtils';

// Simulate a 'server' that holds the true state.
let products: Product[] = MOCK_PRODUCTS;
let conversations: Conversation[] = [];
let productListeners: ((product: Product) => void)[] = [];
const chatListeners = new Map<string, ((conversation: Conversation) => void)[]>();


/**
 * Notifies all subscribed listeners about a product update.
 */
const broadcastProductUpdate = (updatedProduct: Product) => {
  productListeners.forEach(listener => listener(updatedProduct));
};

const broadcastConversationUpdate = (updatedConversation: Conversation) => {
    const listeners = chatListeners.get(updatedConversation.id) || [];
    listeners.forEach(listener => listener(updatedConversation));
};


/**
 * Public API for the WebSocket service simulation.
 */
export const websocketService = {
  // --- Product Methods ---
  subscribeToProducts: (callback: (product: Product) => void) => {
    productListeners.push(callback);
    console.log('A new client subscribed to products. Total:', productListeners.length);
  },
  unsubscribeFromProducts: (callback: (product: Product) => void) => {
    productListeners = productListeners.filter(l => l !== callback);
    console.log('A client unsubscribed from products. Total:', productListeners.length);
  },
  placeBid: (productId: number, amount: number, user: User): Promise<Product> => {
    return new Promise((resolve, reject) => {
      const productIndex = products.findIndex(p => p.id === productId);
      if (productIndex === -1) {
        return reject(new Error("Product not found."));
      }
      const product = products[productIndex];
      if (product.seller.id === user.id) {
        return reject(new Error("You cannot bid on your own item."));
      }
      const currentBid = getCurrentBidAmount(product);
      if (amount <= currentBid) {
        return reject(new Error("Your bid must be higher than the current bid."));
      }
      const newBid: Bid = { id: Date.now(), amount, timestamp: new Date(), bidder: user };
      const updatedProduct: Product = { ...product, bids: [...product.bids, newBid] };
      products[productIndex] = updatedProduct;
      broadcastProductUpdate(updatedProduct);
      resolve(JSON.parse(JSON.stringify(updatedProduct)));
    });
  },
  addProduct: (item: Omit<Product, 'id' | 'bids'>): Promise<Product> => {
    return new Promise(resolve => {
        const newProduct: Product = { ...item, id: Date.now(), bids: [] };
        products = [newProduct, ...products];
        broadcastProductUpdate(newProduct);
        resolve(JSON.parse(JSON.stringify(newProduct)));
    });
  },
  getInitialProducts: (): Product[] => {
    return JSON.parse(JSON.stringify(products));
  },

  // --- Chat Methods ---
  subscribeToConversation: (conversationId: string, callback: (conversation: Conversation) => void) => {
    if (!chatListeners.has(conversationId)) {
      chatListeners.set(conversationId, []);
    }
    chatListeners.get(conversationId)!.push(callback);
    console.log(`Client subscribed to conversation ${conversationId}.`);
  },
  unsubscribeFromConversation: (conversationId: string, callback: (conversation: Conversation) => void) => {
    if (chatListeners.has(conversationId)) {
      const updatedListeners = chatListeners.get(conversationId)!.filter(l => l !== callback);
      chatListeners.set(conversationId, updatedListeners);
      console.log(`Client unsubscribed from conversation ${conversationId}.`);
    }
  },
  getOrCreateConversation: (productId: number, buyer: User): Promise<Conversation> => {
    return new Promise((resolve, reject) => {
        const product = products.find(p => p.id === productId);
        if (!product) return reject(new Error("Product not found"));
        if (product.seller.id === buyer.id) return reject(new Error("Cannot start a chat with yourself."));

        const conversationId = `${productId}-${buyer.id}`;
        let conversation = conversations.find(c => c.id === conversationId);

        if (!conversation) {
            conversation = {
                id: conversationId,
                product,
                buyer,
                seller: product.seller,
                messages: [],
                isBotEnabled: false, // Bot is disabled by default
            };
            conversations.push(conversation);
        }
        resolve(JSON.parse(JSON.stringify(conversation)));
    });
  },
  sendMessage: (conversationId: string, text: string, sender: User): Promise<void> => {
    return new Promise((resolve, reject) => {
        const conversationIndex = conversations.findIndex(c => c.id === conversationId);
        if (conversationIndex === -1) return reject(new Error("Conversation not found"));

        const conversation = conversations[conversationIndex];
        const newMessage: Message = { id: Date.now(), text, sender, timestamp: new Date() };
        let updatedConversation = { ...conversation, messages: [...conversation.messages, newMessage] };
        conversations[conversationIndex] = updatedConversation;
        
        broadcastConversationUpdate(updatedConversation);
        
        // --- Bot Logic ---
        if (updatedConversation.isBotEnabled && sender.id !== updatedConversation.seller.id) {
            // If bot is on and the sender is the buyer, generate a response
            setTimeout(async () => {
                const sellerId = updatedConversation.seller.id;
                const allSellerProducts = products.filter(p => p.seller.id === sellerId);

                const botResponseText = await generateBotResponse(
                    updatedConversation.product,
                    allSellerProducts,
                    text
                );
                
                const botMessage: Message = {
                    id: Date.now(),
                    text: botResponseText,
                    sender: updatedConversation.seller, // Bot sends as the seller
                    timestamp: new Date(),
                };
                // Get the latest version of the conversation again in case other messages arrived
                const currentConversationState = conversations[conversationIndex];
                const finalConversationState = { ...currentConversationState, messages: [...currentConversationState.messages, botMessage] };
                conversations[conversationIndex] = finalConversationState;
                broadcastConversationUpdate(finalConversationState);
            }, 1500); // Simulate bot "thinking"
        }
        // --- End Bot Logic ---
        
        resolve();
    });
  },
  getConversationsForUser: (userId: number): Promise<Conversation[]> => {
    return new Promise(resolve => {
        const userConversations = conversations.filter(c => c.buyer.id === userId || c.seller.id === userId);
        resolve(JSON.parse(JSON.stringify(userConversations)));
    });
  },
  toggleChatBot: (conversationId: string, isEnabled: boolean): Promise<Conversation> => {
    return new Promise((resolve, reject) => {
        const conversationIndex = conversations.findIndex(c => c.id === conversationId);
        if (conversationIndex === -1) return reject(new Error("Conversation not found"));

        const updatedConversation = { ...conversations[conversationIndex], isBotEnabled: isEnabled };
        conversations[conversationIndex] = updatedConversation;

        broadcastConversationUpdate(updatedConversation);
        resolve(JSON.parse(JSON.stringify(updatedConversation)));
    });
  }
};
