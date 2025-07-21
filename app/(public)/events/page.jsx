import prisma from '@/lib/prisma';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

async function getPublishedEvents() {
  const events = await prisma.event.findMany({
    where: {
      eventDate: { gte: new Date() },
    },
    orderBy: { eventDate: 'asc' },
  });
  return events;
}

export default async function PublicEventsPage() {
  const events = await getPublishedEvents();

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Our Events</h1>
        <p className="mt-4 text-lg text-muted-foreground">Join us at our upcoming events to support our cause and community.</p>
      </div>

      {events.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="flex flex-col overflow-hidden">
              <div className="relative aspect-video w-full">
                <Image 
                  src={event.imageUrl || '/placeholder.svg'} // Use a placeholder if no image exists
                  alt={event.title} 
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription className="font-semibold text-primary pt-1">
                  {format(new Date(event.eventDate), "eeee, MMMM do, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No upcoming events scheduled at this time.</p>
          <p className="text-sm text-muted-foreground mt-2">Please check back soon!</p>
        </div>
      )}
    </main>
  );
}