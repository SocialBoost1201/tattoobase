import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AccountSidebarClient from '@/components/account/AccountSidebarClient';

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="flex bg-black min-h-screen">
      {/* PCサイドバー（モバイルでは非表示） */}
      <AccountSidebarClient session={session} />
      
      {/* 右側メインコンテンツ */}
      <div className="flex-1 w-full max-w-5xl mx-auto md:p-8 lg:p-12 overflow-x-hidden pt-14 md:pt-0">
        {children}
      </div>
    </div>
  );
}
