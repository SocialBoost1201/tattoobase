export const UserApiClient = {
  async createBookingDraft(data: {
    studioId: string;
    artistId?: string;
    scheduledAtLocal?: string;
    notes?: string;
    briefJson: any;
    userId?: string; // 認証連携まではフロントから渡して補助
  }) {
    const res = await fetch('http://localhost:3001/api/user-api/booking/draft', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create booking draft');
    }

    return res.json();
  },

  async getBookingDetail(id: string) {
    const res = await fetch(`http://localhost:3001/api/user-api/bookings/${id}`, {
      // APIサーバーに対しキャッシュを無効化する
      cache: 'no-store'
    });

    if (!res.ok) {
      try {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch booking detail');
      } catch (e) {
        throw new Error('Failed to fetch booking detail');
      }
    }

    return res.json();
  }
};
