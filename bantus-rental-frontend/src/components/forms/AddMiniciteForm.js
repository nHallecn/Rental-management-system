"use client";

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const AddMiniciteForm = ({ onMiniciteAdded, closeModal }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !location) {
      toast.error("Please fill out both name and location.");
      return;
    }
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = user?.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const data = { name, location };

      // --- THIS IS THE CORRECTED URL ---
      const response = await axios.post(`${apiUrl}/api/minicites`, data, config);
      // --------------------------------

      toast.success("Minicité created successfully!");
      onMiniciteAdded(response.data.data); // Pass the new minicite data back to the dashboard
      closeModal(); // Close the modal on success

    } catch (error) {
      console.error("Failed to create minicité:", error);
      const errorMessage = error.response?.data?.message || "Failed to create minicité.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Add a New Minicité</h2>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Minicité Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          placeholder="e.g., Cité des Palmiers"
          required
        />
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          placeholder="e.g., Ekounou, Yaoundé"
          required
        />
      </div>
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300"
        >
          {isLoading ? 'Creating...' : 'Create Minicité'}
        </button>
      </div>
    </form>
  );
};
