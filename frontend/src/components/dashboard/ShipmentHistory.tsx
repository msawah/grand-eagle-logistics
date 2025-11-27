'use client';

interface HistoryEvent {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  type: 'delivered' | 'assigned' | 'pickup' | 'created';
}

interface ShipmentHistoryProps {
  events: HistoryEvent[];
}

export default function ShipmentHistory({ events }: ShipmentHistoryProps) {
  const getEventIcon = (type: HistoryEvent['type']) => {
    switch (type) {
      case 'delivered':
        return (
          <div className="bg-green-600 rounded-full p-2 text-white">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case 'assigned':
        return (
          <div className="bg-blue-600 rounded-full p-2 text-white">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
        );
      case 'pickup':
        return (
          <div className="bg-purple-600 rounded-full p-2 text-white">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case 'created':
        return (
          <div className="bg-slate-600 rounded-full p-2 text-white">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Shipment history</h2>

      <div className="space-y-6">
        {events.length === 0 ? (
          <div className="text-center text-slate-500 text-sm py-8">
            No shipment history yet
          </div>
        ) : (
          events.map((event, index) => (
            <div key={event.id} className="flex space-x-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                {getEventIcon(event.type)}
                {index < events.length - 1 && (
                  <div className="w-0.5 h-full bg-slate-700 mt-2"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <h3 className="text-white font-semibold text-sm mb-1">
                  {event.title}
                </h3>
                <p className="text-slate-400 text-xs mb-1">{event.description}</p>
                <p className="text-slate-500 text-xs">
                  {event.timestamp.toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
