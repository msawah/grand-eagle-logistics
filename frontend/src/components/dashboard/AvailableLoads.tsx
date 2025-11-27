'use client';

import { useState } from 'react';

interface Load {
  id: string;
  loadId: string;
  pickup: string;
  dropoff: string;
  revenue: number;
  status: 'posted' | 'assigned' | 'en-route' | 'delivered';
}

interface AvailableLoadsProps {
  loads: Load[];
  onLoadClick?: (loadId: string) => void;
}

export default function AvailableLoads({ loads, onLoadClick }: AvailableLoadsProps) {
  const [activeTab, setActiveTab] = useState<Load['status']>('posted');

  const tabs: { label: string; value: Load['status'] }[] = [
    { label: 'Posted', value: 'posted' },
    { label: 'Assigned', value: 'assigned' },
    { label: 'En-route', value: 'en-route' },
    { label: 'Delivered', value: 'delivered' },
  ];

  const filteredLoads = loads.filter((load) => load.status === activeTab);
  const resultsCount = filteredLoads.length;

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Available loads</h2>
        <span className="text-sm text-slate-400">{resultsCount} results</span>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-4 flex space-x-2 border-b border-slate-700/50">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
              activeTab === tab.value
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Load ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Pickup
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Drop-off
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Revenue
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filteredLoads.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No {activeTab} loads at the moment
                </td>
              </tr>
            ) : (
              filteredLoads.map((load) => (
                <tr
                  key={load.id}
                  onClick={() => onLoadClick?.(load.id)}
                  className="hover:bg-slate-700/30 cursor-pointer transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {load.loadId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {load.pickup}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {load.dropoff}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-400">
                    ${load.revenue.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
