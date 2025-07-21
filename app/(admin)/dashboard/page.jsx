import prisma from '@/lib/prisma';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaginationControls } from '@/components/dashboard/pagination-controls'; // We will create this next

const ITEMS_PER_PAGE = 10;

// The function now accepts a page number
async function getDonations(page = 1) {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  
  // Fetch a specific "page" of donations
  const donations = await prisma.donation.findMany({
    orderBy: { createdAt: 'desc' },
    take: ITEMS_PER_PAGE,
    skip: skip,
  });

  // Also fetch the total count of donations for pagination
  const totalCount = await prisma.donation.count();

  return { donations, totalCount };
}

// The page component now receives searchParams to know the current page
export default async function DashboardPage({ searchParams }) {
  const page = parseInt(searchParams.page || '1', 10);
  const { donations, totalCount } = await getDonations(page);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Donations</CardTitle>
        <CardDescription>
          A list of all recent donations made to the foundation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone / WhatsApp</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="5" className="text-center">
                    No donations yet.
                  </TableCell>
                </TableRow>
              ) : (
                donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">{donation.name}</TableCell>
                    <TableCell>{donation.email}</TableCell>
                    <TableCell>{donation.phone}</TableCell>
                    <TableCell>{donation.donationType}</TableCell>
                    <TableCell>
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          basePath="/dashboard"
        />
      </CardContent>
    </Card>
  );
}