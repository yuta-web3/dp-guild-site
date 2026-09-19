import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NeedPage from '@/components/need/NeedPage';
import { getNeed, needSlugs } from '@/lib/needs';
import '../../lp-base.css';
import '../../top.css';
import './need.css';

// 器はこの1枚。増やすときは lib/needs.ts にデータを足すだけ。

export const dynamicParams = false;

export function generateStaticParams() {
  return needSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const need = getNeed(slug);
  if (!need) return {};
  return {
    title: need.metaTitle,
    description: need.metaDesc,
    alternates: { canonical: `https://dp-guild.com/needs/${need.slug}` },
    openGraph: {
      title: need.metaTitle,
      description: need.metaDesc,
      url: `https://dp-guild.com/needs/${need.slug}`,
      type: 'website',
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const need = getNeed(slug);
  if (!need) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: need.approaches.map((a) => ({
              '@type': 'Question',
              name: `${a.name}は、どれくらいで効きますか`,
              acceptedAnswer: {
                '@type': 'Answer',
                text: `${a.effect}。効き始めるまで${a.speed}。${a.stock}。社内で要るものは${a.needs}。`,
              },
            })),
          }),
        }}
      />
      <NeedPage need={need} />
    </>
  );
}
