'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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


// --- REFACTORED Event Form Component (for Create and Edit) ---
function EventForm({ onFormSubmit, initialData }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [eventDate, setEventDate] = useState(initialData ? new Date(initialData.eventDate) : null);
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = Boolean(initialData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const url = isEditMode ? `/api/events/${initialData.id}` : '/api/events';
    const method = isEditMode ? 'PATCH' : 'POST';

    const promise = fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, eventDate }),
    });

    toast.promise(promise, {
      loading: isEditMode ? 'Updating event...' : 'Creating event...',
      success: (res) => {
        if (!res.ok) throw new Error('Something went wrong.');
        onFormSubmit();
        return `Event ${isEditMode ? 'updated' : 'created'} successfully!`;
      },
      error: `Failed to ${isEditMode ? 'update' : 'create'} event.`,
      finally: () => setIsLoading(false),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields are the same as before */}
      <div className="space-y-2">
        <Label htmlFor="title">Event Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Event Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label>Event Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !eventDate && "text-muted-foreground")} disabled={isLoading}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {eventDate ? format(eventDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={eventDate} onSelect={setEventDate} initialFocus /></PopoverContent>
        </Popover>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (isEditMode ? 'Saving...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create Event')}
      </Button>
    </form>
  );
}


// --- Main Events Page Component ---
export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // For editing
  const router = useRouter();

  const fetchEvents = async () => {
    const res = await fetch('/api/events');
    if (res.ok) {
      const data = await res.json();
      setEvents(data);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);
  
  const refreshEvents = () => fetchEvents();

  const handleFormSubmit = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
    refreshEvents();
  };
  
  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };
  
  const handleCreateClick = () => {
    setSelectedEvent(null);
    setIsDialogOpen(true);
  }

  const handleDelete = (eventId) => {
    const promise = fetch(`/api/events/${eventId}`, { method: 'DELETE' });

    toast.promise(promise, {
      loading: 'Deleting event...',
      success: (res) => {
        if (!res.ok) throw new Error('Something went wrong.');
        refreshEvents();
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
          <DialogTrigger asChild>
            <Button onClick={handleCreateClick}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedEvent ? 'Edit Event' : 'Create a New Event'}</DialogTitle>
              <DialogDescription>{selectedEvent ? 'Update the details below.' : "Fill out the details below to add a new event."}</DialogDescription>
            </DialogHeader>
            <EventForm onFormSubmit={handleFormSubmit} initialData={selectedEvent} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.length > 0 ? (
          events.map((event) => (
            <Card key={event.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>{format(new Date(event.eventDate), "eeee, MMMM do, yyyy")}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEditClick(event)}><FilePenLine className="h-4 w-4 mr-1" /> Edit</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the event.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(event.id)}>Continue</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))
        ) : (<p>No events found. Create one to get started!</p>)}
      </div>
    </div>
  );
}