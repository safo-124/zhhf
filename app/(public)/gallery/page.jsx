import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';

// --- Data Fetching ---
async function getImages() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return images;
}

// --- Child Components for the Page ---

function GalleryHero() {
  return (
    <section className="relative w-full py-24 md:py-32 text-center bg-gradient-to-br from-blue-900 to-green-800 text-white">
      <div className="absolute inset-0 bg-black/40 z-10" />
      <Image
        src="/gallery-hero.jpg" // You can create and add this image to your /public folder
        alt="A vibrant collage of the foundation's work"
        fill
        className="object-cover"
        priority
      />
      <div className="relative z-20 container mx-auto px-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Our Gallery
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
          Moments of impact, stories of hope, and the faces of our community.
        </p>
      </div>
    </section>
  );
}

function GalleryGrid({ images }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {images.map((image) => (
        <div
          key={image.id}
          className="group relative aspect-square overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <Image
            src={image.imageUrl}
            alt={image.caption || 'Community impact image'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {image.caption && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white font-medium text-sm md:text-base">
                {image.caption}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function EmptyGalleryState() {
    return (
        <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-xl bg-white">
          <div className="max-w-md mx-auto">
            <Image
              src="/empty-gallery.svg" // Replace with your empty state illustration
              alt="Empty gallery"
              width={200}
              height={200}
              className="mx-auto opacity-70"
            />
            <h3 className="mt-6 text-lg font-medium text-gray-900">
              Our gallery is currently empty
            </h3>
            <p className="mt-2 text-gray-500">
              Check back soon for updates on our latest activities and events.
            </p>
          </div>
        </div>
    );
}


// --- Main Page Component ---
export default async function PublicGalleryPage() {
  const images = await getImages();

  return (
    <main className="min-h-screen bg-gray-50">
      <GalleryHero />

      <section className="container mx-auto px-4 py-16">
        {images.length > 0 ? (
          <GalleryGrid images={images} />
        ) : (
          <EmptyGalleryState />
        )}
      </section>
    </main>
  );
}