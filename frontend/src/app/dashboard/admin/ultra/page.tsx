'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function UltraAdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/v1/analytics/admin', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setStats(response.data);
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a2332] flex items-center justify-center">
        <div className="text-white text-xl">Loading Admin Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a2332] text-white">
      {/* Header */}
      <header className="bg-[#0f1824] border-b border-[#2a3f5f] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-red-400">🛡️ Admin Control Center</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              <span className="text-[#4ade80]">●</span> System Online
            </div>
            <button className="p-2 hover:bg-[#1a2332] rounded-lg transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center cursor-pointer">
              <span className="text-sm font-bold">A</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0f1824] border-r border-[#2a3f5f] p-4">
          <nav className="space-y-2">
            {[
              { icon: '📊', label: 'Overview', tab: 'overview', active: true },
              { icon: '👥', label: 'Users', tab: 'users' },
              { icon: '📦', label: 'Shipments', tab: 'shipments' },
              { icon: '💰', label: 'Revenue', tab: 'revenue' },
              { icon: '⚠️', label: 'Penalties', tab: 'penalties' },
              { icon: '📈', label: 'Analytics', tab: 'analytics' },
              { icon: '⚙️', label: 'Settings', tab: 'settings' },
              { icon: '🔒', label: 'Security', tab: 'security' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.tab)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  activeTab === item.tab
                    ? 'bg-red-500 text-white font-bold'
                    : 'text-gray-300 hover:bg-[#1a2332]'
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Platform Stats */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {[
              {
                label: 'Total Users',
                value: stats?.platformStats?.totalUsers || 0,
                change: '+12%',
                icon: '👥',
                color: '#3b9eff',
              },
              {
                label: 'Active Shipments',
                value: stats?.platformStats?.activeShipments || 0,
                change: '+8%',
                icon: '📦',
                color: '#f59e0b',
              },
              {
                label: 'Total Revenue',
                value: `$${(stats?.platformStats?.totalRevenue || 0).toLocaleString()}`,
                change: '+24%',
                icon: '💰',
                color: '#4ade80',
              },
              {
                label: 'Platform Fees',
                value: `$${(stats?.platformStats?.platformFees || 0).toLocaleString()}`,
                change: '+18%',
                icon: '💎',
                color: '#8b5cf6',
              },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#0f1824] rounded-lg border border-[#2a3f5f] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    {stat.icon}
                  </div>
                  <span className="text-[#4ade80] text-sm font-bold">{stat.change}</span>
                </div>
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {activeTab === 'overview' && (
            <>
              {/* Recent Shipments */}
              <div className="bg-[#0f1824] rounded-lg border border-[#2a3f5f] p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Recent Shipments</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-[#2a3f5f]">
                        <th className="pb-3">ID</th>
                        <th className="pb-3">Shipper</th>
                        <th className="pb-3">Driver</th>
                        <th className="pb-3">Route</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Revenue</th>
                        <th className="pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a3f5f]">
                      {stats?.recentShipments?.slice(0, 10).map((shipment: any) => (
                        <tr key={shipment.id} className="hover:bg-[#1a2332]">
                          <td className="py-3 font-mono text-sm">#{shipment.id.slice(0, 8)}</td>
                          <td className="py-3">
                            <div>
                              <p className="font-medium">{shipment.shipper?.user?.name || 'N/A'}</p>
                              <p className="text-xs text-gray-400">{shipment.shipper?.companyName}</p>
                            </div>
                          </td>
                          <td className="py-3">
                            <div>
                              <p className="font-medium">{shipment.driver?.user?.name || 'Unassigned'}</p>
                              {shipment.driver && (
                                <p className="text-xs text-gray-400">⭐ {shipment.driver.rating.toFixed(1)}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="text-sm">
                              <p>{shipment.pickupAddress?.split(',')[0]} →</p>
                              <p>{shipment.dropoffAddress?.split(',')[0]}</p>
                            </div>
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                shipment.status === 'completed'
                                  ? 'bg-green-500 text-black'
                                  : shipment.status === 'in_transit'
                                  ? 'bg-yellow-400 text-black'
                                  : 'bg-blue-500 text-white'
                              }`}
                            >
                              {shipment.status}
                            </span>
                          </td>
                          <td className="py-3 font-bold text-[#4ade80]">
                            ${shipment.price.toLocaleString()}
                          </td>
                          <td className="py-3">
                            <button className="text-[#3b9eff] hover:text-[#2563eb]">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Performers */}
              <div className="grid grid-cols-2 gap-6">
                {/* Top Drivers */}
                <div className="bg-[#0f1824] rounded-lg border border-[#2a3f5f] p-6">
                  <h2 className="text-xl font-bold mb-4">🏆 Top Drivers</h2>
                  <div className="space-y-4">
                    {stats?.topDrivers?.slice(0, 5).map((driver: any, idx: number) => (
                      <div key={driver.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-sm text-black">
                            #{idx + 1}
                          </div>
                          <div>
                            <p className="font-medium">{driver.user?.name}</p>
                            <p className="text-xs text-gray-400">{driver.totalDeliveries} deliveries</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-yellow-400">⭐ {driver.rating.toFixed(1)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Shippers */}
                <div className="bg-[#0f1824] rounded-lg border border-[#2a3f5f] p-6">
                  <h2 className="text-xl font-bold mb-4">🏆 Top Shippers</h2>
                  <div className="space-y-4">
                    {stats?.topShippers?.slice(0, 5).map((shipper: any, idx: number) => (
                      <div key={shipper.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-bold text-sm">
                            #{idx + 1}
                          </div>
                          <div>
                            <p className="font-medium">{shipper.user?.name}</p>
                            <p className="text-xs text-gray-400">{shipper.companyName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#3b9eff]">{shipper.totalShipments} loads</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div className="bg-[#0f1824] rounded-lg border border-[#2a3f5f] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">User Management</h2>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="bg-[#1a2332] border border-[#2a3f5f] rounded-lg px-4 py-2 focus:outline-none focus:border-[#3b9eff]"
                  />
                  <button className="bg-[#4ade80] text-black font-bold px-6 py-2 rounded-lg hover:bg-[#22c55e] transition">
                    Add User
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Total Users', value: stats?.platformStats?.totalUsers || 0 },
                  { label: 'Shippers', value: stats?.platformStats?.totalShippers || 0 },
                  { label: 'Drivers', value: stats?.platformStats?.totalDrivers || 0 },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#1a2332] p-4 rounded-lg border border-[#2a3f5f]">
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>

              <p className="text-gray-400 text-center py-12">
                User management interface - Full CRUD operations available via API
              </p>
            </div>
          )}

          {activeTab === 'penalties' && (
            <div className="bg-[#0f1824] rounded-lg border border-[#2a3f5f] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Penalty Management</h2>
                <button className="bg-red-500 text-white font-bold px-6 py-2 rounded-lg hover:bg-red-600 transition">
                  Apply Penalty
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#1a2332] p-4 rounded-lg border border-red-500">
                  <p className="text-gray-400 text-sm">Pending Penalties</p>
                  <p className="text-2xl font-bold text-red-400">
                    {stats?.platformStats?.pendingPenalties || 0}
                  </p>
                </div>
                <div className="bg-[#1a2332] p-4 rounded-lg border border-[#2a3f5f]">
                  <p className="text-gray-400 text-sm">Total Penalty Amount</p>
                  <p className="text-2xl font-bold">$2,340</p>
                </div>
              </div>

              <p className="text-gray-400 text-center py-12">
                Penalty management system - Track and manage driver penalties
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
