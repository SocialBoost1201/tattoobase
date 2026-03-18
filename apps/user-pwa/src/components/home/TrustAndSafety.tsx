import { ShieldCheck, MessageCircle, Wallet } from 'lucide-react';

export default function TrustAndSafety() {
  const promises = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      title: "徹底した衛生管理",
      description: "ガイドラインをクリアした安全なスタジオのみを掲載しています。"
    },
    {
      icon: <Wallet className="w-6 h-6 text-white" />,
      title: "明朗・安心な会計",
      description: "不当な追加請求なし。事前に目安の料金を確認できます。"
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-white" />,
      title: "事前のチャット相談",
      description: "デザインや痛みの不安など、予約前に直接アーティストへ相談可能。"
    }
  ];

  return (
    <section className="py-8 border-y border-neutral-900 bg-neutral-950/50">
      <div className="text-center mb-6">
        <h2 className="font-heading font-extrabold text-white text-lg tracking-widest uppercase">3 Promises</h2>
        <p className="text-neutral-500 text-xs mt-1">TattooBaseが選ばれる理由</p>
      </div>
      
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {promises.map((p, i) => (
          <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
            <div className="shrink-0 w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center border border-neutral-700">
              {p.icon}
            </div>
            <div>
              <h3 className="text-white font-bold text-sm mb-1">{p.title}</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">{p.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
