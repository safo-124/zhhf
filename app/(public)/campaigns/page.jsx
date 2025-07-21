import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// This function now calculates the sum of monetary donations for each campaign
async function getActiveCampaigns() {
  const campaigns = await prisma.campaign.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    include: {
      donations: {
        where: {
          donationType: 'Money', // Only consider money donations
        },
        select: {
          amount: true, // Select the amount field
        },
      },
    },
  });

  // Process the campaigns to calculate the total amount raised
  return campaigns.map(campaign => {
    const totalRaised = campaign.donations.reduce((sum, donation) => {
      return sum + Number(donation.amount || 0);
    }, 0);

    return {
      ...campaign,
      totalRaised,
    };
  });
}

export default async function CampaignsIndexPage() {
  const campaigns = await getActiveCampaigns();

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Our Campaigns
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Support a specific cause. See the direct impact of your generosity.
        </p>
      </div>

      {campaigns.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => {
            const goalAmount = Number(campaign.goalAmount);
            const progress = goalAmount > 0 ? (campaign.totalRaised / goalAmount) * 100 : 0;

            return (
              <Link key={campaign.id} href={`/donate?campaignId=${campaign.id}`} className="group block">
                <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary">{campaign.title}</CardTitle>
                    <CardDescription>{campaign.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm">
                      <span className="font-bold text-lg">${campaign.totalRaised.toLocaleString()}</span> raised of a ${goalAmount.toLocaleString()} goal
                    </p>
                  </CardContent>
                  <CardFooter>
                     <Progress value={progress > 100 ? 100 : progress} />
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">There are no active campaigns at this time.</p>
        </div>
      )}
    </main>
  );
}