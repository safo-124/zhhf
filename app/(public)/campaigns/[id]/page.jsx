import prisma from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from '@/components/ui/button';
import { HandHeart, Users } from 'lucide-react';

async function getCampaign(id) {
  const campaignId = parseInt(id);
  if (isNaN(campaignId)) {
    notFound();
  }

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      donations: {
        where: { donationType: 'Money', amount: { not: null } },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          name: true,
          amount: true,
        },
      },
    },
  });

  if (!campaign || !campaign.isActive) {
    notFound();
  }

  const totalRaised = campaign.donations.reduce((sum, donation) => sum + Number(donation.amount), 0);
  
  return { ...campaign, totalRaised };
}

export default async function CampaignDetailPage({ params }) {
  const campaign = await getCampaign(params.id);
  const goalAmount = Number(campaign.goalAmount);
  const progress = goalAmount > 0 ? (campaign.totalRaised / goalAmount) * 100 : 0;

  return (
    <main className="bg-gray-50/50">
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight">{campaign.title}</h1>
            <p className="text-lg text-muted-foreground">{campaign.description}</p>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Campaign Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progress > 100 ? 100 : progress} className="h-4" />
                <div>
                  <p className="text-2xl font-bold">${campaign.totalRaised.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    raised of a ${goalAmount.toLocaleString()} goal
                  </p>
                </div>
                <Link href={`/donate?campaignId=${campaign.id}`} className="w-full">
                  <Button size="lg" className="w-full">
                    <HandHeart className="mr-2 h-5 w-5" /> Donate to this Campaign
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="h-5 w-5" /> Recent Supporters
                </CardTitle>
              </CardHeader>
              <CardContent>
                {campaign.donations.length > 0 ? (
                  <ul className="space-y-3">
                    {campaign.donations.map((donation, index) => (
                      <li key={index} className="flex justify-between items-center text-sm">
                        <span className="font-medium">{donation.name}</span>
                        <span className="text-muted-foreground">
                          ${Number(donation.amount).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Be the first to donate!</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}