import { Card } from './ui/card';
import { useEffect, useRef, useState } from 'react';
import type { RegionData } from '../App';
import { allCrops } from '../data/cropsData';

interface MapViewProps {
  regions: RegionData[];
  onRegionClick: (region: RegionData) => void;
  showTitle?: boolean;
  // id of the currently selected department (or undefined)
  selectedDepartmentId?: string | undefined;
  showBadge?: boolean;
  selectedCrop?: string;
  onCropChange?: (value: string) => void;
  selectedRecommendation?: string;
  onMoreInfoClick?: () => void;
}

export function MapView({ regions, onRegionClick, showTitle = true, selectedDepartmentId, showBadge = true, selectedCrop, selectedRecommendation, onMoreInfoClick }: MapViewProps) {
  const [showWarning, setShowWarning] = useState(false);
  const prevDeptRef = useRef(undefined as string | undefined);
  const [focusedRegionId, setFocusedRegionId] = useState(null as string | null);
  // markers are static over the image; remove translation logic
  useEffect(() => {
    if (selectedDepartmentId && prevDeptRef.current !== selectedDepartmentId) {
      // show warning briefly
      setShowWarning(true);
      const t = setTimeout(() => setShowWarning(false), 3500);
      prevDeptRef.current = selectedDepartmentId;
      // focus region and trigger click by id
      const found = regions.find(r => r.id === selectedDepartmentId);
      if (found) {
        setFocusedRegionId(found.id);
  // keep focus visual but do not translate the markers layer
        onRegionClick(found);
        // clear focus after a short delay so the pulse can re-trigger later
        setTimeout(() => setFocusedRegionId(null), 3000);
      }
      return () => clearTimeout(t);
    }
  }, [selectedDepartmentId]);
  const getIconSrc = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return '/icon-low.svg';
      case 'medium':
        return '/icon-medium.svg';
      case 'high':
        return '/icon-high.svg';
    }
  };

  // Precompute highlight overlay for clarity (avoid inline IIFE in JSX)
  const highlightOverlay = (() => {
    if (!selectedDepartmentId) return null;
    const hr = regions.find((r) => r.id === selectedDepartmentId);
    if (!hr) return null;
    return (
      <div
        aria-hidden
        className="absolute rounded-xl bg-yellow-300/30 border-2 border-yellow-400 pointer-events-none"
        style={{
          left: `${hr.position.x}%`,
          top: `${hr.position.y}%`,
          width: 140,
          height: 90,
          transform: 'translate(-50%, -50%)',
          zIndex: 5,
        }}
      />
    );
  })();

  return (
    <Card className="h-full w-full bg-gradient-to-br from-blue-50 via-white to-green-50 border-4 border-blue-400 shadow-2xl overflow-hidden relative">
      {/* Decorative background - Guatemala colors */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-blue-600"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-blue-600"></div>
      </div>

      {/* Map Title (can be hidden when parent renders its own title) */}
      {showTitle && (
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="bg-white/98 backdrop-blur-sm px-5 py-4 rounded-xl shadow-2xl border-4 border-blue-500">
            <h3 className="text-blue-900 mb-1">🗺️ Mapa de Guatemala</h3>
            <p className="text-gray-700">Toque un departamento para ver recomendaciones</p>
          </div>
        </div>
      )}

      {/* Map background (image stored in public/Guatemala.png) */}
      <div className="relative w-full h-full overflow-hidden">
          {/* Fixed background image */}
          <div className="absolute inset-0 bg-center bg-no-repeat" style={{ backgroundImage: 'url(/Guatemala.png)', backgroundSize: '100% 100%' }} />

          {/* Markers layer: fixed over the image (no translation) */}
          <div className="absolute inset-0">
            {/* Warning overlay when department changes */}
            {showWarning && (
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30 bg-yellow-200 border-2 border-yellow-400 text-yellow-900 px-4 py-3 rounded-lg shadow-lg">
                Cambio de departamento: {selectedDepartmentId}
              </div>
            )}

              {/* Highlight overlay for selected department (uses percent positions over the image) */}
              {highlightOverlay}

            {/* Clickable hotspots positioned over the map image (make the map labels clickable) */}
            {regions.map((region) => {
              const hw = (region as any).hotspotWidth ?? 120;
              const hh = (region as any).hotspotHeight ?? 60;
              return (
                <button
                  key={`hot-${region.id}`}
                  onClick={() => {
                    setFocusedRegionId(region.id);
                    onRegionClick(region);
                  }}
                  aria-label={`Seleccionar ${region.name}`}
                  title={`Seleccionar ${region.name}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 bg-transparent hover:bg-white/10 rounded-lg border-0"
                  style={{
                    left: `${region.position.x}%`,
                    top: `${region.position.y}%`,
                    width: hw,
                    height: hh,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 8,
                  }}
                ></button>
              );
            })}

            {/* Inline alert removed — full dialog will open on region click */}

            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => onRegionClick(region)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 hover:z-20 p-0 cursor-pointer group active:scale-105 ${focusedRegionId === region.id ? 'z-40' : ''}`}
                style={{
                  left: `${region.position.x}%`,
                  top: `${region.position.y}%`,
                }}
              >
                <div className={`relative ${focusedRegionId === region.id ? 'animate-pulse-fast' : ''}`}>
                  <img src={getIconSrc(region.risk)} alt={region.risk} className="w-8 h-8 drop-shadow-lg" style={{ maxWidth: 32, maxHeight: 32 }} />
                  {focusedRegionId === region.id && (
                    <span className="absolute inset-0 rounded-full border-2 border-yellow-400" />
                  )}
                </div>
                <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border-2 border-gray-200 z-30">
                  <span className="text-gray-900 text-sm">{region.name}</span>
                </div>
              </button>
            ))}
          </div>

    </div>

      {/* Guatemala outline decoration (optionally hidden) */}
      {showBadge && (
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border-2 border-blue-300">
          <p className="text-blue-900">🇬🇹 República de Guatemala</p>
          <p className="text-gray-600">22 Departamentos</p>
        </div>
      )}
    </Card>
  );
}
