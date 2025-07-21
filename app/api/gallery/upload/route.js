import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  const caption = searchParams.get('caption') || '';

  if (!filename || !request.body) {
    return NextResponse.json({ error: 'No filename or file provided.' }, { status: 400 });
  }

  // Upload the file to Vercel Blob
  const blob = await put(filename, request.body, {
    access: 'public',
  });

  // Save the public URL and caption to our database
  const galleryImage = await prisma.galleryImage.create({
    data: {
      imageUrl: blob.url,
      caption: caption,
    },
  });

  return NextResponse.json(galleryImage);
}