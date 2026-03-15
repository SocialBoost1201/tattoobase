import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { revalidatePath } from 'next/cache';

const API = 'http://localhost:3001/api';

async function getArtists(studioId: string) {
  const res = await fetch(`${API}/studio-api/artists?studioId=${studioId}`, { cache: 'no-store' });
  return res.ok ? res.json() : [];
}

export default async function StudioArtistDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const STUDIO_ID = 'demo-studio-id'; // TODO: Replace with auth

  // GET all artists for now and find the specific one (API is basic for MVP)
  const allArtists = await getArtists(STUDIO_ID);
  const artist = allArtists.find((a: any) => a.id === id);

  if (!artist) {
    return (
      <div className="min-h-screen bg-dark-900 text-dark-50 p-8">
        <div className="max-w-3xl mx-auto glass-panel p-8 text-center text-dark-300">
          Artist not found.
          <div className="mt-4">
            <Link href="/studio/artists" className="text-brand-400 hover:text-brand-300">Back to Artists</Link>
          </div>
        </div>
      </div>
    );
  }

  // Server Action for updating profile
  async function updateProfile(formData: FormData) {
    'use server';
    const rawSpecialties = formData.get('specialties') as string;
    const updateData = {
      displayName: formData.get('displayName'),
      bio: formData.get('bio'),
      gender: formData.get('gender') || null,
      yearsOfExperience: formData.get('yearsOfExperience') ? parseInt(formData.get('yearsOfExperience') as string, 10) : null,
      instagramHandle: formData.get('instagramHandle') || null,
      specialties: rawSpecialties ? rawSpecialties.split(',').map(s => s.trim()).filter(Boolean) : [],
    };

    await fetch(`${API}/studio-api/artists/${id}?studioId=${STUDIO_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    revalidatePath(`/studio/artists/${id}`);
    revalidatePath(`/studio/artists`);
  }

  // Server Action for adding portfolio
  async function addPortfolio(formData: FormData) {
    'use server';
    const newWork = {
      artistId: id,
      title: formData.get('title'),
      description: formData.get('description'),
      styleCategory: formData.get('styleCategory'),
      // MVP: dummy image mapping
      imageUrl: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=800&auto=format&fit=crop&q=60",
      tags: [],
    };

    await fetch(`${API}/studio-api/portfolio?studioId=${STUDIO_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newWork),
    });
    revalidatePath(`/studio/artists/${id}`);
  }

  return (
    <div className="min-h-screen bg-dark-900 text-dark-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <Link href="/studio/artists" className="text-sm text-dark-400 hover:text-brand-400 mb-6 inline-block">
          &larr; Back to Artists List
        </Link>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Profile Edit */}
          <div className="w-full md:w-2/3">
            <h1 className="text-2xl font-bold mb-6">Edit Profile: {artist.displayName}</h1>
            
            <div className="glass-panel p-6 rounded-xl border border-dark-700">
              <form action={updateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Display Name</label>
                  <input 
                    type="text" 
                    name="displayName"
                    defaultValue={artist.displayName} 
                    required
                    className="w-full bg-dark-800 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Bio</label>
                  <textarea 
                    name="bio"
                    defaultValue={artist.bio || ''} 
                    rows={4}
                    className="w-full bg-dark-800 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">Gender</label>
                    <select 
                      name="gender" 
                      defaultValue={artist.gender || ''}
                      className="w-full bg-dark-800 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500"
                    >
                      <option value="">(Not specified)</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">Years of Experience</label>
                    <input 
                      type="number" 
                      name="yearsOfExperience"
                      defaultValue={artist.yearsOfExperience || ''} 
                      min="0"
                      className="w-full bg-dark-800 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Specialties (comma separated)</label>
                  <input 
                    type="text" 
                    name="specialties"
                    placeholder="e.g. Traditional, Black and Grey, Fineline"
                    defaultValue={artist.specialties ? artist.specialties.join(', ') : ''} 
                    className="w-full bg-dark-800 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Instagram Handle</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-dark-600 bg-dark-800 text-dark-400">@</span>
                    <input 
                      type="text" 
                      name="instagramHandle"
                      defaultValue={artist.instagramHandle || ''} 
                      className="w-full bg-dark-800 border border-dark-600 rounded-r-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-dark-700 flex justify-end">
                  <button type="submit" className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-6 rounded transition-colors shadow-lg shadow-brand-500/20">
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Portfolio */}
          <div className="w-full md:w-1/3">
            <h2 className="text-xl font-bold mb-6">Portfolio</h2>
            
            {/* Add New Form */}
            <div className="glass-panel p-5 rounded-xl border border-dark-700 mb-6 bg-dark-800/50">
              <h3 className="text-sm font-medium text-dark-300 mb-4 tracking-wide uppercase">Add New Work</h3>
              <form action={addPortfolio} className="space-y-4">
                <input 
                  type="text" 
                  name="title" 
                  placeholder="Title (Optional)"
                  className="w-full bg-dark-900 border border-dark-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                />
                <input 
                  type="text" 
                  name="styleCategory" 
                  placeholder="Style (e.g. Traditional, Anime)"
                  required
                  className="w-full bg-dark-900 border border-dark-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                />
                <button type="submit" className="w-full bg-dark-700 hover:bg-dark-600 text-white py-2 rounded text-sm transition-colors border border-dark-500">
                  + Add Item (Mock Upload)
                </button>
              </form>
            </div>

            {/* List Works */}
            <div className="space-y-4">
              {artist.portfolioWorks && artist.portfolioWorks.length > 0 ? (
                artist.portfolioWorks.map((work: any) => (
                  <div key={work.id} className="glass-panel p-3 rounded-xl border border-dark-700 flex gap-4 items-center">
                    <div className="w-16 h-16 rounded overflow-hidden relative bg-dark-800 shrink-0">
                      {work.imageUrl || work.mediaUrls?.[0] ? (
                        <Image 
                          src={work.imageUrl || work.mediaUrls[0]} 
                          alt="Portfolio item"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-dark-600 text-xs">No Img</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{work.title || 'Untitled Work'}</div>
                      <div className="text-xs text-brand-400 mt-1">{work.styleCategory}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-dark-500 text-sm py-4">
                  No portfolio works added yet.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
