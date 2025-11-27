'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { shipmentsAPI, driversAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/dashboard/Sidebar';
import { StatsGrid } from '@/components/dashboard/StatisticsCard';
import AIChat from '@/components/dashboard/AIChat';
import AvailableLoads from '@/components/dashboard/AvailableLoads';
import ShipmentHistory from '@/components/dashboard/ShipmentHistory';
import SecurityRoles from '@/components/dashboard/SecurityRoles';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

// Cargar mapa dinámicamente (solo en cliente)
const DriversMap = dynamic(
  () => import('@/components/Map').then((mod) => mod.DriversMap),
  { ssr: false, loading: () => <div className="h-[400px] bg-slate-800 animate-pulse rounded-2xl"></div> }
);

export default function ModernShipperDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [shipments, setShipments] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [driverLocations, setDriverLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user && user.role !== 'shipper') {
      router.push('/');
    } else if (user) {
      loadData();
    }
  }, [user, authLoading, router]);

  const loadData = async () => {
    try {
      const [shipmentsRes, driversRes, locationsRes] = await Promise.all([
        shipmentsAPI.getAll(),
        driversAPI.getAll(),
        driversAPI.getLocations().catch(() => ({ data: [] })),
      ]);

      setShipments(shipmentsRes.data);
      setDrivers(driversRes.data);
      setDriverLocations(locationsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Preparar datos para componentes
  const stats = {
    totalRevenue: shipments.reduce((sum, s) => sum + s.price, 0),
    revenueChange: '+14.4%',
    loadsInTransit: shipments.filter((s) => s.status === 'en_route').length,
    transitChange: '+2%',
    totalLoads: shipments.length,
    deliveredLoads: shipments.filter((s) => s.status === 'delivered').length,
  };

  const loads = shipments.map((s) => ({
    id: s.id,
    loadId: `#${s.id.slice(0, 6)}`,
    pickup: s.pickupAddress,
    dropoff: s.dropoffAddress,
    revenue: s.price,
    status: s.status === 'created' ? 'posted' : s.status === 'assigned' ? 'assigned' : s.status === 'en_route' ? 'en-route' : 'delivered',
  }));

  const historyEvents = shipments
    .slice(0, 4)
    .map((s) => ({
      id: s.id,
      title: s.status === 'delivered' ? 'Lead delivered to Columbus, OH' : s.status === 'assigned' ? 'Driver-John Baker assigned' : s.status === 'en_route' ? 'Picked up shipment in Chicago-IL' : 'New load created',
      description: `${s.pickupAddress} → ${s.dropoffAddress}`,
      timestamp: new Date(s.createdAt),
      type: s.status === 'delivered' ? 'delivered' : s.status === 'assigned' ? 'assigned' : s.status === 'en_route' ? 'pickup' : 'created',
    })) as any;

  const mappedDrivers = driverLocations
    .filter((loc) => loc.latitude && loc.longitude)
    .map((loc) => ({
      id: loc.driverId,
      name: loc.driver?.user?.name || 'Driver',
      lat: loc.latitude,
      lng: loc.longitude,
    }));

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0">
        <Sidebar role="shipper" userName={user?.name || 'User'} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-sm text-slate-400">Welcome back, {user?.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
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
          {/* Row 1: Map + Stats + AI Chat */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Real-time Map */}
            <div className="lg:col-span-6">
              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Real-time map</h2>
                  <div className="bg-white px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-slate-900">6h46m</span>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden">
                  {mappedDrivers.length > 0 ? (
                    <DriversMap drivers={mappedDrivers} className="h-[400px]" />
                  ) : (
                    <div className="h-[400px] bg-slate-700/30 rounded-xl flex items-center justify-center text-slate-500">
                      No active drivers with GPS enabled
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats + AI Chat */}
            <div className="lg:col-span-6 space-y-6">
              {/* Statistics */}
              <StatsGrid stats={stats} />

              {/* AI Chat */}
              <div className="h-[300px]">
                <AIChat />
              </div>
            </div>
          </div>

          {/* Row 2: Available Loads */}
          <div>
            <AvailableLoads loads={loads} onLoadClick={(id) => router.push(`/dashboard/shipper/shipments/${id}`)} />
          </div>

          {/* Row 3: Shipment History + Security & Roles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ShipmentHistory events={historyEvents} />
            <SecurityRoles />
          </div>
        </div>
      </main>
    </div>
  );
}
