'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { shipmentsAPI, driversAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function DriverDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [shipments, setShipments] = useState<any[]>([]);
  const [availableShipments, setAvailableShipments] = useState<any[]>([]);
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
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [gpsEnabled, user]);

  const loadData = async () => {
    try {
      const [myShipmentsRes, availableRes] = await Promise.all([
        shipmentsAPI.getAll(),
        shipmentsAPI.getAvailable(),
      ]);
      setShipments(myShipmentsRes.data);
      setAvailableShipments(availableRes.data);
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
            console.log('GPS location updated');
          } catch (error) {
            console.error('Error updating GPS:', error);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
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

  const handleUpdateStatus = async (shipmentId: string, status: string) => {
    try {
      await shipmentsAPI.updateStatus(shipmentId, status);
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🚛</div>
              <div>
                <h1 className="text-lg font-bold text-white">Grand Eagle Logistics</h1>
                <p className="text-xs text-slate-400">Driver Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleGPSTracking}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  gpsEnabled
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                {gpsEnabled ? '📍 GPS Active' : '📍 Enable GPS'}
              </button>
              <span className="text-slate-300">{user?.name}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="text-3xl mb-2">📦</div>
            <div className="text-2xl font-bold text-white">{shipments.length}</div>
            <div className="text-slate-400">My Shipments</div>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="text-3xl mb-2">🚛</div>
            <div className="text-2xl font-bold text-white">
              {shipments.filter((s) => s.status === 'en_route').length}
            </div>
            <div className="text-slate-400">In Transit</div>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-white">
              {shipments.filter((s) => s.status === 'delivered').length}
            </div>
            <div className="text-slate-400">Delivered</div>
          </div>
        </div>

        {/* GPS Warning */}
        {!gpsEnabled && (
          <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <div className="text-yellow-400 font-semibold">GPS Tracking Disabled</div>
                <div className="text-yellow-500 text-sm">
                  Enable GPS tracking to share your location with shippers
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Active Shipments */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-slate-700">
            <h3 className="text-xl font-bold text-white">My Active Shipments</h3>
          </div>
          {shipments.filter((s) => ['assigned', 'en_route'].includes(s.status)).length === 0 ? (
            <div className="px-6 py-8 text-center text-slate-400">
              No active shipments. Check available shipments below.
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {shipments
                .filter((s) => ['assigned', 'en_route'].includes(s.status))
                .map((shipment) => (
                  <div key={shipment.id} className="p-6 hover:bg-slate-700/50">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="text-sm text-slate-400 mb-1">Shipper</div>
                        <div className="text-white font-semibold">
                          {shipment.shipper?.user?.name}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded ${
                          shipment.status === 'en_route'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {shipment.status}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-slate-400 mb-1">📍 Pickup</div>
                        <div className="text-white text-sm">{shipment.pickupAddress}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400 mb-1">🎯 Dropoff</div>
                        <div className="text-white text-sm">{shipment.dropoffAddress}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-green-400 font-bold text-lg">
                        ${shipment.price.toFixed(2)}
                      </div>
                      <div className="flex space-x-2">
                        {shipment.status === 'assigned' && (
                          <button
                            onClick={() => handleUpdateStatus(shipment.id, 'en_route')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
                          >
                            Start Delivery
                          </button>
                        )}
                        {shipment.status === 'en_route' && (
                          <button
                            onClick={() =>
                              router.push(`/dashboard/driver/pod/${shipment.id}`)
                            }
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition"
                          >
                            Upload POD
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Available Shipments */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h3 className="text-xl font-bold text-white">Available Shipments</h3>
          </div>
          {availableShipments.length === 0 ? (
            <div className="px-6 py-8 text-center text-slate-400">
              No available shipments at the moment.
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {availableShipments.map((shipment) => (
                <div key={shipment.id} className="p-6 hover:bg-slate-700/50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="text-sm text-slate-400 mb-1">Shipper</div>
                      <div className="text-white font-semibold">
                        {shipment.shipper?.user?.name}
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-slate-400 mb-1">📍 Pickup</div>
                      <div className="text-white text-sm">{shipment.pickupAddress}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 mb-1">🎯 Dropoff</div>
                      <div className="text-white text-sm">{shipment.dropoffAddress}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-green-400 font-bold text-lg">
                      ${shipment.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-400">
                      Contact shipper to accept this load
                    </div>
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
