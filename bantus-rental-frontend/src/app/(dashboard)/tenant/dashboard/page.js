"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Calendar, Home, User, FileText, Droplet, Zap, Wallet } from 'lucide-react';

// --- Reusable Components for this page ---

const InfoCard = ({ icon: Icon, label, value, color }) => (
    <div className={`bg-white p-4 rounded-lg shadow border-l-4 border-${color}-500`}>
        <p className="text-xs text-gray-500 uppercase">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
);

const DetailItem = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-800">{value}</p>
    </div>
);

const HistoryRow = ({ month, status }) => (
    <div className="flex justify-between items-center py-3 border-b">
        <p className="text-gray-700">{month}</p>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
            {status}
        </span>
    </div>
);

const BillItem = ({ month, amount, status }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
        <div>
            <p className="font-semibold text-gray-800">{month}</p>
            <p className="text-sm text-gray-600">{amount}</p>
        </div>
        <button className={`px-4 py-1 text-sm rounded-md ${
            status === 'Paid' ? 'bg-gray-200 text-gray-700 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'
        }`}>
            {status === 'Paid' ? 'Paid' : 'Pay Now'}
        </button>
    </div>
);


// --- Main Page Component ---

export default function TenantDashboardPage() {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mocking history data based on your UI design
    const mockHistory = {
        rent: [
            { month: 'September 2025', status: 'Paid' },
            { month: 'August 2025', status: 'Paid' },
            { month: 'July 2025', status: 'Paid' },
            { month: 'June 2025', status: 'Paid' },
        ],
        bills: [
            { month: 'December 2025', amount: '6,250 XAF', status: 'Unpaid' },
            { month: 'November 2025', amount: '6,250 XAF', status: 'Paid' },
            { month: 'October 2025', amount: '6,250 XAF', status: 'Paid' },
        ]
    };

    useEffect(() => {
        if (user?.token) {
            const fetchDashboardData = async () => {
                setLoading(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                try {
                    const response = await axios.get(`${apiUrl}/my/dashboard`, config);
                    setDashboardData(response.data.data);
                } catch (error) {
                    toast.error("Failed to fetch your dashboard information.");
                } finally {
                    setLoading(false);
                }
            };
            fetchDashboardData();
        }
    }, [user]);

    if (loading) return <div className="p-8">Loading your dashboard...</div>;
    if (!dashboardData) return <div className="p-8">Could not load your rental information. Please contact your landlord.</div>;

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.username}</h1>
                <p className="text-gray-600">{dashboardData.miniciteName} · Room {dashboardData.roomId}</p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <InfoCard icon={Home} label="Monthly Rent" value="150,000 XAF" color="blue" />
                <InfoCard icon={Zap} label="Utility Bills" value="14,750 XAF" color="yellow" />
                <InfoCard icon={Calendar} label="Next Payment" value="Feb 1, 2026" color="red" />
                <InfoCard icon={Wallet} label="Open Issues" value="2" color="orange" />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left and Middle Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Your Room Details */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold mb-4">Your Room Details</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            <DetailItem label="Room ID" value={dashboardData.roomId} />
                            <DetailItem label="Minicite" value={dashboardData.miniciteName} />
                            <DetailItem label="Entry Date" value={new Date(dashboardData.entryDate).toLocaleDateString()} />
                            <DetailItem label="Landlord" value={dashboardData.landlordName} />
                            <DetailItem label="Landlord Phone" value={dashboardData.landlordPhone} />
                        </div>
                        <button className="text-sm font-semibold text-orange-600 hover:underline">
                            <FileText className="inline-block mr-1 h-4 w-4" />
                            View Your Contract
                        </button>
                    </div>

                    {/* Rent History */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold mb-2">Rent Payment History</h3>
                        {mockHistory.rent.map(rent => (
                            <HistoryRow key={rent.month} month={rent.month} status={rent.status} />
                        ))}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Utility Bills */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold mb-4">Utility Bills</h3>
                        <div className="space-y-3">
                            {mockHistory.bills.map(bill => (
                                <BillItem key={bill.month} {...bill} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
