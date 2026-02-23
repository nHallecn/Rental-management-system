"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import Link from 'next/link';
import { Building, Home, Users, BarChart, Plus } from 'lucide-react';
import { Modal } from '@/components/modals/Modal'; // Import the Modal
import { AddMiniciteForm } from '@/components/forms/AddMiniciteForm'; // Import the Form

// --- Reusable Components ---
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

const MiniciteCard = ({ minicite }) => (
  <Link href={`/landlord/minicites/${minicite.miniciteId}/rooms`} className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
    <h3 className="font-bold text-xl text-gray-800">{minicite.name}</h3>
    <p className="text-sm text-gray-500">{minicite.location}</p>
    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-sm">
      <span>Occupancy</span>
      <span className="font-semibold">86%</span>
    </div>
  </Link>
);

// --- Main Dashboard Component ---
export default function LandlordDashboard() {
  const { user } = useAuth();
  const [minicites, setMinicites] = useState([]);
  const [stats, setStats] = useState({ totalMinicites: 0, totalApartments: 0, totalRooms: 0, overallOccupancy: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // --- THIS IS THE NEW STATE FOR THE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user?.token) {
      const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const res = await axios.get(`${apiUrl}/api/minicites`, config);
          
          setMinicites(res.data.data);
          setStats(prev => ({ ...prev, totalMinicites: res.data.data.length }));

        } catch (err) {
          setError('Failed to fetch dashboard data.');
          toast.error('Failed to fetch dashboard data.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  // --- THIS IS THE NEW FUNCTION TO PASS TO THE FORM ---
  const handleMiniciteAdded = (newMinicite) => {
    setMinicites(prevMinicites => [newMinicite, ...prevMinicites]);
    setStats(prev => ({ ...prev, totalMinicites: prev.totalMinicites + 1 }));
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* --- MODAL COMPONENT --- */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddMiniciteForm 
          onMiniciteAdded={handleMiniciteAdded} 
          closeModal={() => setIsModalOpen(false)}
        />
      </Modal>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Minicités</h1>
        {/* --- BUTTON TO OPEN THE MODAL --- */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center bg-orange-600 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Minicité
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Minicités" value={stats.totalMinicites} icon={Building} />
        <StatCard title="Total Apartments" value={stats.totalApartments} icon={Home} />
        <StatCard title="Total Rooms" value={stats.totalRooms} icon={Users} />
        <StatCard title="Overall Occupancy" value={`${stats.overallOccupancy}%`} icon={BarChart} />
      </div>

      {/* Minicites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {minicites.length > 0 ? (
          minicites.map(minicite => (
            <MiniciteCard key={minicite.miniciteId} minicite={minicite} />
          ))
        ) : (
          <p className="text-gray-500 md:col-span-2 lg:col-span-3 text-center">
            You haven't added any minicités yet. Click "Add Minicite" to get started.
          </p>
        )}
      </div>
    </div>
  );
}
