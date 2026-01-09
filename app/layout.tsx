import type { Metadata } from "next";
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
  },
  twitter: {
    card: "summary_large_image",
    title: "DP-GUILD｜中小企業のWeb・SNS・DX支援",
    description: "滋賀県甲賀市を拠点に、中小企業の『何から手をつけるか』を一緒に決める会社。",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        {children}
      </body>
    </html>
  );
}
