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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FilePenLine, PlusCircle, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PaginationControls } from "@/components/dashboard/pagination-controls";

function EventForm({ onFormSubmit, initialData }) {
  const inputFileRef = useRef(null);
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [eventDate, setEventDate] = useState(initialData ? new Date(initialData.eventDate) : null);
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
        if (!response.ok) {
            throw new Error('Image upload failed');
        }
        const newBlob = await response.json();
        imageUrl = newBlob.imageUrl; // Correctly get the imageUrl property
      } catch (error) {
        toast.error("Image upload failed. Please try again.");
        setIsLoading(false);
        return;
      }
    }

    const eventData = { title, description, eventDate, imageUrl };
    const url = isEditMode ? `/api/events/${initialData.id}` : '/api/events';
    const method = isEditMode ? 'PATCH' : 'POST';

    const promise = fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });

    toast.promise(promise, {
      loading: isEditMode ? 'Updating event...' : 'Creating event...',
      success: (res) => {
        if (!res.ok) throw new Error('Something went wrong.');
        onFormSubmit();
        return `Event ${isEditMode ? 'updated' : 'created'} successfully!`;
      },
      error: (err) => `Failed to ${isEditMode ? 'update' : 'create'} event.`,
      finally: () => setIsLoading(false),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Event Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Event Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label>Event Image (Optional)</Label>
        <Input id="image-file" type="file" ref={inputFileRef} disabled={isLoading} />
        {initialData?.imageUrl && <p className="text-xs text-muted-foreground">An image is already set. Uploading a new one will replace it.</p>}
      </div>
      <div className="space-y-2">
        <Label>Event Date</Label>
        <Popover>
          <PopoverTrigger asChild><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !eventDate && "text-muted-foreground")} disabled={isLoading}><CalendarIcon className="mr-2 h-4 w-4" />{eventDate ? format(eventDate, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger>
          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={eventDate} onSelect={setEventDate} initialFocus /></PopoverContent>
        </Popover>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? (isEditMode ? 'Saving...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create Event')}</Button>
    </form>
  );
}


export function EventsClient({ events, currentPage, totalPages }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const router = useRouter();

  const handleFormSubmit = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
    router.refresh();
  };

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedEvent(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (eventId) => {
    const promise = fetch(`/api/events/${eventId}`, { method: 'DELETE' });
    toast.promise(promise, {
      loading: 'Deleting event...',
      success: (res) => {
        if (!res.ok) throw new Error('Something went wrong.');
        router.refresh();
        return 'Event deleted successfully!';
      },
      error: 'Failed to delete event.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Events</h1>
          <p className="text-muted-foreground">Add, view, edit, and delete foundation events.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) setSelectedEvent(null); }}>
          <DialogTrigger asChild><Button onClick={handleCreateClick}><PlusCircle className="mr-2 h-4 w-4" /> Create Event</Button></DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader><DialogTitle>{selectedEvent ? 'Edit Event' : 'Create a New Event'}</DialogTitle><DialogDescription>{selectedEvent ? 'Update the details below.' : "Fill out the details below."}</DialogDescription></DialogHeader>
            <EventForm onFormSubmit={handleFormSubmit} initialData={selectedEvent} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Event Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {events.length > 0 ? (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{format(new Date(event.eventDate), "MMMM do, yyyy")}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(event)}><FilePenLine className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                      <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the event.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(event.id)}>Continue</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan="3" className="text-center h-24">No events found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <PaginationControls currentPage={currentPage} totalPages={totalPages} basePath="/dashboard/events" />
    </div>
  );
}