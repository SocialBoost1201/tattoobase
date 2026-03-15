// 必要データ一覧:
// - 現在のサブスクリプションプランとステータス (Active, PastDue, GracePeriod, Canceled)
// - 次回請求日と金額 (Next billing date and amount)
// - 請求履歴一覧 (Invoices/Payment history)
// - Grace Period (猶予期間) の残り日数
export default async function StudioBillingPage() {
    const dummyStudioId = "studio_abc";
    const res = await fetch(`http://localhost:3001/studio-api/billing?studioId=${dummyStudioId}`, { cache: 'no-store' });
    const billing = res.ok ? await res.json() : null;

    const data = { message: "Studio Billing & Subscription Data", billing };
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
