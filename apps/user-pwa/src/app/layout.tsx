import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "TatooBase - Find Your Artist. Book Your Ink.",
  description: "日本最大のタトゥーアーティスト予約プラットフォーム。アーティストの作品から、スタジオ予約まで。",
};

import SmoothScroller from "@/components/layout/SmoothScroller";

// (中略)

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${poppins.variable} bg-black text-white`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SmoothScroller>
            <Header />
            <main className="max-w-xl mx-auto px-4 pt-6 pb-24 min-h-screen">
              {children}
            </main>
            <BottomNav />
          </SmoothScroller>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
