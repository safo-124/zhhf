import prisma from '@/lib/prisma';
import { GalleryClient } from './gallery-client';

async function getImages() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return images;
  } catch (error) {
    console.error("Failed to fetch images:", error);
    return [];
  }
}

export default async function GalleryPage() {
  const images = await getImages();
  return <GalleryClient initialImages={images} />;
}