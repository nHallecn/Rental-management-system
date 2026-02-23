"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Users, UserCheck, UserX, Search } from 'lucide-react';

// --- Reusable Components ---

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className={`bg-white p-5 rounded-lg shadow border-l-4 border-${color}-500 flex items-center`}>
    <Icon className={`h-8 w-8 mr-4 text-${color}-500`} />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const TenantRow = ({ tenant }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center py-4 border-b text-sm">
    <div className="font-semibold text-gray-800">{tenant.fullName}</div>
    <div className="text-gray-600">{tenant.username}</div>
    <div className="text-gray-600">{tenant.miniciteName} · Room {tenant.roomId}</div>
    <div>
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
        tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
      }`}>
        {tenant.status === 'active' ? 'Active' : 'Former'}
      </span>
    </div>
  </div>
);

// --- Main Page Component ---

export default function TenantsPage() {
  const { user } = useAuth();
  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', 'closed'

  useEffect(() => {
    if (user?.token) {
      const fetchTenants = async () => {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        try {
          const response = await axios.get(`${apiUrl}/landlord-tenants`, config);
          setTenants(response.data.data);
          setFilteredTenants(response.data.data);
        } catch (error) {
          toast.error("Failed to fetch tenants.");
        } finally {
          setLoading(false);
        }
      };
      fetchTenants();
    }
  }, [user]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setFilteredTenants(tenants);
    } else {
      setFilteredTenants(tenants.filter(t => t.status === filter));
    }
  };

  const stats = {
    total: tenants.length,
    active: tenants.filter(t => t.status === 'active').length,
    former: tenants.filter(t => t.status === 'closed').length,
  };

  const FilterButton = ({ filter, label, count }) => (
    <button
      onClick={() => handleFilterChange(filter)}
      className={`px-4 py-2 rounded-md text-sm font-semibold ${
        activeFilter === filter ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label} ({count})
    </button>
  );

  if (loading) return <div className="p-8">Loading tenants...</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tenants</h1>
          <p className="text-gray-600">Manage tenants and rental contracts</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={Users} label="Total Tenants" value={stats.total} color="blue" />
        <StatCard icon={UserCheck} label="Active Tenants" value={stats.active} color="green" />
        <StatCard icon={UserX} label="Former Tenants" value={stats.former} color="gray" />
      </div>

      {/* Tenant List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <FilterButton filter="all" label="All" count={stats.total} />
            <FilterButton filter="active" label="Active" count={stats.active} />
            <FilterButton filter="closed" label="Former" count={stats.former} />
          </div>
          <div className="w-full md:w-auto flex items-center bg-gray-100 p-2 rounded-lg">
            <Search className="text-gray-400 mx-2 h-5 w-5" />
            <input type="text" placeholder="Search tenants..." className="w-full bg-transparent focus:outline-none" />
          </div>
        </div>
        
        {/* Table Header */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-2 border-b-2 text-xs text-gray-500 font-bold uppercase">
          <div>Name</div>
          <div>Username/Email</div>
          <div>Property</div>
          <div>Status</div>
        </div>

        {/* Table Body */}
        <div>
          {filteredTenants.length > 0 ? (
            filteredTenants.map(tenant => (
              <TenantRow key={tenant.tenantId} tenant={tenant} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No tenants found for this filter.</p>
          )}
        </div>
      </div>
    </div>
  );
}
