import Link from 'next/link';
import { API_BASE } from '@/lib/api';

async function getProfile() {
  try {
    const res = await fetch(`${API_BASE}/user-api/account?userId=user_123`, { cache: 'no-store' });
    if (res.ok) return res.json();
  } catch {
    // API not available
  }
  return {
    kycStatus: 'UNVERIFIED',
    behaviorScore: 100,
    tier: 'LOW',
  };
}

const TIER_COLORS: Record<string, string> = {
  LOW:    'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  MEDIUM: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  HIGH:   'text-red-400 border-red-500/30 bg-red-500/10',
};

const KYC_LABELS: Record<string, string> = {
  VERIFIED: '本人確認済み',
  PENDING: '確認中',
  UNVERIFIED: '未確認',
};

export default async function AccountRiskPage() {
  const profile = await getProfile();
  const tier = profile?.tier ?? 'LOW';
  const kyc = profile?.kycStatus ?? 'UNVERIFIED';
  const score = profile?.behaviorScore ?? 100;
  const tierColor = TIER_COLORS[tier] ?? TIER_COLORS.LOW;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">アカウント状態</h1>
        <p className="text-white/45 text-xs mt-1">本人確認・信頼スコアの確認</p>
      </div>

      {/* Behavior score */}
      <div className="glass rounded-2xl p-5 text-center">
        <p className="text-white/35 text-[10px] uppercase tracking-widest">信頼スコア</p>
        <p className="text-5xl font-extrabold text-white mt-2 font-heading">{score}</p>
        <div className="mt-3 inline-flex items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${tierColor}`}>
            {tier} TIER
          </span>
        </div>
        <div className="mt-4 h-2 bg-white/8 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400/70 to-emerald-300/70 rounded-full transition-all"
            style={{ width: `${Math.min(score, 100)}%` }}
          />
        </div>
      </div>

      {/* KYC status */}
      <div className="glass rounded-2xl divide-y divide-white/8">
        <div className="px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-semibold">本人確認 (KYC)</p>
            <p className="text-white/35 text-xs mt-0.5">{KYC_LABELS[kyc] ?? kyc}</p>
          </div>
          {kyc !== 'VERIFIED' && (
            <Link href="/account/kyc" className="text-xs font-bold bg-white text-black px-3 py-1.5 rounded-lg hover:bg-white/90 transition-all">
              確認する
            </Link>
          )}
          {kyc === 'VERIFIED' && (
            <span className="text-emerald-400 text-xs font-bold">✓ 完了</span>
          )}
        </div>
        <div className="px-4 py-4">
          <p className="text-white/35 text-xs leading-relaxed">
            本人確認を完了すると予約がスムーズになり、信頼スコアが向上します。スコアが高いほどデポジット不要での予約が可能になります。
          </p>
        </div>
      </div>

      <Link href="/account" className="block text-center text-white/30 text-xs hover:text-white/60 transition-colors">
        ← アカウントに戻る
      </Link>
    </div>
  );
}
