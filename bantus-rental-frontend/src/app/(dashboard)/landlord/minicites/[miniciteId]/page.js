"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Home, Bed, BedDouble, UserCheck, Search } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer'; // Import Drawer
import { AddRoomForm } from '@/components/forms/AddRoomForm'; // Import the new form

// Reusable Stat Card
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className={`bg-white p-5 rounded-lg shadow border-l-4 border-${color}-500`}>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
  </div>
);

// Room Card Component
const RoomCard = ({ room, onClick }) => (
    <div 
        onClick={() => onClick(room.roomId)}
        className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border"
    >
        <div className="flex justify-between items-start">
            <h4 className="font-bold text-gray-800">Room {room.roomId}</h4>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
                room.status === 'occupied' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
                {room.status}
            </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
            {room.status === 'occupied' ? `Occupied` : 'Available'}
        </p>
    </div>
);


export default function MiniciteDetailsPage() {
  const { miniciteId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [minicite, setMinicite] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal

  // This function is called by the form on successful submission
  const handleFormSubmit = (newRoom) => {
    setRooms(prevRooms => [...prevRooms, newRoom]); // Add new room to the list
    setIsModalOpen(false); // Close the modal
  };

  useEffect(() => {
    if (user?.token && miniciteId) {
      const fetchData = async () => {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const config = { headers: { Authorization: `Bearer ${user.token}` } };

        try {
          const [miniciteRes, roomsRes] = await Promise.all([
            axios.get(`${apiUrl}/minicites`, config),
            axios.get(`${apiUrl}/minicites/${miniciteId}/rooms`, config)
          ]);
          
          const currentMinicite = miniciteRes.data.data.find(m => m.miniciteId == miniciteId);
          setMinicite(currentMinicite);
          setRooms(roomsRes.data.data);

        } catch (error) {
          toast.error('Failed to fetch property details.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user, miniciteId]);

  const handleRoomClick = (roomId) => {
    router.push(`/landlord/rooms/${roomId}`);
  };

  if (loading) return <div className="p-8">Loading property details...</div>;
  if (!minicite) return <div className="p-8">Property not found.</div>;

  const stats = {
      totalRooms: rooms.length,
      availableRooms: rooms.filter(r => r.status === 'vacant').length,
      occupiedRooms: rooms.filter(r => r.status === 'occupied').length,
      occupancyRate: rooms.length > 0 ? Math.round((rooms.filter(r => r.status === 'occupied').length / rooms.length) * 100) : 0,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Apartments & Rooms · {minicite.name}</h1>
          <p className="text-gray-600">Manage individual units within your minicités</p>
        </div>
        <div className="flex gap-x-3">
            <button className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Add Apartment</button>
            
            {/* Drawer for Adding a Room */}
            <Drawer
              open={isModalOpen}
              onOpenChange={setIsModalOpen}
              title="Add a New Room"
              description={`Enter the details for the new room in ${minicite.name}.`}
              button={
                <button className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                  + Add Room
                </button>
              }
            >
              <AddRoomForm miniciteId={miniciteId} onFormSubmit={handleFormSubmit} />
            </Drawer>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Bed} label="Total Rooms" value={stats.totalRooms} color="blue" />
        <StatCard icon={BedDouble} label="Available Rooms" value={stats.availableRooms} color="green" />
        <StatCard icon={UserCheck} label="Occupied Rooms" value={stats.occupiedRooms} color="red" />
        <StatCard icon={Home} label="Overall Occupancy" value={`${stats.occupancyRate}%`} color="yellow" />
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex items-center bg-white p-2 rounded-lg shadow">
        <Search className="text-gray-400 mx-3 h-5 w-5" />
        <input 
            type="text"
            placeholder="Search a room..."
            className="w-full bg-transparent focus:outline-none"
        />
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {rooms.map(room => (
            <RoomCard key={room.roomId} room={room} onClick={handleRoomClick} />
        ))}
      </div>
    </div>
  );
}
