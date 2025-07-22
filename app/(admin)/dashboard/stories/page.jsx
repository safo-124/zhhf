import prisma from '@/lib/prisma';
import { StoriesClient } from './stories-client';

const ITEMS_PER_PAGE = 10;

async function getStories(page = 1) {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const [stories, totalCount] = await Promise.all([
    prisma.story.findMany({
      orderBy: { updatedAt: 'desc' },
      take: ITEMS_PER_PAGE,
      skip: skip,
    }),
    prisma.story.count(),
  ]);
  return { stories, totalCount };
}

export default async function StoriesPage({ searchParams }) {
  const page = parseInt(searchParams.page || '1', 10);
  const { stories, totalCount } = await getStories(page);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return <StoriesClient stories={stories} currentPage={page} totalPages={totalPages} />;
}