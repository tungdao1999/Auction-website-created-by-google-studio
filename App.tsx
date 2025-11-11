import React, { useState, useEffect } from 'react';
import { Product, User, Conversation } from './types';
import { Header } from './components/Header';
import { useAuction } from './features/auctions/useAuction';
import * as backendService from './api/backendService';
import { AuctionListPage } from './features/auctions/AuctionListPage';
import { ProductDetail } from './features/auctions/ProductDetail';
import { MyBids } from './features/user/MyBids';
import { Favorites } from './features/user/Favorites';
import { AuctionForm } from './features/seller/AuctionForm';
import { MyListingsPage } from './features/seller/MyListingsPage';
import { LoginPage } from './features/auth/LoginPage';
import { requestNotificationPermission } from './utils/notifications';
import { ChatListPage } from './features/chat/ChatListPage';
import { ChatView } from './features/chat/ChatView';

type View = 'listings' | 'productDetail' | 'addItem' | 'myBids' | 'favorites' | 'myListings' | 'chatList' | 'chatDetail';

const App: React.FC = () => {
  const [view, setView] = useState<View>('listings');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { products, isLoading } = useAuction(currentUser);
  const [favoriteProductIds, setFavoriteProductIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favoriteProductIds));
  }, [favoriteProductIds]);

  const handleToggleFavorite = (productId: number) => {
    setFavoriteProductIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };
  
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setView('productDetail');
  };

  const handleBack = () => {
    setSelectedProduct(null);
    setView('listings');
  };
  
  const handleNavigate = (newView: View) => {
    setSelectedProduct(null);
    setSelectedConversation(null);
    setView(newView);
  };

  const handlePlaceBid = async (productId: number, amount: number) => {
    if (!currentUser) return;
    try {
      await backendService.placeBid(productId, amount, currentUser);
      alert('Bid placed successfully!');
    } catch (error: any) {
      console.error("Failed to place bid:", error);
      alert(`Error: ${error.message}`);
    }
  };
  
  const handleAddItem = async (item: Omit<Product, 'id' | 'bids'>) => {
    try {
      await backendService.addProduct(item);
      alert('Item listed successfully!');
      setView('myListings');
    } catch (error) {
      console.error("Failed to add item:", error);
      alert("Failed to list item. Please try again.");
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView('listings');
    requestNotificationPermission();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('listings');
  };
  
  const handleStartChat = async (product: Product) => {
    if (!currentUser) return;
    try {
        const conversation = await backendService.getOrCreateConversation(product.id, currentUser);
        setSelectedConversation(conversation);
        setView('chatDetail');
    } catch (error: any) {
        console.error("Failed to start chat:", error);
        alert(`Error: ${error.message}`);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setView('chatDetail');
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-screen"><p className="text-xl">Loading auction items...</p></div>;
    }

    switch (view) {
      case 'productDetail':
        const currentProduct = products.find(p => p.id === selectedProduct?.id) || selectedProduct;
        return currentProduct && (
          <ProductDetail
            product={currentProduct}
            onBack={handleBack}
            onPlaceBid={handlePlaceBid}
            currentUser={currentUser}
            isFavorited={favoriteProductIds.includes(currentProduct.id)}
            onToggleFavorite={handleToggleFavorite}
            onStartChat={handleStartChat}
            products={products}
            onSelectProduct={handleSelectProduct}
            favoriteProductIds={favoriteProductIds}
          />
        );
      case 'addItem':
        return <AuctionForm currentUser={currentUser} onAddItem={handleAddItem} />;
      case 'myBids':
        return <MyBids products={products} currentUser={currentUser} onSelectProduct={handleSelectProduct} favoriteProductIds={favoriteProductIds} onToggleFavorite={handleToggleFavorite} />;
      case 'favorites':
        return <Favorites products={products} onSelectProduct={handleSelectProduct} favoriteProductIds={favoriteProductIds} onToggleFavorite={handleToggleFavorite} currentUser={currentUser} />;
      case 'myListings':
        return <MyListingsPage products={products} currentUser={currentUser} onSelectProduct={handleSelectProduct} favoriteProductIds={favoriteProductIds} onToggleFavorite={handleToggleFavorite} />;
      case 'chatList':
        return <ChatListPage currentUser={currentUser} onSelectConversation={handleSelectConversation} />;
      case 'chatDetail':
        return selectedConversation && <ChatView initialConversation={selectedConversation} currentUser={currentUser} onBack={() => setView('chatList')} />;
      case 'listings':
      default:
        return <AuctionListPage products={products} onSelectProduct={handleSelectProduct} favoriteProductIds={favoriteProductIds} onToggleFavorite={handleToggleFavorite} currentUser={currentUser} />;
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen font-sans">
      <Header currentUser={currentUser} onNavigate={handleNavigate} activeView={view} onLogout={handleLogout} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
