import prisma from '@/lib/prisma';
import { BlogClient } from './blog-client';

const ITEMS_PER_PAGE = 10;

async function getPosts(page = 1) {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      orderBy: { updatedAt: 'desc' },
      take: ITEMS_PER_PAGE,
      skip: skip,
    }),
    prisma.post.count(),
  ]);
  return { posts, totalCount };
}

export default async function BlogPage({ searchParams }) {
  const page = parseInt(searchParams.page || '1', 10);
  const { posts, totalCount } = await getPosts(page);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return <BlogClient posts={posts} currentPage={page} totalPages={totalPages} />;
}