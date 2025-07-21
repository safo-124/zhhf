import prisma from '@/lib/prisma';
import Image from 'next/image';

// This function runs on the server to get the image data.
async function getImages() {
  const images = await prisma.galleryImage.findMany({
    orderBy: {
      createdAt: 'desc', // Show the newest images first
    },
  });
  return images;
}

export default async function PublicGalleryPage() {
  const images = await getImages();

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Our Gallery
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A glimpse into our work, events, and the communities we serve.
        </p>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.id} className="group relative aspect-square block overflow-hidden rounded-lg">
              <Image
                src={image.imageUrl}
                alt={image.caption || 'Zion Helping Hand Foundation Gallery Image'}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-sm font-semibold text-white">
                    {image.caption}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">The gallery is currently empty.</p>
          <p className="text-sm text-muted-foreground mt-2">
            New photos will be added soon!
          </p>
        </div>
      )}
    </main>
  );
}