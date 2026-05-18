import type { Metadata } from "next";
import "./globals.css";
import StudioSidebar from "@/components/StudioSidebar";
import StudioHeader from "@/components/StudioHeader";

export const metadata: Metadata = {
  title: "TattooBase Studio Portal",
  description: "スタジオ管理ダッシュボード — TattooBase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <div className="flex min-h-screen">
          {/* Desktop Sidebar */}
          <StudioSidebar />

          {/* Main area */}
          <div className="flex-1 flex flex-col min-w-0 md:ml-64">
            <StudioHeader />
            <main className="flex-1 overflow-auto animate-fade-in">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
