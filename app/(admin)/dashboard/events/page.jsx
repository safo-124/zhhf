import prisma from '@/lib/prisma';
import { EventsClient } from './events-client';

const ITEMS_PER_PAGE = 8;

async function getEvents(page = 1) {
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const events = await prisma.event.findMany({
    orderBy: { eventDate: 'desc' },
    take: ITEMS_PER_PAGE,
    skip: skip,
  });

  const totalCount = await prisma.event.count();

  return { events, totalCount };
}

export default async function EventsPage({ searchParams }) {
  const page = parseInt(searchParams.page || '1', 10);
  const { events, totalCount } = await getEvents(page);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <EventsClient
      events={events}
      currentPage={page}
      totalPages={totalPages}
    />
  );
}