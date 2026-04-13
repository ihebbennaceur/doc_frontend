import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/shared/context/LanguageContext';
import { AuthProvider } from '@/shared/context/AuthContext';
import { NotificationProvider } from '@/shared/context/NotificationContext';
import { GoogleAuthWrapper } from '@/shared/providers/GoogleAuthWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fizbo - Seller Platform',
  description: 'Portugal\'s first seller preparation platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <GoogleAuthWrapper>
          <AuthProvider>
            <LanguageProvider>
              <NotificationProvider>
                {children}
              </NotificationProvider>
            </LanguageProvider>
          </AuthProvider>
        </GoogleAuthWrapper>
      </body>
    </html>
  );
}
