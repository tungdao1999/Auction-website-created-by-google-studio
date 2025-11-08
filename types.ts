// FIX: Removed self-import of User which was causing a conflict.

export interface User {
  id: number;
  name: string;
}

export interface Bid {
  id: number;
  amount: number;
  timestamp: Date;
  bidder: User;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  startingPrice: number;
  bids: Bid[];
  endDate: Date;
  seller: User;
}

export interface Message {
  id: number;
  text: string;
  sender: User;
  timestamp: Date;
}

export interface Conversation {
  id: string; // Composite key like `${productId}-${buyerId}`
  product: Product;
  buyer: User;
  seller: User;
  messages: Message[];
  isBotEnabled: boolean;
}