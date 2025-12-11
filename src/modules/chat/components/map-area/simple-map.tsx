import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { renderToStaticMarkup } from 'react-dom/server';

export interface MapLocation {
  id: string | number;
  restaurant_name: string;
  lat: number;
  lng: number;
  address?: string;
  image?: string;
  star?: number;
  desc?: string;
  priceRange?: string;
  color?: string;
}

interface SimpleMapProps {
  locations: MapLocation[];
  zoom?: number;
  className?: string;
}

// Create Icon Marker for each color
const createCustomIcon = (color: string = '#ef4444') => {
  const iconMarkup = renderToStaticMarkup(
    <div style={{ position: 'relative', width: '40px', height: '40px', display: 'flex', justifyContent: 'center' }}>
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 24 24" 
        fill="none" 
        style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.4))' }}
      >
        <path 
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
          fill={color} 
          stroke="white" 
          strokeWidth="1.5"
        />
        <circle cx="12" cy="9" r="3.5" fill="white" />
      </svg>
    </div>
  );

  return new L.DivIcon({
    html: iconMarkup,
    className: 'custom-marker-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

function MapController({ locations, zoom = 15 }: { locations: MapLocation[], zoom?: number }) {
  const map = useMap();

  useEffect(() => {
    if(locations.length === 0) return;

    if(locations.length === 1) {
      map.setView([locations[0].lat, locations[0].lng], zoom);
    } else {
      const points = locations.map(loc => [loc.lat, loc.lng] as [number, number]);
      const bounds = new L.LatLngBounds(points);

      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map, zoom]);
  
  return null;
}

export function SimpleMap({ locations, zoom = 15, className = "h-full w-full" }: SimpleMapProps) {
  const defaultCenter: [number, number] = locations.length > 0 
    ? [locations[0].lat, locations[0].lng] 
    : [21.0285, 105.8542];

  return (
    <div className={className}>
      <MapContainer center={defaultCenter} zoom={zoom} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc) => (
          <Marker 
            key={loc.id} 
            position={[loc.lat, loc.lng]}
            icon={createCustomIcon(loc.color)}
          >
            <Popup>
              <div className="font-semibold">{loc.restaurant_name}</div>
              <div className="text-xs text-gray-500">{loc.address}</div>
            </Popup>
          </Marker>
        ))}
        <MapController locations={locations} zoom={zoom} />
      </MapContainer>
    </div>
  );
}