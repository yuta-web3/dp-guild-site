import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServicePage from '@/components/service/ServicePage';
import { getService, serviceSlugs } from '@/lib/services';
import './lp.css';

// サービスページの器。中身は lib/services.ts のデータで差し替わる。
// サービスを増やすときは lib/services.ts に1件足すだけ。

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `/services/${service.slug}`,
      type: 'website',
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  // 検索結果に価格を出すための構造化データ
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.label,
    description: service.metaDescription,
    provider: {
      '@type': 'Organization',
      name: '株式会社DP-GUILD',
      url: 'https://dp-guild.com',
    },
    areaServed: 'JP',
    offers: {
      '@type': 'Offer',
      price: String(service.price),
      priceCurrency: 'JPY',
      url: `https://dp-guild.com/services/${service.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicePage service={service} />
    </>
  );
}
