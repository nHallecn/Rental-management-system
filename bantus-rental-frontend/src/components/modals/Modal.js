"use client";

import { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, children }) => {
  // Effect to handle the 'Escape' key to close the modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // If the modal is not open, render nothing
  if (!isOpen) {
    return null;
  }

  return (
    // The Modal backdrop
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose} // Close modal if backdrop is clicked
    >
      {/* The Modal content */}
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md m-4"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        <div className="relative">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
          {/* The content passed to the modal (e.g., the AddMiniciteForm) */}
          {children}
        </div>
      </div>
    </div>
  );
};
