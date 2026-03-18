import Link from 'next/link';
import { Bath } from 'lucide-react';
import Image from 'next/image';

export default function TattooFriendlyCrossSell() {
  return (
    <section className="py-10 border-y border-neutral-900 bg-black relative overflow-hidden">
      {/* 背景の装飾 */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-neutral-900 rounded-full blur-3xl opacity-30 pointer-events-none" />
      
      <div className="relative z-10 px-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-800">
            <Bath className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-white text-lg tracking-tight">TATTOO FRIENDLY</h2>
            <p className="text-neutral-500 text-xs">タトゥーOKなサウナ・温泉を探す</p>
          </div>
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 backdrop-blur-sm">
          <p className="text-neutral-300 text-sm leading-relaxed mb-5">
            TattooBaseでは、タトゥーが入っていても気兼ねなく楽しめる全国の温泉やサウナ施設を厳選してご紹介しています。
          </p>
          
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="relative h-24 rounded-lg overflow-hidden border border-neutral-800">
              <Image src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400&auto=format&fit=crop" alt="Onsen" fill className="object-cover opacity-60 hover:opacity-100 transition-opacity" sizes="150px" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-white font-bold text-sm tracking-wide drop-shadow-md">温泉</span>
              </div>
            </div>
            <div className="relative h-24 rounded-lg overflow-hidden border border-neutral-800">
              <Image src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop" alt="Sauna" fill className="object-cover opacity-60 hover:opacity-100 transition-opacity" sizes="150px" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-white font-bold text-sm tracking-wide drop-shadow-md">サウナ</span>
              </div>
            </div>
          </div>

          <Link href="/facilities" className="block w-full py-3.5 bg-white text-black text-center font-bold text-sm rounded-xl hover:bg-neutral-200 transition-colors">
            タトゥーOKな施設を見る
          </Link>
        </div>
      </div>
    </section>
  );
}
