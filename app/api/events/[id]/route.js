import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { del } from '@vercel/blob';

// PATCH: Update an existing event
export async function PATCH(request, { params }) {
  const id = params.id;
  try {
    const data = await request.json();
    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        description: data.description,
        eventDate: new Date(data.eventDate),
        imageUrl: data.imageUrl,
      },
    });
    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

// DELETE: Delete an event
export async function DELETE(request, { params }) {
  const id = params.id;
  try {
    // Find the event record to get the image URL before deleting
    const eventToDelete = await prisma.event.findUnique({
      where: { id: parseInt(id) },
    });

    // If an image URL exists, delete it from Vercel Blob
    if (eventToDelete && eventToDelete.imageUrl) {
      await del(eventToDelete.imageUrl);
    }

    // Delete the event record from the database
    await prisma.event.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}