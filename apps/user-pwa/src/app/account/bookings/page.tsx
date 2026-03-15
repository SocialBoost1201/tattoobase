// 必要データ一覧:
// - List of User's Bookings (Upcoming, Past, Cancelled)
// - Booking summaries (Date, Artist Name, Status)
// - Pagination metadata
export default async function AccountBookingsPage() {
    const dummyUserId = "user_123";
    const res = await fetch(`http://localhost:3001/user-api/account/bookings?userId=${dummyUserId}`, { cache: 'no-store' });
    const bookings = res.ok ? await res.json() : [];

    const data = { message: "User Bookings History", bookings };
    return (
        <pre>
            {JSON.stringify(data, null, 2)}
        </pre>
    );
}
