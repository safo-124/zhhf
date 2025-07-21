import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { del } from '@vercel/blob';

// Helper function (can be moved to a shared utils file later)
function slugify(text) {
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

// PATCH: Update an existing post (e.g., publish it)
export async function PATCH(request, { params }) {
  try {
    const id = parseInt(params.id);
    const { title, content, published, imageUrl } = await request.json();

    const dataToUpdate = { title, content, published, imageUrl };
    
    // If the title is being changed, update the slug as well
    if (title) {
        dataToUpdate.slug = slugify(title);
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: dataToUpdate,
    });
    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE: Delete a post
export async function DELETE(request, { params }) {
    try {
        const id = parseInt(params.id);
        
        // Find the post to get its imageUrl for blob deletion
        const post = await prisma.post.findUnique({ where: { id } });

        if (post && post.imageUrl) {
            await del(post.imageUrl); // Delete image from Vercel Blob
        }

        await prisma.post.delete({ where: { id } });
        
        return NextResponse.json({ message: 'Post deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}