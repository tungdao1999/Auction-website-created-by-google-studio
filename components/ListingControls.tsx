import React from 'react';
import { SearchIcon } from './icons';

interface ListingControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortOption: string;
  onSortChange: (option: string) => void;
}

export const ListingControls: React.FC<ListingControlsProps> = ({ searchTerm, onSearchChange, sortOption, onSortChange }) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="relative w-full sm:w-auto sm:flex-grow max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-subtle" />
        </div>
        <input
          type="text"
          placeholder="Search items by name or description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label htmlFor="sort" className="text-sm font-medium text-on-surface whitespace-nowrap">Sort by:</label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        >
          <option value="newly-listed">Newly Listed</option>
          <option value="ending-soon">Ending Soon</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};