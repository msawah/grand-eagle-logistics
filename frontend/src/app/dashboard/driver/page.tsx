'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { shipmentsAPI, driversAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/dashboard/Sidebar';
import EarningsCard from '@/components/dashboard/EarningsCard';
import AIChat from '@/components/dashboard/AIChat';
import ShipmentHistory from '@/components/dashboard/ShipmentHistory';
import ActiveLoadCard from '@/components/dashboard/ActiveLoadCard';
import { BellIcon, UserCircleIcon, MapPinIcon } from '@heroicons/react/24/outline';

// Cargar mapa dinámicamente (solo en cliente)
const ShipmentMap = dynamic(
  () => import('@/components/Map').then((mod) => mod.ShipmentMap),
  { ssr: false, loading: () => <div className="h-[400px] bg-slate-800 animate-pulse rounded-2xl"></div> }
);

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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const activeLoads = shipments.filter((s) => ['assigned', 'en_route'].includes(s.status));
  const completedLoads = shipments.filter((s) => s.status === 'delivered');

  const totalEarnings = completedLoads.reduce((sum, s) => sum + s.price, 0);
  const thisWeekEarnings = completedLoads.slice(0, 3).reduce((sum, s) => sum + s.price, 0);
  const pendingEarnings = activeLoads.reduce((sum, s) => sum + s.price, 0);

  const historyEvents = shipments
    .slice(0, 5)
    .map((s) => ({
      id: s.id,
      title:
        s.status === 'delivered'
          ? `Delivered to ${s.dropoffAddress}`
          : s.status === 'en_route'
          ? `En-route to ${s.dropoffAddress}`
          : s.status === 'assigned'
          ? `Assigned: ${s.pickupAddress} → ${s.dropoffAddress}`
          : `New load available`,
      description: `$${s.price.toFixed(2)}`,
      timestamp: new Date(s.createdAt),
      type:
        s.status === 'delivered'
          ? 'delivered'
          : s.status === 'en_route'
          ? 'pickup'
          : s.status === 'assigned'
          ? 'assigned'
          : 'created',
    })) as any;

  const currentLoad = activeLoads[0];

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0">
        <Sidebar role="driver" userName={user?.name || 'User'} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Driver Dashboard</h1>
              <p className="text-sm text-slate-400">Welcome back, {user?.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* GPS Toggle */}
              <button
                onClick={toggleGPSTracking}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition ${
                  gpsEnabled
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                <MapPinIcon className="h-5 w-5" />
                <span>{gpsEnabled ? 'GPS Active' : 'Enable GPS'}</span>
              </button>

              <button className="relative p-2 text-slate-400 hover:text-white transition">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-3">
                <UserCircleIcon className="h-10 w-10 text-slate-400" />
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="p-8 space-y-6">
          {/* GPS Warning */}
          {!gpsEnabled && (
            <div className="bg-yellow-500/10 border border-yellow-500 rounded-xl p-4 flex items-center space-x-3">
              <div className="text-3xl">⚠️</div>
              <div>
                <div className="text-yellow-400 font-semibold">GPS Tracking Disabled</div>
                <div className="text-yellow-500 text-sm">
                  Enable GPS tracking to share your location with shippers and get better load assignments
                </div>
              </div>
            </div>
          )}

          {/* Row 1: Earnings + Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <EarningsCard
                totalEarnings={totalEarnings}
                thisWeek={thisWeekEarnings}
                pending={pendingEarnings}
              />
            </div>

            <div className="lg:col-span-3 grid grid-cols-3 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="text-3xl mb-2">📦</div>
                <div className="text-3xl font-bold text-white">{shipments.length}</div>
                <div className="text-slate-400 text-sm">Total Loads</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="text-3xl mb-2">🚛</div>
                <div className="text-3xl font-bold text-white">{activeLoads.length}</div>
                <div className="text-slate-400 text-sm">Active Loads</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-3xl font-bold text-white">{completedLoads.length}</div>
                <div className="text-slate-400 text-sm">Delivered</div>
              </div>
            </div>
          </div>

          {/* Row 2: Current Route Map + AI Chat */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Current Route */}
            <div className="lg:col-span-7">
              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Current Route</h2>
                  {currentLoad && (
                    <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold text-white">
                      In Progress
                    </span>
                  )}
                </div>
                <div className="rounded-xl overflow-hidden">
                  {currentLoad ? (
                    <ShipmentMap
                      pickup={{
                        lat: currentLoad.pickupLat,
                        lng: currentLoad.pickupLng,
                        address: currentLoad.pickupAddress,
                      }}
                      dropoff={{
                        lat: currentLoad.dropoffLat,
                        lng: currentLoad.dropoffLng,
                        address: currentLoad.dropoffAddress,
                      }}
                      className="h-[450px]"
                    />
                  ) : (
                    <div className="h-[450px] bg-slate-700/30 rounded-xl flex items-center justify-center text-slate-500">
                      No active route. Accept a load to get started!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AI Assistant + History */}
            <div className="lg:col-span-5 space-y-6">
              <div className="h-[250px]">
                <AIChat />
              </div>
              <ShipmentHistory events={historyEvents} />
            </div>
          </div>

          {/* Row 3: Active Loads */}
          {activeLoads.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Active Loads</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeLoads.map((load) => (
                  <ActiveLoadCard
                    key={load.id}
                    load={{
                      id: load.id,
                      loadId: `#${load.id.slice(0, 6)}`,
                      pickup: load.pickupAddress,
                      dropoff: load.dropoffAddress,
                      revenue: load.price,
                      status: load.status,
                      distance: '234 mi',
                      eta: '4h 30m',
                    }}
                    onStartDelivery={(id) => handleUpdateStatus(id, 'en_route')}
                    onUploadPOD={(id) => router.push(`/dashboard/driver/pod/${id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Available Loads */}
          {availableShipments.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Available Loads</h2>
                <span className="text-sm text-slate-400">{availableShipments.length} loads available</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {availableShipments.slice(0, 6).map((load) => (
                  <div
                    key={load.id}
                    className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                        Available
                      </span>
                      <div className="text-xl font-bold text-green-400">${load.price.toLocaleString()}</div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">From</div>
                        <div className="text-white text-sm font-medium">{load.pickupAddress}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">To</div>
                        <div className="text-white text-sm font-medium">{load.dropoffAddress}</div>
                      </div>
                    </div>
                    <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition text-sm">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
