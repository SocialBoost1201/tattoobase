// 必要データ一覧:
// - Portfolio Work Info (Image URL, Description, Style Tags)
// - Artist Info (Name, ID, Avatar)
// - Related Works
export default async function PortfolioDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const res = await fetch(`http://localhost:3001/user-api/portfolios/${id}`, { cache: 'no-store' });
    const item = res.ok ? await res.json() : null;

    const data = { message: "Portfolio Item", requestParams: { id }, item };
    return (
        <pre>
            {JSON.stringify(data, null, 2)}
        </pre>
    );
}
