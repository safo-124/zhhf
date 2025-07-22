'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger  } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";
import { PaginationControls } from "@/components/dashboard/pagination-controls";

function UserForm({ onFormSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const promise = fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    toast.promise(promise, {
      loading: 'Creating new admin...',
      success: (res) => {
        if (!res.ok) throw new Error('Something went wrong.');
        onFormSubmit();
        return 'Admin user created successfully!';
      },
      error: (err) => 'Failed to create user.',
      finally: () => setIsLoading(false),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} /></div>
      <div className="space-y-2"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} /></div>
      <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} /></div>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create Admin'}</Button>
    </form>
  );
}

export function UsersClient({ users, currentPage, totalPages }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleFormSubmit = () => { setIsDialogOpen(false); router.refresh(); };
  const handleDelete = (userId) => {
    const promise = fetch(`/api/users/${userId}`, { method: 'DELETE' });
    toast.promise(promise, {
      loading: 'Deleting user...',
      success: (res) => { if (!res.ok) throw new Error('Delete failed.'); router.refresh(); return 'User deleted!'; },
      error: 'Failed to delete user.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Admin Users</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Admin</Button></DialogTrigger>
          <DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>Create New Admin User</DialogTitle><DialogDescription>This user will have full access to the dashboard.</DialogDescription></DialogHeader><UserForm onFormSubmit={handleFormSubmit} /></DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                    <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action is permanent and cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(user.id)}>Delete User</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <PaginationControls currentPage={currentPage} totalPages={totalPages} basePath="/dashboard/users" />
    </div>
  );
}