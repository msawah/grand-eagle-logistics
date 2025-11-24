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
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Failed to get GPS location. Please enable location services.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setImagePreview(url);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // En producción, subirías el archivo a S3/Cloudinary/etc
    // Por ahora, simulamos con una URL
    setError('Note: In production, upload to cloud storage (S3, Cloudinary, etc.)');
    setImageUrl('https://example.com/pod-image.jpg'); // Placeholder
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      if (!imageUrl) {
        throw new Error('Please provide an image URL or upload an image');
      }

      if (!gpsLocation) {
        throw new Error('GPS location not available. Please enable location services.');
      }

      await shipmentsAPI.uploadPOD(shipmentId, {
        imageUrl,
        gpsLat: gpsLocation.lat,
        gpsLng: gpsLocation.lng,
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
          gpsLocation
            ? 'bg-green-500/10 border-green-500'
            : 'bg-yellow-500/10 border-yellow-500'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{gpsLocation ? '📍' : '⚠️'}</div>
            <div>
              <div className={`font-semibold ${gpsLocation ? 'text-green-400' : 'text-yellow-400'}`}>
                {gpsLocation ? 'GPS Location Captured' : 'Waiting for GPS...'}
              </div>
              {gpsLocation && (
                <div className="text-sm text-slate-400">
                  Lat: {gpsLocation.lat.toFixed(6)}, Lng: {gpsLocation.lng.toFixed(6)}
                </div>
              )}
            </div>
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
            {/* Option 1: Image URL */}
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

            {/* Option 2: File Upload */}
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

            {/* Image Preview */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading || !imageUrl || !gpsLocation}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition shadow-lg"
            >
              {uploading ? 'Uploading...' : 'Upload POD'}
            </button>
          </form>

          {/* AI Notice */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🤖</div>
              <div>
                <div className="text-blue-400 font-semibold">AI Fraud Detection</div>
                <div className="text-blue-500 text-sm">
                  Your photo will be automatically analyzed by AI to verify authenticity.
                  Photos must be clear, show the delivery location, and be taken at the
                  correct GPS coordinates.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
