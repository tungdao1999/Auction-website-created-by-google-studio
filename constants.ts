
import { User, Product } from './types';

export const USERS: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
];

const now = new Date();

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Vintage Leather Jacket',
    description: 'A classic vintage leather jacket from the 1980s. In excellent condition with a unique patina. A timeless piece for any wardrobe.',
    imageUrl: 'https://picsum.photos/seed/jacket/800/600',
    startingPrice: 75,
    bids: [
      { id: 1, amount: 80, timestamp: new Date(now.getTime() - 1000 * 60 * 50), bidder: USERS[1] },
      { id: 2, amount: 85, timestamp: new Date(now.getTime() - 1000 * 60 * 30), bidder: USERS[2] },
    ],
    endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
    seller: USERS[0],
  },
  {
    id: 2,
    name: 'Antique World Map',
    description: 'A beautifully preserved world map from the early 20th century. Features detailed cartography and rich colors. Perfect for collectors.',
    imageUrl: 'https://picsum.photos/seed/map/800/600',
    startingPrice: 120,
    bids: [],
    endDate: new Date(now.getTime() + 1000 * 60 * 60 * 5), // 5 hours from now
    seller: USERS[1],
  },
  {
    id: 3,
    name: 'Modern Ergonomic Chair',
    description: 'State-of-the-art ergonomic office chair. Provides excellent lumbar support and is fully adjustable. Barely used.',
    imageUrl: 'https://picsum.photos/seed/chair/800/600',
    startingPrice: 250,
    bids: [
      { id: 3, amount: 260, timestamp: new Date(now.getTime() - 1000 * 60 * 120), bidder: USERS[0] },
    ],
    endDate: new Date(now.getTime() + 1000 * 60 * 30), // 30 minutes from now
    seller: USERS[2],
  },
  {
    id: 4,
    name: 'Retro Gaming Console',
    description: 'A complete retro gaming console set with two controllers and classic games. A nostalgia trip waiting to happen.',
    imageUrl: 'https://picsum.photos/seed/console/800/600',
    startingPrice: 100,
    bids: [],
    endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
    seller: USERS[0],
  }
];
