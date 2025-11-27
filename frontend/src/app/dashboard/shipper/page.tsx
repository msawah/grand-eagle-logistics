'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { shipmentsAPI, driversAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ShipperDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [shipments, setShipments] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

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
      const [shipmentsRes, driversRes] = await Promise.all([
        shipmentsAPI.getAll(),
        driversAPI.getAll(),
      ]);
      setShipments(shipmentsRes.data);
      setDrivers(driversRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDriver = async (shipmentId: string, driverId: string) => {
    try {
      await shipmentsAPI.assignDriver(shipmentId, driverId);
      loadData();
    } catch (error) {
      console.error('Error assigning driver:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0d1829] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1829] text-white">
      {/* Header */}
      <header className="bg-[#1a2942] border-b border-[#2d3f5f]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold flex items-center space-x-3">
              <span>🦅</span>
              <span>Grand Eagle Logistics - Shipper</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/shipper/ultra"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                Ultra Dashboard
              </Link>
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
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1a2942] p-6 rounded-lg border border-[#2d3f5f]">
            <div className="text-3xl mb-2">📦</div>
            <div className="text-2xl font-bold">{shipments.length}</div>
            <div className="text-gray-400">Total Shipments</div>
          </div>
          <div className="bg-[#1a2942] p-6 rounded-lg border border-[#2d3f5f]">
            <div className="text-3xl mb-2">🚛</div>
            <div className="text-2xl font-bold">
              {shipments.filter((s) => s.status === 'en_route').length}
            </div>
            <div className="text-gray-400">In Transit</div>
          </div>
          <div className="bg-[#1a2942] p-6 rounded-lg border border-[#2d3f5f]">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold">
              {shipments.filter((s) => s.status === 'delivered').length}
            </div>
            <div className="text-gray-400">Delivered</div>
          </div>
          <div className="bg-[#1a2942] p-6 rounded-lg border border-[#2d3f5f]">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-2xl font-bold">
              {shipments.filter((s) => s.status === 'created').length}
            </div>
            <div className="text-gray-400">Pending</div>
          </div>
        </div>

        {/* Create Shipment Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg transition"
          >
            {showCreateForm ? 'Cancel' : '+ Create New Shipment'}
          </button>
        </div>

        {/* My Shipments Table */}
        <div className="bg-[#1a2942] rounded-lg border border-[#2d3f5f] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#2d3f5f]">
            <h3 className="text-xl font-bold">My Shipments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0d1829]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    FROM → TO
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    STATUS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    DRIVER
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    PRICE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d3f5f]">
                {shipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-[#0d1829]/50">
                    <td className="px-6 py-4 text-sm">
                      <div>{shipment.pickupAddress}</div>
                      <div className="text-gray-500">→ {shipment.dropoffAddress}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          shipment.status === 'delivered'
                            ? 'bg-green-500/20 text-green-400'
                            : shipment.status === 'en_route'
                            ? 'bg-blue-500/20 text-blue-400'
                            : shipment.status === 'assigned'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {shipment.driver?.user?.name || (
                        <select
                          onChange={(e) => handleAssignDriver(shipment.id, e.target.value)}
                          className="px-2 py-1 bg-[#0d1829] border border-[#2d3f5f] rounded text-white text-xs"
                        >
                          <option value="">Assign Driver</option>
                          {drivers.map((driver) => (
                            <option key={driver.id} value={driver.id}>
                              {driver.user.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">${shipment.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-blue-400 hover:text-blue-300">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
