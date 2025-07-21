'use client';

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { FilePenLine, PlusCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { PaginationControls } from "@/components/dashboard/pagination-controls";

const RichTextEditor = dynamic(
  () => import('@/components/dashboard/rich-text-editor').then((mod) => mod.RichTextEditor),
  { 
    ssr: false,
    loading: () => <div className="min-h-[280px] w-full rounded-md border border-input bg-background animate-pulse"></div>
  }
);

function PostForm({ onFormSubmit, initialData }) {
  const inputFileRef = useRef(null);
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [published, setPublished] = useState(initialData?.published || false);
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = Boolean(initialData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
        toast.error("Title and content are required.");
        return;
    }
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

    const postData = { title, content, published, imageUrl };
    const url = isEditMode ? `/api/posts/${initialData.id}` : '/api/posts';
    const method = isEditMode ? 'PATCH' : 'POST';

    const promise = fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });

    toast.promise(promise, {
      loading: isEditMode ? 'Updating post...' : 'Creating post...',
      success: (res) => {
        if (!res.ok) throw new Error('Something went wrong.');
        onFormSubmit();
        return `Post ${isEditMode ? 'updated' : 'created'} successfully!`;
      },
      error: (err) => `Failed to ${isEditMode ? 'update' : 'create'} post.`,
      finally: () => setIsLoading(false),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Post Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label>Content</Label>
        <RichTextEditor initialContent={content} onUpdate={setContent} />
      </div>
      <div className="space-y-2">
        <Label>Featured Image (Optional)</Label>
        <Input id="image-file" type="file" ref={inputFileRef} disabled={isLoading} />
        {initialData?.imageUrl && <p className="text-xs text-muted-foreground">An image is already set. Uploading a new one will replace it.</p>}
      </div>
      <div className="flex items-center space-x-2 pt-4">
        <Switch id="published" checked={published} onCheckedChange={setPublished} disabled={isLoading} />
        <Label htmlFor="published">Publish Post</Label>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Post'}</Button>
    </form>
  );
}

export function BlogClient({ posts, currentPage, totalPages }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const router = useRouter();

   const handleFormSubmit = () => { setIsDialogOpen(false); setSelectedPost(null); router.refresh(); };
   const handleEditClick = (post) => { setSelectedPost(post); setIsDialogOpen(true); };
   const handleCreateClick = () => { setSelectedPost(null); setIsDialogOpen(true); };
   const handleDelete = (postId) => {
     const promise = fetch(`/api/posts/${postId}`, { method: 'DELETE' });
     toast.promise(promise, {
       loading: 'Deleting post...',
       success: (res) => { if (!res.ok) throw new Error('Delete failed.'); router.refresh(); return 'Post deleted!'; },
       error: 'Failed to delete post.',
     });
   };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold">Manage Blog Posts</h1>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) setSelectedPost(null); }}>
          <DialogTrigger asChild><Button onClick={handleCreateClick}><PlusCircle className="mr-2 h-4 w-4" /> Create Post</Button></DialogTrigger>
          <DialogContent className="sm:max-w-3xl"><DialogHeader><DialogTitle>{selectedPost ? 'Edit Post' : 'Create New Post'}</DialogTitle></DialogHeader><PostForm onFormSubmit={handleFormSubmit} initialData={selectedPost} /></DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Status</TableHead><TableHead>Last Updated</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
             {posts.length > 0 ? (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell><Badge variant={post.published ? 'default' : 'secondary'}>{post.published ? 'Published' : 'Draft'}</Badge></TableCell>
                    <TableCell>{format(new Date(post.updatedAt), "MMMM do, yyyy")}</TableCell>
                    <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(post)}><FilePenLine className="h-4 w-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete this post.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(post.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
             ) : (
                <TableRow><TableCell colSpan="4" className="text-center h-24">No posts found. Create one to get started.</TableCell></TableRow>
             )}
          </TableBody>
        </Table>
      </div>
      <PaginationControls currentPage={currentPage} totalPages={totalPages} basePath="/dashboard/blog" />
    </div>
  );
}