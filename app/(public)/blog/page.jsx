import prisma from '@/lib/prisma';
import { BlogList } from './blog-list'; // Import the new client component

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

      <BlogList allPosts={posts} />
    </main>
  );
}