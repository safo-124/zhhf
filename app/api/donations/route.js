import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { name, email, phone, donation_type, amount, campaignId } = await request.json();

  if (!name || !email || !donation_type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Use the correct Prisma field name `donationType`
  const donationData = {
    name,
    email,
    phone,
    donationType: donation_type, // <-- THE FIX IS HERE
  };

  if (campaignId) {
    donationData.campaignId = parseInt(campaignId);
  }
  
  if (amount) {
    donationData.amount = parseFloat(amount);
  }

  try {
    const newDonation = await prisma.donation.create({
      data: donationData,
    });
    return NextResponse.json({ message: 'Donation created successfully', data: newDonation }, { status: 201 });
  } catch (error) {
    console.error('Prisma error:', error);
    return NextResponse.json({ error: 'Failed to create donation' }, { status: 500 });
  }
}