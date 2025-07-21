'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from 'lucide-react';

export function GalleryClient({ initialImages }) {
  const inputFileRef = useRef(null);
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!inputFileRef.current?.files?.[0]) {
      toast.error("Please select a file to upload.");
      return;
    }

    setIsLoading(true);
    const file = inputFileRef.current.files[0];

    const promise = fetch(`/api/gallery/upload?filename=${file.name}&caption=${encodeURIComponent(caption)}`, {
      method: 'POST',
      body: file,
    });

    toast.promise(promise, {
      loading: 'Uploading image...',
      success: (res) => {
        if (!res.ok) throw new Error("Upload failed.");
        router.refresh();
        setCaption('');
        inputFileRef.current.value = "";
        return "Image uploaded successfully!";
      },
      error: "Failed to upload image.",
      finally: () => setIsLoading(false),
    });
  };

  const handleDelete = (imageId) => {
    const promise = fetch(`/api/gallery/${imageId}`, { method: 'DELETE' });
    toast.promise(promise, {
        loading: 'Deleting image...',
        success: (res) => {
            if (!res.ok) throw new Error("Failed to delete.");
            router.refresh();
            return "Image deleted successfully!";
        },
        error: "Failed to delete image."
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Upload New Image</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-file">Image File</Label>
              <Input id="image-file" type="file" ref={inputFileRef} required disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caption">Caption (Optional)</Label>
              <Input id="caption" value={caption} onChange={(e) => setCaption(e.target.value)} disabled={isLoading} placeholder="E.g., Community outreach event, 2025" />
            </div>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Uploading..." : "Upload Image"}</Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">Gallery</h2>
        {initialImages.length === 0 ? (
          <p>No images in the gallery yet. Upload one to get started.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {initialImages.map((image) => (
              <Card key={image.id} className="overflow-hidden group">
                <div className="relative aspect-square">
                  <Image src={image.imageUrl} alt={image.caption || 'Gallery image'} fill className="object-cover" />
                  <div className="absolute top-2 right-2">
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                       <Button variant="destructive" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-4 w-4" />
                       </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete this image.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(image.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                {image.caption && <p className="text-sm text-muted-foreground p-3">{image.caption}</p>}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}