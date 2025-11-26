'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import axios from 'axios';

const Map = dynamic(() => import('../../../../components/Map'), { ssr: false });

interface ShipmentStats {
  totalShipments: number;
  activeShipments: number;
  completedShipments: number;
  totalRevenue: number;
  recentShipments: any[];
  shipmentsInTransit: any[];
  monthlyStats: {
    total: number;
    completed: number;
    inProgress: number;
  };
}

export default function UltraShipperDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<ShipmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posted');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (!user.shipper?.id) {
        router.push('/login');
        return;
      }

      const response = await axios.get(
        `http://localhost:3001/api/v1/analytics/shipper/${user.shipper.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setStats(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a2332] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const getRevenueChange = () => {
    return '+136.4';
  };

  const getInTransitChange = () => {
    return '+2%';
  };

  return (
    <div className="min-h-screen bg-[#1a2332] text-white">
      {/* Header */}
      <header className="bg-[#0f1824] border-b border-[#2a3f5f] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-[#3b9eff]">🦅 Shipper</div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by pickup or drop-off location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#1a2332] border border-[#2a3f5f] rounded-lg px-4 py-2 w-96 focus:outline-none focus:border-[#3b9eff] text-white placeholder-gray-400"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-[#1a2332] rounded-lg transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#1e5a9e] flex items-center justify-center cursor-pointer">
              <span className="text-sm font-bold">U</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0f1824] border-r border-[#2a3f5f] p-4">
          <nav className="space-y-2">
            {[
              { icon: '🏠', label: 'Dashboard', active: true },
              { icon: '🗺️', label: 'Map' },
              { icon: '📦', label: 'Load Management' },
              { icon: '🚚', label: 'Shipments' },
              { icon: '👥', label: 'Drivers' },
              { icon: '⚠️', label: 'Penalties' },
              { icon: '📄', label: 'Documents' },
              { icon: '💰', label: 'Wallet' },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  item.active
                    ? 'bg-[#3b9eff] text-white'
                    : 'text-gray-300 hover:bg-[#1a2332]'
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 p-4 bg-[#1a2332] rounded-lg">
            <img src="/map-icon.svg" alt="Map" className="w-full h-24 object-contain bg-[#0f1824] rounded-lg p-2" />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Real-time Map */}
            <div className="col-span-8 bg-[#0f1824] rounded-lg border border-[#2a3f5f] p-6">
              <h2 className="text-xl font-bold mb-4">Real-time map</h2>
              <div className="relative h-64 bg-[#1a2332] rounded-lg overflow-hidden">
                <Map
                  locations={stats?.shipmentsInTransit?.map((s: any) => ({
                    lat: s.pickupLat,
                    lng: s.pickupLng,
                    label: `Shipment: ${s.id.slice(0, 8)}`,
                    type: 'pickup' as const,
                  })) || []}
                />
                <div className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded-lg font-bold">
                  6h46m
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="col-span-4 bg-[#0f1824] rounded-lg border border-[#2a3f5f] p-6">
              <h2 className="text-xl font-bold mb-4">Statistics</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400 text-sm">Total revenue</span>
                    <span className="text-[#4ade80] text-sm">+1.4 %</span>
                  </div>
                  <div className="text-3xl font-bold">${stats?.totalRevenue?.toLocaleString() || '10,280'}</div>
                  <div className="text-[#4ade80] text-sm">{getRevenueChange()}</div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400 text-sm">in transit</span>
                    <span className="text-[#4ade80] text-sm">+4</span>
                  </div>
                  <div className="text-3xl font-bold">{stats?.activeShipments || 16}</div>
                  <div className="text-[#4ade80] text-sm">{getInTransitChange()}</div>
                </div>
              </div>
            </div>

            {/* AI Assistant */}
            <div className="col-span-4 bg-[#0f1824] rounded-lg border border-[#2a3f5f] p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-[#3b9eff] rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold">AI</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold">AI Assistant</h2>
                  <p className="text-gray-400 text-sm">How can I assist you today?</p>
                </div>
              </div>
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full bg-[#1a2332] border border-[#2a3f5f] rounded-lg px-4 py-3 focus:outline-none focus:border-[#3b9eff] text-white placeholder-gray-400"
              />
            </div>

            {/* Available Loads */}
            <div className="col-span-8 bg-[#0f1824] rounded-lg border border-[#2a3f5f] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Available loads</h2>
                <span className="text-gray-400">{stats?.recentShipments?.length || 5} results</span>
              </div>

              <div className="flex space-x-2 mb-4">
                {['Posted', 'Assigned', 'En-route', 'Delivered'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`px-4 py-2 rounded-lg transition ${
                      activeTab === tab.toLowerCase()
                        ? 'bg-[#3b9eff] text-white'
                        : 'bg-[#1a2332] text-gray-400 hover:bg-[#2a3f5f]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-[#2a3f5f]">
                      <th className="pb-3">Load ID</th>
                      <th className="pb-3">Pickup</th>
                      <th className="pb-3">Drop-off</th>
                      <th className="pb-3">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a3f5f]">
                    {stats?.recentShipments?.slice(0, 4).map((shipment: any) => (
                      <tr key={shipment.id} className="hover:bg-[#1a2332] cursor-pointer">
                        <td className="py-3 font-mono">#{shipment.id.slice(0, 6)}</td>
                        <td className="py-3">{shipment.pickupAddress?.split(',')[0] || 'Houston'}</td>
                        <td className="py-3">{shipment.dropoffAddress?.split(',')[0] || 'Miami, FL'}</td>
                        <td className="py-3 text-[#4ade80]">${shipment.price?.toLocaleString() || '2,440'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shipment History */}
            <div className="col-span-4 bg-[#0f1824] rounded-lg border border-[#2a3f5f] p-6">
              <h2 className="text-xl font-bold mb-4">Shipment history</h2>
              <div className="space-y-4">
                {[
                  { icon: 'E', text: 'Lead delivered to Columbus, OH', time: 'Just now', color: '#3b9eff' },
                  { icon: 'E', text: 'Driver-John Baker assigned', time: '2 min ago', color: '#3b9eff' },
                  { icon: '⚪', text: 'Picked up shipment in Chicago-IL', time: '1 hour ago', color: '#3b9eff' },
                  { icon: '⚪', text: 'New load created', time: '2 hours ago', color: '#6b7280' },
                ].map((event, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: event.color }}
                    >
                      {event.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{event.text}</p>
                      <p className="text-xs text-gray-400">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security & Roles - Bottom */}
            <div className="col-span-12 bg-[#0f1824] rounded-lg border border-[#2a3f5f] p-6">
              <h2 className="text-xl font-bold mb-4">Security & roles</h2>
              <div className="grid grid-cols-4 gap-6">
                {[
                  { icon: '👤', label: 'Driver', color: '#3b9eff' },
                  { icon: '🚢', label: 'Shipper', color: '#3b9eff' },
                  { icon: '👨‍💼', label: 'Admin', color: '#3b9eff' },
                  { icon: '🔍', label: 'Auditor', color: '#3b9eff' },
                ].map((role) => (
                  <div key={role.label} className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${role.color}20`, border: `2px solid ${role.color}` }}
                    >
                      <span className="text-xl">{role.icon}</span>
                    </div>
                    <span className="font-medium">{role.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
