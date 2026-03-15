// 必要データ一覧:
// - システム障害、インシデントレポート一覧 (System incidents manually or automatically reported)
// - 対応ステータス (Open, Investigating, Resolved)
// - MTTR / 影響範囲メタデータ
export default async function AdminIncidentsPage() {
    const res = await fetch('http://localhost:3001/admin-api/incidents', { cache: 'no-store' });
    const incidents = res.ok ? await res.json() : [];

    const data = { message: "Admin Operational Incidents Log", incidents };
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
