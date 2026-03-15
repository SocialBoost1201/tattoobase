// 必要データ一覧:
// - ユーザーの基本情報 (User details)
// - 提出された身分証画像URLリスト (ID Document URLs securely fetched)
// - KYCの審査ステータス記録と監査ログ (Approval/Rejection history)
export default async function AdminKYCDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const res = await fetch(`http://localhost:3001/admin-api/kyc/${id}`, { cache: 'no-store' });
    const kyc = res.ok ? await res.json() : null;

    const data = { message: "Admin KYC Detail", kycId: id, kyc };
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
