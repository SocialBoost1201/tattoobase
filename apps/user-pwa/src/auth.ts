import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import Resend from 'next-auth/providers/resend';

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY ?? 'resend_dev_placeholder',
      from: 'noreply@tattoobase.dev',
      // 開発環境: メール未送信、コンソールにリンクを出力
      sendVerificationRequest: async ({ url }) => {
        if (process.env.NODE_ENV === 'development' || !process.env.AUTH_RESEND_KEY || process.env.AUTH_RESEND_KEY === 'resend_dev_placeholder') {
          console.log('\n🔑 [DEV] マジックリンク:');
          console.log(url);
          console.log('');
          return;
        }
        // 本番: Resend でメール送信（AUTH_RESEND_KEY が設定されている場合）
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.AUTH_RESEND_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'noreply@tattoobase.dev',
            to: url.split('email=')[1]?.split('&')[0] ?? '',
            subject: 'TattooBase ログインリンク',
            html: `<p><a href="${url}">こちらをクリックしてログインしてください</a></p>`,
          }),
        });
        if (!res.ok) throw new Error('メール送信に失敗しました');
      },
    }),
  ],
  pages: {
    signIn: '/login',
    verifyRequest: '/login/verify',
  },
  session: {
    strategy: 'database',
  },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});
