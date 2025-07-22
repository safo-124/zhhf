'use client';

import { useState, useRef } from "react";
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

// --- StoryForm Sub-Component ---
function StoryForm({ onFormSubmit, initialData }) {
  const inputFileRef = useRef(null);
  const [title, setTitle] = useState(initialData?.title || '');
  const [author, setAuthor] = useState(initialData?.author || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [published, setPublished] = useState(initialData?.published || false);
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = Boolean(initialData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let imageUrl = initialData?.imageUrl || null;
    const file = inputFileRef.current?.files?.[0];

    if (file) {
      try {
        const response = await fetch(`/api/gallery/upload?filename=${file.name}`, {
          method: 'POST',
          body: file,
        });
        if (!response.ok) throw new Error('Image upload failed');
        const newBlob = await response.json();
        imageUrl = newBlob.imageUrl;
      } catch (error) {
        toast.error("Image upload failed. Please try again.");
        setIsLoading(false);
        return;
      }
    }

    const storyData = { title, author, content, imageUrl, published };
    const url = isEditMode ? `/api/stories/${initialData.id}` : '/api/stories';
    const method = isEditMode ? 'PATCH' : 'POST';

    const promise = fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storyData),
    });

    toast.promise(promise, {
      loading: isEditMode ? 'Updating story...' : 'Creating story...',
      success: (res) => {
        if (!res.ok) throw new Error('Something went wrong.');
        onFormSubmit();
        return `Story ${isEditMode ? 'updated' : 'created'} successfully!`;
      },
      error: (err) => `Failed to ${isEditMode ? 'update' : 'create'} story.`,
      finally: () => setIsLoading(false),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Story Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="author">Author</Label>
        <Input id="author" placeholder="e.g., — Jane Doe, Community Member" value={author} onChange={(e) => setAuthor(e.target.value)} required disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required className="min-h-[150px]" disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label>Image (Optional)</Label>
        <Input id="image-file" type="file" ref={inputFileRef} disabled={isLoading} />
        {initialData?.imageUrl && <p className="text-xs text-muted-foreground">An image is already set. Uploading a new one will replace it.</p>}
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="published" checked={published} onCheckedChange={setPublished} disabled={isLoading} />
        <Label htmlFor="published">Publish Story</Label>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Story'}</Button>
    </form>
  );
}

// --- Main StoriesClient Component ---
export function StoriesClient({ stories, currentPage, totalPages }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const router = useRouter();

  const handleFormSubmit = () => { setIsDialogOpen(false); setSelectedStory(null); router.refresh(); };
  const handleEditClick = (story) => { setSelectedStory(story); setIsDialogOpen(true); };
  const handleCreateClick = () => { setSelectedStory(null); setIsDialogOpen(true); };
  const handleDelete = (storyId) => {
    const promise = fetch(`/api/stories/${storyId}`, { method: 'DELETE' });
    toast.promise(promise, {
      loading: 'Deleting story...',
      success: (res) => { if (!res.ok) throw new Error('Delete failed.'); router.refresh(); return 'Story deleted!'; },
      error: 'Failed to delete story.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Success Stories</h1>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) setSelectedStory(null); }}>
          <DialogTrigger asChild><Button onClick={handleCreateClick}><PlusCircle className="mr-2 h-4 w-4" /> Create Story</Button></DialogTrigger>
          <DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>{selectedStory ? 'Edit Story' : 'Create New Story'}</DialogTitle></DialogHeader><StoryForm onFormSubmit={handleFormSubmit} initialData={selectedStory} /></DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Author</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {stories.map((story) => (
              <TableRow key={story.id}>
                <TableCell className="font-medium">{story.title}</TableCell>
                <TableCell>{story.author}</TableCell>
                <TableCell><Badge variant={story.published ? 'default' : 'secondary'}>{story.published ? 'Published' : 'Draft'}</Badge></TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(story)}><FilePenLine className="h-4 w-4" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                    <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete this story.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(story.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <PaginationControls currentPage={currentPage} totalPages={totalPages} basePath="/dashboard/stories" />
    </div>
  );
}