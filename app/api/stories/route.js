import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Fetch all stories
export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}

// POST: Create a new story
export async function POST(request) {
  try {
    const { title, author, content, imageUrl } = await request.json();

    if (!title || !author || !content) {
      return NextResponse.json({ error: 'Title, author, and content are required' }, { status: 400 });
    }

    const newStory = await prisma.story.create({
      data: {
        title,
        author,
        content,
        imageUrl,
        published: false, // Stories are drafts by default
      },
    });

    return NextResponse.json(newStory, { status: 201 });
  } catch (error) {
    console.error("Error creating story:", error);
    return NextResponse.json({ error: 'Failed to create story' }, { status: 500 });
  }
}