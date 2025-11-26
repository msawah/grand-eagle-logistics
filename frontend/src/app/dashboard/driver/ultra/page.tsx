'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import axios from 'axios';

const Map = dynamic(() => import('../../../../components/Map'), { ssr: false });

export default function UltraDriverDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (!user.driver?.id) {
        router.push('/login');
        return;
      }

      const response = await axios.get(
        `http://localhost:3001/api/v1/analytics/driver/${user.driver.id}`,
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

  return (
    <div className="min-h-screen bg-[#1a2332] text-white">
      {/* Header */}
      <header className="bg-[#0f1824] border-b border-[#2a3f5f] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-[#4ade80]">🚚 Driver Dashboard</div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-[#1a2332] rounded-lg transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4ade80] to-[#22c55e] flex items-center justify-center cursor-pointer">
              <span className="text-sm font-bold">D</span>
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
              { icon: '📦', label: 'Available Loads' },
              { icon: '🚚', label: 'My Deliveries' },
              { icon: '🗺️', label: 'Navigation' },
              { icon: '💰', label: 'Earnings' },
              { icon: '⭐', label: 'Reviews' },
              { icon: '📄', label: 'Documents' },
              { icon: '💳', label: 'Wallet' },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  item.active
                    ? 'bg-[#4ade80] text-black font-bold'
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
          <div className="grid grid-cols-12 gap-6">
            {/* Earnings Overview */}
            <div className="col-span-4 bg-[#0f1824] rounded-lg border border-[#2a3f5f] p-6">
              <h2 className="text-lg font-bold mb-4">💰 Earnings</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold text-[#4ade80]">
                    ${stats?.totalEarnings?.toLocaleString() || '12,450'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    ${stats?.pendingEarnings?.toLocaleString() || '1,200'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Available Balance</p>
                  <p className="text-2xl font-bold">
                    ${stats?.walletBalance?.toLocaleString() || '5,340'}
                  </p>
                </div>
                <button className="w-full bg-[#4ade80] text-black font-bold py-3 rounded-lg hover:bg-[#22c55e] transition">
                  Withdraw Funds
                </button>
              </div>
            </div>

            {/* Active Delivery */}
            <div className="col-span-8 bg-[#0f1824] rounded-lg border border-[#2a3f5f] p-6">
              <h2 className="text-lg font-bold mb-4">🚚 Active Delivery</h2>
              {stats?.activeShipment ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Shipment ID</p>
                      <p className="font-mono text-lg">#{stats.activeShipment.id.slice(0, 8)}</p>
                    </div>
                    <div className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-bold">
                      IN PROGRESS
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Pickup</p>
                      <p className="font-medium">{stats.activeShipment.pickupAddress}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Drop-off</p>
                      <p className="font-medium">{stats.activeShipment.dropoffAddress}</p>
                    </div>
                  </div>

                  <div className="h-64 bg-[#1a2332] rounded-lg overflow-hidden">
                    <Map
                      markers={[
                        {
                          position: [stats.activeShipment.pickupLat, stats.activeShipment.pickupLng] as [number, number],
                          popup: 'Pickup',
                        },
                        {
                          position: [stats.activeShipment.dropoffLat, stats.activeShipment.dropoffLng] as [number, number],
                          popup: 'Drop-off',
                        },
                      ]}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button className="flex-1 bg-[#3b9eff] text-white font-bold py-3 rounded-lg hover:bg-[#2563eb] transition">
                      Update Status
                    </button>
                    <button className="flex-1 bg-[#f59e0b] text-white font-bold py-3 rounded-lg hover:bg-[#d97706] transition">
                      Upload POD
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-400">No active delivery</p>
                  <button className="mt-4 bg-[#4ade80] text-black font-bold px-6 py-3 rounded-lg hover:bg-[#22c55e] transition">
                    Browse Available Loads
                  </button>
                </div>
              )}
            </div>

            {/* Performance Stats */}
            <div className="col-span-4 bg-[#0f1824] rounded-lg border border-[#2a3f5f] p-6">
              <h2 className="text-lg font-bold mb-4">📊 Performance</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Deliveries</p>
                  <p className="text-3xl font-bold">{stats?.totalDeliveries || 143}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Rating</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-yellow-400">
                      {stats?.driver?.rating?.toFixed(1) || '4.8'}
                    </p>
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">On-Time Delivery</p>
                  <p className="text-2xl font-bold text-[#4ade80]">96%</p>
                </div>
              </div>
            </div>

            {/* Available Loads */}
            <div className="col-span-8 bg-[#0f1824] rounded-lg border border-[#2a3f5f] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">📦 Available Loads</h2>
                <span className="text-gray-400">{stats?.availableLoads?.length || 0} loads</span>
              </div>

              <div className="space-y-3">
                {stats?.availableLoads?.slice(0, 5).map((load: any) => (
                  <div
                    key={load.id}
                    className="bg-[#1a2332] border border-[#2a3f5f] rounded-lg p-4 hover:border-[#4ade80] transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-gray-400">#{load.id.slice(0, 8)}</span>
                      <span className="text-[#4ade80] font-bold text-lg">
                        ${load.driverPayout || (load.price * 0.9).toFixed(0)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Pickup</p>
                        <p className="font-medium">{load.pickupAddress?.split(',')[0]}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Drop-off</p>
                        <p className="font-medium">{load.dropoffAddress?.split(',')[0]}</p>
                      </div>
                    </div>
                    <button className="w-full mt-3 bg-[#4ade80] text-black font-bold py-2 rounded-lg hover:bg-[#22c55e] transition">
                      Accept Load
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="col-span-4 bg-[#0f1824] rounded-lg border border-[#2a3f5f] p-6">
              <h2 className="text-lg font-bold mb-4">⭐ Recent Reviews</h2>
              <div className="space-y-4">
                {stats?.recentReviews?.slice(0, 3).map((review: any) => (
                  <div key={review.id} className="border-b border-[#2a3f5f] pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(review.rating)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{review.comment || 'Great service!'}</p>
                  </div>
                )) || (
                  <p className="text-gray-400 text-center py-4">No reviews yet</p>
                )}
              </div>
            </div>

            {/* Penalties */}
            {stats?.penalties && stats.penalties.length > 0 && (
              <div className="col-span-12 bg-[#0f1824] border-l-4 border-red-500 rounded-lg p-6">
                <h2 className="text-lg font-bold mb-4 text-red-400">⚠️ Pending Penalties</h2>
                <div className="space-y-3">
                  {stats.penalties.map((penalty: any) => (
                    <div key={penalty.id} className="flex items-center justify-between bg-[#1a2332] p-4 rounded-lg">
                      <div>
                        <p className="font-medium">{penalty.reason}</p>
                        <p className="text-sm text-gray-400">{penalty.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-400">${penalty.amount}</p>
                        <button className="mt-2 bg-red-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-red-600 transition">
                          Pay Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
