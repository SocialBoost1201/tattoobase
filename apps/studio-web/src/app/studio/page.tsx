// 必要データ一覧:
// - 今日の予約リスト (Today's Bookings)
// - 新規のデザイン依頼件数 (New Design Requests count)
// - アカウント・スタジオステータス (KYC Status, Stripe Connect status)
// - スタジオの売上サマリー概要 (Recent Revenue summary)
export default async function StudioDashboard() {
    const dummyStudioId = "studio_abc";
    const res = await fetch(`http://localhost:3001/studio-api/dashboard?studioId=${dummyStudioId}`, { cache: 'no-store' });
    const dashboard = res.ok ? await res.json() : {};

    const data = { message: "Studio Dashboard Data", ...dashboard };
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
