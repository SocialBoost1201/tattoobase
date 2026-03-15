// 必要データ一覧:
// - システム全体のGMV, 総トランザクション数
// - アクティブスタジオ数と新規オンボーディング数
// - Stripe Webhook のエラー / 正常完了率
// - アラートが必要な未処理のKYC（本人確認）レビュー件数
export default async function AdminDashboardPage() {
    const res = await fetch('http://localhost:3001/admin-api/dashboard', { cache: 'no-store' });
    const metrics = res.ok ? await res.json() : {};

    const data = { message: "Admin System Dashboard", metrics };
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
