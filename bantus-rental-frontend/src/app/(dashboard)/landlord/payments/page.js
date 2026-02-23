"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Wallet, Calendar, Search } from 'lucide-react';

// --- Reusable Components ---

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className={`bg-white p-5 rounded-lg shadow border-l-4 border-${color}-500`}>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
  </div>
);

const PaymentRow = ({ payment }) => (
  <div className="grid grid-cols-5 gap-4 items-center py-4 border-b text-sm">
    <div className="col-span-2">
      <p className="font-semibold text-gray-800">Rent Payment Complete</p>
      <p className="text-gray-500">{payment.tenantName}</p>
    </div>
    <div className="text-gray-600">{new Date(payment.paymentDate).toLocaleDateString()}</div>
    <div className="text-gray-600">{payment.miniciteName} · Room {payment.roomId}</div>
    <div className="font-bold text-gray-800 text-right">
      {new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(payment.amount)}
    </div>
  </div>
);

// --- Main Page Component ---

export default function PaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.token) {
      const fetchPayments = async () => {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        try {
          // Use the new backend endpoint
          const response = await axios.get(`${apiUrl}/landlord-payments`, config);
          setPayments(response.data.data);
        } catch (error) {
          toast.error("Failed to fetch payments.");
        } finally {
          setLoading(false);
        }
      };
      fetchPayments();
    }
  }, [user]);

  const totalCollected = payments.reduce((acc, p) => acc + parseFloat(p.amount), 0);
  const thisMonthCollected = payments
    .filter(p => new Date(p.paymentDate).getMonth() === new Date().getMonth())
    .reduce((acc, p) => acc + parseFloat(p.amount), 0);

  if (loading) return <div className="p-8">Loading payments...</div>;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Payments</h1>
        <p className="text-gray-600">Track and manage all payment transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard 
          icon={Wallet} 
          label="Total Collected (All Time)" 
          value={new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(totalCollected)} 
          color="green" 
        />
        <StatCard 
          icon={Calendar} 
          label="Collected This Month" 
          value={new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(thisMonthCollected)} 
          color="blue" 
        />
      </div>

      {/* Payment Log */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Transaction History</h3>
          <div className="w-full md:w-1/3 flex items-center bg-gray-100 p-2 rounded-lg">
            <Search className="text-gray-400 mx-2 h-5 w-5" />
            <input type="text" placeholder="Search by tenant, room..." className="w-full bg-transparent focus:outline-none" />
          </div>
        </div>
        
        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 py-2 border-b-2 text-xs text-gray-500 font-bold uppercase">
          <div className="col-span-2">Description</div>
          <div>Date</div>
          <div>Property</div>
          <div className="text-right">Amount</div>
        </div>

        {/* Table Body */}
        <div>
          {payments.length > 0 ? (
            payments.map(payment => (
              <PaymentRow key={payment.paymentId} payment={payment} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No payments recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
