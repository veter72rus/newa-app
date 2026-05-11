import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'נ.ע.א - השוואת תשואות מסלולי ביטוח',
  description: 'השוואת תשואות במסלולי ביטוח וחיסכון בישראל',
  keywords: ['תשואות', 'ביטוח', 'חיסכון', 'ישראל', 'מסלולי השקעה'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <meta httpEquiv="Content-Language" content="he" />
      </head>
      <body>{children}</body>
    </html>
  );
}
