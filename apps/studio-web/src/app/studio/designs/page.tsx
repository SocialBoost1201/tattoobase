// 必要データ一覧:
// - カスタムデザイン依頼一覧 (Design Requests)
// - 依頼ステータス (Pending, Quoted, Rejected, Accepted)
// - 参考画像URLリスト (Reference Images from User)
// - 対象アーティスト情報 (Requested Artist if any)
export default async function StudioDesignsList() {
    const dummyStudioId = "studio_abc";
    const res = await fetch(`http://localhost:3001/studio-api/designs?studioId=${dummyStudioId}`, { cache: 'no-store' });
    const designs = res.ok ? await res.json() : [];

    const data = { message: "Studio Design Requests List", designs };
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
