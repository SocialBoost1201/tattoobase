import Link from 'next/link';

const SPOTS = [
  { label: '温泉・銭湯', emoji: '♨️', count: '28施設', href: '/facilities?type=ONSEN' },
  { label: 'ジム・プール', emoji: '🏊', count: '15施設', href: '/facilities?type=GYM' },
  { label: 'ホテル', emoji: '🏨', count: '42施設', href: '/facilities?type=HOTEL' },
  { label: 'ビーチ', emoji: '🏖️', count: '9施設', href: '/facilities?type=BEACH' },
];

export default function TattooFriendlyCrossSell() {
  return (
    <section className="py-2 px-4">
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <h2 className="font-heading font-extrabold text-white text-xl tracking-tight">TATTOO FRIENDLY</h2>
          <p className="text-white/35 text-xs mt-0.5">タトゥーOKな施設を全国から探す</p>
        </div>
        <Link href="/facilities" className="text-[11px] font-semibold text-white/40 hover:text-white transition-colors uppercase tracking-widest">
          すべて見る →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {SPOTS.map((spot) => (
          <Link key={spot.label} href={spot.href} className="group block">
            <div className="glass glass-hover rounded-2xl p-4 flex flex-col gap-2 border border-white/8 hover:border-white/20 transition-all">
              <span className="text-2xl">{spot.emoji}</span>
              <div>
                <p className="text-white font-semibold text-sm">{spot.label}</p>
                <p className="text-white/35 text-xs mt-0.5">{spot.count}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link href="/facilities" className="block mt-4 w-full py-3.5 bg-white text-black text-center font-bold text-sm rounded-2xl hover:bg-white/90 transition-all font-heading">
        タトゥーOKな施設をすべて見る
      </Link>
    </section>
  );
}
