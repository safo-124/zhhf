import prisma from '@/lib/prisma';
import { SubscribersClient } from './subscribers-client';

const ITEMS_PER_PAGE = 10;

// This function now handles pagination logic
async function getSubscribers(page = 1) {
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: 'desc' },
    take: ITEMS_PER_PAGE,
    skip: skip,
  });

  const totalCount = await prisma.subscriber.count();

  return { subscribers, totalCount };
}

// The page now gets the page number from the URL
export default async function SubscribersPage({ searchParams }) {
  const page = parseInt(searchParams.page || '1', 10);
  const { subscribers, totalCount } = await getSubscribers(page);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <SubscribersClient
      subscribers={subscribers}
      currentPage={page}
      totalPages={totalPages}
    />
  );
}