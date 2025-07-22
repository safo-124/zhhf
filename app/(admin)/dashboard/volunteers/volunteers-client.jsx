'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationControls } from "@/components/dashboard/pagination-controls";
import { format } from "date-fns";

export function VolunteersClient({ volunteers, currentPage, totalPages }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Volunteers</h1>
        <p className="text-muted-foreground">A list of everyone who has signed up to volunteer.</p>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Date Registered</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {volunteers.length > 0 ? (
              volunteers.map((volunteer) => (
                <TableRow key={volunteer.id}>
                  <TableCell className="font-medium">{volunteer.name}</TableCell>
                  <TableCell>{volunteer.email}</TableCell>
                  <TableCell>{volunteer.phone}</TableCell>
                  <TableCell>{format(new Date(volunteer.createdAt), "MMMM do, yyyy")}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="4" className="text-center h-24">
                  No volunteers have signed up yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/dashboard/volunteers"
      />
    </div>
  );
}