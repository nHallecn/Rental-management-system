"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Calendar, Home, User, FileText, Droplet, Zap, AlertTriangle } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { AddTenantForm } from '@/components/forms/AddTenantForm';

// --- Utility Bill Form Component ---
const UtilityBillForm = ({ room, onBillGenerated }) => {
    const [reading, setReading] = useState({ waterValue: '', electricityValue: '' });
    const [rates, setRates] = useState({ waterRate: '500', electricityRate: '100' });
    const [deadline, setDeadline] = useState(new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const config = { headers: { Authorization: `Bearer ${user.token}` } };

        try {
            // Step 1: Submit the meter reading
            const readingData = {
                month: new Date().toISOString().split('T')[0],
                waterValue: parseFloat(reading.waterValue),
                electricityValue: parseFloat(reading.electricityValue),
            };
            const readingRes = await axios.post(`${apiUrl}/rooms/${room.roomId}/readings`, readingData, config);
            const newReadingId = readingRes.data.data.id;
            toast.success("Meter reading submitted.");

            // Step 2: Generate the bill from the new reading
            const billData = {
                waterRate: parseFloat(rates.waterRate),
                electricityRate: parseFloat(rates.electricityRate),
                deadline: deadline,
            };
            await axios.post(`${apiUrl}/billing/generate-from-reading/${newReadingId}`, billData, config);
            
            toast.success("Utility bill generated and sent successfully!");
            onBillGenerated(); // Refresh parent component
            setReading({ waterValue: '', electricityValue: '' });

        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm font-medium text-gray-700">New Water Index</label>
                <input type="number" value={reading.waterValue} onChange={e => setReading({...reading, waterValue: e.target.value})} placeholder="e.g., 210.5" className="mt-1 w-full border-gray-300 rounded-md p-2" required/>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700">New Electricity Index</label>
                <input type="number" value={reading.electricityValue} onChange={e => setReading({...reading, electricityValue: e.target.value})} placeholder="e.g., 2800.7" className="mt-1 w-full border-gray-300 rounded-md p-2" required/>
            </div>
            <hr/>
            <div>
                <label className="text-sm font-medium text-gray-700">Water Rate (XAF per unit)</label>
                <input type="number" value={rates.waterRate} onChange={e => setRates({...rates, waterRate: e.target.value})} className="mt-1 w-full border-gray-300 rounded-md p-2" required/>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700">Electricity Rate (XAF per unit)</label>
                <input type="number" value={rates.electricityRate} onChange={e => setRates({...rates, electricityRate: e.target.value})} className="mt-1 w-full border-gray-300 rounded-md p-2" required/>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700">Payment Deadline</label>
                <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md p-2 bg-white" required/>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 disabled:bg-orange-300">
                {isLoading ? 'Generating...' : 'Generate & Send Bill'}
            </button>
        </form>
    );
};


// --- Main Page Component (and other sub-components) ---
// ... (InfoCard, DetailItem, RentHistoryRow, IssueItem components remain the same) ...
const InfoCard = ({ icon: Icon, label, value, color }) => ( <div className={`bg-white p-4 rounded-lg shadow border-l-4 border-${color}-500`}> <p className="text-xs text-gray-500 uppercase">{label}</p> <p className="text-xl font-bold text-gray-800">{value}</p> </div> );
const DetailItem = ({ label, value }) => ( <div> <p className="text-sm text-gray-500">{label}</p> <p className="font-medium text-gray-800">{value || 'N/A'}</p> </div> );
const RentHistoryRow = ({ month, status }) => ( <div className="flex justify-between items-center py-3 border-b"> <p className="text-gray-700">{month}</p> <span className={`px-3 py-1 text-xs font-semibold rounded-full ${ status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }`}> {status} </span> </div> );
const IssueItem = ({ issue }) => ( <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border"> <div> <p className="font-semibold text-gray-800">{issue.description}</p> <p className="text-xs text-gray-500">Reported: {new Date(issue.createdAt).toLocaleDateString()}</p> </div> <span className={`px-2 py-0.5 text-xs rounded-full ${ issue.status === 'open' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800' }`}> {issue.status} </span> </div> );


export default function RoomDetailsPage() {
    const { roomId } = useParams();
    const { user } = useAuth();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchRoomDetails = async () => {
        if (!user?.token || !roomId) return;
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const response = await axios.get(`${apiUrl}/rooms/${roomId}/details`, config);
            setDetails(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch room details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoomDetails();
    }, [user, roomId]);

    if (loading) return <div className="p-8">Loading Room Details...</div>;
    if (!details) return <div className="p-8">Could not load details for this room.</div>;

    const { room, minicite, tenant, rentHistory, issues } = details;
    const isOccupied = room.status === 'occupied';

    return (
        <div>
            {/* ... (Header and InfoCards remain the same) ... */}
            <div className="flex justify-between items-center mb-6"> <h1 className="text-3xl font-bold text-gray-800">Apartments & Rooms · Room {roomId}</h1> <div className="flex gap-x-3"> <button disabled={!isOccupied} className="bg-red-100 text-red-700 font-bold py-2 px-4 rounded-lg hover:bg-red-200 disabled:bg-gray-200 disabled:text-gray-400"> Remove Tenant </button> <Drawer open={isModalOpen} onOpenChange={setIsModalOpen} title="Add and Assign a New Tenant" description={`To Room ${roomId} in ${minicite.name}`} button={ <button disabled={isOccupied} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400"> Add new tenant </button> }> <AddTenantForm roomId={roomId} onFormSubmit={fetchRoomDetails} /> </Drawer> </div> </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"> <InfoCard icon={Home} label="Monthly Rent" value={new Intl.NumberFormat('fr-CM').format(room.annualRent / 12)} color="blue" /> <InfoCard icon={Zap} label="Utility Bills" value={isOccupied ? "14,750 XAF" : "N/A"} color="yellow" /> <InfoCard icon={Calendar} label="Next Payment" value={isOccupied ? "Feb 1, 2026" : "N/A"} color="red" /> <InfoCard icon={AlertTriangle} label="Open Issues" value={isOccupied ? issues.filter(i => i.status === 'open').length : 0} color="orange" /> </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* ... (Room Details and Rent History sections remain the same) ... */}
                    <div className="bg-white p-6 rounded-lg shadow"> <h3 className="text-xl font-bold mb-4">Room Details</h3> <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4"> <DetailItem label="Room ID" value={room.roomId} /> <DetailItem label="Minicite" value={minicite.name} /> <DetailItem label="Entry Date" value={isOccupied && details.session ? new Date(details.session.entryDate).toLocaleDateString() : 'N/A'} /> <DetailItem label="Annual Rent" value={new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(room.annualRent)} /> </div> </div>
                    {isOccupied && rentHistory.length > 0 && ( <div className="bg-white p-6 rounded-lg shadow"> <h3 className="text-xl font-bold mb-2">Rent History</h3> {rentHistory.map(rent => <RentHistoryRow key={rent.paymentId} month={new Date(rent.paymentDate).toLocaleString('default', { month: 'long', year: 'numeric' })} status="Paid" />)} </div> )}
                </div>
                <div className="space-y-8">
                    {/* ... (Tenant Info section remains the same) ... */}
                    <div className="bg-white p-6 rounded-lg shadow"> <h3 className="text-xl font-bold mb-4">{isOccupied ? "Tenant" : "Room Status"}</h3> {isOccupied && tenant ? ( <div className="space-y-3"> <DetailItem label="Full Name" value={tenant.fullName} /> </div> ) : ( <p className="text-gray-600">This room is currently vacant.</p> )} </div>
                    {isOccupied && (
                        <>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-xl font-bold mb-4">Utility Bills</h3>
                                {/* The new, powerful form goes here */}
                                <UtilityBillForm room={room} onBillGenerated={fetchRoomDetails} />
                            </div>
                            {issues.length > 0 && (
                                <div className="bg-white p-6 rounded-lg shadow">
                                    <h3 className="text-xl font-bold mb-4">Issues</h3>
                                    <div className="space-y-3">
                                        {issues.map(issue => <IssueItem key={issue.issueId} issue={issue} />)}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
