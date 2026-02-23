"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import Link from 'next/link';
import { Home, BedDouble, Bed, BarChart, Plus } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-yellow-100 p-4 rounded-lg shadow-inner text-center">
    <p className="text-3xl font-bold text-gray-800">{value}</p>
    <p className="text-sm font-medium text-gray-600 mt-1">{title}</p>
  </div>
);

const RoomCard = ({ room }) => (
  <Link href={`/landlord/rooms/${room.roomId}/details`} className="block bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input type="checkbox" className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded" />
      </div>
      <div className="ml-3 text-sm">
        <label className="font-bold text-lg text-gray-900">{`Room ${room.number}`}</label>
        <p className="text-gray-500">{room.status === 'OCCUPIED' ? `Occupied by ${room.tenantName}` : 'Available'}</p>
      </div>
    </div>
  </Link>
);

export default function MiniciteRoomsPage() {
  const { user } = useAuth();
  const params = useParams();
  const { miniciteId } = params;

  const [miniciteName, setMiniciteName] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.token && miniciteId) {
      const fetchRooms = async () => {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        try {
          const response = await axios.get(`${apiUrl}/api/rooms/by-minicite/${miniciteId}`, config);
          setRooms(response.data.data.rooms);
          setMiniciteName(response.data.data.miniciteName);
        } catch (error) {
          console.error("Failed to fetch rooms:", error);
          toast.error("Failed to fetch rooms for this minicité.");
        } finally {
          setLoading(false);
        }
      };
      fetchRooms();
    }
  }, [user, miniciteId]);

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === 'OCCUPIED').length;
  const availableRooms = totalRooms - occupiedRooms;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  if (loading) {
    return <div className="text-center p-10">Loading rooms...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Apartments & Rooms . <span className="text-orange-600">{miniciteName}</span></h1>
          <p className="text-gray-500 mt-1">Manage individual units within your minicités</p>
        </div>
        <div className="flex gap-x-4">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50">Add Apartment</button>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600">Add Room</button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Rooms" value={totalRooms} icon={Home} />
        <StatCard title="Available Rooms" value={availableRooms} icon={Bed} />
        <StatCard title="Occupied Rooms" value={occupiedRooms} icon={BedDouble} />
        <StatCard title="Overall Occupancy" value={`${occupancyRate}%`} icon={BarChart} />
      </div>

      {/* Search and Rooms Grid */}
      <div>
        <div className="mb-4">
            <input type="text" placeholder="Search a room" className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.length > 0 ? (
            rooms.map(room => (
              <RoomCard key={room.roomId} room={room} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-10">No rooms found for this minicité. Click "Add Room" to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
}
