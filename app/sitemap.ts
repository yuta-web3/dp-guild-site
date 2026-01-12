import { MetadataRoute } from 'next';
import { client } from '@/lib/microcms';
import type { BlogListResponse } from '@/lib/microcms';

const BASE_URL = 'https://dp-guild.com';

// 全ブログ記事を取得（ページネーション対応）
async function getAllBlogs() {
  const allBlogs: { id: string; updatedAt: string }[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const response = await client.get<BlogListResponse>({
      endpoint: 'blogs',
      queries: {
        limit,
        offset,
        fields: 'id,updatedAt',
      },
    });

    allBlogs.push(...response.contents);

    if (response.contents.length < limit) {
      break;
    }
    offset += limit;
  }

  return allBlogs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/results`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // ブログ記事（microCMSから動的に取得）
  try {
    const blogs = await getAllBlogs();
    const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => ({
      url: `${BASE_URL}/blog/${blog.id}`,
      lastModified: new Date(blog.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    return [...staticPages, ...blogPages];
  } catch (error) {
    console.error('Failed to fetch blogs for sitemap:', error);
    return staticPages;
  }
}
