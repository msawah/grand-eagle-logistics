'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { shipmentsAPI, driversAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function DriverDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gpsEnabled, setGpsEnabled] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user && user.role !== 'driver') {
      router.push('/');
    } else if (user) {
      loadData();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (gpsEnabled && user) {
      const interval = setInterval(() => {
        updateGPSLocation();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [gpsEnabled, user]);

  const loadData = async () => {
    try {
      const [myShipmentsRes] = await Promise.all([
        shipmentsAPI.getAll(),
      ]);
      setShipments(myShipmentsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateGPSLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            await driversAPI.updateLocation(
              position.coords.latitude,
              position.coords.longitude
            );
          } catch (error) {
            console.error('Error updating GPS:', error);
          }
        }
      );
    }
  };

  const toggleGPSTracking = () => {
    if (!gpsEnabled) {
      updateGPSLocation();
    }
    setGpsEnabled(!gpsEnabled);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0d1829] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const activeShipments = shipments.filter((s) => ['assigned', 'en_route'].includes(s.status));
  const inTransit = shipments.filter((s) => s.status === 'en_route').length;
  const delivered = shipments.filter((s) => s.status === 'delivered').length;

  return (
    <div className="min-h-screen bg-[#0d1829] text-white">
      {/* Header */}
      <header className="bg-[#1a2942] border-b border-[#2d3f5f]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold flex items-center space-x-3">
              <span>🚛</span>
              <span>Driver Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleGPSTracking}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  gpsEnabled
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {gpsEnabled ? '📍 GPS Active' : '📍 Enable GPS'}
              </button>
              <span className="text-gray-300">{user?.name}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1a2942] rounded-xl p-6 border border-[#2d3f5f]">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">📦</div>
              <div>
                <div className="text-3xl font-bold">{shipments.length}</div>
                <div className="text-gray-400 text-sm">My Shipments</div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a2942] rounded-xl p-6 border border-[#2d3f5f]">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🚚</div>
              <div>
                <div className="text-3xl font-bold">{inTransit}</div>
                <div className="text-gray-400 text-sm">In Transit</div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a2942] rounded-xl p-6 border border-[#2d3f5f]">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">✅</div>
              <div>
                <div className="text-3xl font-bold">{delivered}</div>
                <div className="text-gray-400 text-sm">Delivered</div>
              </div>
            </div>
          </div>
        </div>

        {/* GPS Warning */}
        {!gpsEnabled && (
          <div className="bg-yellow-900/20 border border-yellow-600 rounded-xl p-4 mb-8 flex items-center space-x-4">
            <div className="text-3xl">⚠️</div>
            <div>
              <div className="text-yellow-400 font-semibold">GPS Tracking Disabled</div>
              <div className="text-yellow-500 text-sm">
                Enable GPS tracking to share your location with shippers
              </div>
            </div>
          </div>
        )}

        {/* My Active Shipments */}
        <div className="bg-[#1a2942] rounded-xl p-6 border border-[#2d3f5f] mb-8">
          <h2 className="text-2xl font-bold mb-6">My Active Shipments</h2>

          {activeShipments.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No active shipments. Check available loads to get started!
            </div>
          ) : (
            <div className="space-y-4">
              {activeShipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="bg-[#0d1829] rounded-lg p-6 border border-[#2d3f5f] hover:border-blue-500 transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Shipper</div>
                      <div className="font-bold text-lg">
                        {shipment.shipper?.user?.name || 'Grand Eagle Admin'}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          shipment.status === 'en_route'
                            ? 'bg-blue-600 text-white'
                            : 'bg-yellow-600 text-white'
                        }`}
                      >
                        {shipment.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center space-x-2 text-sm text-gray-400 mb-1">
                        <span>📍</span>
                        <span>Pickup</span>
                      </div>
                      <div className="font-medium">{shipment.pickupAddress}</div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 text-sm text-gray-400 mb-1">
                        <span>🎯</span>
                        <span>Dropoff</span>
                      </div>
                      <div className="font-medium">{shipment.dropoffAddress}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-[#2d3f5f]">
                    <div className="text-2xl font-bold text-green-400">
                      ${shipment.price.toFixed(2)}
                    </div>
                    <button
                      onClick={() => router.push(`/dashboard/driver/pod/${shipment.id}`)}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
                    >
                      Upload POD
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
