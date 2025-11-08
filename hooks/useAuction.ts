import { useState, useEffect } from 'react';
import { Product } from '../types';
import * as backendService from '../services/backendService';
import { websocketService } from '../services/websocketService';

// Helper to ensure date fields are Date objects after JSON serialization/deserialization
const reviveProductDates = (product: any): Product => ({
  ...product,
  endDate: new Date(product.endDate),
  bids: product.bids.map((bid: any) => ({
    ...bid,
    timestamp: new Date(bid.timestamp),
  })),
});


export const useAuction = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

    websocketService.subscribe(handleProductUpdate);

    // 3. Clean up subscription on unmount
    return () => {
      websocketService.unsubscribe(handleProductUpdate);
    };
  }, []);

  return { products, isLoading };
};