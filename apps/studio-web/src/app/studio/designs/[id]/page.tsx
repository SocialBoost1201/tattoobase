// 必要データ一覧:
// - デザイン詳細情報 (Design Details, Description, Location, Size)
// - 参考画像ファイル・添付ファイル (Reference Files)
// - 顧客情報 (Customer info)
// - 見積もり・チャット履歴 (Quotes provided, Message history)
// - ステータスアクション履歴 (Status transitions)
export default async function StudioDesignDetail({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const dummyStudioId = "studio_abc";
    const res = await fetch(`http://localhost:3001/studio-api/designs/${id}?studioId=${dummyStudioId}`, { cache: 'no-store' });
    const design = res.ok ? await res.json() : null;

    const data = { message: "Studio Design Detail", designId: id, design };
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
