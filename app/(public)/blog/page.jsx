import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

// This function runs on the server to get all published posts
async function getPublishedPosts() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });
  return posts;
}

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Foundation News & Updates
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Stay up to date with our latest stories, events, and announcements.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
              <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
                <div className="relative aspect-video w-full">
                  <Image
                    src={post.imageUrl || '/placeholder.svg'}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="group-hover:text-primary">{post.title}</CardTitle>
                  <CardDescription>
                    {format(new Date(post.createdAt), "MMMM do, yyyy")}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No posts have been published yet.</p>
          <p className="text-sm text-muted-foreground mt-2">Check back soon for news and updates!</p>
        </div>
      )}
    </main>
  );
}