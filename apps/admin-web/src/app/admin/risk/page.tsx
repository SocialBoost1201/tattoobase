// 必要データ一覧:
// - RiskProfiles / RiskEvents の一覧
// - 高リスクユーザー、フラグが立てられたアカウントのリスト (Flagged accounts: Fraud, Overdue)
// - 対応ステータス (Pending mitigation, Resolved)
export default async function AdminRiskPage() {
    const res = await fetch('http://localhost:3001/admin-api/risk', { cache: 'no-store' });
    const risks = res.ok ? await res.json() : [];

    const data = { message: "Admin Risk Events & Profiles", risks };
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
