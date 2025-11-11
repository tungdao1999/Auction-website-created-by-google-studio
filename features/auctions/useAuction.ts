import { useState, useEffect } from 'react';
import { Product, User } from '../../types';
import * as backendService from '../../api/backendService';
import { websocketService } from '../../api/websocketService';
import { sendNotification } from '../../utils/notifications';
import { getHighestBidder } from '../../utils/auctionUtils';

// Helper to ensure date fields are Date objects after JSON serialization/deserialization
const reviveProductDates = (product: any): Product => ({
  ...product,
  endDate: new Date(product.endDate),
  bids: product.bids.map((bid: any) => ({
    ...bid,
    timestamp: new Date(bid.timestamp),
  })),
});


export const useAuction = (currentUser: User | null) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notifiedWinIds, setNotifiedWinIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    // 1. Fetch initial data
    backendService.getProducts()
      .then(initialProducts => {
        setProducts(initialProducts.map(reviveProductDates));
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch initial products:", err);
        setIsLoading(false);
      });

    // 2. Subscribe to real-time updates
    const handleProductUpdate = (updatedProduct: Product) => {
      const revivedProduct = reviveProductDates(updatedProduct);
      setProducts(prevProducts => {
        const oldProduct = prevProducts.find(p => p.id === revivedProduct.id);

        // --- Notification Logic ---
        if (oldProduct && currentUser) {
            const oldHighestBidder = getHighestBidder(oldProduct);
            const newHighestBidder = getHighestBidder(revivedProduct);

            // Notify user if they have been outbid
            if (
                oldHighestBidder?.id === currentUser.id &&
                newHighestBidder?.id !== currentUser.id
            ) {
                sendNotification('You have been outbid!', {
                    body: `Someone placed a higher bid on "${revivedProduct.name}".`,
                    icon: revivedProduct.imageUrl,
                    tag: `outbid-${revivedProduct.id}` // Tag prevents multiple notifications for same item
                });
            }
        }
        // --- End Notification Logic ---

        const productExists = prevProducts.some(p => p.id === revivedProduct.id);
        if (productExists) {
          // If product exists, update it
          return prevProducts.map(p => p.id === revivedProduct.id ? revivedProduct : p);
        } else {
          // If it's a new product, add it to the top of the list
          return [revivedProduct, ...prevProducts];
        }
      });
    };

    websocketService.subscribeToProducts(handleProductUpdate);

    // 3. Clean up subscription on unmount
    return () => {
      websocketService.unsubscribeFromProducts(handleProductUpdate);
    };
  }, [currentUser]); // Rerun effect if user changes

  // Effect for checking win conditions
  useEffect(() => {
    if (!currentUser || products.length === 0) return;

    products.forEach(product => {
        const isOver = new Date() > product.endDate;
        if (isOver && !notifiedWinIds.has(product.id)) {
            const winner = getHighestBidder(product);
            if (winner?.id === currentUser.id) {
                sendNotification('Congratulations, you won!', {
                    body: `You won the auction for "${product.name}".`,
                    icon: product.imageUrl,
                    tag: `win-${product.id}`
                });
                setNotifiedWinIds(prev => new Set(prev).add(product.id)); 
            }
        }
    });
  }, [products, currentUser, notifiedWinIds]);


  return { products, isLoading };
};
