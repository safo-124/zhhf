'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function VolunteerPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interests, setInterests] = useState('');
  const [availability, setAvailability] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const promise = fetch('/api/volunteers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, interests, availability }),
    });

    toast.promise(promise, {
      loading: 'Submitting your application...',
      success: (res) => {
        if (res.status === 409) throw new Error('This email has already been registered.');
        if (!res.ok) throw new Error('Something went wrong.');
        
        // Reset form
        setName(''); setEmail(''); setPhone(''); setInterests(''); setAvailability('');
        return 'Thank you for your interest! We will be in touch soon.';
      },
      error: (err) => err.message,
      finally: () => setIsLoading(false),
    });
  };

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Volunteer With Us
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Join our team of dedicated volunteers and make a real difference in the community.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Volunteer Application</CardTitle>
            <CardDescription>Please fill out the form below to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interests">Areas of Interest (Optional)</Label>
                <Textarea id="interests" placeholder="e.g., Event planning, food drives, mentoring..." value={interests} onChange={(e) => setInterests(e.target.value)} className="min-h-[100px]" disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Availability (Optional)</Label>
                <Textarea id="availability" placeholder="e.g., Weekends, weekday evenings..." value={availability} onChange={(e) => setAvailability(e.target.value)} className="min-h-[100px]" disabled={isLoading} />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}