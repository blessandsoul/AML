import type { Metadata } from 'next';
import { Noto_Sans_Georgian } from 'next/font/google';
import './globals.css';
import { MainLayout } from '@/components/layout/MainLayout';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/sonner"
import { Agentation } from 'agentation';

const notoSansGeorgian = Noto_Sans_Georgian({ subsets: ['georgian'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Auto Market LGC - პრემიუმ ავტო იმპორტი',
  description: 'სრული სერვისი: ავტომობილების ჩამოყვანა ამერიკიდან და ევროპიდან',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          notoSansGeorgian.variable
        )}
      >
        <MainLayout>{children}</MainLayout>
        <Toaster />
        <Agentation />
      </body>
    </html>
  );
}
