'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { FilePenLine, PlusCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { PaginationControls } from "@/components/dashboard/pagination-controls";

// --- CampaignForm Sub-Component ---
function CampaignForm({ onFormSubmit, initialData }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [goalAmount, setGoalAmount] = useState(initialData?.goalAmount || '');
  const [isActive, setIsActive] = useState(initialData ? initialData.isActive : true);
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = Boolean(initialData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const campaignData = { title, description, goalAmount, isActive };
    const url = isEditMode ? `/api/campaigns/${initialData.id}` : '/api/campaigns';
    const method = isEditMode ? 'PATCH' : 'POST';

    const promise = fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaignData),
    });

    toast.promise(promise, {
      loading: isEditMode ? 'Updating campaign...' : 'Creating campaign...',
      success: (res) => {
        if (!res.ok) throw new Error('Something went wrong.');
        onFormSubmit();
        return `Campaign ${isEditMode ? 'updated' : 'created'} successfully!`;
      },
      error: (err) => `Failed to ${isEditMode ? 'update' : 'create'} campaign.`,
      finally: () => setIsLoading(false),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Campaign Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="goalAmount">Goal Amount ($)</Label>
        <Input id="goalAmount" type="number" step="0.01" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} required disabled={isLoading} />
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} disabled={isLoading} />
        <Label htmlFor="isActive">Campaign is Active</Label>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Campaign'}</Button>
    </form>
  );
}

// --- Main CampaignsClient Component ---
export function CampaignsClient({ campaigns, currentPage, totalPages }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const router = useRouter();

  const handleFormSubmit = () => { setIsDialogOpen(false); setSelectedCampaign(null); router.refresh(); };
  const handleEditClick = (campaign) => { setSelectedCampaign(campaign); setIsDialogOpen(true); };
  const handleCreateClick = () => { setSelectedCampaign(null); setIsDialogOpen(true); };
  const handleDelete = (campaignId) => {
    const promise = fetch(`/api/campaigns/${campaignId}`, { method: 'DELETE' });
    toast.promise(promise, {
      loading: 'Deleting campaign...',
      success: (res) => { if (!res.ok) throw new Error('Delete failed.'); router.refresh(); return 'Campaign deleted!'; },
      error: 'Failed to delete campaign.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Donation Campaigns</h1>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) setSelectedCampaign(null); }}>
          <DialogTrigger asChild><Button onClick={handleCreateClick}><PlusCircle className="mr-2 h-4 w-4" /> Create Campaign</Button></DialogTrigger>
          <DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>{selectedCampaign ? 'Edit Campaign' : 'Create New Campaign'}</DialogTitle></DialogHeader><CampaignForm onFormSubmit={handleFormSubmit} initialData={selectedCampaign} /></DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Status</TableHead><TableHead>Goal</TableHead><TableHead>Donations</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.title}</TableCell>
                  <TableCell><Badge variant={campaign.isActive ? 'default' : 'secondary'}>{campaign.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
                  <TableCell>${Number(campaign.goalAmount).toLocaleString()}</TableCell>
                  <TableCell>{campaign._count.donations}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(campaign)}><FilePenLine className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                      <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(campaign.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan="5" className="text-center h-24">No campaigns found. Create one to get started.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <PaginationControls currentPage={currentPage} totalPages={totalPages} basePath="/dashboard/campaigns" />
    </div>
  );
}