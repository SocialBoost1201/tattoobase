// 必要データ一覧:
// - List of User's Design Requests (Pending, Quoted, Accepted, Rejected)
// - Design request summaries (Artist Name, Target Date, Status)
// - Pagination metadata
export default async function AccountDesignsPage() {
    const dummyUserId = "user_123";
    const res = await fetch(`http://localhost:3001/user-api/account/designs?userId=${dummyUserId}`, { cache: 'no-store' });
    const designs = res.ok ? await res.json() : [];

    const data = { message: "User Design Requests", designs };
    return (
        <pre>
            {JSON.stringify(data, null, 2)}
        </pre>
    );
}
