import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsletterForm } from '@/components/newsletter-form';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

// --- Data Fetching Functions ---
async function getRecentEvents() {
  return prisma.event.findMany({
    where: {
      eventDate: { gte: new Date() }, // Only future events
    },
    orderBy: { eventDate: 'asc' },
    take: 3, // Get the next 3 upcoming events
  });
}

async function getRecentImages() {
  return prisma.galleryImage.findMany({
    orderBy: { createdAt: 'desc' },
    take: 4, // Get the 4 most recent images
  });
}


// --- The Homepage Component ---
export default async function Home() {
  const recentEvents = await getRecentEvents();
  const recentImages = await getRecentImages();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Section 1: Hero */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-gray-50 to-gray-200">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Zion Helping Hand Foundation
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Dedicated to making a difference through community support, events, and direct aid. Your contribution matters.
            </p>
            <div className="mt-6">
              <Link href="/donate">
                <Button size="lg">Donate Now</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Section 2: Recent Events */}
        {recentEvents.length > 0 && (
          <section className="w-full py-12 md:py-24">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-10">
                Upcoming Events
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recentEvents.map((event) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription className="font-semibold text-primary pt-1">
                        {format(new Date(event.eventDate), "MMMM do, yyyy")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link href="/events">
                    <Button variant="outline">View All Events <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Section 3: Recent Gallery Images */}
        {recentImages.length > 0 && (
          <section className="w-full py-12 md:py-24 bg-muted">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-10">
                From Our Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recentImages.map((image) => (
                   <div key={image.id} className="group relative aspect-square block overflow-hidden rounded-lg">
                      <Image
                        src={image.imageUrl}
                        alt={image.caption || 'Gallery Image'}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                   </div>
                ))}
              </div>
               <div className="text-center mt-8">
                <Link href="/gallery">
                    <Button variant="outline">View Full Gallery <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
              </div>
            </div>
          </section>
        )}
        
        {/* Section 4: Newsletter Signup */}
        <section className="w-full py-12 md:py-24">
            <div className="container mx-auto px-4">
                <NewsletterForm />
            </div>
        </section>

      </main>
    </div>
  );
}