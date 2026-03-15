import Link from 'next/link';

export default function VerifyPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4 px-4">
      <div className="text-5xl">✅</div>
      <h1 className="font-heading text-2xl font-bold text-dark-50">ログインが完了しました</h1>
      <p className="text-dark-400 text-sm">ご利用ありがとうございます。</p>
      <Link
        href="/account"
        className="mt-4 bg-brand-500 hover:bg-brand-400 text-dark-900 font-semibold px-6 py-3 rounded-xl transition-colors duration-200 inline-block"
      >
        アカウントページへ
      </Link>
    </div>
  );
}
