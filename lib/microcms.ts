import { createClient } from 'microcms-js-sdk';

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

// 型定義
export type Category = {
  id: string;
  name: string;
};

export type FAQ = {
  fieldId: string;
  question: string;
  answer: string;
};

export type Blog = {
  id: string;
  title: string;
  description: string;
  aio_answer: string;
  tldr: string;
  content: string;
  eyecatch?: {
    url: string;
    width: number;
    height: number;
  };
  category?: Category;
  faq?: FAQ[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
};

export type BlogListResponse = {
  contents: Blog[];
  totalCount: number;
  offset: number;
  limit: number;
};

// ブログ一覧取得
export async function getBlogs(limit?: number, offset?: number) {
  const response = await client.get<BlogListResponse>({
    endpoint: 'blogs',
    queries: {
      limit: limit || 10,
      offset: offset || 0,
      orders: '-publishedAt',
    },
  });
  return response;
}

// ブログ詳細取得
export async function getBlogById(id: string) {
  const response = await client.get<Blog>({
    endpoint: 'blogs',
    contentId: id,
  });
  return response;
}

// カテゴリ別ブログ取得
export async function getBlogsByCategory(categoryId: string, limit?: number) {
  const response = await client.get<BlogListResponse>({
    endpoint: 'blogs',
    queries: {
      filters: `category[equals]${categoryId}`,
      limit: limit || 10,
      orders: '-publishedAt',
    },
  });
  return response;
}

// ブログ全件取得（ページネーション対応）
export async function getAllBlogs() {
  const allContents: Blog[] = [];
  let offset = 0;
  const limit = 100;
  
  while (true) {
    const response = await client.get<BlogListResponse>({
      endpoint: 'blogs',
      queries: {
        limit,
        offset,
        orders: '-publishedAt',
      },
    });
    
    allContents.push(...response.contents);
    
    if (allContents.length >= response.totalCount) {
      break;
    }
    offset += limit;
  }
  
  return { contents: allContents, totalCount: allContents.length };
}

// ブログ一覧用：一覧に要る項目だけを全件取る（本文は取らない。重いため）
export type BlogSummary = Pick<Blog, 'id' | 'title' | 'description' | 'category' | 'publishedAt' | 'eyecatch'>;

export async function getBlogSummaries() {
  const all: BlogSummary[] = [];
  let offset = 0;
  const limit = 100;
  while (true) {
    const res = await client.get<{ contents: BlogSummary[]; totalCount: number }>({
      endpoint: 'blogs',
      queries: {
        limit,
        offset,
        orders: '-publishedAt',
        fields: 'id,title,description,category,publishedAt,eyecatch',
      },
    });
    all.push(...res.contents);
    if (all.length >= res.totalCount || res.contents.length === 0) break;
    offset += limit;
  }
  return all;
}
