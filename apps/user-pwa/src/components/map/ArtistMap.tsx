'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';
import { Star, CalendarHeart } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Leaflet のデフォルトアイコンパス修正（Next.js SSR対策）
function fixLeafletIcons() {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

// カスタムアーティストピン
function createArtistIcon(rating?: number) {
  const html = `
    <div style="
      background: #fff;
      color: #000;
      font-weight: 900;
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 999px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.4);
      white-space: nowrap;
      border: 2px solid #000;
      display: flex;
      align-items: center;
      gap: 3px;
      font-family: sans-serif;
    ">
      ★ ${rating ? rating.toFixed(1) : '—'}
    </div>
  `;
  return L.divIcon({ html, className: '', iconAnchor: [28, 16] });
}

// 地図の中心を動的に移動するコンポーネント
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export type ArtistPin = {
  id: string;
  displayName: string;
  lat: number;
  lng: number;
  rating?: number;
  styles?: string[];
  avatarUrl?: string;
  prefecture?: string;
};

type Props = {
  artists: ArtistPin[];
  center?: [number, number];
  height?: string;
};

export default function ArtistMap({ artists, center = [35.6762, 139.6503], height = '60vh' }: Props) {
  useEffect(() => { fixLeafletIcons(); }, []);

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-neutral-800">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%', background: '#111' }}
        zoomControl={false}
      >
        {/* Carto Dark (完全無料・APIキー不要) */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />

        <MapController center={center} />

        {artists.map(artist => (
          <Marker
            key={artist.id}
            position={[artist.lat, artist.lng]}
            icon={createArtistIcon(artist.rating)}
          >
            <Popup className="artist-popup" closeButton={false}>
              <div className="bg-neutral-900 rounded-xl overflow-hidden shadow-2xl border border-neutral-700 w-56">
                {/* アバター + 名前 */}
                <div className="p-3 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center font-bold text-white text-sm shrink-0 overflow-hidden">
                    {artist.avatarUrl
                      ? <img src={artist.avatarUrl} alt={artist.displayName} className="w-full h-full object-cover" />
                      : artist.displayName.slice(0, 2)
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm truncate">{artist.displayName}</p>
                    <p className="text-neutral-400 text-xs truncate">{artist.prefecture ?? '東京'}</p>
                    {/* スタイルタグ */}
                    {artist.styles && artist.styles.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {artist.styles.slice(0, 2).map(s => (
                          <span key={s} className="px-1.5 py-0.5 bg-neutral-800 text-neutral-300 text-xs rounded font-bold">{s}</span>
                        ))}
                      </div>
                    )}
                    {/* 評価 */}
                    {artist.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-white text-xs font-bold">{artist.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="border-t border-neutral-800 flex">
                  <Link href={`/artist/${artist.id}`}
                    className="flex-1 text-center py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors">
                    プロフィール
                  </Link>
                  <div className="w-px bg-neutral-800" />
                  <Link href={`/booking/start?artistId=${artist.id}`}
                    className="flex-1 text-center py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1">
                    <CalendarHeart className="w-3 h-3" /> 予約
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style>{`
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
        .leaflet-popup-tip-container { display: none; }
        .artist-popup .leaflet-popup-content-wrapper { border-radius: 12px; overflow: hidden; }
      `}</style>
    </div>
  );
}
