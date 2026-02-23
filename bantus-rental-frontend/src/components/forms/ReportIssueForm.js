"use client";

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const ReportIssueForm = ({ onFormSubmit }) => {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error('Please provide a description of the issue.');
      return;
    }
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      // Use the endpoint we created for tenants to report issues
      const response = await axios.post(`${apiUrl}/my/issues`, { description }, config);
      
      toast.success('Issue reported successfully!');
      onFormSubmit(response.data.data); // Pass the new issue data back to the parent
      
      setDescription(''); // Reset form

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to report issue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="issue-description" className="block text-sm font-medium text-gray-700">
          Describe the issue
        </label>
        <textarea
          id="issue-description"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2"
          placeholder="e.g., The kitchen sink is leaking and dripping constantly."
          required
        />
        <p className="mt-2 text-xs text-gray-500">
          Please be as detailed as possible. Your landlord will be notified immediately.
        </p>
      </div>
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline disabled:bg-orange-300"
        >
          {isLoading ? 'Submitting...' : 'Submit Issue Report'}
        </button>
      </div>
    </form>
  );
};
