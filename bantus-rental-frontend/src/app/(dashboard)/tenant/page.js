"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { DollarSign, Home, Calendar, FileText, AlertTriangle } from 'lucide-react';

// A loading skeleton component for a better user experience
const StatCardSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
    <div className="h-8 bg-gray-300 rounded w-1/2"></div>
  </div>
);

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center">
      <div className="bg-orange-100 p-3 rounded-full">
        <Icon className="h-6 w-6 text-orange-600" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export default function TenantDashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.token) {
      const fetchDashboardData = async () => {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        try {
          // --- THIS IS THE CORRECTED URL ---
          const response = await axios.get(`${apiUrl}/api/my/dashboard`, config);
          setDashboardData(response.data.data);
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
          toast.error("Failed to fetch your dashboard information.");
        } finally {
          setLoading(false);
        }
      };
      fetchDashboardData();
    }
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {dashboardData?.tenant?.fullName || user?.fullName || 'Tenant'}!
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : dashboardData ? (
        <>
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Monthly Rent" 
              value={`${new Intl.NumberFormat('en-US').format(dashboardData.room.annualRent / 12)} XAF`} 
              icon={DollarSign} 
            />
            <StatCard 
              title="Room" 
              value={`Room ${dashboardData.room.number}`} 
              icon={Home} 
            />
            <StatCard 
              title="Next Payment Due" 
              value={new Date(dashboardData.nextPaymentDate).toLocaleDateString()} 
              icon={Calendar} 
            />
            <StatCard 
              title="Open Issues" 
              value={dashboardData.openIssuesCount} 
              icon={AlertTriangle} 
            />
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Rent Payments</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.recentPayments.length > 0 ? (
                      dashboardData.recentPayments.map((payment) => (
                        <tr key={payment.paymentId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Intl.NumberFormat('en-US').format(payment.amount)} XAF</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.note || '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-10 text-gray-500">No recent payments found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Unpaid Bills</h2>
              <div className="space-y-4">
                {dashboardData.unpaidBills.length > 0 ? (
                  dashboardData.unpaidBills.map(bill => (
                    <div key={bill.billId} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">{bill.type} Bill</p>
                        <p className="text-sm text-gray-500">Due: {new Date(bill.deadline).toLocaleDateString()}</p>
                      </div>
                      <div className="font-bold text-red-600">
                        {new Intl.NumberFormat('en-US').format(bill.amount)} XAF
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">No unpaid bills. You're all caught up!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        !loading && <p className="text-center text-gray-500">Could not load dashboard data.</p>
      )}
    </div>
  );
}
