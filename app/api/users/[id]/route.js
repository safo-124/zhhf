import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// DELETE: Delete a user
export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    
    // Optional: Add logic here to prevent a user from deleting their own account
    // or deleting the last remaining admin account.

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}