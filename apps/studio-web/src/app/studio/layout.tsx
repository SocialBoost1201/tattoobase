import StudioSidebar from '@/components/layout/StudioSidebar';
import StudioHeader from '@/components/layout/StudioHeader';

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      {/* 左サイドバー */}
      <StudioSidebar />
      
      {/* メインコンテンツエリア (サイドバー分だけ右にシフト) */}
      <div className="ml-64 flex flex-col flex-1 min-h-screen">
        <StudioHeader />
        
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
