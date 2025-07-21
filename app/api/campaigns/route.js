import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { NewCampaignNotification } from '@/emails/new-campaign-notification';

const resend = new Resend(process.env.RESEND_API_KEY);

// GET: Fetch all campaigns
export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { donations: true },
        },
      },
    });
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

// POST: Create a new campaign and send email notifications
export async function POST(request) {
  try {
    const { title, description, goalAmount } = await request.json();

    if (!title || !description || !goalAmount) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Step 1: Create the campaign in the database
    const newCampaign = await prisma.campaign.create({
      data: {
        title,
        description,
        goalAmount: parseFloat(goalAmount),
        isActive: true,
      },
    });

    // Step 2: Send notification emails to all subscribers
    try {
      const subscribers = await prisma.subscriber.findMany({
        where: { type: 'Email' }
      });
      
      const subscriberEmails = subscribers.map(s => s.email);

      if (subscriberEmails.length > 0) {
        await resend.emails.send({
          from: 'Zion Helping Hand <onboarding@resend.dev>', // IMPORTANT: Replace with your verified domain
          to: subscriberEmails,
          subject: `New Campaign: ${newCampaign.title}`,
          react: <NewCampaignNotification 
                    title={newCampaign.title} 
                    description={newCampaign.description}
                    goalAmount={Number(newCampaign.goalAmount)} 
                 />,
        });
      }
    } catch (emailError) {
      console.error("Failed to send campaign notification emails:", emailError);
    }

    return NextResponse.json(newCampaign, { status: 201 });

  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}