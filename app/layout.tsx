import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '宝宝发育早知道 - 宝宝身体发育评估',
  description: '根据宝宝年龄、身高、体重，评估宝宝身体发育情况，并提供科学的养育建议',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>{children}</body>
    </html>
  );
}