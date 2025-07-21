import prisma from '@/lib/prisma';
import { CampaignsClient } from './campaigns-client';

const ITEMS_PER_PAGE = 10;

async function getCampaigns(page = 1) {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  
  const [campaignsFromDb, totalCount] = await Promise.all([
    prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      take: ITEMS_PER_PAGE,
      skip: skip,
      include: {
        _count: {
          select: { donations: true },
        },
      },
    }),
    prisma.campaign.count(),
  ]);

  // Convert Decimal to a plain number before sending to the client
  const campaigns = campaignsFromDb.map(campaign => ({
    ...campaign,
    goalAmount: Number(campaign.goalAmount),
  }));

  return { campaigns, totalCount };
}

export default async function CampaignsPage({ searchParams }) {
  const page = parseInt(searchParams.page || '1', 10);
  const { campaigns, totalCount } = await getCampaigns(page);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return <CampaignsClient campaigns={campaigns} currentPage={page} totalPages={totalPages} />;
}