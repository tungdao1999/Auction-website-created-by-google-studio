import React, { useState } from 'react';
import { User } from '../../types';
import { generateDescription } from '../../api/geminiService';
import { SparklesIcon } from '../../components/icons';

interface AuctionFormProps {
  currentUser: User;
  onAddItem: (item: Omit<any, 'id' | 'bids'>) => void;
}

export const AuctionForm: React.FC<AuctionFormProps> = ({ currentUser, onAddItem }) => {
  const [name, setName] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [duration, setDuration] = useState('1');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const endDate = new Date(Date.now() + Number(duration) * 24 * 60 * 60 * 1000);
    onAddItem({
      name,
      startingPrice: Number(startingPrice),
      description,
      imageUrl: imageUrl || `https://picsum.photos/seed/${name.replace(/\s+/g, '-')}/800/600`,
      endDate,
      seller: currentUser,
    });
    // Clear form
    setName('');
    setStartingPrice('');
    setDuration('1');
    setDescription('');
    setImageUrl('');
  };

  const handleGenerateDescription = async () => {
    if (!name) {
      alert("Please enter an item name first.");
      return;
    }
    setIsGenerating(true);
    try {
      const generatedDesc = await generateDescription(name);
      setDescription(generatedDesc);
    } catch (error) {
      console.error(error);
      alert("Failed to generate description.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-2xl animate-fade-in">
      <div className="bg-surface rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-on-surface mb-6">List a New Item for Auction</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-on-surface">Item Name</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>

          <div className="relative">
            <label htmlFor="description" className="block text-sm font-medium text-on-surface">Description</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            <button 
                type="button" 
                onClick={handleGenerateDescription}
                disabled={isGenerating || !name}
                className="absolute bottom-3 right-3 flex items-center gap-2 text-xs px-2 py-1 bg-secondary text-white rounded-md hover:bg-secondary-hover disabled:bg-gray-400"
            >
                <SparklesIcon className="w-4 h-4" />
                {isGenerating ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-on-surface">Starting Price ($)</label>
              <input type="number" id="price" value={startingPrice} onChange={e => setStartingPrice(e.target.value)} required min="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-on-surface">Auction Duration (days)</label>
              <select id="duration" value={duration} onChange={e => setDuration(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                <option value="1">1 Day</option>
                <option value="3">3 Days</option>
                <option value="5">5 Days</option>
                <option value="7">7 Days</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-on-surface">Image URL (Optional)</label>
            <input type="text" id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://picsum.photos/..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            <p className="text-xs text-subtle mt-1">If left blank, a random placeholder image will be used.</p>
          </div>
          
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
            List Item
          </button>
        </form>
      </div>
    </div>
  );
};
