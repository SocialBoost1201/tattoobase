import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const API = 'http://localhost:3001/api';

async function getArtists(studioId: string) {
  const res = await fetch(`${API}/studio-api/artists?studioId=${studioId}`, { cache: 'no-store' });
  return res.ok ? res.json() : [];
}

export default async function StudioArtistsList() {
  // TODO: Replace with authenticated studio ID
  const STUDIO_ID = "demo-studio-id";
  const artists = await getArtists(STUDIO_ID);

  return (
    <div className="min-h-screen bg-dark-900 text-dark-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Artists</h1>
            <p className="text-dark-400">Manage your studio's artists and their portfolios.</p>
          </div>
          <button className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-6 rounded transition-colors shadow-lg shadow-brand-500/20">
            Invite Artist
          </button>
        </div>

        {artists.length === 0 ? (
          <div className="glass-panel p-12 text-center text-dark-400">
            <p className="text-lg mb-4">No artists found for this studio.</p>
            <p className="text-sm">Click "Invite Artist" to add your first team member.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist: any) => (
              <Link href={`/studio/artists/${artist.id}`} key={artist.id} className="block group">
                <div className="glass-panel rounded-xl overflow-hidden border border-dark-700 hover:border-brand-500/50 transition-all duration-300 transform group-hover:-translate-y-1">
                  {/* Photo & Header */}
                  <div className="aspect-square w-full bg-dark-800 relative">
                    {artist.profileImageUrl ? (
                      <Image
                        src={artist.profileImageUrl}
                        alt={artist.displayName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-dark-600">
                        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="text-xl font-bold text-white mb-1 group-hover:text-brand-400 transition-colors">
                        {artist.displayName}
                      </h2>
                      <div className="flex flex-wrap gap-1">
                        {artist.specialties && artist.specialties.length > 0 ? (
                          artist.specialties.slice(0, 2).map((s: string) => (
                            <span key={s} className="text-xs px-2 py-0.5 rounded bg-dark-800/80 text-dark-200 border border-dark-600">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded bg-dark-800/80 text-dark-400 border border-dark-700">No specialties</span>
                        )}
                        {artist.specialties && artist.specialties.length > 2 && (
                          <span className="text-xs px-2 py-0.5 rounded bg-dark-800/80 text-dark-400 border border-dark-700">+{artist.specialties.length - 2}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats / Info */}
                  <div className="p-4 grid grid-cols-2 divide-x divide-dark-700 bg-dark-800/50">
                    <div className="px-2 text-center">
                      <div className="text-xs text-dark-400 uppercase tracking-widest mb-1">Portfolio</div>
                      <div className="font-bold text-lg">{artist.portfolioWorks?.length || 0}</div>
                    </div>
                    <div className="px-2 text-center">
                      <div className="text-xs text-dark-400 uppercase tracking-widest mb-1">Experience</div>
                      <div className="font-bold text-lg">{artist.yearsOfExperience ? `${artist.yearsOfExperience} yrs` : 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
