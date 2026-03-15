// 必要データ一覧:
// - 作品(Portfolio Item)のリスト
// - 各画像URL、適用タグ、説明テキスト
// - 担当アーティスト情報
export default async function StudioPortfolioList() {
    const dummyStudioId = "studio_abc";
    const res = await fetch(`http://localhost:3001/studio-api/portfolio?studioId=${dummyStudioId}`, { cache: 'no-store' });
    const items = res.ok ? await res.json() : [];

    const data = { message: "Studio Portfolio Management", items };
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
