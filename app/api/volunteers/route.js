import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Fetch all volunteers for the admin dashboard
export async function GET() {
  try {
    const volunteers = await prisma.volunteer.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(volunteers);
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    return NextResponse.json({ error: 'Failed to fetch volunteers' }, { status: 500 });
  }
}

// POST: Handle a new volunteer sign-up
export async function POST(request) {
  try {
    const { name, email, phone, interests, availability } = await request.json();

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Name, email, and phone are required' }, { status: 400 });
    }

    // Check if a volunteer with this email has already signed up
    const existingVolunteer = await prisma.volunteer.findUnique({
      where: { email },
    });

    if (existingVolunteer) {
      return NextResponse.json({ error: 'This email has already been registered.' }, { status: 409 });
    }

    const newVolunteer = await prisma.volunteer.create({
      data: {
        name,
        email,
        phone,
        interests,
        availability,
      },
    });

    return NextResponse.json(newVolunteer, { status: 201 });
  } catch (error) {
    console.error("Error creating volunteer:", error);
    return NextResponse.json({ error: 'Failed to create volunteer' }, { status: 500 });
  }
}