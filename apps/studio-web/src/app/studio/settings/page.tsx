// 必要データ一覧:
// - スタジオの基本設定 (Name, Location, Contact, Description)
// - Stripe Connect のオンボーディングステータス (Payouts enabled, requirements due)
// - キャンセルポリシー設定
// - 営業時間・定休日設定
export default async function StudioSettingsPage() {
    const data = { message: "Studio Settings & Stripe Connect", connected: true };
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
