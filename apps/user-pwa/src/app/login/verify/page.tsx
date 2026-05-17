import Link from 'next/link';

export default function VerifyPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-5 px-4">
      <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h1 className="font-heading text-2xl font-extrabold text-white">ログインが完了しました</h1>
      <p className="text-white/45 text-sm">ご利用ありがとうございます。</p>
      <Link
        href="/account"
        className="mt-2 bg-white text-black font-bold px-6 py-3.5 rounded-2xl hover:bg-white/90 transition-all inline-block font-heading"
      >
        アカウントページへ
      </Link>
    </div>
  );
}
