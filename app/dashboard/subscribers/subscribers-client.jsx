'use client';

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

// This component receives the initial data as a prop
export function SubscribersClient({ initialSubscribers }) {
  const router = useRouter();

  const handleDelete = async (subscriberId) => {
    const promise = fetch(`/api/subscribers/${subscriberId}`, { method: 'DELETE' });

    toast.promise(promise, {
      loading: 'Deleting subscriber...',
      success: (res) => {
        if (!res.ok) throw new Error('Something went wrong.');
        // router.refresh() tells Next.js to re-fetch the data on the server
        // for the current route, which will update our table.
        router.refresh(); 
        return 'Subscriber deleted successfully!';
      },
      error: 'Failed to delete subscriber.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Subscribers</h1>
        <p className="text-muted-foreground">View and manage newsletter subscribers.</p>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Phone / WhatsApp</TableHead>
              <TableHead>Subscription Type</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialSubscribers.length > 0 ? (
              initialSubscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">{subscriber.email}</TableCell>
                  <TableCell>{subscriber.phone || 'N/A'}</TableCell>
                  <TableCell>{subscriber.type}</TableCell>
                  <TableCell>{new Date(subscriber.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>This will permanently delete the subscriber and remove them from your list.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(subscriber.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="5" className="text-center h-24">
                  No subscribers yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}