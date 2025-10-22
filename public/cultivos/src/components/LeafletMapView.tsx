import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { RegionData } from '../App';

interface LeafletMapViewProps {
  regions: RegionData[];
  onRegionClick: (region: RegionData) => void;
}

// Approx bounding box for Guatemala (lat/lng)
const GUATE_BBOX = {
  north: 17.816, // approx north lat
  south: 13.733, // approx south lat
  west: -92.227, // approx west lng
  east: -88.226, // approx east lng
};

// Convert percentage positions (0-100) into lat/lng within GUATE_BBOX
function percentToLatLng(xPercent: number, yPercent: number) {
  const lng = GUATE_BBOX.west + (xPercent / 100) * (GUATE_BBOX.east - GUATE_BBOX.west);
  // yPercent top=0 maps to north, bottom=100 maps to south
  const lat = GUATE_BBOX.north - (yPercent / 100) * (GUATE_BBOX.north - GUATE_BBOX.south);
  return [lat, lng] as [number, number];
}

const getIcon = (risk: 'low' | 'medium' | 'high') => {
  const size = [36, 36];
  const options = {
    iconUrl: risk === 'low' ? '/icon-low.svg' : risk === 'medium' ? '/icon-medium.svg' : '/icon-high.svg',
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1] / 2],
    popupAnchor: [0, -size[1] / 2],
    className: 'leaflet-marker-icon',
  } as L.IconOptions;
  return new Icon(options);
};

export function LeafletMapView({ regions, onRegionClick }: LeafletMapViewProps) {
  // center roughly Guatemala
  const center: [number, number] = [15.5, -90.25];

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border-4 border-blue-400 shadow-2xl">
      <MapContainer center={center} zoom={7} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {regions.map((r) => {
          const pos = percentToLatLng(r.position.x, r.position.y);
          const icon = getIcon(r.risk);
          return (
            <Marker
              key={r.id}
              position={pos}
              icon={icon}
              eventHandlers={{
                click: () => onRegionClick(r),
              }}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{r.name}</strong>
                  <div>Riesgo: {r.risk}</div>
                  <div>Precipitación: {r.rainfall ?? '—'}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default LeafletMapView;
