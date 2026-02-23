"use client";

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// This form needs the roomId to create the session
export const AddTenantForm = ({ roomId, onFormSubmit }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !username || !password || !entryDate) {
      toast.error('Please fill out all fields.');
      return;
    }
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const config = { headers: { Authorization: `Bearer ${user.token}` } };

      // Step 1: Register the new tenant user
      const registerResponse = await axios.post(`${apiUrl}/tenants/register`, {
        fullName,
        username,
        password
      }, config);

      const newTenantId = registerResponse.data.data.tenantId;
      toast.success('Tenant user account created successfully!');

      // Step 2: Create the tenant session to assign them to the room
      const sessionData = {
        tenantId: newTenantId,
        entryDate: entryDate,
      };
      
      const sessionResponse = await axios.post(`${apiUrl}/rooms/${roomId}/sessions`, sessionData, config);

      toast.success('Tenant has been assigned to the room!');
      onFormSubmit(sessionResponse.data.data); // Callback to update the UI

    } catch (error) {
      // Handle potential errors, e.g., if username already exists
      toast.error(error.response?.data?.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-600">
        This will create a new user account for the tenant and assign them to this room.
      </p>
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Temporary Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          placeholder="Tenant can change this later"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Rental Entry Date</label>
        <input
          type="date"
          value={entryDate}
          onChange={(e) => setEntryDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-white"
          required
        />
      </div>
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-green-400"
        >
          {isLoading ? 'Assigning Tenant...' : 'Add and Assign Tenant'}
        </button>
      </div>
    </form>
  );
};
