import prisma from '@/lib/prisma';
import { UsersClient } from './users-client.jsx';


const ITEMS_PER_PAGE = 15;

async function getUsers(page = 1) {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      orderBy: { id: 'desc' }, // Sort by ID to get newest first
      take: ITEMS_PER_PAGE,
      skip: skip,
      select: { id: true, name: true, email: true }, // Select only existing fields
    }),
    prisma.user.count(),
  ]);
  return { users, totalCount };
}

export default async function UsersPage({ searchParams }) {
  const page = parseInt(searchParams.page || '1', 10);
  const { users, totalCount } = await getUsers(page);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return <UsersClient users={users} currentPage={page} totalPages={totalPages} />;
}