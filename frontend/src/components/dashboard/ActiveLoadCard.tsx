'use client';

import { TruckIcon, MapPinIcon, FlagIcon } from '@heroicons/react/24/outline';

interface ActiveLoadCardProps {
  load: {
    id: string;
    loadId: string;
    pickup: string;
    dropoff: string;
    revenue: number;
    status: string;
    distance?: string;
    eta?: string;
  };
  onStartDelivery?: (id: string) => void;
  onUploadPOD?: (id: string) => void;
}

export default function ActiveLoadCard({ load, onStartDelivery, onUploadPOD }: ActiveLoadCardProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 rounded-xl p-3">
            <TruckIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold">{load.loadId}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              load.status === 'en-route' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {load.status}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-400">${load.revenue.toLocaleString()}</div>
          <div className="text-xs text-slate-400">Revenue</div>
        </div>
      </div>

      {/* Route */}
      <div className="space-y-4 mb-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            <div className="bg-green-500 rounded-full p-1.5">
              <MapPinIcon className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="text-xs text-slate-400 mb-1">Pickup</div>
            <div className="text-white font-medium">{load.pickup}</div>
          </div>
        </div>

        <div className="ml-2.5 h-8 w-0.5 bg-slate-700"></div>

        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            <div className="bg-red-500 rounded-full p-1.5">
              <FlagIcon className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="text-xs text-slate-400 mb-1">Dropoff</div>
            <div className="text-white font-medium">{load.dropoff}</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {(load.distance || load.eta) && (
        <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-slate-700/50">
          {load.distance && (
            <div>
              <div className="text-slate-400 text-xs mb-1">Distance</div>
              <div className="text-white font-semibold">{load.distance}</div>
            </div>
          )}
          {load.eta && (
            <div>
              <div className="text-slate-400 text-xs mb-1">ETA</div>
              <div className="text-white font-semibold">{load.eta}</div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-3">
        {load.status === 'assigned' && onStartDelivery && (
          <button
            onClick={() => onStartDelivery(load.id)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Start Delivery
          </button>
        )}
        {load.status === 'en-route' && onUploadPOD && (
          <button
            onClick={() => onUploadPOD(load.id)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Upload POD
          </button>
        )}
        <button className="px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
