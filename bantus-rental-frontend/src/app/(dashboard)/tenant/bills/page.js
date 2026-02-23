"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Droplet, Zap, Calendar, Check } from 'lucide-react';

// --- Reusable Components ---

const BillRow = ({ bill }) => {
  const isPaid = bill.status === 'paid';
  const Icon = bill.type === 'water' ? Droplet : Zap;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
      <div className="flex items-center">
        <Icon className={`h-6 w-6 mr-4 ${bill.type === 'water' ? 'text-blue-500' : 'text-yellow-500'}`} />
        <div>
          <p className="font-semibold text-gray-800 capitalize">{bill.type} Bill</p>
          <p className="text-sm text-gray-500">
            {bill.unitsConsumed.toFixed(2)} units consumed
          </p>
        </div>
      </div>
      <div className="flex items-center gap-x-6">
        <p className="font-bold text-lg text-gray-800">
          {new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(bill.amount)}
        </p>
        <button
          disabled={isPaid}
          className={`px-4 py-2 text-sm font-semibold rounded-md ${
            isPaid 
              ? 'bg-green-100 text-green-700 flex items-center cursor-default' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isPaid ? <><Check className="h-4 w-4 mr-1"/> Paid</> : 'Pay Now'}
        </button>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export default function TenantBillsPage() {
  const { user } = useAuth();
  const [billsByMonth, setBillsByMonth] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.token) {
      const fetchBills = async () => {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        try {
          const response = await axios.get(`${apiUrl}/my-billing/bills`, config);
          
          // Group bills by month
          const grouped = response.data.data.reduce((acc, bill) => {
            const monthYear = new Date(bill.month).toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!acc[monthYear]) {
              acc[monthYear] = [];
            }
            acc[monthYear].push(bill);
            return acc;
          }, {});
          setBillsByMonth(grouped);

        } catch (error) {
          toast.error("Failed to fetch your bills.");
        } finally {
          setLoading(false);
        }
      };
      fetchBills();
    }
  }, [user]);

  if (loading) return <div className="p-8">Loading your bills...</div>;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Utility Bills</h1>
        <p className="text-gray-600">A history of your water and electricity bills.</p>
      </div>

      {/* Bills List */}
      <div className="space-y-8">
        {Object.keys(billsByMonth).length > 0 ? (
          Object.entries(billsByMonth).map(([month, bills]) => (
            <div key={month}>
              <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                {month}
              </h2>
              <div className="space-y-3">
                {bills.map(bill => (
                  <BillRow key={bill.billId} bill={bill} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">No bills found</h3>
            <p className="mt-1 text-sm text-gray-500">Your landlord has not generated any utility bills for you yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
