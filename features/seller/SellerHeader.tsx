import React from 'react';

interface SellerHeaderProps {
  activeTab: 'myListings' | 'createListing';
  onTabChange: (tab: 'myListings' | 'createListing') => void;
}

export const SellerHeader: React.FC<SellerHeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
                onClick={() => onTabChange('myListings')}
                className={`${
                    activeTab === 'myListings'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-subtle hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
                My Listings
            </button>
            <button
                 onClick={() => onTabChange('createListing')}
                 className={`${
                    activeTab === 'createListing'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-subtle hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
                Create New Listing
            </button>
        </nav>
    </div>
  );
};
