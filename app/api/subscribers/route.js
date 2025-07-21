import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Fetch all subscribers
export async function GET() {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(subscribers);
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}

// POST: Create a new subscriber
export async function POST(request) {
  try {
    const { email, phone, type = 'Email' } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if subscriber already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      return NextResponse.json({ error: 'This email is already subscribed.' }, { status: 409 }); // 409 Conflict
    }

    const newSubscriber = await prisma.subscriber.create({
      data: {
        email,
        phone, // Optional phone number
        type,
      },
    });

    return NextResponse.json(newSubscriber, { status: 201 });
  } catch (error)
  {
    console.error("Error creating subscriber:", error);
    return NextResponse.json({ error: "Failed to create subscriber" }, { status: 500 });
  }
}