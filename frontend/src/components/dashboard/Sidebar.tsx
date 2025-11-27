'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  MapIcon,
  TruckIcon,
  DocumentTextIcon,
  UserGroupIcon,
  BellIcon,
  WalletIcon,
  ExclamationTriangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: number;
}

interface SidebarProps {
  role: 'shipper' | 'driver' | 'admin';
  userName: string;
}

export default function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();

  const shipperNav: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard/shipper', icon: HomeIcon },
    { name: 'Map', href: '/dashboard/shipper/map', icon: MapIcon },
    { name: 'Load Management', href: '/dashboard/shipper/loads', icon: TruckIcon },
    { name: 'Shipments', href: '/dashboard/shipper/shipments', icon: DocumentTextIcon },
    { name: 'Drivers', href: '/dashboard/shipper/drivers', icon: UserGroupIcon },
    { name: 'Penalties', href: '/dashboard/shipper/penalties', icon: ExclamationTriangleIcon },
    { name: 'Documents', href: '/dashboard/shipper/documents', icon: DocumentTextIcon },
    { name: 'Wallet', href: '/dashboard/shipper/wallet', icon: WalletIcon },
  ];

  const driverNav: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard/driver', icon: HomeIcon },
    { name: 'Map', href: '/dashboard/driver/map', icon: MapIcon },
    { name: 'My Loads', href: '/dashboard/driver/loads', icon: TruckIcon },
    { name: 'Shipments', href: '/dashboard/driver/shipments', icon: DocumentTextIcon },
    { name: 'Documents', href: '/dashboard/driver/documents', icon: DocumentTextIcon },
    { name: 'Wallet', href: '/dashboard/driver/wallet', icon: WalletIcon },
  ];

  const navigation = role === 'shipper' ? shipperNav : driverNav;

  const isActive = (href: string) => {
    if (href === `/dashboard/${role}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
      {/* Logo & User */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center space-x-3 mb-6">
          <div className="text-4xl">
            {role === 'shipper' ? '🦅' : '🚛'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Shipper</h1>
            <p className="text-xs text-slate-400">Grand Eagle Logistics</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by pickup or drop off location"
            className="w-full px-4 py-2 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.name}</span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Map Icon at Bottom */}
      <div className="p-6 border-t border-slate-800">
        <div className="bg-blue-600 p-4 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-blue-700 transition">
          <MapIcon className="h-12 w-12 text-white" />
        </div>
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-2 w-2 bg-slate-700 rounded-full"></div>
            <WalletIcon className="h-6 w-6 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
