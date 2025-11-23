'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'shipper') {
        router.push('/dashboard/shipper');
      } else if (user.role === 'driver') {
        router.push('/dashboard/driver');
      } else {
        router.push('/dashboard/admin');
      }
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <nav className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">🦅</div>
              <div>
                <h1 className="text-xl font-bold text-white">Grand Eagle Logistics</h1>
                <p className="text-xs text-slate-400">Professional Transportation</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/login"
                className="px-4 py-2 text-white hover:text-blue-400 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Professional Logistics
            <br />
            <span className="text-blue-400">Made Simple</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Connect shippers with verified drivers. Track shipments in real-time.
            Secure proof of delivery with AI-powered fraud detection.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition shadow-lg"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white text-lg font-semibold rounded-lg transition"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-bold text-white mb-2">Real-Time Tracking</h3>
            <p className="text-slate-400">
              Monitor your shipments with live GPS tracking and location updates.
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-white mb-2">AI Fraud Detection</h3>
            <p className="text-slate-400">
              Advanced AI analyzes proof of delivery photos to prevent fraud.
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-white mb-2">Carrier Verification</h3>
            <p className="text-slate-400">
              Automatic MC/DOT verification through FMCSA integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
