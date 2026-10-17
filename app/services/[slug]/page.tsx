import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServicePage from '@/components/service/ServicePage';
import { getService, serviceSlugs } from '@/lib/services';
import '../../lp-base.css';
import './service.css';

// サービスページの器。中身は lib/services/<slug>.ts のデータで差し替わる。
// サービスを増やすときは lib/services/ に1ファイル足し、lib/services/index.ts の一覧に1行足すだけ。

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
    // 金額を出すページだけ価格を載せる。見積りのページは載せない
    ...(service.price.kind === 'fixed'
      ? {
          offers: service.price.plans.map((p) => ({
            '@type': 'Offer',
            name: p.name,
            price: String(p.amount),
            priceCurrency: 'JPY',
            url: `https://dp-guild.com/services/${service.slug}`,
          })),
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* JS が無いときは、2画面目以降の出現を待たずに全部見せる（FV は CSS だけで出るので不要） */}
      <noscript>
        <style>
          {'.lp.svc .rv{opacity:1!important;transform:none!important}' +
            '.lp.svc .steps[hidden]{display:block!important}.lp.svc .seg{display:none}'}
        </style>
      </noscript>
      <ServicePage service={service} />
    </>
  );
}
