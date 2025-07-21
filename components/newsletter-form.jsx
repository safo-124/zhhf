'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const promise = fetch('/api/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    toast.promise(promise, {
      loading: 'Subscribing...',
      success: async (res) => {
        if (res.status === 409) { // Handle case where email is already subscribed
          throw new Error('This email is already subscribed.');
        }
        if (!res.ok) {
          throw new Error('Something went wrong.');
        }
        setEmail(''); // Clear input on success
        return 'Thank you for subscribing!';
      },
      error: (err) => err.message, // Display the specific error message
      finally: () => setIsLoading(false),
    });
  };

  return (
    <div className="w-full max-w-md p-6 mx-auto border rounded-lg shadow-md">
      <div className="flex flex-col space-y-2 text-center">
        <h3 className="text-2xl font-semibold tracking-tight">Subscribe to our Newsletter</h3>
        <p className="text-sm text-muted-foreground">
          Get the latest updates on our events and initiatives.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2 mt-4">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Joining...' : 'Join'}
        </Button>
      </form>
    </div>
  );
}