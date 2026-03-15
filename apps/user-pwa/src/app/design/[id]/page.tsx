// 必要データ一覧:
// - Design Request Detail (Status, Description, Reference Image URLs)
// - Artist Info
// - Proposals & Quotes from Artist
// - Communication/Message history (if applicable)
export default async function DesignDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const res = await fetch(`http://localhost:3001/user-api/designs/${id}`, { cache: 'no-store' });
    const design = res.ok ? await res.json() : null;

    const data = { message: "Design Request Data", requestParams: { id }, design };
    return (
        <pre>
            {JSON.stringify(data, null, 2)}
        </pre>
    );
}
