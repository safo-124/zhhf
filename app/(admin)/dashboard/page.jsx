import prisma from '@/lib/prisma';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaginationControls } from '@/components/dashboard/pagination-controls';
import { StatCard } from '@/components/dashboard/stat-card'; // Import the new component
import { Users, HandHeart, Calendar, DollarSign } from 'lucide-react'; // Import icons

const ITEMS_PER_PAGE = 10;

// This function now fetches all dashboard stats at once
async function getDashboardData(page = 1) {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Use Promise.all to fetch data concurrently
  const [donations, donationCount, donationCountThisMonth, subscriberCount, eventCount] = await Promise.all([
    prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
      take: ITEMS_PER_PAGE,
      skip: skip,
    }),
    prisma.donation.count(),
    prisma.donation.count({
      where: { createdAt: { gte: startOfMonth } },
    }),
    prisma.subscriber.count(),
    prisma.event.count({
      where: { eventDate: { gte: today } },
    }),
  ]);

  return { donations, donationCount, donationCountThisMonth, subscriberCount, eventCount };
}

export default async function DashboardPage({ searchParams }) {
  const page = parseInt(searchParams.page || '1', 10);
  const { 
    donations, 
    donationCount, 
    donationCountThisMonth, 
    subscriberCount, 
    eventCount 
  } = await getDashboardData(page);

  const totalDonationPages = Math.ceil(donationCount / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Donations"
          value={donationCount}
          icon={<HandHeart className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard 
          title="Donations (This Month)"
          value={donationCountThisMonth}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard 
          title="Subscribers"
          value={subscriberCount}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard 
          title="Upcoming Events"
          value={eventCount}
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Donations Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>A paginated list of all recent donations.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="4" className="text-center">No donations yet.</TableCell>
                  </TableRow>
                ) : (
                  donations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-medium">{donation.name}</TableCell>
                      <TableCell>{donation.email}</TableCell>
                      <TableCell>{donation.donationType}</TableCell>
                      <TableCell>{new Date(donation.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <PaginationControls
            currentPage={page}
            totalPages={totalDonationPages}
            basePath="/dashboard"
          />
        </CardContent>
      </Card>
    </div>
  );
}