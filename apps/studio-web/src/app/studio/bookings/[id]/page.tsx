import React from "react";
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

const API = 'http://localhost:3001/api';

async function getBookingDetail(studioId: string, id: string) {
  const res = await fetch(`${API}/studio-api/bookings/${id}?studioId=${studioId}`, { cache: 'no-store' });
  return res.ok ? res.json() : null;
}

export default async function BookingManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const STUDIO_ID = 'demo-studio-id'; // To be replaced with auth
  
  const booking = await getBookingDetail(STUDIO_ID, id);

  if (!booking) {
    return (
      <div className="min-h-screen bg-dark-900 text-dark-50 p-8">
        <div className="max-w-3xl mx-auto glass-panel p-8 text-center text-dark-300">
          Booking not found or you don't have access.
          <div className="mt-4">
            <Link href="/" className="text-brand-400 hover:text-brand-300">Back to Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  const isRequireApproval = booking.status === 'RequireApproval';

  async function handleApprove() {
    'use server';
    await fetch(`${API}/studio-api/bookings/${id}/approve?studioId=${STUDIO_ID}`, { method: 'POST' });
    revalidatePath(`/studio/bookings/${id}`);
    revalidatePath(`/`);
  }

  async function handleReject() {
    'use server';
    await fetch(`${API}/studio-api/bookings/${id}/reject?studioId=${STUDIO_ID}`, { method: 'POST' });
    revalidatePath(`/studio/bookings/${id}`);
    revalidatePath(`/`);
  }

  return (
    <div className="min-h-screen bg-dark-900 text-dark-50 p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-dark-400 hover:text-brand-400 mb-6 inline-block">
          &larr; Back to Dashboard
        </Link>
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Booking Details</h1>
            <p className="text-dark-400 text-sm mt-1">ID: {booking.id}</p>
          </div>
          <div className="px-3 py-1 rounded bg-dark-700 text-sm font-semibold">
            Status: <span className={isRequireApproval ? 'text-yellow-400' : 'text-brand-400'}>{booking.status}</span>
          </div>
        </div>

        <div className="glass-panel rounded-lg border border-dark-700 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-dark-700 font-bold bg-dark-800">
            Request Information
          </div>
          <div className="p-6 grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-dark-400 uppercase tracking-wide mb-1">Client</div>
              <div className="font-medium text-lg">{booking.user?.name || booking.userId}</div>
              <div className="text-dark-400 text-sm mt-1">{booking.user?.email || 'No email provided'}</div>
            </div>
            <div>
              <div className="text-sm text-dark-400 uppercase tracking-wide mb-1">Artist</div>
              <div className="font-medium text-lg">{booking.artist?.displayName || booking.artistId}</div>
            </div>
            <div>
              <div className="text-sm text-dark-400 uppercase tracking-wide mb-1">Scheduled</div>
              <div className="font-medium">
                {booking.scheduledAtLocal ? new Date(booking.scheduledAtLocal).toLocaleString('en-US') : 'TBD'}
              </div>
            </div>
            <div>
              <div className="text-sm text-dark-400 uppercase tracking-wide mb-1">Notes / Request</div>
              <div className="bg-dark-800 p-3 rounded text-sm text-dark-300">
                {booking.notes || 'No notes provided by the client.'}
              </div>
            </div>
          </div>
        </div>

        {isRequireApproval && (
          <div className="glass-panel p-6 rounded-lg border border-yellow-500/30 bg-yellow-500/5 mb-6">
            <h2 className="text-lg font-bold text-yellow-500 mb-2">Requires Your Approval</h2>
            <p className="text-sm text-dark-300 mb-6">
              This client has submitted a booking request that requires studio approval before proceeding to payment.
            </p>
            
            <div className="flex gap-4">
              <form action={handleApprove}>
                <button type="submit" className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded transition-colors">
                  Approve Request
                </button>
              </form>
              <form action={handleReject}>
                <button type="submit" className="bg-transparent border border-red-500 text-red-500 hover:bg-red-500/10 font-bold py-2 px-6 rounded transition-colors">
                  Decline
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
