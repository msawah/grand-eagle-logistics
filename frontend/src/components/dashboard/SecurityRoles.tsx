'use client';

interface Role {
  name: string;
  icon: string;
  active?: boolean;
}

export default function SecurityRoles() {
  const roles: Role[] = [
    { name: 'Driver', icon: '👤', active: false },
    { name: 'Shipper', icon: '📦', active: true },
    { name: 'Admin', icon: '⚙️', active: false },
    { name: 'Auditor', icon: '👁️', active: false },
  ];

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Security & roles</h2>

      <div className="grid grid-cols-2 gap-4">
        {roles.map((role) => (
          <div
            key={role.name}
            className={`flex items-center space-x-3 p-4 rounded-xl border transition cursor-pointer ${
              role.active
                ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/50'
                : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
            }`}
          >
            <div className="text-2xl">{role.icon}</div>
            <span className={`text-sm font-medium ${role.active ? 'text-white' : 'text-slate-400'}`}>
              {role.name}
            </span>
          </div>
        ))}
      </div>

      {/* Security Info */}
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-400">Two-Factor Auth</span>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-6 bg-green-600 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-xs text-green-400">Enabled</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Session Timeout</span>
          <span className="text-sm text-white">30 minutes</span>
        </div>
      </div>
    </div>
  );
}
