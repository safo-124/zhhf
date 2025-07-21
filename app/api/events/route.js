import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

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

// POST: Create a new event
export async function POST(request) {
  try {
    const { title, description, eventDate, imageUrl } = await request.json();

    if (!title || !description || !eventDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        eventDate: new Date(eventDate),
        imageUrl,
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}