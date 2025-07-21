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
    const blob = await put(filename, request.body, {
      access: 'public',
      addRandomSuffix: true, // <-- THIS IS THE FIX
    });

    const galleryImage = await prisma.galleryImage.create({
      data: {
        imageUrl: blob.url,
        caption: caption,
      },
    });

    return NextResponse.json(galleryImage);
    
  } catch (error) {
    console.error("Upload Error:", error);
    // Forward the specific Vercel Blob error message if it exists
    const errorMessage = error.message || "Failed to process upload.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}