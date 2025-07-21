import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// PATCH: Update an existing campaign
export async function PATCH(request, { params }) {
  try {
    const id = parseInt(params.id);
    const { title, description, goalAmount, isActive } = await request.json();

    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        title,
        description,
        goalAmount: parseFloat(goalAmount),
        isActive,
      },
    });
    return NextResponse.json(updatedCampaign);
  } catch (error) {
    console.error("Error updating campaign:", error);
    return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
  }
}

// DELETE: Delete a campaign
export async function DELETE(request, { params }) {
    try {
        const id = parseInt(params.id);
        
        // Before deleting a campaign, you might want to handle its associated donations.
        // For now, we'll just delete the campaign.
        // A better approach might be to archive it or disassociate the donations.
        await prisma.campaign.delete({ where: { id } });
        
        return NextResponse.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        console.error("Error deleting campaign:", error);
        return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 });
    }
}