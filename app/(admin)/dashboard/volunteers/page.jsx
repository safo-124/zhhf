import prisma from '@/lib/prisma';
import { VolunteersClient } from './volunteers-client';

const ITEMS_PER_PAGE = 15;

async function getVolunteers(page = 1) {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const [volunteers, totalCount] = await Promise.all([
    prisma.volunteer.findMany({
      orderBy: { createdAt: 'desc' },
      take: ITEMS_PER_PAGE,
      skip: skip,
    }),
    prisma.volunteer.count(),
  ]);
  return { volunteers, totalCount };
}

export default async function VolunteersPage({ searchParams }) {
  const page = parseInt(searchParams.page || '1', 10);
  const { volunteers, totalCount } = await getVolunteers(page);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return <VolunteersClient volunteers={volunteers} currentPage={page} totalPages={totalPages} />;
}