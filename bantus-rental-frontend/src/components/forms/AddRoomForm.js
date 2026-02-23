"use client";

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// The miniciteId is passed as a prop to associate the new room correctly
export const AddRoomForm = ({ miniciteId, onFormSubmit }) => {
  const [annualRent, setAnnualRent] = useState('');
  const [status, setStatus] = useState('vacant');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!annualRent || isNaN(parseFloat(annualRent))) {
      toast.error('Please enter a valid annual rent amount.');
      return;
    }
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const roomData = {
        annualRent: parseFloat(annualRent),
        status: status,
      };

      // The endpoint is nested under the specific minicité
      const response = await axios.post(`${apiUrl}/minicites/${miniciteId}/rooms`, roomData, config);
      
      toast.success('Room created successfully!');
      onFormSubmit(response.data.data); // Pass the new room data back to the parent page
      
      // Reset form
      setAnnualRent('');
      setStatus('vacant');

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create room.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="annual-rent" className="block text-sm font-medium text-gray-700">
          Annual Rent (XAF)
        </label>
        <input
          type="number"
          id="annual-rent"
          value={annualRent}
          onChange={(e) => setAnnualRent(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2"
          placeholder="e.g., 600000"
          required
        />
      </div>
      <div>
        <label htmlFor="room-status" className="block text-sm font-medium text-gray-700">
          Initial Status
        </label>
        <select
          id="room-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 bg-white"
        >
          <option value="vacant">Vacant</option>
          <option value="occupied">Occupied</option>
        </select>
      </div>
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline disabled:bg-orange-300"
        >
          {isLoading ? 'Creating...' : 'Create Room'}
        </button>
      </div>
    </form>
  );
};
