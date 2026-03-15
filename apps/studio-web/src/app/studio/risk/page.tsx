// 必要データ一覧:
// - 顧客のKYC・リスク判定ステータス一覧 (Risk Profiles associated with Studio's bookings)
// - 未承認/確認待ちの身分証・同意書リスト (Pending KYC approvals)
export default async function StudioRiskPage() {
    const dummyStudioId = "studio_abc";
    const res = await fetch(`http://localhost:3001/studio-api/risk?studioId=${dummyStudioId}`, { cache: 'no-store' });
    const risks = res.ok ? await res.json() : [];

    const data = { message: "Studio Risk & KYC Queue", risks };
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
