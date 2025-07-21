import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Helper function to generate a URL-friendly slug from a title
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// GET: Fetch all posts for the admin dashboard
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST: Create a new blog post
export async function POST(request) {
  try {
    const { title, content, imageUrl } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        slug: slugify(title), // Generate slug from title
        imageUrl,
        published: false, // Posts are drafts by default
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    if (error.code === 'P2002') {
        return NextResponse.json({ error: 'A post with this title already exists.'}, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}