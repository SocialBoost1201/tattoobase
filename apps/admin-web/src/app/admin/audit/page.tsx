// 必要データ一覧:
// - システム全体の監査ログ一覧 (Global Audit Logs)
// - 実行されたアクション種別 (Action Types: VIEW, CREATE, UPDATE, DELETE, PAYMENT_CREATED, STATE_TRANSITION)
// - 実行者・対象エンティティ情報 (Actor ID, Entity ID/Type)
// - 変更前/変更後のJSONデータ (Before/After JSON diffs)
// - 検索フィルター用パラメータ (Filters by Actor, Entity, Date range)
export default async function AdminAuditPage({
    searchParams,
}: {
    searchParams: Promise<{ entityType?: string; actorId?: string; limit?: string }>
}) {
    const { entityType, actorId, limit } = await searchParams;
    const params = new URLSearchParams();
    if (entityType) params.set('entityType', entityType);
    if (actorId) params.set('actorId', actorId);
    if (limit) params.set('limit', limit);

    const res = await fetch(`http://localhost:3001/admin-api/audit?${params.toString()}`, { cache: 'no-store' });
    const logs = res.ok ? await res.json() : [];

    const data = { message: "Admin Global Audit Logs", logs };
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
