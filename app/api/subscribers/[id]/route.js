import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// DELETE: Delete a subscriber
export async function DELETE(request, { params }) {
  const id = params.id;
  try {
    await prisma.subscriber.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Subscriber deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 });
  }
}