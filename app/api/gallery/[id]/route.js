import { del } from '@vercel/blob';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  const id = parseInt(params.id);
  try {
    // First, find the database record to get the image URL
    const imageRecord = await prisma.galleryImage.findUnique({
      where: { id },
    });

    if (!imageRecord) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Delete the file from Vercel Blob
    await del(imageRecord.imageUrl);

    // Delete the record from our database
    await prisma.galleryImage.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}