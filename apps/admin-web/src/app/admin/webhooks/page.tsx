// 必要データ一覧:
// - 全Webhookイベントのリスト (All registered Webhook Events)
// - 処理ステータス (Status: Pending, Processed, Failed, Locked)
// - エラー発生時のペイロードおよびスタックトレース (Error JSON payloads)
// - リトライ回数と最新実行時刻 (Retry attempts, processingStartedAt)
export default async function AdminWebhooksPage() {
    const res = await fetch('http://localhost:3001/admin-api/webhooks', { cache: 'no-store' });
    const events = res.ok ? await res.json() : [];

    const data = { message: "Admin Webhooks Monitoring", events };
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
