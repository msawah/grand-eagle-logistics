'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { shipmentsAPI, driversAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ShipperDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [shipments, setShipments] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    pickupAddress: '',
    dropoffAddress: '',
    pickupLat: '',
    pickupLng: '',
    dropoffLat: '',
    dropoffLng: '',
    price: '',
  });

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

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await shipmentsAPI.create({
        ...formData,
        pickupLat: parseFloat(formData.pickupLat),
        pickupLng: parseFloat(formData.pickupLng),
        dropoffLat: parseFloat(formData.dropoffLat),
        dropoffLng: parseFloat(formData.dropoffLng),
        price: parseFloat(formData.price),
      });
      setShowCreateForm(false);
      setFormData({
        pickupAddress: '',
        dropoffAddress: '',
        pickupLat: '',
        pickupLng: '',
        dropoffLat: '',
        dropoffLng: '',
        price: '',
      });
      loadData();
    } catch (error) {
      console.error('Error creating shipment:', error);
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
              <div className="text-3xl">🦅</div>
              <div>
                <h1 className="text-lg font-bold text-white">Grand Eagle Logistics</h1>
                <p className="text-xs text-slate-400">Shipper Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="text-3xl mb-2">📦</div>
            <div className="text-2xl font-bold text-white">{shipments.length}</div>
            <div className="text-slate-400">Total Shipments</div>
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
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-2xl font-bold text-white">
              {shipments.filter((s) => s.status === 'created').length}
            </div>
            <div className="text-slate-400">Pending</div>
          </div>
        </div>

        {/* Create Shipment Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            {showCreateForm ? 'Cancel' : '+ Create New Shipment'}
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Create New Shipment</h3>
            <form onSubmit={handleCreateShipment} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Pickup Address
                  </label>
                  <input
                    type="text"
                    value={formData.pickupAddress}
                    onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Dropoff Address
                  </label>
                  <input
                    type="text"
                    value={formData.dropoffAddress}
                    onChange={(e) => setFormData({ ...formData, dropoffAddress: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Pickup Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.pickupLat}
                    onChange={(e) => setFormData({ ...formData, pickupLat: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Pickup Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.pickupLng}
                    onChange={(e) => setFormData({ ...formData, pickupLng: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Dropoff Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.dropoffLat}
                    onChange={(e) => setFormData({ ...formData, dropoffLat: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Dropoff Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.dropoffLng}
                    onChange={(e) => setFormData({ ...formData, dropoffLng: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
              >
                Create Shipment
              </button>
            </form>
          </div>
        )}

        {/* Shipments List */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h3 className="text-xl font-bold text-white">My Shipments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                    From → To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {shipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-slate-700/50">
                    <td className="px-6 py-4 text-sm text-slate-300">
                      <div>{shipment.pickupAddress}</div>
                      <div className="text-slate-500">→ {shipment.dropoffAddress}</div>
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
                            : 'bg-slate-500/20 text-slate-400'
                        }`}
                      >
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {shipment.driver?.user?.name || (
                        <select
                          onChange={(e) => handleAssignDriver(shipment.id, e.target.value)}
                          className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-xs"
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
                    <td className="px-6 py-4 text-sm text-slate-300">
                      ${shipment.price.toFixed(2)}
                    </td>
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
