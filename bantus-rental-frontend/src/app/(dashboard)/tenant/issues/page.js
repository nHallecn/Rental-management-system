"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AlertTriangle, Wrench, CheckCircle } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { ReportIssueForm } from '@/components/forms/ReportIssueForm';

// --- Reusable Components ---

const IssueRow = ({ issue }) => {
  const statusInfo = {
    open: { icon: AlertTriangle, color: 'text-red-500', label: 'Open' },
    in_progress: { icon: Wrench, color: 'text-yellow-500', label: 'In Progress' },
    resolved: { icon: CheckCircle, color: 'text-green-500', label: 'Resolved' },
  };

  const currentStatus = statusInfo[issue.status] || statusInfo.open;
  const Icon = currentStatus.icon;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex-1">
        <p className="font-semibold text-gray-800">{issue.description}</p>
        <p className="text-xs text-gray-500 mt-1">
          Reported on: {new Date(issue.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className={`flex items-center font-semibold text-sm ${currentStatus.color}`}>
        <Icon className="h-5 w-5 mr-2" />
        <span>{currentStatus.label}</span>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export default function TenantIssuesPage() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchIssues = async () => {
    if (!user?.token) return;
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    try {
      const response = await axios.get(`${apiUrl}/my/issues`, config);
      setIssues(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch your reported issues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [user]);

  const handleFormSubmit = (newIssue) => {
    setIssues(prevIssues => [newIssue, ...prevIssues]); // Add new issue to the top of the list
    setIsModalOpen(false); // Close the modal
  };

  if (loading) return <div className="p-8">Loading your issues...</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Reported Issues</h1>
          <p className="text-gray-600">Track the status of your maintenance requests</p>
        </div>
        <Drawer
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          title="Report a New Issue"
          description="Let your landlord know what's wrong. They will be notified immediately."
          button={
            <button className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
              + Report New Issue
            </button>
          }
        >
          <ReportIssueForm onFormSubmit={handleFormSubmit} />
        </Drawer>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {issues.length > 0 ? (
          issues.map(issue => (
            <IssueRow key={issue.issueId} issue={issue} />
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No issues reported</h3>
            <p className="mt-1 text-sm text-gray-500">Click "Report New Issue" to submit a request.</p>
          </div>
        )}
      </div>
    </div>
  );
}
