// 必要データ一覧:
// - スタジオの全予約リスト (All Bookings for the Studio)
// - 各予約のステータス一覧 (Pending, Confirmed, Completed, Cancelled)
// - カレンダーまたはリスト用の日付・時間メタデータ
// - ゲスト(顧客)情報 (Name, reference image, memo)
// - ペジネーション用メタデータ
export default async function StudioBookingsList() {
    const dummyStudioId = "studio_abc";
    const res = await fetch(`http://localhost:3001/studio-api/bookings?studioId=${dummyStudioId}`, { cache: 'no-store' });
    const bookings = res.ok ? await res.json() : [];

    const data = { message: "Studio Bookings List", bookings };
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
