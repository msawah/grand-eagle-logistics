'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para iconos de Leaflet en Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Iconos personalizados
const pickupIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTQiIGZpbGw9IiMyNTYzZWIiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjE2IiB5PSIyMiIgZm9udC1zaXplPSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPvCfk6Y8L3RleHQ+PC9zdmc+',
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
});

const dropoffIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTQiIGZpbGw9IiMxMGIzODEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjE2IiB5PSIyMiIgZm9udC1zaXplPSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPvCfjq88L3RleHQ+PC9zdmc+',
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
});

const driverIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTQiIGZpbGw9IiNmNTliMGEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjE2IiB5PSIyMiIgZm9udC1zaXplPSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPvCfmro8L3RleHQ+PC9zdmc+',
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
});

interface Location {
  lat: number;
  lng: number;
  label?: string;
  type?: 'pickup' | 'dropoff' | 'driver';
}

interface MapProps {
  locations: Location[];
  showRoute?: boolean;
  center?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
}

// Componente interno para ajustar bounds del mapa
function MapBounds({ locations }: { locations: Location[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(
        locations.map((loc) => [loc.lat, loc.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);

  return null;
}

export default function Map({
  locations,
  showRoute = false,
  center,
  zoom = 13,
  height = '500px',
  className = '',
}: MapProps) {
  // Calcular centro si no se proporciona
  const defaultCenter: [number, number] = center || (
    locations.length > 0
      ? [locations[0].lat, locations[0].lng]
      : [36.1627, -86.7816] // Nashville, TN por defecto
  );

  // Función para obtener el icono según el tipo
  const getIcon = (type?: string) => {
    switch (type) {
      case 'pickup':
        return pickupIcon;
      case 'dropoff':
        return dropoffIcon;
      case 'driver':
        return driverIcon;
      default:
        return icon;
    }
  };

  // Coordenadas para la ruta
  const routeCoordinates: [number, number][] = showRoute
    ? locations.map((loc) => [loc.lat, loc.lng])
    : [];

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcadores */}
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={[location.lat, location.lng]}
            icon={getIcon(location.type)}
          >
            {location.label && (
              <Popup>
                <div className="text-sm">
                  <strong>{location.label}</strong>
                  <br />
                  <span className="text-xs text-gray-600">
                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </span>
                </div>
              </Popup>
            )}
          </Marker>
        ))}

        {/* Ruta entre puntos */}
        {showRoute && routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            color="#3b82f6"
            weight={4}
            opacity={0.7}
          />
        )}

        {/* Ajustar bounds automáticamente */}
        <MapBounds locations={locations} />
      </MapContainer>
    </div>
  );
}

// Componente para shipment tracking
interface ShipmentMapProps {
  pickup: { lat: number; lng: number; address: string };
  dropoff: { lat: number; lng: number; address: string };
  driverLocation?: { lat: number; lng: number };
  className?: string;
}

export function ShipmentMap({
  pickup,
  dropoff,
  driverLocation,
  className = '',
}: ShipmentMapProps) {
  const locations: Location[] = [
    {
      ...pickup,
      label: `📍 Pickup: ${pickup.address}`,
      type: 'pickup',
    },
    {
      ...dropoff,
      label: `🎯 Dropoff: ${dropoff.address}`,
      type: 'dropoff',
    },
  ];

  if (driverLocation) {
    locations.push({
      ...driverLocation,
      label: '🚛 Driver Current Location',
      type: 'driver',
    });
  }

  return (
    <Map
      locations={locations}
      showRoute={true}
      className={className}
      height="400px"
    />
  );
}

// Componente para mostrar múltiples drivers
interface DriversMapProps {
  drivers: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
  }>;
  className?: string;
}

export function DriversMap({ drivers, className = '' }: DriversMapProps) {
  const locations: Location[] = drivers.map((driver) => ({
    lat: driver.lat,
    lng: driver.lng,
    label: `🚛 ${driver.name}`,
    type: 'driver',
  }));

  return (
    <Map
      locations={locations}
      showRoute={false}
      className={className}
      height="600px"
    />
  );
}
