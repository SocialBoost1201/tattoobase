import React from "react";
import Link from 'next/link';

const API = 'http://localhost:3001/api';

async function getDashboard(studioId: string) {
  const res = await fetch(`${API}/studio-api/dashboard?studioId=${studioId}`, { cache: 'no-store' });
  return res.ok ? res.json() : null;
}

async function getBookings(studioId: string) {
  const res = await fetch(`${API}/studio-api/bookings?studioId=${studioId}`, { cache: 'no-store' });
  return res.ok ? res.json() : [];
}

export default async function StudioDashboard() {
  const STUDIO_ID = 'demo-studio-id'; // To be replaced with auth
  
  const dashboard = await getDashboard(STUDIO_ID);
  const bookings = await getBookings(STUDIO_ID);
  
  const studioName = dashboard?.studio?.name || 'TattooBase Studio';
  const todayCount = dashboard?.todayBookings || 0;
  const activeReqs = dashboard?.activeDesigns || 0;

  return (
    <div className="min-h-screen flex bg-dark-900 text-dark-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-900 border-r border-dark-700 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-dark-700">
          <span className="font-heading font-bold text-lg text-brand-400">TattooBase Studio</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 bg-dark-800 text-brand-400 rounded-lg">
            Dashboard
          </Link>
          <Link href="/studio/bookings" className="flex items-center gap-3 px-3 py-2 text-dark-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors">
            Bookings
          </Link>
          <Link href="/studio/designs" className="flex items-center gap-3 px-3 py-2 text-dark-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors">
            Designs
          </Link>
          <Link href="/studio/settings" className="flex items-center gap-3 px-3 py-2 text-dark-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors">
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-dark-700 flex items-center px-8 bg-dark-900/50 backdrop-blur-sm sticky top-0 z-10">
          <h1 className="text-xl font-bold">Today's Schedule</h1>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-dark-300">{studioName}</span>
            <div className="w-8 h-8 rounded-full bg-brand-600 border-2 border-dark-700"></div>
          </div>
        </header>

        <div className="p-8 flex-1 overflow-auto animate-fade-in">

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-panel p-6 rounded-lg border-l-4 border-brand-500">
              <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-2">Today's Bookings</h3>
              <div className="text-3xl font-bold">{todayCount}</div>
            </div>
            <div className="glass-panel p-6 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-2">Active Designs</h3>
              <div className="text-3xl font-bold">{activeReqs}</div>
            </div>
          </div>

          {/* Agenda view */}
          <div className="glass-panel rounded-lg overflow-hidden border border-dark-700">
            <div className="px-6 py-4 border-b border-dark-700 flex justify-between items-center">
              <h2 className="font-bold text-lg">Recent & Upcoming Appointments</h2>
              <Link href="/studio/bookings" className="text-sm bg-dark-700 hover:bg-dark-600 px-3 py-1 rounded transition-colors text-white">View All</Link>
            </div>
            <div className="divide-y divide-dark-700">
              {bookings.length > 0 ? bookings.map((booking: any) => {
                const isConfirmed = booking.status === 'Confirmed';
                const isPending = booking.status === 'PendingPayment' || booking.status === 'RequireApproval';
                
                return (
                  <div key={booking.id} className="px-6 py-4 flex items-center hover:bg-dark-800/50 transition-colors">
                    <div className="w-24 font-bold text-dark-200">
                      {booking.scheduledAtLocal ? new Date(booking.scheduledAtLocal).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}) : 'TBD'}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{booking.user?.name || booking.user?.email || 'Guest'}</div>
                      <div className="text-sm text-dark-400">Artist: {booking.artist?.displayName || 'Unknown'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isConfirmed ? 'bg-green-500' : isPending ? 'bg-yellow-500' : 'bg-dark-500'}`}></span>
                      <span className="text-xs text-dark-300 font-medium bg-dark-700 px-2 py-1 rounded">{booking.status}</span>
                    </div>
                    <Link href={`/studio/bookings/${booking.id}`} className="ml-6 text-brand-500 hover:text-brand-300 text-sm font-semibold">
                      Manage
                    </Link>
                  </div>
                );
              }) : (
                <div className="px-6 py-8 text-center text-dark-400">No upcoming appointments found.</div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
