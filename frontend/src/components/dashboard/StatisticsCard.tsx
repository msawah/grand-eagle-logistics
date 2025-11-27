'use client';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
}

export default function StatisticsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  subtitle,
}: StatisticsCardProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-400 font-medium mb-2">{title}</p>
          <div className="flex items-baseline space-x-3">
            <h3 className="text-3xl font-bold text-white">{value}</h3>
            {change && (
              <span
                className={`text-sm font-semibold ${
                  changeType === 'positive'
                    ? 'text-green-400'
                    : changeType === 'negative'
                    ? 'text-red-400'
                    : 'text-slate-400'
                }`}
              >
                {change}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatsGridProps {
  stats: {
    totalRevenue: number;
    revenueChange: string;
    loadsInTransit: number;
    transitChange: string;
    totalLoads: number;
    deliveredLoads: number;
  };
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Statistics</h2>

      <div className="space-y-6">
        {/* Total Revenue */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm text-slate-400">Total revenue</span>
            <span className="text-sm text-green-400 font-semibold">{stats.revenueChange}</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            ${stats.totalRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-green-400">+136.4</div>
        </div>

        {/* In Transit */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm text-slate-400">in transit</span>
            <span className="text-sm text-green-400 font-semibold">{stats.transitChange}</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white">{stats.loadsInTransit}</span>
            <span className="text-sm text-green-400 font-semibold">+4</span>
          </div>
          <div className="text-xs text-green-400">+2%</div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Progress</span>
            <span>{Math.round((stats.deliveredLoads / stats.totalLoads) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{
                width: `${(stats.deliveredLoads / stats.totalLoads) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
