
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
  },
  {
    id: 5,
    name: 'Designer Sunglasses',
    description: 'Stylish designer sunglasses with UV protection. Perfect for a sunny day out. Comes with a protective case.',
    imageUrl: 'https://picsum.photos/seed/sunglasses/800/600',
    startingPrice: 150,
    bids: [
        { id: 4, amount: 155, timestamp: new Date(now.getTime() - 1000 * 60 * 10), bidder: USERS[2] },
    ],
    endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 1), // 1 day from now
    seller: USERS[1],
  },
  {
    id: 6,
    name: 'Professional DSLR Camera',
    description: 'A high-end DSLR camera with multiple lenses. Captures stunning photos and 4K video. Ideal for professionals and enthusiasts.',
    imageUrl: 'https://picsum.photos/seed/camera/800/600',
    startingPrice: 800,
    bids: [],
    endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    seller: USERS[2],
  },
  {
    id: 7,
    name: 'Acoustic Guitar',
    description: 'A beautiful acoustic guitar with a rich, warm tone. Perfect for beginners and experienced players alike. Includes a soft case.',
    imageUrl: 'https://picsum.photos/seed/guitar/800/600',
    startingPrice: 200,
    bids: [
        { id: 5, amount: 210, timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2), bidder: USERS[0] },
    ],
    endDate: new Date(now.getTime() + 1000 * 60 * 60 * 12), // 12 hours from now
    seller: USERS[0],
  },
  {
    id: 8,
    name: 'Gourmet Coffee Machine',
    description: 'A premium coffee machine that makes espresso, cappuccino, and lattes. Bring the cafe experience to your home.',
    imageUrl: 'https://picsum.photos/seed/coffee/800/600',
    startingPrice: 300,
    bids: [],
    endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
    seller: USERS[1],
  },
  {
    id: 9,
    name: 'Smartwatch Fitness Tracker',
    description: 'A sleek smartwatch that tracks your fitness, heart rate, and sleep. Syncs with your smartphone for notifications.',
    imageUrl: 'https://picsum.photos/seed/watch/800/600',
    startingPrice: 90,
    bids: [
        { id: 6, amount: 95, timestamp: new Date(now.getTime() - 1000 * 60 * 5), bidder: USERS[2] },
        { id: 7, amount: 100, timestamp: new Date(now.getTime() - 1000 * 60 * 2), bidder: USERS[0] },
    ],
    endDate: new Date(now.getTime() + 1000 * 60 * 45), // 45 minutes from now
    seller: USERS[2],
  },
  {
    id: 10,
    name: 'Vintage Books Collection',
    description: 'A collection of ten classic novels in hardcover. Beautiful editions for any book lover\'s shelf.',
    imageUrl: 'https://picsum.photos/seed/books/800/600',
    startingPrice: 60,
    bids: [],
    endDate: new Date(now.getTime() + 1000 * 60 * 60 * 8), // 8 hours from now
    seller: USERS[0],
  },
  {
    id: 11,
    name: 'Mountain Bike',
    description: 'A rugged mountain bike with full suspension and disc brakes. Ready for any trail adventure.',
    imageUrl: 'https://picsum.photos/seed/bike/800/600',
    startingPrice: 450,
    bids: [
        { id: 8, amount: 460, timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24), bidder: USERS[1] },
    ],
    endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 4), // 4 days from now
    seller: USERS[1],
  },
  {
    id: 12,
    name: 'Portable Bluetooth Speaker',
    description: 'A compact and powerful Bluetooth speaker with long battery life. Waterproof design, great for outdoor use.',
    imageUrl: 'https://picsum.photos/seed/speaker/800/600',
    startingPrice: 40,
    bids: [],
    endDate: new Date(now.getTime() + 1000 * 60 * 60 * 3), // 3 hours from now
    seller: USERS[2],
  }
];
