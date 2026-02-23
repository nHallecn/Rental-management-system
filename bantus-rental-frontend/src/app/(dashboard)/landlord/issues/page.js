"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AlertTriangle, Loader, CheckCircle, Search } from 'lucide-react';

// --- Reusable Components for this page ---

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className={`bg-white p-5 rounded-lg shadow border-l-4 border-${color}-500 flex items-center`}>
    <Icon className={`h-8 w-8 mr-4 text-${color}-500`} />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const IssueCard = ({ issue, onStatusChange }) => {
  const statusStyles = {
    open: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' },
    in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' },
    resolved: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' },
  };

  const currentStyle = statusStyles[issue.status] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-500' };

  return (
    <div className={`bg-white p-4 rounded-lg shadow border-t-4 ${currentStyle.border}`}>
      <div className="flex justify-between items-start mb-2">
        <p className="font-bold text-gray-800">Room {issue.roomId} · {issue.miniciteName}</p>
        <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${currentStyle.bg} ${currentStyle.text}`}>
          {issue.status.replace('_', ' ')}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-4">{issue.description}</p>
      <div className="text-xs text-gray-400 mb-4">
        Reported on: {new Date(issue.createdAt).toLocaleDateString()}
      </div>
      
      {issue.status !== 'resolved' && (
        <div className="flex gap-x-2">
          {issue.status === 'open' && (
            <button 
              onClick={() => onStatusChange(issue.issueId, 'in_progress')}
              className="w-full text-sm bg-yellow-500 text-white font-semibold py-2 px-3 rounded-md hover:bg-yellow-600"
            >
              Start Work
            </button>
          )}
          {issue.status === 'in_progress' && (
            <button 
              onClick={() => onStatusChange(issue.issueId, 'resolved')}
              className="w-full text-sm bg-green-500 text-white font-semibold py-2 px-3 rounded-md hover:bg-green-600"
            >
              Mark Resolved
            </button>
          )}
        </div>
      )}
    </div>
  );
};


// --- Main Page Component ---

export default function IssuesPage() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'open', 'in_progress', 'resolved'

  const fetchIssues = async () => {
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    try {
      const response = await axios.get(`${apiUrl}/issues`, config);
      setIssues(response.data.data);
      setFilteredIssues(response.data.data); // Initially, show all issues
    } catch (error) {
      toast.error("Failed to fetch issues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchIssues();
    }
  }, [user]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setFilteredIssues(issues);
    } else {
      setFilteredIssues(issues.filter(issue => issue.status === filter));
    }
  };

  const handleStatusChange = async (issueId, newStatus) => {
    const originalIssues = [...issues];
    // Optimistically update the UI
    const updatedIssues = issues.map(issue => 
      issue.issueId === issueId ? { ...issue, status: newStatus } : issue
    );
    setIssues(updatedIssues);
    handleFilterChange(activeFilter); // Re-apply current filter

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${apiUrl}/issues/${issueId}/status`, { status: newStatus }, config);
      toast.success(`Issue status updated to "${newStatus.replace('_', ' ')}".`);
    } catch (error) {
      toast.error("Failed to update status. Reverting changes.");
      setIssues(originalIssues); // Revert UI on error
      handleFilterChange(activeFilter);
    }
  };

  const stats = {
    open: issues.filter(i => i.status === 'open').length,
    in_progress: issues.filter(i => i.status === 'in_progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
  };

  const FilterButton = ({ filter, label }) => (
    <button
      onClick={() => handleFilterChange(filter)}
      className={`px-4 py-2 rounded-md text-sm font-semibold ${
        activeFilter === filter ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label} ({filter === 'all' ? issues.length : stats[filter]})
    </button>
  );

  if (loading) return <div className="p-8">Loading issues...</div>;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Issues Management</h1>
        <p className="text-gray-600">Track and resolve maintenance requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={AlertTriangle} label="Open Issues" value={stats.open} color="red" />
        <StatCard icon={Loader} label="In Progress" value={stats.in_progress} color="yellow" />
        <StatCard icon={CheckCircle} label="Resolved" value={stats.resolved} color="green" />
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 p-4 bg-white rounded-lg shadow">
        <div className="flex items-center gap-2 flex-wrap">
          <FilterButton filter="all" label="All" />
          <FilterButton filter="open" label="Open" />
          <FilterButton filter="in_progress" label="In Progress" />
          <FilterButton filter="resolved" label="Resolved" />
        </div>
        <div className="w-full md:w-auto flex items-center bg-gray-100 p-2 rounded-lg">
          <Search className="text-gray-400 mx-2 h-5 w-5" />
          <input type="text" placeholder="Search issues..." className="w-full bg-transparent focus:outline-none" />
        </div>
      </div>

      {/* Issues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIssues.length > 0 ? (
          filteredIssues.map(issue => (
            <IssueCard key={issue.issueId} issue={issue} onStatusChange={handleStatusChange} />
          ))
        ) : (
          <p className="text-gray-500 md:col-span-3 text-center">No issues found for this filter.</p>
        )}
      </div>
    </div>
  );
}
