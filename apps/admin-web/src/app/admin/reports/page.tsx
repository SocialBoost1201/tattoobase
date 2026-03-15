// 必要データ一覧:
// - 定期監査レポート / 財務集計レポート (Generated Audit & Financial Reports)
// - エクスポート可能なレポートのリストと生成状態 (PDF/CSV ready to download)
export default async function AdminReportsPage() {
    const res = await fetch('http://localhost:3001/admin-api/reports', { cache: 'no-store' });
    const reports = res.ok ? await res.json() : [];

    const data = { message: "Admin Generated Reports Center", reports };
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
