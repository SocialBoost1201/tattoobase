// 必要データ一覧:
// - User's Identity Verification Data (ID Document references, Status)
// - Consent Forms Signed (PDF links, Signed Dates)
// - Risk profile assessment results (if visible to user)
export default async function AccountRiskPage() {
    const dummyUserId = "user_123";
    const res = await fetch(`http://localhost:3001/user-api/account?userId=${dummyUserId}`, { cache: 'no-store' });
    const profile = res.ok ? await res.json() : null;

    const data = { message: "User Risk/KYC Status", documents: [], profile };
    return (
        <pre>
            {JSON.stringify(data, null, 2)}
        </pre>
    );
}
