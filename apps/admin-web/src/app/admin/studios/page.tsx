// 必要データ一覧:
// - 全スタジオの一覧 (All Studios in system)
// - スタジオごとのステータス (Active, Suspended, Pending Verification)
// - スタジオの基本メトリクス (Booking counts, Total Revenue, Risk Score)
export default async function AdminStudiosPage() {
    const res = await fetch('http://localhost:3001/admin-api/studios', { cache: 'no-store' });
    const studios = res.ok ? await res.json() : [];

    const data = { message: "Admin Studios Directory", studios };
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
