import React from 'react';
import { User } from '../types';
import { HammerIcon } from './icons';

type View = 'listings' | 'myBids' | 'favorites' | 'addItem' | 'myListings' | 'chatList';

interface HeaderProps {
  currentUser: User;
  onNavigate: (view: View) => void;
  activeView: string;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onNavigate, activeView, onLogout }) => {
  const navItems = [
    { id: 'listings', label: 'All Listings' },
    { id: 'myBids', label: 'My Bids' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'chatList', label: 'Chats' },
    { id: 'myListings', label: 'My Listings' },
  ];

  return (
    <header className="bg-surface shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('listings')}>
            <HammerIcon className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-on-surface">Bidify</h1>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as View)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeView === item.id
                    ? 'text-primary bg-primary/10'
                    : 'text-subtle hover:text-on-surface hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-4">
             <button
              onClick={() => onNavigate('addItem')}
              className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-md transition-colors"
            >
              List Item
            </button>
            <div className="text-sm hidden sm:block">
              <span className="text-subtle">Logged in as </span>
              <span className="font-bold text-on-surface">{currentUser.name}</span>
            </div>
            <button
              onClick={onLogout}
              className="px-3 py-2 text-sm font-medium text-subtle hover:text-on-surface hover:bg-gray-100 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};