import { API_BASE } from './api';

export const UserApiClient = {
  async createBookingDraft(data: {
    studioId: string;
    artistId?: string;
    scheduledAtLocal?: string;
    notes?: string;
    briefJson: any;
    userId?: string;
  }) {
    const res = await fetch(`${API_BASE}/user-api/booking/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to create booking draft');
    }

    return res.json();
  },

  async getBookingDetail(id: string) {
    const res = await fetch(`${API_BASE}/user-api/bookings/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch booking detail');
    }

    return res.json();
  },
};
