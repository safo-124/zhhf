import prisma from '@/lib/prisma';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Fetches all published stories from the database
async function getPublishedStories() {
  const stories = await prisma.story.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });
  return stories;
}

export default async function PublicStoriesPage() {
  const stories = await getPublishedStories();

  return (
    <main className="bg-slate-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-blue-950">
            Stories of Impact
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Read the real-life stories of individuals and communities transformed by your support and our work.
          </p>
        </div>

        {stories.length > 0 ? (
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <Card key={story.id} className="flex flex-col overflow-hidden shadow-lg">
                {story.imageUrl && (
                  <div className="relative aspect-video w-full">
                    <Image
                      src={story.imageUrl}
                      alt={story.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col flex-grow p-6">
                  <CardHeader className="p-0">
                    <CardTitle className="text-xl text-blue-950">{story.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 mt-4 text-muted-foreground flex-grow">
                    <p>"{story.content}"</p>
                  </CardContent>
                  <CardFooter className="p-0 mt-4">
                    <p className="font-bold text-slate-600">{story.author}</p>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No success stories have been published yet.</p>
            <p className="text-sm text-muted-foreground mt-2">Check back soon to see the impact of our work!</p>
          </div>
        )}
      </div>
    </main>
  );
}