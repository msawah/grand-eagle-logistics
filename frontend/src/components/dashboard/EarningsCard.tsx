'use client';

interface EarningsCardProps {
  totalEarnings: number;
  thisWeek: number;
  pending: number;
}

export default function EarningsCard({ totalEarnings, thisWeek, pending }: EarningsCardProps) {
  return (
    <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Total Earnings</h3>
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-4xl font-bold mb-2">${totalEarnings.toLocaleString()}</div>
        <div className="text-green-100 text-sm">All time earnings</div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
        <div>
          <div className="text-2xl font-bold">${thisWeek.toLocaleString()}</div>
          <div className="text-green-100 text-xs">This Week</div>
        </div>
        <div>
          <div className="text-2xl font-bold">${pending.toLocaleString()}</div>
          <div className="text-green-100 text-xs">Pending</div>
        </div>
      </div>
    </div>
  );
}
