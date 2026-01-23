import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


// Organization JSON-LD for structured data
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '株式会社DP-GUILD',
  alternateName: 'DP-GUILD',
  url: 'https://dp-guild.com',
  logo: 'https://dp-guild.com/logo.png',
  description: '滋賀県甲賀市を拠点に、中小企業の「何から手をつけるか」を一緒に決める会社。Web制作・SNS運用・DX支援を、判断から実行・改善まで伴走します。',
  foundingDate: '2019-02-19',
  address: {
    '@type': 'PostalAddress',
    postalCode: '520-3333',
    addressRegion: '滋賀県',
    addressLocality: '甲賀市',
    streetAddress: '甲南町希望ケ丘3丁目12-9',
    addressCountry: 'JP',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    url: 'https://dp-guild.com/contact',
  },
  sameAs: [],
};

// LocalBusiness JSON-LD for local SEO
const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://dp-guild.com/#localbusiness',
  name: '株式会社DP-GUILD',
  image: 'https://dp-guild.com/og-image.png',
  url: 'https://dp-guild.com',
  description: '滋賀県甲賀市を拠点に、中小企業のWeb制作・SNS運用・DX支援を行う会社。',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '甲南町希望ケ丘3丁目12-9',
    addressLocality: '甲賀市',
    addressRegion: '滋賀県',
    postalCode: '520-3333',
    addressCountry: 'JP',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 34.9528,
    longitude: 136.1564,
  },
  areaServed: [
    { '@type': 'City', name: '甲賀市' },
    { '@type': 'City', name: '湖南市' },
    { '@type': 'City', name: '東近江市' },
    { '@type': 'AdministrativeArea', name: '滋賀県' },
  ],
  serviceType: [
    'Web制作',
    'ホームページ制作',
    'SNS運用代行',
    'SNS運用支援',
    'DX支援',
    'IT導入支援',
    'SEO対策',
  ],
  priceRange: '$$',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
};

export const metadata: Metadata = {
  title: {
    default: "DP-GUILD｜中小企業のWeb・SNS・DX支援",
    template: "%s｜DP-GUILD",
  },
  description: "滋賀県甲賀市を拠点に、中小企業の『何から手をつけるか』を一緒に決める会社。Web制作・SNS運用・DX支援を、判断から実行・改善まで伴走します。",
  metadataBase: new URL("https://dp-guild.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "DP-GUILD｜中小企業のWeb・SNS・DX支援",
    description: "滋賀県甲賀市を拠点に、中小企業の『何から手をつけるか』を一緒に決める会社。",
    url: "https://dp-guild.com",
    siteName: "DP-GUILD",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "https://dp-guild.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "DP-GUILD",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DP-GUILD｜中小企業のWeb・SNS・DX支援",
    description: "滋賀県甲賀市を拠点に、中小企業の『何から手をつけるか』を一緒に決める会社。",
    images: ["https://dp-guild.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WWT9VVHRME"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WWT9VVHRME');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
        {children}
      </body>
    </html>
  );
}
