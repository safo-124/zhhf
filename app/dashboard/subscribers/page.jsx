import prisma from '@/lib/prisma';
import { SubscribersClient } from './subscribers-client'; // Import the new client component

// This is the SERVER COMPONENT. It can be async.
async function getSubscribers() {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return subscribers;
  } catch (error) {
    console.error("Failed to fetch subscribers:", error);
    // Return an empty array in case of an error so the page doesn't crash
    return [];
  }
}

export default async function SubscribersPage() {
  const subscribers = await getSubscribers();
  
  // It fetches the data and passes it down to the client component.
  return <SubscribersClient initialSubscribers={subscribers} />;
}