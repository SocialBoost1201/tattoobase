import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: {
    default: "TattooBase - 日本最大のタトゥーアーティスト予約プラットフォーム",
    template: "%s | TattooBase",
  },
  description: "タトゥーアーティストの作品を見てスタイルを選び、そのままオンライン予約できる日本最大のプラットフォーム。和彫・ブラックアンドグレー・ミニマル等、全スタイル対応。",
  keywords: ["タトゥー", "刺青", "タトゥースタジオ", "和彫", "ブラックアンドグレー", "ワンポイント", "タトゥーアーティスト", "予約"],
  authors: [{ name: "TattooBase" }],
  creator: "TattooBase",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "TattooBase",
    title: "TattooBase - 日本最大のタトゥーアーティスト予約プラットフォーム",
    description: "タトゥーアーティストの作品を見てスタイルを選び、そのままオンライン予約。",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@tattoobase_jp",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TattooBase",
  },
};


import SmoothScroller from "@/components/layout/SmoothScroller";
import AIStyleAssistant from "@/components/ui/AIStyleAssistant";
import SeoFooter from "@/components/layout/SeoFooter";
import AddToHomeScreen from "@/components/ui/AddToHomeScreen";

// (中略)

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} ${poppins.variable} bg-black text-white`}>
        <SmoothScroller>
          <Header />
          {/* モバイル: max-w-xl / PC: max-w-7xl */}
          <main className="mx-auto px-4 pt-6 pb-24 min-h-screen
            max-w-xl
            md:max-w-7xl md:px-8 md:pb-12">
            {children}
          </main>
          <SeoFooter />
          {/* BottomNavはスマホのみ */}
          <div className="md:hidden">
            <BottomNav />
          </div>
          {/* E-3: AIスタイルアシスタント（全ページ共通フローティング） */}
          <AIStyleAssistant />
          {/* H: Add to Home Screen プロンプト（モバイルのみ） */}
          <div className="md:hidden">
            <AddToHomeScreen />
          </div>
        </SmoothScroller>
      </body>
    </html>
  );
}



