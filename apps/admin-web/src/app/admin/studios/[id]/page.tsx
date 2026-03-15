// 必要データ一覧:
// - スタジオ詳細情報 (Studio profile, address, business details)
// - コンプライアンス/本人確認ステータス (Compliance & Directors KYC)
// - 財務データ / Strype Connect アカウント状態 (Financial & Payout status)
// - 所属アーティスト一覧および管理画面へのリンク
export default async function AdminStudioDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const res = await fetch(`http://localhost:3001/admin-api/studios/${id}`, { cache: 'no-store' });
    const studio = res.ok ? await res.json() : null;

    const data = { message: "Admin Studio Detail", studioId: id, studio };
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
