import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { NewEventNotification } from '@/emails/new-event-notification';

// Initialize Resend with your API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// GET: Fetch all events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        eventDate: 'desc',
      },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

// POST: Create a new event and send email notifications
export async function POST(request) {
  try {
    const { title, description, eventDate, imageUrl } = await request.json();

    if (!title || !description || !eventDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Step 1: Create the event in the database
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        eventDate: new Date(eventDate),
        imageUrl,
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
          from: 'Zion Helping Hand <onboarding@resend.dev>', // IMPORTANT: Replace with your verified Resend domain
          to: subscriberEmails,
          subject: `New Event Announcement: ${newEvent.title}`,
          react: <NewEventNotification title={newEvent.title} description={newEvent.description} />,
        });
      }
    } catch (emailError) {
      // Log the error but don't fail the entire request
      console.error("Failed to send notification emails:", emailError);
    }

    return NextResponse.json(newEvent, { status: 201 });
    
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}