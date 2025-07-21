'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const promise = fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });

    toast.promise(promise, {
      loading: 'Sending your message...',
      success: (res) => {
        if (!res.ok) throw new Error('Something went wrong.');
        // Reset form
        setName('');
        setEmail('');
        setMessage('');
        return 'Your message has been sent successfully!';
      },
      error: 'Failed to send message. Please try again.',
      finally: () => setIsLoading(false),
    });
  };

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Info Section */}
        <div className="space-y-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold">Get in Touch</h1>
            <p className="mt-2 text-muted-foreground">
              We'd love to hear from you. Fill out the form or use the contact information below.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Mail className="h-6 w-6 text-primary" />
              <span>info@zhhf.org</span> {/* Replace with actual email */}
            </div>
            <div className="flex items-center gap-4">
              <Phone className="h-6 w-6 text-primary" />
              <span>+233 12 345 6789</span> {/* Replace with actual phone */}
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required className="min-h-[120px]" disabled={isLoading} />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}