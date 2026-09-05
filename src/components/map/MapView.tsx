import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '../../lib/utils';

// Fix for default marker icons in Leaflet with Vite/Webpack
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Default Vadodara coordinates [lng, lat] for consistency with existing code
const VADODARA_CENTER: [number, number] = [73.1812, 22.3072];

interface Marker {
  id: string;
  lng: number;
  lat: number;
  title?: string;
  color?: string;
  element?: HTMLElement;
}

interface MapViewProps {
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  markers?: Marker[];
  onMarkerClick?: (marker: Marker) => void;
  onMapClick?: (lng: number, lat: number) => void;
  className?: string;
  style?: string; // Kept for compatibility but ignored or mapped to tile providers
  interactive?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  center = VADODARA_CENTER,
  zoom = 12,
  markers = [],
  onMarkerClick,
  onMapClick,
  className,
  style = 'dark',
  interactive = true,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markerRefs = useRef<{ [key: string]: L.Marker }>({});

  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) return;

    // Leaflet uses [lat, lng], but we receive [lng, lat]
    const initialCenter: L.LatLngExpression = [center[1], center[0]];

    map.current = L.map(mapContainer.current, {
      center: initialCenter,
      zoom: zoom,
      zoomControl: false,
      attributionControl: false,
      dragging: interactive,
      touchZoom: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
    });

    // Tile layers
    const isDark = style.includes('dark');
    const tileUrl = isDark 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map.current);

    map.current.on('click', (e: L.LeafletMouseEvent) => {
      if (onMapClick) {
        onMapClick(e.latlng.lng, e.latlng.lat);
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update center and zoom when props change
  useEffect(() => {
    if (map.current) {
      // Leaflet uses [lat, lng]
      const targetCenter: L.LatLngExpression = [center[1], center[0]];
      map.current.setView(targetCenter, zoom, {
        animate: true,
        duration: 2,
      });
    }
  }, [center, zoom]);

  // Update markers when props change
  useEffect(() => {
    if (!map.current) return;

    // Remove old markers that aren't in the new list
    const currentMarkerIds = markers.map(m => m.id);
    Object.keys(markerRefs.current).forEach(id => {
      if (!currentMarkerIds.includes(id)) {
        markerRefs.current[id].remove();
        delete markerRefs.current[id];
      }
    });

    // Add or update markers
    markers.forEach(m => {
      if (markerRefs.current[m.id]) {
        markerRefs.current[m.id].setLatLng([m.lat, m.lng]);
      } else {
        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="
              width: 12px; 
              height: 12px; 
              border-radius: 50%; 
              background-color: ${m.color || '#ef4444'}; 
              border: 2px solid #fff; 
              box-shadow: 0 0 10px rgba(0,0,0,0.5);
              cursor: pointer;
            "></div>
          `,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });

        const marker = L.marker([m.lat, m.lng], { icon: customIcon }).addTo(map.current!);

        if (onMarkerClick) {
          marker.on('click', () => onMarkerClick(m));
        }

        markerRefs.current[m.id] = marker;
      }
    });
  }, [markers, onMarkerClick]);

  return (
    <div className={cn("relative w-full h-full", className)}>
      <div ref={mapContainer} className="absolute inset-0 z-0" />
      {/* Attribution overlay since we hid the default one */}
      <div className="absolute bottom-2 right-2 z-10 text-[8px] text-white/30 pointer-events-none">
        &copy; OSM &middot; CARTO
      </div>
    </div>
  );
};
