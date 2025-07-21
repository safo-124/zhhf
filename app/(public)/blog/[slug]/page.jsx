import prisma from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { ShareButtons } from '@/components/share-buttons';

async function getPost(slug) {
  const post = await prisma.post.findUnique({
    where: {
      slug: slug,
      published: true,
    },
  });

  if (!post) {
    notFound();
  }
  return post;
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);

  return (
    <main className="container mx-auto px-4 py-12">
      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            {post.title}
          </h1>
          <p className="text-muted-foreground">
            Published on {format(new Date(post.createdAt), "MMMM do, yyyy")}
          </p>
        </header>

        {post.imageUrl && (
          <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <ShareButtons title={post.title} />

      </article>
    </main>
  );
}