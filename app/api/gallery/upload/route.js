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

  try {
    // Step 1: Upload the file to Vercel Blob
    const blob = await put(filename, request.body, {
      access: 'public',
    });

    // Step 2: Save the public URL from the blob and the caption to our database
    const galleryImage = await prisma.galleryImage.create({
      data: {
        imageUrl: blob.url, // Use the URL from the successful upload
        caption: caption,
      },
    });

    // Return the database record as confirmation
    return NextResponse.json(galleryImage);

  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Failed to process upload." }, { status: 500 });
  }
}