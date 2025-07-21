import prisma from '@/lib/prisma'; // <== Import our new Prisma client
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, phone, donation_type } = await request.json();

    if (!name || !email || !donation_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newDonation = await prisma.donation.create({
      data: {
        name,
        email,
        phone,
        donationType: donation_type, // Notice the camelCase here
      },
    });

    return NextResponse.json({ message: 'Donation created successfully', data: newDonation }, { status: 201 });
  } catch (error) {
    console.error('Prisma error:', error);
    return NextResponse.json({ error: 'An error occurred while creating the donation.' }, { status: 500 });
  }
}