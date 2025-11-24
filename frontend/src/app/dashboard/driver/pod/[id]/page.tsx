'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { shipmentsAPI } from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';

export default function UploadPODPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const shipmentId = params?.id as string;

  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'checking' | 'success' | 'error'>('checking');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user && user.role !== 'driver') {
      router.push('/');
    } else if (user && shipmentId) {
      loadShipment();
      getCurrentLocation();
    }
  }, [user, authLoading, shipmentId, router]);

  const loadShipment = async () => {
    try {
      const response = await shipmentsAPI.getById(shipmentId);
      setShipment(response.data);
    } catch (error) {
      console.error('Error loading shipment:', error);
      setError('Failed to load shipment details');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setGpsStatus('checking');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setGpsStatus('success');
        },
        (error) => {
          console.error('Geolocation error:', error);
          setGpsStatus('error');
          setError('Failed to get GPS location. Please enable location services.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setGpsStatus('error');
      setError('Geolocation is not supported by your browser');
    }
  };

  // Refresh GPS location
  const refreshGPS = () => {
    getCurrentLocation();
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setImagePreview(url);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setError('Note: In production, upload to cloud storage (S3, Cloudinary, etc.)');
    setImageUrl('https://example.com/pod-image.jpg');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      if (!imageUrl) {
        throw new Error('Please provide an image URL or upload an image');
      }

      // CRITICAL: Get fresh GPS location right before submit
      const freshLocation = await new Promise<{ lat: number; lng: number }>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            reject(new Error('Failed to get GPS location'));
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });

      await shipmentsAPI.uploadPOD(shipmentId, {
        imageUrl,
        gpsLat: freshLocation.lat,
        gpsLng: freshLocation.lng,
        deviceTime: new Date().toISOString(),
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/driver');
      }, 2000);
    } catch (error: any) {
      setError(error.response?.data?.error || error.message || 'Failed to upload POD');
    } finally {
      setUploading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Shipment not found</div>
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
              <div className="text-3xl">📦</div>
              <div>
                <h1 className="text-lg font-bold text-white">Upload Proof of Delivery</h1>
                <p className="text-xs text-slate-400">Shipment {shipmentId.slice(0, 8)}</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboard/driver')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">✅</div>
              <div>
                <div className="text-green-400 font-semibold">POD Uploaded Successfully!</div>
                <div className="text-green-500 text-sm">
                  Redirecting to dashboard...
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* GPS Status */}
        <div className={`mb-6 p-4 rounded-lg border ${
          gpsStatus === 'success'
            ? 'bg-green-500/10 border-green-500'
            : gpsStatus === 'error'
            ? 'bg-red-500/10 border-red-500'
            : 'bg-yellow-500/10 border-yellow-500'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {gpsStatus === 'success' ? '📍' : gpsStatus === 'error' ? '❌' : '⏳'}
              </div>
              <div>
                <div className={`font-semibold ${
                  gpsStatus === 'success' ? 'text-green-400' : 
                  gpsStatus === 'error' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {gpsStatus === 'success' ? 'GPS Location Captured' : 
                   gpsStatus === 'error' ? 'GPS Error' : 'Checking GPS...'}
                </div>
                {gpsLocation && (
                  <div className="text-sm text-slate-400">
                    Lat: {gpsLocation.lat.toFixed(6)}, Lng: {gpsLocation.lng.toFixed(6)}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={refreshGPS}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
            >
              Refresh GPS
            </button>
          </div>
        </div>

        {/* Shipment Info */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Shipment Details</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-400 mb-1">Pickup</div>
              <div className="text-white">{shipment.pickupAddress}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">Dropoff</div>
              <div className="text-white">{shipment.dropoffAddress}</div>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Upload Delivery Photo</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={handleImageUrlChange}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="text-center text-slate-400">OR</div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Upload Image File
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              <p className="mt-2 text-sm text-slate-400">
                Max file size: 5MB. Supported formats: JPG, PNG, WebP
              </p>
            </div>

            {imagePreview && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Preview
                </label>
                <div className="border-2 border-slate-600 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="POD Preview"
                    className="w-full h-auto"
                    onError={() => {
                      setError('Failed to load image preview');
                      setImagePreview('');
                    }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading || !imageUrl}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition shadow-lg"
            >
              {uploading ? 'Uploading POD...' : 'Upload POD'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🔒</div>
              <div>
                <div className="text-blue-400 font-semibold">Secure Upload</div>
                <div className="text-blue-500 text-sm">
                  Your delivery photo will be securely stored with GPS coordinates and timestamp.
                  GPS location is captured at the moment of upload to ensure accuracy.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
