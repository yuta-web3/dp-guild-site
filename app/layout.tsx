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
        {children}
      </body>
    </html>
  );
}
