import prisma from '@/lib/prisma';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// This async function is a React Server Component.
// It runs on the server, so we can directly access the database.
async function getDonations() {
  const donations = await prisma.donation.findMany({
    orderBy: {
      createdAt: 'desc', // Show the newest donations first
    },
  });
  return donations;
}

export default async function DashboardPage() {
  const donations = await getDonations();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Donations</CardTitle>
        <CardDescription>
          A list of all recent donations made to the foundation.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}