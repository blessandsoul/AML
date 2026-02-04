import type { Metadata } from 'next';
import { Noto_Sans_Georgian } from 'next/font/google';
import './globals.css';
import { MainLayout } from '@/components/layout/MainLayout';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/sonner"
import { Agentation } from 'agentation';
import { QueryProvider } from '@/providers/query-provider';
import { ReduxProvider } from '@/providers/redux-provider';

const notoSansGeorgian = Noto_Sans_Georgian({ subsets: ['georgian'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL('https://automarket.ge'),
  title: {
    default: 'Auto Market LGC - ავტო იმპორტი ამერიკიდან და ევროპიდან',
    template: '%s | Auto Market LGC'
  },
  description: 'სრული სერვისი: ავტომობილების შერჩევა, შეძენა აუქციონებზე (Copart, IAAI), ტრანსპორტირება და დაზღვევა. დაზოგეთ 30%-მდე ჩვენთან ერთად.',
  keywords: ['ავტო იმპორტი', 'მანქანები ამერიკიდან', 'copart ge', 'iaai ge', 'manheim', 'ავტო აუქციონი', 'ტრანსპორტირება'],
  alternates: {
    canonical: '/',
    languages: {
      'ka-GE': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: 'Auto Market LGC - ავტო იმპორტი გარანტიით',
    description: 'შეიძინეთ სასურველი ავტომობილი ამერიკასა და ევროპაში დილერის ფასად. სრული ისტორია, დაზღვევა და ტრანსპორტირება.',
    url: 'https://automarket.ge',
    siteName: 'Auto Market LGC',
    locale: 'ka_GE',
    type: 'website',
    images: [
      {
        url: 'https://automarket.ge/og-image.jpg', // Ensure this image exists eventually
        width: 1200,
        height: 630,
        alt: 'Auto Market LGC Hero Image',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE', // Placeholder for user to fill later
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "Auto Market LGC",
        "url": "https://automarket.ge",
        "logo": "https://automarket.ge/logo.png",
        "sameAs": [
          "https://facebook.com/automarketlgc",
          "https://instagram.com/automarketlgc",
          "https://twitter.com/automarketlgc"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+995599000000",
          "contactType": "customer service",
          "areaServed": "GE",
          "availableLanguage": ["ka", "en", "ru"]
        }
      },
      {
        "@type": "LocalBusiness",
        "name": "Auto Market LGC - Tbilisi",
        "image": "https://automarket.ge/office-tbilisi.jpg",
        "telephone": "+995322054244",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "2 Dimitri Uznadze St",
          "addressLocality": "Tbilisi",
          "postalCode": "0102",
          "addressCountry": "GE"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 41.6938,
          "longitude": 44.8015
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          ],
          "opens": "10:00",
          "closes": "19:00"
        }
      }
    ]
  };

  return (
    <html lang="ka" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          notoSansGeorgian.variable
        )}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ReduxProvider>
          <QueryProvider>
            <MainLayout>{children}</MainLayout>
            <Toaster />
          </QueryProvider>
        </ReduxProvider>
        <Agentation />
      </body>
    </html>
  );
}
