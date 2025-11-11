import React, { PropsWithChildren } from 'react';
import { XIcon } from './icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<PropsWithChildren<ModalProps>> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={`bg-surface rounded-lg shadow-xl w-full ${sizeClasses[size]} m-auto relative`}
        onClick={e => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-on-surface">{title}</h2>
          <button onClick={onClose} className="text-subtle hover:text-on-surface">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
