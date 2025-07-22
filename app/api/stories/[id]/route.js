import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { del } from '@vercel/blob';

// PATCH: Update an existing story
export async function PATCH(request, { params }) {
  try {
    const id = parseInt(params.id);
    const { title, author, content, imageUrl, published } = await request.json();

    const updatedStory = await prisma.story.update({
      where: { id },
      data: {
        title,
        author,
        content,
        imageUrl,
        published,
      },
    });
    return NextResponse.json(updatedStory);
  } catch (error) {
    console.error("Error updating story:", error);
    return NextResponse.json({ error: 'Failed to update story' }, { status: 500 });
  }
}

// DELETE: Delete a story
export async function DELETE(request, { params }) {
    try {
        const id = parseInt(params.id);
        
        const story = await prisma.story.findUnique({ where: { id } });

        if (story && story.imageUrl) {
            await del(story.imageUrl); // Delete the associated image from Vercel Blob
        }

        await prisma.story.delete({ where: { id } });
        
        return NextResponse.json({ message: 'Story deleted successfully' });
    } catch (error) {
        console.error("Error deleting story:", error);
        return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 });
    }
}